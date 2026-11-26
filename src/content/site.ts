/**
 * Conteúdo do site — fonte única de verdade para textos e dados.
 * Componentes só leem daqui; trocar copy não exige tocar em layout.
 */

export const site = {
  name: "Odemi",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://odemi.com.br",
  title: "Odemi — Identidade visual e sites de alto padrão",
  description:
    "A Odemi desenvolve marcas e sites para negócios que decidem com cuidado e precisam parecer tão sólidos quanto são.",
  claim: "Forma que segue função.",
  legal: {
    company: "Odemi · CNPJ/MEI: a confirmar",
    privacy: "Política de privacidade (LGPD): a confirmar",
  },
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null,
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? null, // somente dígitos, ex.: 5541999999999
  },
} as const;

export const nav = [
  { label: "Serviços", href: "#servicos" },
  { label: "Processo", href: "#processo" },
  { label: "Exemplos", href: "#exemplos" },
  { label: "Contato", href: "#contato" },
] as const;

export const hero = {
  eyebrow: "Identidade visual e sites de alto padrão",
  titleWords: ["Presença", "que", "transmite", "*critério*", "antes", "da", "primeira", "conversa."],
  lead: site.description,
  cta: { label: "Solicitar uma conversa", href: "#contato" },
};

export const manifesto = {
  eyebrow: "Princípio",
  text:
    "Uma marca não precisa gritar. Precisa ser clara, coerente e bem construída. Quando a forma segue a função, o cliente percebe o cuidado antes de ler uma linha sobre você.",
  signature: "Forma que segue função.",
};

export const services = {
  eyebrow: "Serviços",
  title: "Três entregas, uma mesma lógica:",
  titleEm: "forma que segue função.",
  intro:
    "Cada projeto começa pelo negócio, não pela estética. O visual é consequência do que precisa ser comunicado.",
  note: "Valores sob consulta, conforme o escopo do projeto.",
  items: [
    {
      n: "01",
      title: "Identidade visual",
      desc: "Marca construída a partir do posicionamento do negócio, pensada para durar além das tendências.",
      list: ["Diagnóstico e posicionamento", "Logotipo e monograma", "Paleta, tipografia e grid", "Manual de uso da marca"],
    },
    {
      n: "02",
      title: "Site institucional",
      desc: "Site sob medida, rápido e simples de manter, que apresenta o negócio com precisão.",
      list: ["Arquitetura de conteúdo", "Design responsivo", "Desenvolvimento e publicação", "SEO técnico e desempenho"],
    },
    {
      n: "03",
      title: "Página de conversão",
      desc: "Página única com um objetivo claro: levar o visitante certo até a próxima conversa.",
      list: ["Roteiro e estrutura de texto", "Design orientado à ação", "Integração com WhatsApp e formulário", "Medição de acessos configurada"],
    },
  ],
};

export const processSteps = {
  eyebrow: "Processo",
  title: "Quatro etapas, com",
  titleEm: "aprovação",
  titleEnd: "em cada uma.",
  intro: "Nenhuma etapa começa antes da anterior ser aprovada. Você sabe o que está sendo feito, e por quê.",
  steps: [
    { n: "01", title: "Entendimento", text: "Conversa inicial sobre o negócio, o público e as referências. Termina com um briefing escrito e aprovado." },
    { n: "02", title: "Direção", text: "Proposta de conceito visual e de estrutura. Uma direção bem defendida, não dez opções para escolher." },
    { n: "03", title: "Produção", text: "Desenvolvimento da identidade e do site, com rodadas de revisão dentro do escopo combinado." },
    { n: "04", title: "Entrega", text: "Arquivos finais, manual da marca, site publicado e orientação para o uso no dia a dia." },
  ],
};

export type ExampleTheme = "estetica" | "advocacia" | "consultoria";

export const examples = {
  eyebrow: "Exemplos",
  title: "Como o trabalho",
  titleEm: "se apresenta.",
  intro: "Três direções de abordagem para segmentos que a Odemi atende. São exemplos ilustrativos, não projetos de clientes.",
  note: "Exemplos ilustrativos de abordagem. Não representam clientes, marcas ou resultados reais.",
  items: [
    {
      theme: "estetica" as ExampleTheme,
      title: "Clínica de estética",
      text: "Identidade serena e site com agendamento direto. Ênfase em confiança, clareza dos procedimentos e higiene visual.",
      mock: { word: "Estética", headline: "Cuidado que se percebe nos detalhes.", meta: "Cuidado · Precisão · Calma" },
    },
    {
      theme: "advocacia" as ExampleTheme,
      title: "Escritório de advocacia",
      text: "Marca sóbria, tipografia de autoridade e um site que organiza as áreas de atuação sem jargão.",
      mock: { word: "Advocacia", headline: "Direito empresarial com clareza.", meta: "Contratos · Societário" },
    },
    {
      theme: "consultoria" as ExampleTheme,
      title: "Consultoria",
      text: "Sistema visual para propostas, apresentações e site, com a mesma linguagem em todos os pontos de contato.",
      mock: { word: "Consultoria", headline: "Método antes de opinião.", meta: "Estratégia · Gestão" },
    },
  ],
};

export const contact = {
  eyebrow: "Contato",
  title: "Vamos conversar sobre o",
  titleEm: "seu projeto.",
  lead: "Conte um pouco sobre o negócio e o que precisa ser construído. A resposta vem com uma proposta de próximos passos, sem compromisso.",
  projectTypes: ["Identidade visual", "Site institucional", "Página de conversão", "Projeto completo"],
};
