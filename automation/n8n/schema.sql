-- Odemi — banco do atendimento automático (Postgres / Supabase)
-- Rode uma vez antes de ativar o workflow.
-- A tabela de memória do agente (n8n_chat_histories) é criada pelo próprio n8n.

create table if not exists leads (
  id               bigserial primary key,
  channel          text not null check (channel in ('whatsapp', 'site')),
  phone            text unique,              -- só dígitos, ex.: 5541999998888 (null no site)
  email            text,
  name             text,
  company          text,

  -- qualificação (preenchida pelo agente)
  segment          text,
  service          text,
  goal             text,
  timeline         text,
  budget           text,
  summary          text,
  score            text check (score in ('quente', 'morno', 'frio') or score is null or score = ''),

  -- controle do atendimento
  handoff          boolean not null default false,  -- agente pediu humano
  handoff_reason   text,
  bot_paused       boolean not null default false,  -- #bot off / após transferência
  owner_notified   boolean not null default false,

  last_message_at  timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists leads_score_idx   on leads (score);
create index if not exists leads_created_idx on leads (created_at desc);

-- Visão rápida para acompanhar o funil
create or replace view leads_painel as
select
  id, channel, coalesce(name, '—') as nome, phone, email,
  service as servico, timeline as prazo, budget as investimento,
  score as classificacao, handoff as pediu_humano, bot_paused as bot_pausado,
  created_at, last_message_at
from leads
order by coalesce(last_message_at, created_at) desc;
