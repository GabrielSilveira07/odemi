# odemi

Site institucional da Odemi — identidade visual e sites de alto padrão.
HTML/CSS estático, sem build. Página única, desktop e mobile.

## Rodar

```bash
npx serve .
```

## Estrutura

```
index.html            página única (header, hero, serviços, processo, exemplos, contato, rodapé)
styles/tokens.css     cores, tipografia, espaço, movimento — fonte única de verdade
styles/base.css       reset, escala tipográfica, grid de 12 colunas, .wrap, .section-head
styles/components.css logo, btn, nav-link, header, menu, rule-list, service-card,
                      process-step, example-card, tag, contact-field, field, footer
styles/sections.css   composição por seção + entrada do hero
scripts/main.js       menu mobile, seção ativa, filetes do processo, formulário (layout)
assets/               logo.svg, favicon.svg
```

## Pendências de conteúdo

- E-mail, WhatsApp, CNPJ/MEI e política de privacidade: **a confirmar**.
- Formulário é só layout: não envia nada até os canais serem definidos.
- Textos de serviços, processo e exemplos são rascunho inicial para revisão.

## Configuração do Claude Code

### Skills (`.claude/skills/`)

| Pacote | Skills |
|---|---|
| `emilkowalski/skills` | animação, gestos, design engineering, revisão de UI (20 skills) |
| `Leonxlnx/taste-skill` | `design-taste-frontend` |
| `pbakaus/impeccable` | `impeccable` |

Versões fixadas em `skills-lock.json`. Atualizar com:

```bash
npx skills update -p
```

### MCP (`.mcp.json`)

- **playwright** — `@playwright/mcp`, headless, usando o Chromium pré-instalado em `/opt/pw-browsers/chromium` (ambiente cloud do Claude Code).

Para rodar localmente, remova os argumentos `--no-sandbox` e `--executable-path ...` do `.mcp.json` (ou rode `npx playwright install chromium`).
