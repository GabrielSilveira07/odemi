"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FadeIn, SplitReveal, words } from "@/components/ui/Reveal";
import { contact, site } from "@/content/site";
import { contactSchema, type FieldErrors } from "@/lib/contact-schema";
import { cn } from "@/lib/cn";

type Status = { kind: "idle" | "sending" | "success" | "error"; message?: string };

const inputBase =
  "peer w-full rounded-none border-0 border-b border-pedra bg-transparent pb-3 pt-7 text-[16px] text-tinta outline-none transition-colors duration-300 placeholder:text-transparent focus:border-latao";

function Field({
  name, label, error, type = "text", textarea, autoComplete, children,
}: {
  name: string; label: string; error?: string; type?: string; textarea?: boolean; autoComplete?: string; children?: React.ReactNode;
}) {
  const id = `f-${name}`;
  const describedBy = error ? `${id}-erro` : undefined;
  const props = { id, name, placeholder: label, autoComplete, "aria-invalid": !!error, "aria-describedby": describedBy };
  return (
    <div className="relative">
      {children ? (
        <select {...props} defaultValue="" className={cn(inputBase, "cursor-pointer appearance-none")}>{children}</select>
      ) : textarea ? (
        <textarea {...props} rows={4} className={cn(inputBase, "resize-none leading-relaxed")} />
      ) : (
        <input {...props} type={type} className={inputBase} />
      )}
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-0 origin-left text-muted transition-all duration-300 ease-out-expo",
          children
            ? "top-0 text-[11px] uppercase tracking-[0.2em]"
            : "top-7 text-[16px] peer-focus:top-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]",
        )}
      >
        {label}
      </label>
      {children && (
        <svg viewBox="0 0 12 8" className="pointer-events-none absolute bottom-5 right-1 w-3 text-latao" aria-hidden>
          <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" />
        </svg>
      )}
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-latao transition-transform duration-500 ease-out-expo peer-focus:scale-x-100" />
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-erro`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-[13px] text-[#9B3B2E]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const f: FieldErrors = {};
      for (const i of parsed.error.issues) {
        const k = i.path[0] as keyof FieldErrors;
        f[k] ??= i.message;
      }
      setErrors(f);
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        form.reset();
        setStatus({ kind: "success", message: "Mensagem enviada. A resposta chega no e-mail informado." });
      } else {
        if (json.fields) setErrors(json.fields);
        setStatus({ kind: "error", message: json.error ?? "Revise os campos destacados." });
      }
    } catch {
      setStatus({ kind: "error", message: "Sem conexão. Tente novamente." });
    }
  }

  const wa = site.contact.whatsapp;

  return (
    <section id="contato" data-theme="light" aria-labelledby="contato-titulo" className="bg-marfim py-28 md:py-40">
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 flex flex-col gap-8 lg:col-span-6">
          <FadeIn><p className="eyebrow text-muted">{contact.eyebrow}</p></FadeIn>
          <SplitReveal
            id="contato-titulo"
            words={[...words(contact.title), ...words(contact.titleEm).map((w) => `*${w}*`)]}
            className="serif-title max-w-[11em] text-h1 text-tinta"
          />
          <FadeIn delay={0.15}><p className="max-w-[30em] text-[17px] leading-[1.75]">{contact.lead}</p></FadeIn>

          <FadeIn delay={0.25}>
            <dl className="mt-4">
              {[
                { k: "E-mail", v: site.contact.email, href: site.contact.email ? `mailto:${site.contact.email}` : null },
                { k: "WhatsApp", v: wa, href: wa ? `https://wa.me/${wa}` : null },
              ].map((row) => (
                <div key={row.k} className="grid grid-cols-[110px_1fr] items-baseline gap-4 border-t border-pedra py-5 last:border-b">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">{row.k}</dt>
                  <dd className={cn("font-serif text-[22px]", row.v ? "text-tinta" : "italic text-muted")}>
                    {row.href ? <a href={row.href} className="hover:text-latao">{row.v}</a> : "A confirmar"}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="col-span-12 lg:col-span-5 lg:col-start-8">
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8 lg:pt-14" aria-describedby="form-status">
            <Field name="nome" label="Nome" autoComplete="name" error={errors.nome} />
            <Field name="email" label="E-mail" type="email" autoComplete="email" error={errors.email} />
            <Field name="empresa" label="Empresa (opcional)" autoComplete="organization" error={errors.empresa} />
            <Field name="tipo" label="Tipo de projeto" error={errors.tipo}>
              <option value="" disabled>Selecione</option>
              {contact.projectTypes.map((t) => <option key={t}>{t}</option>)}
            </Field>
            <Field name="mensagem" label="O que precisa ser construído?" textarea error={errors.mensagem} />

            {/* honeypot */}
            <div aria-hidden className="absolute -left-[9999px]">
              <label>Site<input name="site" tabIndex={-1} autoComplete="off" /></label>
            </div>

            <div className="flex flex-col items-start gap-4 pt-2">
              <Button type="submit" tone="dark" disabled={status.kind === "sending"} className="w-full sm:w-auto">
                {status.kind === "sending" ? "Enviando…" : "Enviar mensagem"}
              </Button>
              <p
                id="form-status"
                role="status"
                className={cn("min-h-5 text-[13px]", status.kind === "error" ? "text-[#9B3B2E]" : "text-muted")}
              >
                {status.message}
              </p>
            </div>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
