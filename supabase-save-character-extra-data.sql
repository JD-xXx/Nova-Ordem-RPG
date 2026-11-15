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

  select coalesce(array_agg(value), array[]::text[])
    into v_specializations
  from jsonb_array_elements_text(p_ficha_data->'specializations') as item(value);

  update public.characters
     set specializations = v_specializations,
         ficha_data = coalesce(ficha_data, '{}'::jsonb)
                      || (p_ficha_data - 'specializations'),
         updated_at = now()
   where id = p_character_id
     and player_id = v_user_id
     and status in ('draft', 'rejected');

  if not found then
    raise exception 'Ficha não encontrada, não pertence à sua conta ou não pode mais ser editada.';
  end if;
end;
$$;

revoke all on function public.save_character_extra_data(uuid, jsonb) from public;
revoke all on function public.save_character_extra_data(uuid, jsonb) from anon;
grant execute on function public.save_character_extra_data(uuid, jsonb) to authenticated;
