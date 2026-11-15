-- Nova Ordem: capacidades mecânicas exclusivas de Ciborgues.
-- Execute esta migration no Supabase SQL Editor após revisar.
-- A coluna é separada de supernatural_skills porque representa capacidades
-- produzidas por componentes mecânicos, não por Chi ou Talentos.

ALTER TABLE public.characters
ADD COLUMN IF NOT EXISTS cybernetic_skills text[] NOT NULL DEFAULT ARRAY[]::text[];

CREATE OR REPLACE FUNCTION public.submit_character(p_character_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
    v_character public.characters%ROWTYPE;
    v_specializations text[];
    v_supernatural text[];
    v_cybernetic text[];
    v_allowed text[] := ARRAY[
        'Controle',
        'Corroer',
        'Criação',
        'Elemental',
        'Aceleração',
        'Ocultar',
        'Cinese',
        'Poder',
        'Psíquico',
        'Controle de Alcance',
        'Alcance',
        'Transformação',
        'Estado',
        'Suporte',
        'Tóxico',
        'Vazio',
        'Warp'
    ];
    v_spec text;
    v_distinct_count integer;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'É necessário estar autenticado.';
    END IF;

    SELECT *
    INTO v_character
    FROM public.characters
    WHERE id = p_character_id
      AND player_id = auth.uid()
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Personagem não encontrado.';
    END IF;

    IF v_character.status NOT IN ('draft', 'rejected') THEN
        RAISE EXCEPTION 'Esta ficha não pode ser enviada neste estado.';
    END IF;

    IF v_character.name IS NULL
       OR pg_catalog.btrim(v_character.name) = ''
       OR v_character.age IS NULL
       OR v_character.height_cm IS NULL
       OR v_character.weight_kg IS NULL
       OR v_character.gender IS NULL
       OR v_character.personality IS NULL
       OR v_character.appearance IS NULL
       OR v_character.backstory IS NULL
       OR v_character.race IS NULL
    THEN
        RAISE EXCEPTION 'Preencha todos os dados básicos da ficha.';
    END IF;

    v_specializations := COALESCE(
        v_character.specializations,
        ARRAY[]::text[]
    );

    v_supernatural := COALESCE(
        v_character.supernatural_skills,
        ARRAY[]::text[]
    );

    v_cybernetic := COALESCE(
        v_character.cybernetic_skills,
        ARRAY[]::text[]
    );

    -- HUMANOS
    IF v_character.race = 'Humanos' THEN
        IF v_character.chi_reserve IS NULL THEN
            RAISE EXCEPTION 'Humanos precisam definir sua reserva de Chi.';
        END IF;

        IF pg_catalog.cardinality(v_supernatural) > 0 THEN
            RAISE EXCEPTION 'Humanos não podem possuir habilidades sobrenaturais.';
        END IF;

        IF pg_catalog.cardinality(v_cybernetic) > 0 THEN
            RAISE EXCEPTION 'Apenas Ciborgues podem possuir habilidades cibernéticas.';
        END IF;

        IF pg_catalog.cardinality(v_specializations) > 0
           OR v_character.talent_rarity IS NOT NULL
        THEN
            RAISE EXCEPTION 'Humanos não podem possuir Talentos ou especializações.';
        END IF;

    -- HÍBRIDOS E QUÍMIOS
    ELSIF v_character.race IN ('Híbridos', 'Químios') THEN
        IF v_character.chi_reserve IS NULL THEN
            RAISE EXCEPTION 'Esta raça precisa definir sua reserva de Chi.';
        END IF;

        IF v_character.talent_rarity IS NULL
           OR v_character.talent_rarity NOT IN ('Comum', 'Raro')
        THEN
            RAISE EXCEPTION 'A raridade do Talento precisa ser Comum ou Raro.';
        END IF;

        IF pg_catalog.cardinality(v_cybernetic) > 0 THEN
            RAISE EXCEPTION 'Habilidades cibernéticas são exclusivas de Ciborgues.';
        END IF;

        IF v_character.talent_rarity = 'Comum'
           AND pg_catalog.cardinality(v_specializations) <> 1
        THEN
            RAISE EXCEPTION 'Talentos Comuns exigem exatamente uma especialização.';
        END IF;

        IF v_character.talent_rarity = 'Raro'
           AND pg_catalog.cardinality(v_specializations) <> 2
        THEN
            RAISE EXCEPTION 'Talentos Raros exigem exatamente duas especializações.';
        END IF;

        FOREACH v_spec IN ARRAY v_specializations LOOP
            IF v_spec IS NULL OR NOT (v_spec = ANY(v_allowed)) THEN
                RAISE EXCEPTION 'A ficha contém uma especialização inválida.';
            END IF;
        END LOOP;

        SELECT pg_catalog.count(DISTINCT item)
        INTO v_distinct_count
        FROM pg_catalog.unnest(v_specializations) AS specs(item);

        IF pg_catalog.cardinality(v_specializations) <> v_distinct_count THEN
            RAISE EXCEPTION 'Não é permitido repetir especializações.';
        END IF;

    -- CIBORGUES
    ELSIF v_character.race = 'Ciborgues' THEN
        IF v_character.chi_reserve IS NOT NULL THEN
            RAISE EXCEPTION 'Ciborgues não realizam rolagem de Chi.';
        END IF;

        IF pg_catalog.cardinality(v_supernatural) > 0 THEN
            RAISE EXCEPTION 'Ciborgues não podem possuir habilidades sobrenaturais.';
        END IF;

        IF v_character.talent_rarity IS NOT NULL
           OR pg_catalog.cardinality(v_specializations) > 0
        THEN
            RAISE EXCEPTION 'Ciborgues não possuem Talentos ou especializações.';
        END IF;

    ELSE
        RAISE EXCEPTION 'Raça inválida.';
    END IF;

    UPDATE public.characters
    SET status = 'submitted',
        updated_at = pg_catalog.now()
    WHERE id = p_character_id;

    RETURN true;
END;
$function$;
