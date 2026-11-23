"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { manifesto } from "@/content/site";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const color = useTransform(progress, range, ["#6B675F", "#0E0E0E"]);
  return (
    <motion.span style={{ opacity, color }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

/** Texto de princípio que acende palavra por palavra conforme a rolagem (seção fixada). */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const list = manifesto.text.split(" ");
  const sigOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 1]);
  const sigY = useTransform(scrollYProgress, [0.82, 0.95], [16, 0]);
  const bar = useTransform(scrollYProgress, [0, 0.95], ["0%", "100%"]);

  return (
    <section ref={ref} data-theme="light" aria-label="Princípio" className="relative h-[220vh] bg-marfim">
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="wrap grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 flex items-center gap-6 lg:col-span-2 lg:flex-col lg:items-start">
            <p className="eyebrow text-muted">{manifesto.eyebrow}</p>
            <div className="relative h-px w-24 bg-pedra/60 lg:mt-6 lg:h-40 lg:w-px" aria-hidden>
              <motion.span className="absolute left-0 top-0 h-px bg-latao lg:hidden" style={{ width: bar }} />
              <motion.span className="absolute left-0 top-0 hidden w-px bg-latao lg:block" style={{ height: bar }} />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-10">
            <p className="serif-title text-[clamp(1.9rem,4.2vw,4.25rem)] leading-[1.12]">
              {list.map((w, i) => {
                const start = (i / list.length) * 0.8;
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, start + 0.8 / list.length + 0.04]}>
                    {w}
                  </Word>
                );
              })}
            </p>
            <motion.p
              style={{ opacity: sigOpacity, y: sigY }}
              className="mt-12 flex items-center gap-4 font-serif text-2xl italic text-latao"
            >
              <span className="h-px w-12 bg-latao" aria-hidden />
              {manifesto.signature}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
