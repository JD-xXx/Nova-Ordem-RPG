-- Nova Ordem: cargos delegados e avaliações independentes por seção.
-- Aplicar somente no projeto de testes durante esta etapa.
-- Em cada ambiente, registrar manualmente o UUID do Administrador Principal em
-- private.system_owner após a migração. Não conceder esse registro por RPC.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.system_owner (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);
alter table private.system_owner enable row level security;
revoke all on private.system_owner from public, anon, authenticated;
drop policy if exists deny_client_access on private.system_owner;
create policy deny_client_access on private.system_owner for all to anon, authenticated using (false) with check (false);

create table if not exists private.staff_permissions (code text primary key, description text not null, category text not null);
create table if not exists private.staff_roles (
  code text primary key check (code ~ '^[a-z][a-z0-9_]{1,47}$'),
  label text not null, description text not null default '', is_system boolean not null default false,
  created_by uuid references auth.users(id), created_at timestamptz not null default now()
);
create table if not exists private.staff_role_permissions (
  role_code text not null references private.staff_roles(code) on delete cascade,
  permission_code text not null references private.staff_permissions(code) on delete cascade,
  primary key (role_code, permission_code)
);
create table if not exists private.staff_role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role_code text not null references private.staff_roles(code) on delete restrict,
  assigned_by uuid not null references auth.users(id), assigned_at timestamptz not null default now(),
  revoked_by uuid references auth.users(id), revoked_at timestamptz
);
create unique index if not exists staff_role_assignments_one_active on private.staff_role_assignments(user_id,role_code) where revoked_at is null;
create index if not exists staff_role_assignments_user_active on private.staff_role_assignments(user_id,revoked_at);
create table if not exists private.staff_audit_log (
  id uuid primary key default gen_random_uuid(), actor_id uuid references auth.users(id),
  target_user_id uuid references auth.users(id), role_code text references private.staff_roles(code),
  action text not null, details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create index if not exists staff_audit_log_created_at on private.staff_audit_log(created_at desc);

alter table private.staff_permissions enable row level security;
alter table private.staff_roles enable row level security;
alter table private.staff_role_permissions enable row level security;
alter table private.staff_role_assignments enable row level security;
alter table private.staff_audit_log enable row level security;
revoke all on private.staff_permissions,private.staff_roles,private.staff_role_permissions,private.staff_role_assignments,private.staff_audit_log from public,anon,authenticated;
drop policy if exists deny_client_access on private.staff_permissions;
create policy deny_client_access on private.staff_permissions for all to anon,authenticated using(false) with check(false);
drop policy if exists deny_client_access on private.staff_roles;
create policy deny_client_access on private.staff_roles for all to anon,authenticated using(false) with check(false);
drop policy if exists deny_client_access on private.staff_role_permissions;
create policy deny_client_access on private.staff_role_permissions for all to anon,authenticated using(false) with check(false);
drop policy if exists deny_client_access on private.staff_role_assignments;
create policy deny_client_access on private.staff_role_assignments for all to anon,authenticated using(false) with check(false);
drop policy if exists deny_client_access on private.staff_audit_log;
create policy deny_client_access on private.staff_audit_log for all to anon,authenticated using(false) with check(false);

insert into private.staff_permissions(code,description,category) values
 ('characters.review.profile.read','Consultar informações básicas de personagens para avaliação.','characters'),
 ('characters.review.profile.decide','Aprovar ou devolver informações básicas de personagens.','characters'),
 ('characters.review.story.read','Consultar histórias e origens de personagens para avaliação.','characters'),
 ('characters.review.story.decide','Aprovar ou devolver histórias e origens de personagens.','characters'),
 ('characters.review.powers.read','Consultar Talentos, habilidades e módulos para avaliação.','characters'),
 ('characters.review.powers.decide','Aprovar ou devolver Talentos, habilidades e módulos.','characters'),
 ('community.moderate','Acessar ferramentas de moderação da comunidade.','community'),
 ('events.manage','Criar e administrar eventos, missões e treinamentos.','events')
on conflict(code) do update set description=excluded.description,category=excluded.category;

insert into private.staff_roles(code,label,description,is_system) values
 ('avaliador_fichas','Avaliador de Fichas','Avalia informações básicas e histórias dos personagens.',true),
 ('balanceador','Balanceador','Avalia Talentos, habilidades sobrenaturais e módulos cibernéticos.',true),
 ('moderador','Moderador','Cuida da convivência e das ocorrências da comunidade.',true),
 ('organizador','Organizador de Eventos e Missões','Organiza eventos, missões e treinamentos.',true)
on conflict(code) do update set label=excluded.label,description=excluded.description,is_system=true;

insert into private.staff_role_permissions(role_code,permission_code) values
 ('avaliador_fichas','characters.review.profile.read'),
 ('avaliador_fichas','characters.review.profile.decide'),
 ('avaliador_fichas','characters.review.story.read'),
 ('avaliador_fichas','characters.review.story.decide'),
 ('balanceador','characters.review.powers.read'),
 ('balanceador','characters.review.powers.decide'),
 ('moderador','community.moderate'),
 ('organizador','events.manage')
on conflict do nothing;

create table if not exists public.character_section_reviews (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  section_key text not null check(section_key in ('profile','story','powers')),
  status text not null check(status in ('pending','approved','needs_revision','not_applicable')),
  reviewer_id uuid references auth.users(id), note text, reviewed_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(character_id,section_key)
);
create index if not exists character_section_reviews_queue on public.character_section_reviews(section_key,status,updated_at desc);
create index if not exists character_section_reviews_character on public.character_section_reviews(character_id);
alter table public.character_section_reviews enable row level security;
revoke all on public.character_section_reviews from public,anon,authenticated;
grant select on public.character_section_reviews to authenticated;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (
    select 1 from private.system_owner so
    where so.singleton = true and so.user_id = auth.uid()
  );
$function$

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

CREATE OR REPLACE FUNCTION public.has_staff_permission(p_permission text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select public.is_admin() or exists (
    select 1
    from private.staff_role_assignments a
    join private.staff_role_permissions rp on rp.role_code = a.role_code
    where a.user_id = auth.uid()
      and a.revoked_at is null
      and rp.permission_code = p_permission
  );
$function$

revoke all on function public.has_staff_permission(text) from public, anon;
grant execute on function public.has_staff_permission(text) to authenticated;

CREATE OR REPLACE FUNCTION public.get_my_staff_access()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_roles jsonb;
  v_permissions jsonb;
begin
  if v_user_id is null then raise exception 'É necessário estar autenticado.'; end if;

  select coalesce(jsonb_agg(jsonb_build_object('code', r.code, 'label', r.label, 'description', r.description) order by r.label), '[]'::jsonb)
    into v_roles
  from private.staff_role_assignments a
  join private.staff_roles r on r.code = a.role_code
  where a.user_id = v_user_id and a.revoked_at is null;

  select coalesce(jsonb_agg(distinct rp.permission_code), '[]'::jsonb)
    into v_permissions
  from private.staff_role_assignments a
  join private.staff_role_permissions rp on rp.role_code = a.role_code
  where a.user_id = v_user_id and a.revoked_at is null;

  return jsonb_build_object('is_owner', public.is_admin(), 'roles', v_roles, 'permissions', v_permissions);
end;
$function$

revoke all on function public.get_my_staff_access() from public, anon;
grant execute on function public.get_my_staff_access() to authenticated;

CREATE OR REPLACE FUNCTION public.list_staff_role_catalog()
 RETURNS TABLE(role_code text, label text, description text, is_system boolean, permissions jsonb)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if not public.is_admin() then raise exception 'Somente o Administrador Principal pode consultar o catálogo de cargos.'; end if;
  return query
  select r.code, r.label, r.description, r.is_system,
         coalesce(jsonb_agg(rp.permission_code order by rp.permission_code) filter (where rp.permission_code is not null), '[]'::jsonb)
  from private.staff_roles r
  left join private.staff_role_permissions rp on rp.role_code = r.code
  group by r.code, r.label, r.description, r.is_system
  order by r.is_system desc, r.label;
end;
$function$

revoke all on function public.list_staff_role_catalog() from public, anon;
grant execute on function public.list_staff_role_catalog() to authenticated;

CREATE OR REPLACE FUNCTION public.list_staff_management()
 RETURNS TABLE(user_id uuid, email text, display_name text, roles jsonb)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if not public.is_admin() then raise exception 'Somente o Administrador Principal pode administrar a equipe.'; end if;
  return query
  select p.id, u.email::text, coalesce(nullif(p.display_name, ''), u.email)::text,
         coalesce((
           select jsonb_agg(jsonb_build_object('assignment_id', a.id, 'code', r.code, 'label', r.label, 'assigned_at', a.assigned_at) order by r.label)
           from private.staff_role_assignments a
           join private.staff_roles r on r.code = a.role_code
           where a.user_id = p.id and a.revoked_at is null
         ), '[]'::jsonb)
  from public.profiles p
  join auth.users u on u.id = p.id
  order by case when p.id = auth.uid() then 0 else 1 end, coalesce(p.display_name, u.email);
end;
$function$

revoke all on function public.list_staff_management() from public, anon;
grant execute on function public.list_staff_management() to authenticated;

CREATE OR REPLACE FUNCTION public.list_staff_audit_log(p_limit integer DEFAULT 100)
 RETURNS TABLE(id uuid, action text, actor_name text, target_name text, role_label text, details jsonb, created_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if not public.is_admin() then raise exception 'Somente o Administrador Principal pode consultar o histórico da equipe.'; end if;
  return query
  select l.id, l.action,
         coalesce(actor.display_name, l.actor_id::text),
         coalesce(target.display_name, l.target_user_id::text),
         r.label, l.details, l.created_at
  from private.staff_audit_log l
  left join public.profiles actor on actor.id = l.actor_id
  left join public.profiles target on target.id = l.target_user_id
  left join private.staff_roles r on r.code = l.role_code
  order by l.created_at desc
  limit greatest(1, least(coalesce(p_limit, 100), 250));
end;
$function$

revoke all on function public.list_staff_audit_log(integer) from public, anon;
grant execute on function public.list_staff_audit_log(integer) to authenticated;

CREATE OR REPLACE FUNCTION public.list_staff_permission_catalog()
 RETURNS TABLE(permission_code text, description text, category text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if not public.is_admin() then raise exception 'Somente o Administrador Principal pode consultar as permissões disponíveis.'; end if;
  return query select p.code, p.description, p.category
  from private.staff_permissions p order by p.category, p.code;
end;
$function$

revoke all on function public.list_staff_permission_catalog() from public, anon;
grant execute on function public.list_staff_permission_catalog() to authenticated;

CREATE OR REPLACE FUNCTION public.create_staff_role(p_code text, p_label text, p_description text, p_permissions text[])
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_permission text;
begin
  if not public.is_admin() then raise exception 'Somente o Administrador Principal pode criar cargos.'; end if;
  if p_code is null or p_code !~ '^[a-z][a-z0-9_]{1,47}$' then
    raise exception 'Código do cargo inválido. Use letras minúsculas, números e sublinhados.';
  end if;
  if nullif(btrim(p_label), '') is null then raise exception 'Informe o nome do cargo.'; end if;
  if coalesce(cardinality(p_permissions), 0) = 0 then raise exception 'Selecione ao menos uma permissão para o cargo.'; end if;
  if exists (
    select 1 from unnest(p_permissions) x
    left join private.staff_permissions p on p.code = x
    where p.code is null
  ) then raise exception 'O cargo contém uma permissão desconhecida.'; end if;
  if 'characters.review.profile.decide' = any(p_permissions)
     and not ('characters.review.profile.read' = any(p_permissions)) then
    raise exception 'A permissão de decidir informações básicas exige a permissão de leitura correspondente.';
  end if;
  if 'characters.review.story.decide' = any(p_permissions)
     and not ('characters.review.story.read' = any(p_permissions)) then
    raise exception 'A permissão de decidir histórias exige a permissão de leitura correspondente.';
  end if;
  if 'characters.review.powers.decide' = any(p_permissions)
     and not ('characters.review.powers.read' = any(p_permissions)) then
    raise exception 'A permissão de decidir poderes exige a permissão de leitura correspondente.';
  end if;

  insert into private.staff_roles(code, label, description, is_system, created_by)
  values (p_code, btrim(p_label), coalesce(btrim(p_description), ''), false, auth.uid());

  foreach v_permission in array p_permissions loop
    insert into private.staff_role_permissions(role_code, permission_code) values (p_code, v_permission);
  end loop;

  insert into private.staff_audit_log(actor_id, role_code, action, details)
  values (auth.uid(), p_code, 'role_created',
          jsonb_build_object('label', btrim(p_label), 'permissions', to_jsonb(p_permissions)));
  return p_code;
end;
$function$

revoke all on function public.create_staff_role(text, text, text, text[]) from public, anon;
grant execute on function public.create_staff_role(text,text,text,text[]) to authenticated;

CREATE OR REPLACE FUNCTION public.assign_staff_role(p_user_id uuid, p_role_code text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_assignment_id uuid; v_target_role text;
begin
  if not public.is_admin() then raise exception 'Somente o Administrador Principal pode conceder cargos.'; end if;
  if p_user_id is null or p_user_id = auth.uid() then
    raise exception 'Não é permitido atribuir um cargo ao Administrador Principal.';
  end if;
  if not exists (select 1 from public.profiles where id = p_user_id) then raise exception 'Conta não encontrada.'; end if;
  select role into v_target_role from public.profiles where id = p_user_id;
  if v_target_role = 'admin' then raise exception 'Uma conta administrativa não pode receber cargos delegados.'; end if;
  if not exists (select 1 from private.staff_roles where code = p_role_code) then raise exception 'Cargo não encontrado.'; end if;

  insert into private.staff_role_assignments(user_id, role_code, assigned_by)
  values (p_user_id, p_role_code, auth.uid())
  on conflict (user_id, role_code) where revoked_at is null do nothing
  returning id into v_assignment_id;

  if v_assignment_id is null then
    select id into v_assignment_id from private.staff_role_assignments
    where user_id = p_user_id and role_code = p_role_code and revoked_at is null;
    return v_assignment_id;
  end if;

  insert into private.staff_audit_log(actor_id, target_user_id, role_code, action, details)
  values (auth.uid(), p_user_id, p_role_code, 'role_assigned',
          jsonb_build_object('assignment_id', v_assignment_id));
  return v_assignment_id;
end;
$function$

revoke all on function public.assign_staff_role(uuid, text) from public, anon;
grant execute on function public.assign_staff_role(uuid,text) to authenticated;

CREATE OR REPLACE FUNCTION public.revoke_staff_role(p_assignment_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_user_id uuid; v_role_code text;
begin
  if not public.is_admin() then raise exception 'Somente o Administrador Principal pode revogar cargos.'; end if;
  update private.staff_role_assignments
     set revoked_at = now(), revoked_by = auth.uid()
   where id = p_assignment_id and revoked_at is null
  returning user_id, role_code into v_user_id, v_role_code;
  if not found then raise exception 'Atribuição não encontrada ou já revogada.'; end if;

  insert into private.staff_audit_log(actor_id, target_user_id, role_code, action, details)
  values (auth.uid(), v_user_id, v_role_code, 'role_revoked',
          jsonb_build_object('assignment_id', p_assignment_id));
  return true;
end;
$function$

revoke all on function public.revoke_staff_role(uuid) from public, anon;
grant execute on function public.revoke_staff_role(uuid) to authenticated;

CREATE OR REPLACE FUNCTION public.get_character_review_queue()
 RETURNS TABLE(character_id uuid, character_name text, player_name text, section_key text, section_label text, section_status text, submitted_at timestamp with time zone, section_data jsonb, review_note text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.uid() is null then raise exception 'É necessário estar autenticado.'; end if;
  return query
  select c.id,
         coalesce(c.name, 'Personagem sem nome'),
         coalesce(p.display_name, 'Jogador'),
         r.section_key,
         case r.section_key
           when 'profile' then 'Informações básicas'
           when 'story' then 'História e origem'
           when 'powers' then 'Talento e poderes'
         end,
         r.status,
         c.updated_at,
         case r.section_key
           when 'profile' then jsonb_build_object(
             'name', c.name, 'age', c.age, 'height_cm', c.height_cm,
             'weight_kg', c.weight_kg, 'gender', c.gender,
             'personality', c.personality, 'appearance', c.appearance,
             'race', c.race, 'chi_reserve', c.chi_reserve,
             'common_skills', c.common_skills,
             'occupation', c.ficha_data -> 'occupation'
           )
           when 'story' then jsonb_build_object('backstory', c.backstory)
           when 'powers' then jsonb_build_object(
             'race', c.race, 'talent_rarity', c.talent_rarity,
             'specializations', c.specializations,
             'supernatural_skills', c.supernatural_skills,
             'talent_description', c.ficha_data -> 'talentDescription',
             'cybernetic_modules', c.cybernetic_modules
           )
         end,
         r.note
  from public.character_section_reviews r
  join public.characters c on c.id = r.character_id
  left join public.profiles p on p.id = c.player_id
  where r.status = 'pending'
    and c.status in ('submitted','rejected')
    and c.player_id <> auth.uid()
    and case r.section_key
      when 'profile' then public.has_staff_permission('characters.review.profile.read')
      when 'story' then public.has_staff_permission('characters.review.story.read')
      when 'powers' then public.has_staff_permission('characters.review.powers.read')
      else false
    end
  order by c.updated_at asc, r.created_at asc;
end;
$function$

revoke all on function public.get_character_review_queue() from public, anon;
grant execute on function public.get_character_review_queue() to authenticated;

CREATE OR REPLACE FUNCTION public.decide_character_section(p_character_id uuid, p_section_key text, p_decision text, p_note text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_permission text;
  v_current_status text;
  v_character_status text;
begin
  if auth.uid() is null then raise exception 'É necessário estar autenticado.'; end if;
  v_permission := case p_section_key
    when 'profile' then 'characters.review.profile.decide'
    when 'story' then 'characters.review.story.decide'
    when 'powers' then 'characters.review.powers.decide'
    else null end;
  if v_permission is null then raise exception 'Seção de avaliação inválida.'; end if;
  if not public.has_staff_permission(v_permission) then
    raise exception 'Sua conta não possui permissão para avaliar esta seção.';
  end if;
  if p_decision not in ('approved','needs_revision') then raise exception 'Decisão inválida.'; end if;
  if p_decision = 'needs_revision' and nullif(btrim(p_note), '') is null then
    raise exception 'Explique o que precisa ser corrigido antes de devolver a seção.';
  end if;

  select r.status, c.status into v_current_status, v_character_status
  from public.character_section_reviews r
  join public.characters c on c.id = r.character_id
  where r.character_id = p_character_id and r.section_key = p_section_key
  for update of r, c;

  if not found then raise exception 'Esta seção ainda não foi encaminhada para avaliação.'; end if;
  if v_character_status not in ('submitted','rejected') then raise exception 'Esta ficha não está em processo de avaliação.'; end if;
  if v_current_status <> 'pending' then raise exception 'Esta seção não está pendente de avaliação.'; end if;

  update public.character_section_reviews
     set status = p_decision, reviewer_id = auth.uid(),
         note = nullif(btrim(p_note), ''), reviewed_at = now(), updated_at = now()
   where character_id = p_character_id and section_key = p_section_key;

  if p_decision = 'needs_revision' then
    update public.characters set status = 'rejected',
      review_note = nullif(btrim(p_note), ''), updated_at = now()
    where id = p_character_id;
  end if;

  insert into private.staff_audit_log(actor_id, target_user_id, action, details)
  select auth.uid(), c.player_id, 'character_section_' || p_decision,
         jsonb_build_object('character_id', c.id, 'section_key', p_section_key,
                            'note', nullif(btrim(p_note), ''))
  from public.characters c where c.id = p_character_id;
  return true;
end;
$function$

revoke all on function public.decide_character_section(uuid, text, text, text) from public, anon;
grant execute on function public.decide_character_section(uuid,text,text,text) to authenticated;

CREATE OR REPLACE FUNCTION public.get_my_character_review_status(p_character_id uuid)
 RETURNS TABLE(section_key text, status text, note text, reviewer_name text, reviewed_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.uid() is null or not (
    public.is_admin()
    or exists (select 1 from public.characters c where c.id = p_character_id and c.player_id = auth.uid())
  ) then raise exception 'Você não pode consultar a avaliação desta ficha.'; end if;

  return query
  select r.section_key, r.status, r.note,
         coalesce(p.display_name, 'Equipe da Agência'), r.reviewed_at
  from public.character_section_reviews r
  left join public.profiles p on p.id = r.reviewer_id
  where r.character_id = p_character_id
  order by case r.section_key when 'profile' then 1 when 'story' then 2 else 3 end;
end;
$function$

revoke all on function public.get_my_character_review_status(uuid) from public, anon;
grant execute on function public.get_my_character_review_status(uuid) to authenticated;

CREATE OR REPLACE FUNCTION public.guard_approved_character_sections()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_profile_status text;
  v_story_status text;
  v_powers_status text;
  v_old_profile jsonb;
  v_new_profile jsonb;
  v_old_story jsonb;
  v_new_story jsonb;
  v_old_powers jsonb;
  v_new_powers jsonb;
begin
  if auth.uid() is null or auth.uid() <> old.player_id or old.status <> 'rejected' then
    return new;
  end if;

  select max(status) filter (where section_key = 'profile'),
         max(status) filter (where section_key = 'story'),
         max(status) filter (where section_key = 'powers')
    into v_profile_status, v_story_status, v_powers_status
  from public.character_section_reviews
  where character_id = old.id;

  v_old_profile := jsonb_build_object(
    'name', old.name, 'age', old.age, 'height_cm', old.height_cm,
    'weight_kg', old.weight_kg, 'gender', old.gender,
    'personality', old.personality, 'appearance', old.appearance,
    'race', old.race, 'chi_reserve', old.chi_reserve,
    'common_skills', old.common_skills,
    'occupation', old.ficha_data -> 'occupation',
    'humanChiEnhancement', old.ficha_data -> 'humanChiEnhancement',
    'draft_fields', jsonb_build_object(
      'name', old.ficha_data #> '{draftState,fields,name}',
      'age', old.ficha_data #> '{draftState,fields,age}',
      'height', old.ficha_data #> '{draftState,fields,height}',
      'gender', old.ficha_data #> '{draftState,fields,gender}',
      'weight', old.ficha_data #> '{draftState,fields,weight}',
      'personality', old.ficha_data #> '{draftState,fields,personality}',
      'appearance', old.ficha_data #> '{draftState,fields,appearance}',
      'skills', old.ficha_data #> '{draftState,fields,skills}',
      'occupation', old.ficha_data #> '{draftState,fields,occupation}'
    ),
    'draft_race', old.ficha_data #> '{draftState,race}',
    'draft_second_roll', old.ficha_data #> '{draftState,secondRoll}'
  );
  v_new_profile := jsonb_build_object(
    'name', new.name, 'age', new.age, 'height_cm', new.height_cm,
    'weight_kg', new.weight_kg, 'gender', new.gender,
    'personality', new.personality, 'appearance', new.appearance,
    'race', new.race, 'chi_reserve', new.chi_reserve,
    'common_skills', new.common_skills,
    'occupation', new.ficha_data -> 'occupation',
    'humanChiEnhancement', new.ficha_data -> 'humanChiEnhancement',
    'draft_fields', jsonb_build_object(
      'name', new.ficha_data #> '{draftState,fields,name}',
      'age', new.ficha_data #> '{draftState,fields,age}',
      'height', new.ficha_data #> '{draftState,fields,height}',
      'gender', new.ficha_data #> '{draftState,fields,gender}',
      'weight', new.ficha_data #> '{draftState,fields,weight}',
      'personality', new.ficha_data #> '{draftState,fields,personality}',
      'appearance', new.ficha_data #> '{draftState,fields,appearance}',
      'skills', new.ficha_data #> '{draftState,fields,skills}',
      'occupation', new.ficha_data #> '{draftState,fields,occupation}'
    ),
    'draft_race', new.ficha_data #> '{draftState,race}',
    'draft_second_roll', new.ficha_data #> '{draftState,secondRoll}'
  );

  v_old_story := jsonb_build_object(
    'backstory', old.backstory,
    'draft_history', old.ficha_data #> '{draftState,fields,history}'
  );
  v_new_story := jsonb_build_object(
    'backstory', new.backstory,
    'draft_history', new.ficha_data #> '{draftState,fields,history}'
  );

  v_old_powers := jsonb_build_object(
    'talent_rarity', old.talent_rarity,
    'specializations', old.specializations,
    'supernatural_skills', old.supernatural_skills,
    'cybernetic_modules', old.cybernetic_modules,
    'talent_description', old.ficha_data -> 'talentDescription',
    'cybernetic_modules_json', old.ficha_data -> 'cyberneticModules',
    'draft_supernatural', old.ficha_data #> '{draftState,fields,supernatural}',
    'draft_talent_description', old.ficha_data #> '{draftState,fields,talentDescription}',
    'draft_specializations', old.ficha_data #> '{draftState,specializations}',
    'draft_modules', old.ficha_data #> '{draftState,cyberneticModules}',
    'draft_rarity', old.ficha_data #> '{draftState,rarity}'
  );
  v_new_powers := jsonb_build_object(
    'talent_rarity', new.talent_rarity,
    'specializations', new.specializations,
    'supernatural_skills', new.supernatural_skills,
    'cybernetic_modules', new.cybernetic_modules,
    'talent_description', new.ficha_data -> 'talentDescription',
    'cybernetic_modules_json', new.ficha_data -> 'cyberneticModules',
    'draft_supernatural', new.ficha_data #> '{draftState,fields,supernatural}',
    'draft_talent_description', new.ficha_data #> '{draftState,fields,talentDescription}',
    'draft_specializations', new.ficha_data #> '{draftState,specializations}',
    'draft_modules', new.ficha_data #> '{draftState,cyberneticModules}',
    'draft_rarity', new.ficha_data #> '{draftState,rarity}'
  );

  if v_profile_status = 'approved' and v_old_profile is distinct from v_new_profile then
    raise exception 'As informações básicas desta ficha já foram aprovadas e estão bloqueadas.';
  end if;
  if v_story_status = 'approved' and v_old_story is distinct from v_new_story then
    raise exception 'A história desta ficha já foi aprovada e está bloqueada.';
  end if;
  if v_powers_status = 'approved' and v_old_powers is distinct from v_new_powers then
    raise exception 'Os poderes desta ficha já foram aprovados e estão bloqueados.';
  end if;

  if old.race is distinct from new.race and v_powers_status = 'approved' then
    update public.character_section_reviews
       set status = 'pending', reviewer_id = null,
           note = 'Reavaliação necessária porque a raça do personagem foi alterada.',
           reviewed_at = null, updated_at = now()
     where character_id = old.id and section_key = 'powers';
    insert into private.staff_audit_log(actor_id, target_user_id, action, details)
    values (auth.uid(), old.player_id, 'character_section_reopened',
            jsonb_build_object('character_id', old.id, 'section_key', 'powers', 'reason', 'race_changed'));
  end if;
  return new;
end;
$function$

revoke all on function public.guard_approved_character_sections() from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_character(p_character_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_character public.characters%rowtype;
  v_specializations text[];
  v_supernatural text[];
  v_cybernetic jsonb;
  v_allowed text[] := array[
    'Controle', 'Corroer', 'Criação', 'Elemental', 'Aceleração', 'Ocultar',
    'Cinese', 'Poder', 'Psíquico', 'Controle de Alcance', 'Alcance',
    'Transformação', 'Estado', 'Suporte', 'Tóxico', 'Vazio', 'Warp'
  ];
  v_spec text;
  v_distinct_count integer;
  v_powers_applicable boolean;
begin
  if auth.uid() is null then raise exception 'É necessário estar autenticado.'; end if;

  select * into v_character
  from public.characters
  where id = p_character_id and player_id = auth.uid()
  for update;
  if not found then raise exception 'Personagem não encontrado.'; end if;
  if v_character.status not in ('draft','rejected') then
    raise exception 'Esta ficha não pode ser enviada neste estado.';
  end if;

  if v_character.name is null or btrim(v_character.name) = ''
     or v_character.age is null
     or v_character.height_cm is null
     or v_character.weight_kg is null
     or v_character.gender is null or btrim(v_character.gender) = ''
     or v_character.personality is null or btrim(v_character.personality) = ''
     or v_character.appearance is null or btrim(v_character.appearance) = ''
     or v_character.backstory is null or btrim(v_character.backstory) = ''
     or v_character.race is null then
    raise exception 'Preencha todos os dados básicos da ficha.';
  end if;

  v_specializations := coalesce(v_character.specializations, array[]::text[]);
  v_supernatural := coalesce(v_character.supernatural_skills, array[]::text[]);
  v_cybernetic := coalesce(v_character.cybernetic_modules, '[]'::jsonb);

  if v_character.race = 'Humanos' then
    if v_character.chi_reserve is null then raise exception 'Humanos precisam definir sua reserva de Chi.'; end if;
    if cardinality(v_supernatural) > 0 then raise exception 'Humanos não podem possuir habilidades sobrenaturais.'; end if;
    if v_cybernetic <> '[]'::jsonb then raise exception 'Apenas Ciborgues podem possuir módulos cibernéticos.'; end if;
    if cardinality(v_specializations) > 0 or v_character.talent_rarity is not null then
      raise exception 'Humanos não podem possuir Talentos ou especializações.';
    end if;
  elsif v_character.race in ('Híbridos','Químios') then
    if v_character.chi_reserve is null then raise exception 'Esta raça precisa definir sua reserva de Chi.'; end if;
    if v_character.talent_rarity is null or v_character.talent_rarity not in ('Comum','Raro') then
      raise exception 'A raridade do Talento precisa ser Comum ou Raro.';
    end if;
    if v_cybernetic <> '[]'::jsonb then raise exception 'Módulos cibernéticos são exclusivos de Ciborgues.'; end if;
    if v_character.talent_rarity = 'Comum' and cardinality(v_specializations) <> 1 then
      raise exception 'Talentos Comuns exigem exatamente uma especialização.';
    end if;
    if v_character.talent_rarity = 'Raro' and cardinality(v_specializations) <> 2 then
      raise exception 'Talentos Raros exigem exatamente duas especializações.';
    end if;
    foreach v_spec in array v_specializations loop
      if v_spec is null or not (v_spec = any(v_allowed)) then
        raise exception 'A ficha contém uma especialização inválida.';
      end if;
    end loop;
    select count(distinct item) into v_distinct_count
    from unnest(v_specializations) as specs(item);
    if cardinality(v_specializations) <> v_distinct_count then
      raise exception 'Não é permitido repetir especializações.';
    end if;
  elsif v_character.race = 'Ciborgues' then
    if v_character.chi_reserve is not null then raise exception 'Ciborgues não realizam rolagem de Chi.'; end if;
    if cardinality(v_supernatural) > 0 then raise exception 'Ciborgues não podem possuir habilidades sobrenaturais.'; end if;
    if v_character.talent_rarity is not null or cardinality(v_specializations) > 0 then
      raise exception 'Ciborgues não possuem Talentos ou especializações.';
    end if;
    if jsonb_typeof(v_cybernetic) <> 'array' then
      raise exception 'Os módulos cibernéticos precisam ser enviados em formato de lista.';
    end if;
    if jsonb_array_length(v_cybernetic) > 5 then raise exception 'Ciborgues podem possuir no máximo 5 módulos cibernéticos.'; end if;
    if exists (
      select 1 from jsonb_array_elements(v_cybernetic) as module(item)
      where jsonb_typeof(module.item) <> 'object'
         or btrim(coalesce(module.item ->> 'name','')) = ''
         or btrim(coalesce(module.item ->> 'description','')) = ''
    ) then
      raise exception 'Cada módulo precisa ter um nome e uma descrição de funcionamento.';
    end if;
  else
    raise exception 'Raça inválida.';
  end if;

  v_powers_applicable :=
    v_character.race in ('Híbridos','Químios')
    or (v_character.race = 'Ciborgues' and jsonb_array_length(v_cybernetic) > 0);

  update public.characters
     set status = 'submitted', review_note = null, updated_at = now()
   where id = p_character_id;

  insert into public.character_section_reviews(character_id, section_key, status)
  values
    (p_character_id, 'profile', 'pending'),
    (p_character_id, 'story', 'pending'),
    (p_character_id, 'powers', case when v_powers_applicable then 'pending' else 'not_applicable' end)
  on conflict (character_id, section_key) do nothing;

  update public.character_section_reviews
     set status = 'pending', reviewer_id = null, note = null,
         reviewed_at = null, updated_at = now()
   where character_id = p_character_id and status = 'needs_revision';

  if v_powers_applicable then
    update public.character_section_reviews
       set status = 'pending', reviewer_id = null, note = null,
           reviewed_at = null, updated_at = now()
     where character_id = p_character_id and section_key = 'powers'
       and status = 'not_applicable';
  else
    update public.character_section_reviews
       set status = 'not_applicable', reviewer_id = null, note = null,
           reviewed_at = null, updated_at = now()
     where character_id = p_character_id and section_key = 'powers'
       and status = 'pending';
  end if;

  return true;
end;
$function$

revoke all on function public.submit_character(uuid) from public, anon;
grant execute on function public.submit_character(uuid) to authenticated;

CREATE OR REPLACE FUNCTION public.approve_character(p_character_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.uid() is null then raise exception 'Usuário não autenticado.'; end if;
  if not public.is_admin() then
    raise exception 'Apenas o Administrador Principal pode aprovar a ficha completa.';
  end if;
  if not exists (select 1 from public.characters where id = p_character_id and status = 'submitted') then
    raise exception 'Ficha não encontrada ou não está aguardando decisão final.';
  end if;
  if not exists (select 1 from public.character_section_reviews where character_id = p_character_id) then
    raise exception 'As avaliações por seção ainda não foram inicializadas.';
  end if;
  if exists (
    select 1 from public.character_section_reviews
    where character_id = p_character_id and status not in ('approved','not_applicable')
  ) then raise exception 'A ficha ainda possui seções pendentes ou devolvidas.'; end if;

  update public.characters set status = 'approved', review_note = null, updated_at = now()
  where id = p_character_id and status = 'submitted';
  if not found then raise exception 'Não foi possível concluir a aprovação da ficha.'; end if;
  return true;
end;
$function$

revoke all on function public.approve_character(uuid) from public, anon;
grant execute on function public.approve_character(uuid) to authenticated;

CREATE OR REPLACE FUNCTION public.return_character_for_revision(p_character_id uuid, p_review_note text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.uid() is null then raise exception 'Usuário não autenticado.'; end if;
  if not public.is_admin() then
    raise exception 'Apenas o Administrador Principal pode devolver a ficha completa.';
  end if;
  if p_review_note is null or btrim(p_review_note) = '' then raise exception 'Informe o motivo da devolução.'; end if;

  if not exists (select 1 from public.character_section_reviews where character_id = p_character_id) then
    raise exception 'As avaliações por seção ainda não foram inicializadas.';
  end if;

  update public.character_section_reviews
     set status = case when status = 'not_applicable' then status else 'needs_revision' end,
         reviewer_id = case when status = 'not_applicable' then reviewer_id else auth.uid() end,
         note = case when status = 'not_applicable' then note else btrim(p_review_note) end,
         reviewed_at = case when status = 'not_applicable' then reviewed_at else now() end,
         updated_at = now()
   where character_id = p_character_id;

  update public.characters
     set status = 'rejected', review_note = btrim(p_review_note), updated_at = now()
   where id = p_character_id and status = 'submitted';
  if not found then raise exception 'Ficha não encontrada ou não está aguardando avaliação.'; end if;
  return true;
end;
$function$

revoke all on function public.return_character_for_revision(uuid, text) from public, anon;
grant execute on function public.return_character_for_revision(uuid,text) to authenticated;

drop policy if exists "Players view own section reviews or owner" on public.character_section_reviews;
create policy "Players view own section reviews or owner" on public.character_section_reviews
for select to authenticated using (
  public.is_admin()
  or exists (select 1 from public.characters c
    where c.id=character_section_reviews.character_id and c.player_id=(select auth.uid()))
);


drop trigger if exists a_guard_approved_character_sections on public.characters;
create trigger a_guard_approved_character_sections before update on public.characters
for each row execute function public.guard_approved_character_sections();

insert into public.character_section_reviews(character_id,section_key,status)
select c.id,s.section_key,
 case when s.section_key='powers'
   and (c.race in ('Híbridos','Químios')
     or (c.race='Ciborgues' and jsonb_array_length(coalesce(c.cybernetic_modules,'[]'::jsonb))>0))
   then 'pending'
   when s.section_key='powers' then 'not_applicable'
   else 'pending' end
from public.characters c
cross join (values('profile'),('story'),('powers')) as s(section_key)
where c.status in ('submitted','rejected')
on conflict(character_id,section_key) do nothing;

revoke execute on function public.rls_auto_enable() from public,anon,authenticated;
