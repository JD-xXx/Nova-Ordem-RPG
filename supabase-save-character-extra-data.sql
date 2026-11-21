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
as $$
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
$$;

revoke all on function public.save_character_extra_data(uuid, jsonb) from public;
revoke all on function public.save_character_extra_data(uuid, jsonb) from anon;
grant execute on function public.save_character_extra_data(uuid, jsonb) to authenticated;
