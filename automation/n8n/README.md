# Atendimento automático — n8n

Workflow: `atendimento-odemi.json` · Banco: `schema.sql`

```
WhatsApp (Evolution API) ─► Webhook ─► Normalizar ─► Roteador
                                                    ├─ mensagem ─► Registrar lead ─► Bot ativo? ─► Agente Odemi ─► Enviar resposta
                                                    │                                               │  ├ OpenAI (gpt-4.1-mini)
                                                    │                                               │  ├ Memória Postgres (20 msgs, por telefone)
                                                    │                                               │  ├ tool salvar_qualificacao
                                                    │                                               │  └ tool transferir_humano
                                                    │                                               ▼
                                                    │                       Ler lead ─► quente ou transferido? ─► Avisar no WhatsApp ─► Marcar avisado (+ pausa bot)
                                                    ├─ sem_texto ─► resposta fixa (áudio, figurinha)
                                                    └─ comando  ─► #bot on / #bot off

Site (/api/contato) ─► Webhook (header auth) ─► Normalizar ─► Gravar lead ─► Avisar no WhatsApp ─► { ok: true }
```

## Instalação

1. **Banco:** rode `schema.sql` no Postgres/Supabase.
2. **Importar:** n8n → *Workflows → Import from file* → `atendimento-odemi.json`.
3. **Credenciais** (criar no n8n e selecionar nos nós):
   | Nome | Tipo | Valor |
   |---|---|---|
   | `Postgres Odemi` | Postgres | conexão do banco (Supabase: use a connection string do pooler) |
   | `OpenAI` | OpenAI API | API key |
   | `Evolution API` | Header Auth | `apikey` = chave da instância |
   | `Webhook Site Odemi` | Header Auth | ex.: `x-odemi-token` = segredo longo aleatório |
4. **Variáveis de ambiente do n8n:**
   ```
   EVOLUTION_URL=https://evolution.seudominio.com
   EVOLUTION_INSTANCE=odemi
   OWNER_PHONE=5541999999999        # quem recebe os avisos
   N8N_BLOCK_ENV_ACCESS_IN_NODE=false
   ```
5. **Evolution API:** configure o webhook da instância para
   `https://SEU_N8N/webhook/odemi-whatsapp`, evento **MESSAGES_UPSERT** apenas.
6. Ative o workflow.

## Operação

- **Assumir uma conversa:** no WhatsApp da Odemi, envie `#bot off` dentro do chat do cliente. `#bot on` devolve ao bot.
- **Transferência automática:** quando o agente chama `transferir_humano` (ou o lead fica *quente*), você recebe um resumo no `OWNER_PHONE` e o bot pausa naquele chat (se foi transferência).
- **Acompanhar leads:** `select * from leads_painel;`

## Ligar o formulário do site

No `src/app/api/contato/route.ts` do site, após validar, enviar também:

```ts
await fetch(process.env.N8N_WEBHOOK_URL!, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-odemi-token": process.env.N8N_WEBHOOK_TOKEN! },
  body: JSON.stringify(parsed.data),
});
```

(Ainda não aplicado no código do site.)

## Decisões a validar

- **Faixas de investimento** no prompt (até R$ 5 mil · 5–15 mil · acima de 15 mil): ajuste à sua política comercial.
- **Critério de lead quente:** prazo até 60 dias + investimento compatível.
- **Modelo:** `gpt-4.1-mini` (custo baixo, bom em pt-BR). Troque no nó *OpenAI* se preferir outro.

## Limitações conhecidas

- Mensagens enviadas em sequência rápida geram uma resposta cada (sem agrupamento/debounce).
- Áudio não é transcrito — o bot pede texto. Próximo passo possível: transcrição com Whisper.
- Não testado em uma instância n8n real a partir deste ambiente: o JSON foi validado estruturalmente e os nós de código foram testados com payloads de exemplo da Evolution API v2. Após importar, confira se os nós Postgres reconhecem as colunas (abra cada um uma vez).
