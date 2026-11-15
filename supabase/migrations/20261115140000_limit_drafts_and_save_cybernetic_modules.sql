-- Nova Ordem: autosave parcial, limite permanente de 2 rascunhos por jogador e limite de personagens ativos.
-- Execute no SQL Editor do projeto Supabase "Nova Ordem - Testes" antes de publicar a nova integração.
-- Esta migração preserva o histórico de aprovações mesmo se uma ficha aprovada for removida.

begin;

-- Histórico de aprovações preservado para consulta administrativa; não altera o limite de rascunhos.
create table if not exists public.character_approval_unlocks (
  character_id uuid primary key,
  player_id uuid not null,
  approved_at timestamptz not null default now()
);

create index if not exists character_approval_unlocks_player_idx
  on public.character_approval_unlocks(player_id);

alter table public.character_approval_unlocks enable row level security;
revoke all on public.character_approval_unlocks from public;
revoke all on public.character_approval_unlocks from anon;
revoke all on public.character_approval_unlocks from authenticated;

-- Registra aprovações antigas para que a migração não retire desbloqueios já conquistados.
insert into public.character_approval_unlocks(player_id, character_id)
select player_id, id
from public.characters
where status = 'approved'
on conflict (character_id) do nothing;

-- Impede que um jogador tenha mais de dois personagens aprovados simultaneamente.
create or replace function public.enforce_player_approved_character_limit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_new_approval boolean := false;
  v_active_count integer;
begin
  if new.status = 'approved' then
    if tg_op = 'INSERT' then
      v_new_approval := true;
    elsif tg_op = 'UPDATE' then
      v_new_approval := old.status is distinct from 'approved';
    end if;
  end if;

  if v_new_approval then
    perform pg_advisory_xact_lock(hashtextextended(new.player_id::text, 0));

    select count(*) into v_active_count
    from public.characters
    where player_id = new.player_id
      and status = 'approved'
      and id <> new.id;

    if v_active_count >= 2 then
      raise exception 'Este jogador já possui o limite de 2 personagens aprovados no RPG.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists characters_approved_limit_guard on public.characters;
create trigger characters_approved_limit_guard
before insert or update of status on public.characters
for each row execute function public.enforce_player_approved_character_limit();

-- Registra cada personagem aprovado apenas uma vez. O registro permanece mesmo se a ficha for removida.
create or replace function public.record_character_approval_unlock()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_new_approval boolean := false;
begin
  if new.status = 'approved' then
    if tg_op = 'INSERT' then
      v_new_approval := true;
    elsif tg_op = 'UPDATE' then
      v_new_approval := old.status is distinct from 'approved';
    end if;
  end if;

  if v_new_approval then
    insert into public.character_approval_unlocks(player_id, character_id)
    values (new.player_id, new.id)
    on conflict (character_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists characters_record_approval_unlock on public.characters;
create trigger characters_record_approval_unlock
after insert or update of status on public.characters
for each row execute function public.record_character_approval_unlock();


-- Limite permanente de dois rascunhos por jogador, validado no próprio banco.
create or replace function public.enforce_player_draft_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $
declare
  v_new_draft boolean := false;
  v_draft_count integer;
begin
  if new.status = 'draft' then
    if tg_op = 'INSERT' then
      v_new_draft := true;
    elsif tg_op = 'UPDATE' then
      v_new_draft := old.status is distinct from 'draft'
        or old.player_id is distinct from new.player_id;
    end if;
  end if;
  if v_new_draft then
    if new.player_id is null then
      raise exception 'O rascunho precisa pertencer a um jogador.';
    end if;
    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(new.player_id::text, 0));
    select pg_catalog.count(*) into v_draft_count
    from public.characters
    where player_id = new.player_id and status = 'draft' and id is distinct from new.id;
    if v_draft_count >= 2 then
      raise exception 'Cada jogador pode manter no máximo 2 rascunhos ao mesmo tempo.';
    end if;
  end if;
  return new;
end;
$;

drop trigger if exists characters_draft_limit_guard on public.characters;
create trigger characters_draft_limit_guard
before insert or update of status, player_id on public.characters
for each row execute function public.enforce_player_draft_limit();

-- Consulta segura para a interface mostrar a capacidade atual do jogador.
create or replace function public.get_character_creation_progress()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_draft_count integer;
  v_approved_count integer;
  v_active_count integer;
  v_draft_limit integer;
begin
  if v_user_id is null then
    raise exception 'É necessário estar autenticado.';
  end if;

  select count(*) into v_draft_count
  from public.characters
  where player_id = v_user_id and status = 'draft';

  select count(*) into v_approved_count
  from public.character_approval_unlocks
  where player_id = v_user_id;

  select count(*) into v_active_count
  from public.characters
  where player_id = v_user_id and status = 'approved';

  v_draft_limit := 2;

  return jsonb_build_object(
    'draft_count', v_draft_count,
    'draft_limit', v_draft_limit,
    'approved_count', v_approved_count,
    'active_character_count', v_active_count,
    'max_active_characters', 2
  );
end;
$$;

-- Criação protegida no servidor: no máximo 2 rascunhos simultâneos por jogador.
create or replace function public.create_character_draft()
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_draft_count integer;
  v_draft_limit integer;
  v_character_id uuid;
begin
  if v_user_id is null then
    raise exception 'É necessário estar autenticado.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text, 0));

  v_draft_limit := 2;

  select count(*) into v_draft_count
  from public.characters
  where player_id = v_user_id and status = 'draft';

  if v_draft_count >= v_draft_limit then
    raise exception 'Cada jogador pode manter no máximo 2 rascunhos ao mesmo tempo.', v_draft_limit;
  end if;

  insert into public.characters(player_id, status)
  values (v_user_id, 'draft')
  returning id into v_character_id;

  return v_character_id;
end;
$$;

-- Salva o estado incompleto e o nome sem exigir que todos os campos básicos estejam preenchidos.
create or replace function public.save_character_draft_progress(
  p_character_id uuid,
  p_draft_state jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_name text;
begin
  if v_user_id is null then
    raise exception 'É necessário estar autenticado.';
  end if;

  if p_draft_state is null or jsonb_typeof(p_draft_state) <> 'object' then
    raise exception 'O progresso da ficha precisa ser um objeto JSON.';
  end if;

  if jsonb_typeof(p_draft_state->'fields') is distinct from 'object' then
    raise exception 'Os campos da ficha estão em formato inválido.';
  end if;

  v_name := nullif(btrim(p_draft_state #>> '{fields,name}'), '');

  update public.characters
     set name = case
                  when (p_draft_state->'fields') ? 'name' then v_name
                  else name
                end,
         ficha_data = coalesce(ficha_data, '{}'::jsonb)
                      || jsonb_build_object('draftState', p_draft_state),
         updated_at = now()
   where id = p_character_id
     and player_id = v_user_id
     and status in ('draft', 'rejected');

  if not found then
    raise exception 'Rascunho não encontrado, não pertence à sua conta ou não pode mais ser editado.';
  end if;
end;
$$;

revoke all on function public.get_character_creation_progress() from public;
revoke all on function public.get_character_creation_progress() from anon;
grant execute on function public.get_character_creation_progress() to authenticated;

revoke all on function public.create_character_draft() from public;
revoke all on function public.create_character_draft() from anon;
grant execute on function public.create_character_draft() to authenticated;

revoke all on function public.save_character_draft_progress(uuid, jsonb) from public;
revoke all on function public.save_character_draft_progress(uuid, jsonb) from anon;
grant execute on function public.save_character_draft_progress(uuid, jsonb) to authenticated;


-- Integra os módulos cibernéticos ao salvamento complementar da ficha.
-- RPC complementar para salvar os campos extras do criador de personagens.
-- Execute este arquivo no SQL Editor do projeto Supabase "Nova Ordem - Testes".

create or replace function public.save_character_extra_data(
  p_character_id uuid,
  p_ficha_data jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $
declare
  v_user_id uuid;
  v_specializations text[];
  v_modules jsonb;
  v_race text;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'É necessário estar autenticado.';
  end if;

  if p_ficha_data is null or jsonb_typeof(p_ficha_data) <> 'object' then
    raise exception 'Os dados complementares devem ser enviados como um objeto JSON.';
  end if;

  if not (p_ficha_data ? 'specializations')
     or jsonb_typeof(p_ficha_data->'specializations') <> 'array' then
    raise exception 'A lista de especializações precisa ser enviada como um array.';
  end if;

  select race into v_race
  from public.characters
  where id = p_character_id
    and player_id = v_user_id
    and status in ('draft', 'rejected')
  for update;

  if not found then
    raise exception 'Ficha não encontrada, não pertence à sua conta ou não pode mais ser editada.';
  end if;

  select coalesce(pg_catalog.array_agg(value), array[]::text[])
    into v_specializations
  from pg_catalog.jsonb_array_elements_text(p_ficha_data->'specializations') as item(value);

  if p_ficha_data ? 'cyberneticModules' then
    v_modules := p_ficha_data->'cyberneticModules';
    if pg_catalog.jsonb_typeof(v_modules) <> 'array' then
      raise exception 'Os módulos cibernéticos precisam ser enviados como uma lista.';
    end if;
    if pg_catalog.jsonb_array_length(v_modules) > 5 then
      raise exception 'Ciborgues podem possuir no máximo 5 módulos cibernéticos.';
    end if;
    if v_race is distinct from 'Ciborgues' and pg_catalog.jsonb_array_length(v_modules) > 0 then
      raise exception 'Apenas Ciborgues podem possuir módulos cibernéticos.';
    end if;
    if exists (
      select 1 from pg_catalog.jsonb_array_elements(v_modules) as module(item)
      where pg_catalog.jsonb_typeof(module.item) <> 'object'
        or pg_catalog.btrim(coalesce(module.item ->> 'name', '')) = ''
        or pg_catalog.btrim(coalesce(module.item ->> 'description', '')) = ''
    ) then
      raise exception 'Cada módulo precisa de nome e descrição de funcionamento.';
    end if;
  end if;

  update public.characters
     set specializations = v_specializations,
         cybernetic_modules = case when p_ficha_data ? 'cyberneticModules' then v_modules else cybernetic_modules end,
         ficha_data = coalesce(ficha_data, '{}'::jsonb)
                      || (p_ficha_data - 'specializations'),
         updated_at = now()
   where id = p_character_id
     and player_id = v_user_id
     and status in ('draft', 'rejected');
end;
$;

revoke all on function public.save_character_extra_data(uuid, jsonb) from public;
revoke all on function public.save_character_extra_data(uuid, jsonb) from anon;
grant execute on function public.save_character_extra_data(uuid, jsonb) to authenticated;


commit;
