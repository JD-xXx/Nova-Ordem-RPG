-- Nova Ordem: autosave parcial, limite progressivo de rascunhos e limite de personagens ativos.
-- Execute no SQL Editor do projeto Supabase "Nova Ordem - Testes" antes de publicar a nova integração.
-- Esta migração preserva o histórico de aprovações mesmo se uma ficha aprovada for removida.

begin;

-- Histórico permanente de aprovações usado para desbloquear vagas.
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

  v_draft_limit := case
    when v_approved_count >= 2 then 5
    when v_approved_count = 1 then 4
    else 2
  end;

  return jsonb_build_object(
    'draft_count', v_draft_count,
    'draft_limit', v_draft_limit,
    'approved_count', v_approved_count,
    'active_character_count', v_active_count,
    'max_active_characters', 2
  );
end;
$$;

-- Criação protegida no servidor: 2 vagas no início, 4 após a primeira aprovação, 5 após a segunda.
create or replace function public.create_character_draft()
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_approved_count integer;
  v_draft_count integer;
  v_draft_limit integer;
  v_character_id uuid;
begin
  if v_user_id is null then
    raise exception 'É necessário estar autenticado.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text, 0));

  select count(*) into v_approved_count
  from public.character_approval_unlocks
  where player_id = v_user_id;

  v_draft_limit := case
    when v_approved_count >= 2 then 5
    when v_approved_count = 1 then 4
    else 2
  end;

  select count(*) into v_draft_count
  from public.characters
  where player_id = v_user_id and status = 'draft';

  if v_draft_count >= v_draft_limit then
    raise exception 'Você atingiu seu limite atual de % rascunhos. As vagas adicionais são liberadas após aprovações.', v_draft_limit;
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

commit;
