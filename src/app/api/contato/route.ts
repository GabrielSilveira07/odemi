import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

/**
 * POST /api/contato
 * Valida com o mesmo schema do cliente e envia via Resend.
 * Variáveis: RESEND_API_KEY, CONTACT_TO (destino), CONTACT_FROM (remetente verificado).
 * Sem configuração, responde 503 — o formulário informa que o envio não está ativo.
 */

// limite simples por IP (memória da instância; suficiente para baixo volume)
const hits = new Map<string, { n: number; t: number }>();
const WINDOW = 10 * 60 * 1000;
const MAX = 5;

function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > WINDOW) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > MAX;
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Muitas tentativas. Tente novamente em alguns minutos." }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "Requisição inválida." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0]);
      if (!fields[k]) fields[k] = issue.message;
    }
    return NextResponse.json({ ok: false, fields }, { status: 422 });
  }

  // honeypot preenchido: finge sucesso, não envia
  if (parsed.data.site) return NextResponse.json({ ok: true });

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    return NextResponse.json(
      { ok: false, error: "O envio ainda não está ativo. Os canais de contato estão em confirmação." },
      { status: 503 },
    );
  }

  const d = parsed.data;
  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    replyTo: d.email,
    subject: `Novo contato — ${d.tipo} — ${d.nome}`,
    html: `
      <p><strong>Nome:</strong> ${escape(d.nome)}</p>
      <p><strong>E-mail:</strong> ${escape(d.email)}</p>
      <p><strong>Empresa:</strong> ${escape(d.empresa || "—")}</p>
      <p><strong>Tipo:</strong> ${escape(d.tipo)}</p>
      <p><strong>Mensagem:</strong><br>${escape(d.mensagem).replace(/\n/g, "<br>")}</p>`,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "Não foi possível enviar agora. Tente novamente." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
