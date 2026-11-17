# A.R.K. — configuração da IA (ambiente de testes)

## Arquitetura
- Frontend: `ark-assistant.js`
- Endpoint: Supabase Edge Function `ark-ai-chat`
- Provedor: Gemini Developer API
- Modelo inicial: `gemini-3.5-flash-lite` (configurável por segredo)
- Projeto Supabase: Nova Ordem - Testes
- Branch: `feature/cybernetic-skills`

## Segredo obrigatório
A função não funciona até que o segredo `GEMINI_API_KEY` seja configurado no projeto Supabase de testes.

No Dashboard do Supabase:
1. Abra o projeto **Nova Ordem - Testes**.
2. Vá a **Edge Functions → Secrets**.
3. Adicione `GEMINI_API_KEY` com a chave gerada pelo titular adulto da conta, respeitando os termos do provedor.
4. Opcionalmente, adicione `GEMINI_MODEL` com um ID de modelo disponível no plano escolhido. Se omitido, será usado `gemini-3.5-flash-lite`.

Nunca coloque essa chave em arquivos do GitHub, no frontend ou em mensagens públicas.

## Privacidade e limites
- A função recebe somente a pergunta, a página atual, trechos públicos da base local da A.R.K. e até oito mensagens recentes da conversa.
- Não consulta tabelas, fichas, perfis ou dados administrativos.
- Não executa ações nem altera o banco.
- CORS permite somente o domínio de testes e endereços localhost para desenvolvimento.
- Existe um limite em memória de 10 solicitações por minuto por IP e por instância. É uma proteção inicial, não um rate limit persistente.
- A modalidade gratuita do Gemini pode usar dados enviados para melhorar produtos do Google. Não envie senhas, tokens, dados pessoais ou informações privadas.

## Observação
A função é implantada com verificação JWT desativada para permitir o uso por visitantes do site de testes. Ela não tem acesso ao banco e aceita apenas conteúdo público. Antes de qualquer uso em produção, implementar rate limit persistente, proteção contra abuso e política de privacidade apropriada.
