# odemi

Projeto em definição.

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
