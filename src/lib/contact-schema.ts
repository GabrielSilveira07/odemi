import { z } from "zod";

/** Schema compartilhado entre o formulário (cliente) e a rota /api/contato (servidor). */
export const contactSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome.").max(120),
  email: z.string().trim().email("Informe um e-mail válido."),
  empresa: z.string().trim().max(160).optional().or(z.literal("")),
  tipo: z.string().trim().min(1, "Selecione o tipo de projeto."),
  mensagem: z.string().trim().min(10, "Conte um pouco mais (mínimo de 10 caracteres).").max(4000),
  /** honeypot: precisa chegar vazio */
  site: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type FieldErrors = Partial<Record<keyof ContactInput, string>>;
