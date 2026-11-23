"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/Reveal";
import { hero, services } from "@/content/site";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // ponteiro normalizado (-1..1) suavizado
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 60, damping: 20 });
  const spy = useSpring(py, { stiffness: 60, damping: 20 });

  // brilho de latão seguindo o cursor
  const gx = useMotionValue(70);
  const gy = useMotionValue(40);
  const sgx = useSpring(gx, { stiffness: 50, damping: 20 });
  const sgy = useSpring(gy, { stiffness: 50, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(640px circle at ${sgx}% ${sgy}%, rgba(154,123,79,0.20), transparent 62%)`;

  // scroll: conteúdo recua e monograma gira
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const markRotate = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const markScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  // linha do monograma inclina na direção do cursor; círculo desloca levemente
  const lineRotate = useTransform(spy, [-1, 1], [-7, 7]);
  const markX = useTransform(spx, [-1, 1], [-24, 24]);
  const markY = useTransform(spy, [-1, 1], [-18, 18]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    px.set(nx * 2 - 1);
    py.set(ny * 2 - 1);
    gx.set(nx * 100);
    gy.set(ny * 100);
  };

  return (
    <section
      ref={ref}
      id="topo"
      data-theme="dark"
      aria-labelledby="hero-titulo"
      onPointerMove={onMove}
      className="grain relative flex min-h-[100svh] overflow-hidden bg-marinho text-pedra"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />

      {/* Monograma gigante */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-14vw] top-1/2 hidden aspect-square w-[min(70vw,980px)] -translate-y-1/2 md:block"
        style={{ x: markX, y: markY, rotate: markRotate, scale: markScale }}
      >
        <svg viewBox="0 0 100 100" className="size-full overflow-visible text-marfim" fill="none">
          <motion.circle
            cx="50" cy="50" r="36"
            stroke="currentColor" strokeOpacity="0.16" strokeWidth="0.18"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.6, ease, delay: 0.2 }}
          />
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity="0.05" strokeWidth="0.12" strokeDasharray="0.6 1.4" />
          <motion.g style={{ rotate: lineRotate, transformOrigin: "50px 50px" }}>
            <motion.line
              x1="0" y1="50" x2="100" y2="50"
              stroke="currentColor" strokeOpacity="0.16" strokeWidth="0.18"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease, delay: 1.1 }}
            />
          </motion.g>
          {/* ponto de latão orbitando */}
          <motion.g
            style={{ transformOrigin: "50px 50px" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            <circle cx="86" cy="50" r="0.7" fill="#9A7B4F" />
          </motion.g>
        </svg>
      </motion.div>

      <motion.div
        className="wrap relative z-10 flex flex-col justify-between gap-20 pb-0 pt-[calc(72px+clamp(56px,13vh,150px))]"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="flex max-w-[920px] flex-col gap-9">
          <motion.p
            className="eyebrow text-pedra"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.1 }}
          >
            {hero.eyebrow}
          </motion.p>

          <SplitReveal
            as="h1"
            id="hero-titulo"
            immediate
            delay={0.25}
            words={hero.titleWords}
            className="serif-title text-display text-marfim [&_em]:text-latao-claro"
          />

          <motion.div
            className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.9 }}
          >
            <p className="max-w-[30em] text-[17px] leading-[1.75] text-[#CFCABF]">{hero.lead}</p>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 1.05 }}
          >
            <Button href={hero.cta.href} className="w-full sm:w-auto">{hero.cta.label}</Button>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="grid grid-cols-1 border-t border-pedra/25 sm:grid-cols-[repeat(3,1fr)_auto]"
        >
          {services.items.map((s) => (
            <a
              key={s.n}
              href="#servicos"
              className="group flex min-h-16 items-center gap-4 border-b border-pedra/15 text-[11px] font-medium uppercase tracking-[0.2em] text-pedra transition-colors duration-300 hover:text-marfim sm:min-h-20 sm:border-b-0"
            >
              <span className="text-latao">{s.n}</span>
              <span className="relative">
                {s.title}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-latao transition-transform duration-500 ease-out-expo group-hover:scale-x-100" />
              </span>
            </a>
          ))}
          <div className="hidden items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-pedra/70 sm:flex" aria-hidden>
            Role
            <span className="relative block h-10 w-px overflow-hidden bg-pedra/20">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-latao"
                animate={reduce ? undefined : { y: ["-100%", "200%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
