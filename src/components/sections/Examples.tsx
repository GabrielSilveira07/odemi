"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { FadeIn, SectionHead, words } from "@/components/ui/Reveal";
import { examples, type ExampleTheme } from "@/content/site";
import { cn } from "@/lib/cn";

type Item = (typeof examples.items)[number];

const themes: Record<ExampleTheme, { bg: string; fg: string; sub: string; accent: string; art: React.ReactNode; mark: React.ReactNode }> = {
  estetica: {
    bg: "bg-[#F7F4EE]",
    fg: "text-grafite",
    sub: "bg-grafite/15",
    accent: "#9A7B4F",
    mark: <><circle cx="24" cy="24" r="17" /><circle cx="24" cy="24" r="9" /></>,
    art: (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,#E8DFD0_0%,#D6CBB8_38%,#B9B3A7_100%)]">
        <div className="absolute left-[18%] top-[22%] size-[46%] rounded-full bg-[radial-gradient(circle_at_40%_35%,#FBF8F2,#E2D7C4_70%)] shadow-[0_30px_60px_-20px_rgba(62,47,36,0.35)]" />
        <div className="absolute bottom-[14%] right-[12%] h-px w-[38%] bg-[#9A7B4F]" />
      </div>
    ),
  },
  advocacia: {
    bg: "bg-marinho",
    fg: "text-marfim",
    sub: "bg-marfim/20",
    accent: "#C2A57A",
    mark: <><rect x="8" y="8" width="32" height="32" /><line x1="24" y1="8" x2="24" y2="40" /></>,
    art: (
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#1B2C46_0%,#0F1B2D_55%,#0A1220_100%)]">
        {[18, 34, 50, 66, 82].map((l) => (
          <div key={l} className="absolute inset-y-[12%] w-px bg-gradient-to-b from-transparent via-[#9A7B4F]/50 to-transparent" style={{ left: `${l}%` }} />
        ))}
        <div className="absolute left-1/2 top-1/2 size-[34%] -translate-x-1/2 -translate-y-1/2 border border-[#C2A57A]/60" />
      </div>
    ),
  },
  consultoria: {
    bg: "bg-[#E9E5DC]",
    fg: "text-tinta",
    sub: "bg-tinta/15",
    accent: "#3E2F24",
    mark: <><path d="M8 40 L24 8 L40 40 Z" /><line x1="14" y1="28" x2="34" y2="28" /></>,
    art: (
      <div className="absolute inset-0 bg-[#2B2D31]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,241,234,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(244,241,234,0.07)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute bottom-[16%] left-[12%] flex h-[52%] w-[60%] items-end gap-[8%]">
          {[38, 56, 72, 100].map((h, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-[#9A7B4F] to-[#C2A57A]" style={{ height: `${h}%`, opacity: 0.45 + i * 0.18 }} />
          ))}
        </div>
      </div>
    ),
  },
};

/** Mini site fictício dentro de uma moldura de navegador. */
function Mock({ item }: { item: Item }) {
  const t = themes[item.theme];
  return (
    <div className="overflow-hidden border border-marfim/10 bg-[#1a1410] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
      <div className="flex h-7 items-center gap-1.5 border-b border-marfim/10 px-3">
        <i className="size-2 rounded-full bg-marfim/20" /><i className="size-2 rounded-full bg-marfim/20" /><i className="size-2 rounded-full bg-marfim/20" />
        <span className="mx-auto h-3 w-1/3 rounded-sm bg-marfim/8" />
      </div>
      <div className={cn("relative aspect-[4/4.4] p-5", t.bg, t.fg)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 48 48" className="size-4" fill="none" stroke={t.accent} strokeWidth="2.5">{t.mark}</svg>
            <span className="font-serif text-[10px] font-semibold uppercase tracking-[0.22em]">{item.mock.word}</span>
          </div>
          <div className="flex gap-2">{[0, 1, 2].map((k) => <i key={k} className={cn("h-px w-5", t.sub)} />)}</div>
        </div>
        <p className="mt-6 max-w-[70%] font-serif text-[clamp(1.1rem,1.7vw,1.5rem)] leading-[1.08]">{item.mock.headline}</p>
        <div className="mt-3 flex flex-col gap-1.5">
          <i className={cn("h-[3px] w-[58%]", t.sub)} /><i className={cn("h-[3px] w-[44%]", t.sub)} />
        </div>
        <div className="mt-4 inline-flex h-5 items-center border px-2 text-[7px] uppercase tracking-[0.2em]" style={{ borderColor: t.accent }}>
          Agendar
        </div>
        <div className="absolute inset-x-5 bottom-5 top-[52%] overflow-hidden">{t.art}</div>
        <span className="absolute bottom-7 left-7 text-[7px] uppercase tracking-[0.24em] text-marfim/80 mix-blend-difference">{item.mock.meta}</span>
      </div>
    </div>
  );
}

function ExampleCard({ item, index }: { item: Item; index: number }) {
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const shine = useTransform(ry, [-8, 8], ["0%", "100%"]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <FadeIn delay={index * 0.12} className={cn(index === 1 && "md:mt-24", index === 2 && "md:mt-12")}>
      <article className="flex flex-col gap-6">
        <div className="[perspective:1200px]" onPointerMove={onMove} onPointerLeave={reset} data-cursor="hover">
          <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative">
            <Mock item={item} />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.12)_50%,transparent_60%)] bg-[length:250%_100%]"
              style={{ backgroundPositionX: shine }}
            />
            <span className="absolute -top-3 left-5 bg-latao px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.22em] text-tinta" style={{ transform: "translateZ(40px)" }}>
              Ilustrativo
            </span>
          </motion.div>
        </div>
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-[12px] font-medium tracking-[0.12em] text-latao">0{index + 1}</span>
            <h3 className="serif-title text-h3 text-marfim">{item.title}</h3>
          </div>
          <p className="mt-3 text-[15px] leading-[1.7] text-pedra">{item.text}</p>
        </div>
      </article>
    </FadeIn>
  );
}

export function Examples() {
  return (
    <section id="exemplos" data-theme="dark" aria-labelledby="exemplos-titulo" className="grain relative bg-cafe py-28 md:py-40">
      <div className="wrap relative z-10">
        <SectionHead
          tone="light"
          id="exemplos-titulo"
          eyebrow={examples.eyebrow}
          words={[...words(examples.title), ...words(examples.titleEm).map((w) => `*${w}*`)]}
          intro={examples.intro}
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
          {examples.items.map((item, i) => <ExampleCard key={item.theme} item={item} index={i} />)}
        </div>
        <p className="mt-20 border-t border-marfim/15 pt-6 text-[13px] text-pedra/80">{examples.note}</p>
      </div>
    </section>
  );
}
