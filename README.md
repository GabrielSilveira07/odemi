# odemi

Site institucional da Odemi — identidade visual e sites de alto padrão.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Motion · Lenis · Zod · Resend

## Rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Build de produção: `npm run build && npm start`. Deploy recomendado: Vercel (zero config).

## Arquitetura

```
src/
  app/
    layout.tsx            fontes (next/font), metadata, rolagem suave, cursor
    page.tsx              composição das seções
    globals.css           tokens (@theme) → utilitários bg-marinho, text-latao, text-display…
    api/contato/route.ts  validação Zod + envio Resend + honeypot + rate limit
    opengraph-image.tsx   imagem de compartilhamento gerada
    sitemap.ts · robots.ts · icon.svg
  content/site.ts         TODO o texto do site (fonte única de verdade)
  lib/                    contact-schema (compartilhado cliente/servidor), cn
  components/
    brand/   Logo, Monogram
    ui/      Button (magnético), Cursor, Reveal (SplitReveal, FadeIn, SectionHead)
    layout/  Header (adaptativo ao tema da seção), Footer, SmoothScroll
    sections/ Hero, Marquee, Manifesto, Services, Process, Examples, Contact
```

**Convenções**
- Texto só em `content/site.ts`. Layout não carrega copy.
- Cada seção declara `data-theme="dark|light"`; o header lê isso para trocar de cor.
- Animações respeitam `prefers-reduced-motion` (Lenis, cursor e transições desligam).

## Movimento

| Seção | Interação |
|---|---|
| Hero | título revelado palavra a palavra, monograma desenhado que reage ao cursor e gira com a rolagem, brilho de latão seguindo o ponteiro |
| Manifesto | seção fixada; o texto acende palavra a palavra conforme a rolagem |
| Serviços | cards empilhados (sticky) que recuam conforme o próximo entra — desktop |
| Processo | trilho horizontal fixado com filetes preenchidos pela rolagem — desktop |
| Exemplos | mockups com inclinação 3D e reflexo no hover |
| Global | rolagem suave, cursor customizado, botões magnéticos, header que se esconde ao descer |

## Variáveis de ambiente

Ver `.env.example`. Sem `RESEND_API_KEY`/`CONTACT_TO`/`CONTACT_FROM` o formulário valida, mas a API responde 503 com aviso de envio inativo. Sem `NEXT_PUBLIC_CONTACT_EMAIL`/`NEXT_PUBLIC_WHATSAPP` o site exibe "A confirmar".

## Pendências

- E-mail, WhatsApp, CNPJ/MEI, política de privacidade e domínio.
- Conta Resend + domínio verificado para o formulário.
- Textos de serviços, processo, exemplos e manifesto são rascunho para revisão.
- Exemplos são ilustrativos; substituir por cases reais quando existirem.

## Claude Code

- Skills em `.claude/skills/` (`emilkowalski/skills`, `Leonxlnx/taste-skill`, `pbakaus/impeccable`), versões em `skills-lock.json` — atualizar com `npx skills update -p`.
- MCP `playwright` em `.mcp.json`, usando o Chromium do ambiente cloud (`/opt/pw-browsers/chromium`). Localmente, remova `--no-sandbox` e `--executable-path`.
