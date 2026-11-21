-- Nova Ordem: restringe a execução direta de funções internas usadas exclusivamente por gatilhos.
-- Os gatilhos continuam podendo invocá-las durante INSERT/UPDATE.

REVOKE ALL ON FUNCTION public.enforce_player_approved_character_limit() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_player_approved_character_limit() FROM anon;
REVOKE ALL ON FUNCTION public.enforce_player_approved_character_limit() FROM authenticated;

REVOKE ALL ON FUNCTION public.enforce_player_draft_limit() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_player_draft_limit() FROM anon;
REVOKE ALL ON FUNCTION public.enforce_player_draft_limit() FROM authenticated;

REVOKE ALL ON FUNCTION public.record_character_approval_unlock() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_character_approval_unlock() FROM anon;
REVOKE ALL ON FUNCTION public.record_character_approval_unlock() FROM authenticated;
