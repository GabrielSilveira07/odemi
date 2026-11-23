"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { FadeIn, SectionHead, words } from "@/components/ui/Reveal";
import { services } from "@/content/site";
import { cn } from "@/lib/cn";

type Item = (typeof services.items)[number];

const surfaces = [
  { card: "bg-marinho text-pedra", title: "text-marfim", line: "border-marfim/15", dark: true },
  { card: "bg-marfim-2 text-grafite border border-pedra/70", title: "text-tinta", line: "border-pedra", dark: false },
  { card: "bg-tinta text-pedra", title: "text-marfim", line: "border-marfim/15", dark: true },
];

/** Desenho de linha próprio de cada serviço — construção, não decoração. */
function Drawing({ index }: { index: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 0.6, vectorEffect: "non-scaling-stroke" as const };
  if (index === 0)
    return (
      <svg viewBox="0 0 200 200" className="size-full" aria-hidden>
        <g {...common} strokeOpacity="0.25">
          {[40, 70, 100, 130, 160].map((v) => <line key={`h${v}`} x1="20" y1={v} x2="180" y2={v} />)}
          {[40, 70, 100, 130, 160].map((v) => <line key={`v${v}`} x1={v} y1="20" x2={v} y2="180" />)}
        </g>
        <g {...common} strokeWidth={1.2} className="text-latao">
          <circle cx="100" cy="100" r="60" />
          <line x1="10" y1="100" x2="190" y2="100" />
        </g>
        <g {...common} strokeOpacity="0.4" strokeDasharray="2 3">
          <circle cx="100" cy="100" r="80" />
        </g>
      </svg>
    );
  if (index === 1)
    return (
      <svg viewBox="0 0 200 200" className="size-full" aria-hidden>
        <g {...common} strokeOpacity="0.5">
          <rect x="20" y="36" width="160" height="128" />
          <line x1="20" y1="52" x2="180" y2="52" />
          <circle cx="30" cy="44" r="2" /><circle cx="38" cy="44" r="2" /><circle cx="46" cy="44" r="2" />
          <line x1="34" y1="120" x2="166" y2="120" />
          <rect x="34" y="128" width="40" height="24" /><rect x="80" y="128" width="40" height="24" /><rect x="126" y="128" width="40" height="24" />
        </g>
        <g {...common} strokeWidth={1.2} className="text-latao">
          <line x1="34" y1="72" x2="130" y2="72" />
          <line x1="34" y1="84" x2="110" y2="84" />
          <rect x="34" y="96" width="44" height="12" />
        </g>
      </svg>
    );
  return (
    <svg viewBox="0 0 200 200" className="size-full" aria-hidden>
      <g {...common} strokeOpacity="0.45">
        <path d="M30 40 H170 L120 100 V160 L80 175 V100 Z" />
        <line x1="50" y1="64" x2="150" y2="64" />
      </g>
      <g {...common} strokeWidth={1.2} className="text-latao">
        <line x1="100" y1="20" x2="100" y2="190" strokeDasharray="3 4" />
        <path d="M92 180 L100 190 L108 180" />
      </g>
    </svg>
  );
}

function ServiceCard({ item, index, total, progress }: { item: Item; index: number; total: number; progress: MotionValue<number> }) {
  const s = surfaces[index];
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.045]);
  const brightness = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.12]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <div className="md:sticky" style={{ top: `calc(96px + ${index * 28}px)` }}>
      <motion.article
        style={{ scale, filter, transformOrigin: "top center" }}
        className={cn("relative grid min-h-[min(78vh,660px)] grid-cols-12 gap-x-6 gap-y-10 overflow-hidden p-8 md:p-14", s.card, s.dark && "grain")}
      >
        <div className="relative z-10 col-span-12 flex flex-col lg:col-span-6">
          <div className="flex items-start justify-between">
            <span
              className="font-serif text-[clamp(5rem,11vw,10rem)] font-medium leading-[0.8] text-transparent"
              style={{ WebkitTextStroke: "1px #9A7B4F" }}
            >
              {item.n}
            </span>
            <span className={cn("mt-3 text-[11px] font-medium uppercase tracking-[0.2em]", s.dark ? "text-pedra/70" : "text-muted")}>
              {item.n} / 0{total}
            </span>
          </div>
          <h3 className={cn("serif-title mt-auto pt-12 text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]", s.title)}>{item.title}</h3>
          <p className="mt-5 max-w-[28em] text-[16px] leading-[1.7]">{item.desc}</p>
        </div>

        <div className="relative z-10 col-span-12 flex flex-col justify-between gap-10 lg:col-span-5 lg:col-start-8">
          <div className={cn("mx-auto aspect-square w-full max-w-[240px] lg:mx-0 lg:ml-auto", s.dark ? "text-marfim" : "text-tinta")}>
            <Drawing index={index} />
          </div>
          <ul>
            {item.list.map((li) => (
              <li key={li} className={cn("flex items-center gap-4 border-t py-4 text-[15px] last:border-b", s.line, s.title)}>
                <span className="h-px w-3 flex-none bg-latao" aria-hidden />
                {li}
              </li>
            ))}
          </ul>
        </div>
      </motion.article>
    </div>
  );
}

export function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="servicos" data-theme="light" aria-labelledby="servicos-titulo" className="bg-marfim py-28 md:py-40">
      <div className="wrap">
        <SectionHead
          id="servicos-titulo"
          eyebrow={services.eyebrow}
          words={[...words(services.title), ...words(services.titleEm).map((w) => `*${w}*`)]}
          intro={services.intro}
        />
        <div ref={ref} className="flex flex-col gap-8">
          {services.items.map((item, i) => (
            <ServiceCard key={item.n} item={item} index={i} total={services.items.length} progress={scrollYProgress} />
          ))}
        </div>
        <FadeIn>
          <p className="mt-10 font-serif text-lg italic text-muted">{services.note}</p>
        </FadeIn>
      </div>
    </section>
  );
}
