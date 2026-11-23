"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { SectionHead, words } from "@/components/ui/Reveal";
import { processSteps as process } from "@/content/site";

type Step = (typeof process.steps)[number];

function Panel({ step, index, total, progress }: { step: Step; index: number; total: number; progress: MotionValue<number> }) {
  const seg = 1 / total;
  const start = index * seg;
  const fill = useTransform(progress, [start, start + seg], ["0%", "100%"]);
  // offsets precisam ficar em [0,1] e crescentes (aceleração via WAAPI)
  const opacity = useTransform(progress, [Math.max(0, start - seg * 0.6), start + seg * 0.3], [index === 0 ? 1 : 0.35, 1]);

  return (
    <motion.li style={{ opacity }} className="relative flex w-[78vw] max-w-[440px] shrink-0 flex-col pr-10 md:w-[34vw]">
      <div className="relative h-px w-full bg-marfim/15">
        <motion.span className="absolute inset-y-0 left-0 bg-latao" style={{ width: fill }} />
        <span className="absolute -top-[5px] left-0 size-[11px] rounded-full border border-latao bg-marinho" />
      </div>
      <span className="mt-10 font-serif text-[clamp(4.5rem,8vw,7.5rem)] leading-none text-marfim/10">{step.n}</span>
      <h3 className="serif-title -mt-6 text-[clamp(1.75rem,2.6vw,2.5rem)] text-marfim">{step.title}</h3>
      <p className="mt-5 max-w-[26em] text-[15px] leading-[1.75] text-pedra">{step.text}</p>
    </motion.li>
  );
}

/**
 * Etapas em trilho horizontal fixado: a rolagem vertical desloca o trilho
 * e preenche cada filete. Em telas pequenas vira lista vertical.
 */
export function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "-52%"]);
  const total = process.steps.length;

  return (
    <section
      ref={ref}
      id="processo"
      data-theme="dark"
      aria-labelledby="processo-titulo"
      className="grain relative bg-marinho md:h-[300vh]"
    >
      <div className="relative z-10 flex flex-col justify-center overflow-hidden py-28 md:sticky md:top-0 md:h-[100svh] md:py-0">
        <div className="wrap">
          <SectionHead
            tone="light"
            id="processo-titulo"
            eyebrow={process.eyebrow}
            words={[...words(process.title), `*${process.titleEm}*`, ...words(process.titleEnd)]}
            intro={process.intro}
          />
        </div>

        {/* desktop: trilho horizontal */}
        <div className="wrap hidden md:block">
          <motion.ol style={{ x }} className="flex">
            {process.steps.map((s, i) => (
              <Panel key={s.n} step={s} index={i} total={total} progress={scrollYProgress} />
            ))}
          </motion.ol>
        </div>

        {/* mobile: lista vertical */}
        <ol className="wrap flex flex-col gap-14 md:hidden">
          {process.steps.map((s) => (
            <li key={s.n} className="border-t border-marfim/15 pt-8">
              <span className="text-[13px] font-medium tracking-[0.12em] text-latao">{s.n}</span>
              <h3 className="serif-title mt-4 text-[2rem] text-marfim">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.75] text-pedra">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
