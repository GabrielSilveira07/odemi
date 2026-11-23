"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

const ease = [0.16, 1, 0.3, 1] as const;

/** Palavra marcada com *asteriscos* vira itálico. */
function renderWord(w: string) {
  return w.startsWith("*") ? <em>{w.replace(/\*/g, "")}</em> : w;
}

/**
 * Revela um título palavra por palavra, cada uma subindo de dentro de uma máscara.
 * `immediate` anima no carregamento (hero); caso contrário, ao entrar na tela.
 */
export function SplitReveal({
  words,
  as: Tag = "h2",
  className,
  delay = 0,
  immediate = false,
  id,
}: {
  words: string[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  immediate?: boolean;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const show = immediate || inView;

  return (
    <Tag ref={ref as never} id={id} className={className}>
      <span className="sr-only">{words.join(" ").replace(/\*/g, "")}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              initial={reduce ? false : { y: "110%" }}
              animate={show ? { y: "0%" } : undefined}
              transition={{ duration: 1.1, ease, delay: delay + i * 0.055 }}
            >
              {renderWord(w)}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** Fade + leve subida ao entrar na tela. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Título de seção: eyebrow + título revelado + intro opcional. */
export function SectionHead({
  eyebrow,
  words,
  intro,
  id,
  tone = "dark",
}: {
  eyebrow: string;
  words: string[];
  intro?: string;
  id: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="mb-16 grid grid-cols-12 items-end gap-x-6 gap-y-6 md:mb-24">
      <FadeIn className="col-span-12">
        <p className={cn("eyebrow", tone === "light" ? "text-pedra" : "text-muted")}>{eyebrow}</p>
      </FadeIn>
      <SplitReveal
        id={id}
        words={words}
        className={cn(
          "serif-title col-span-12 text-h2 lg:col-span-8",
          tone === "light" ? "text-marfim" : "text-tinta",
        )}
      />
      {intro && (
        <FadeIn delay={0.2} className="col-span-12 lg:col-span-4">
          <p className={cn("text-[15px] leading-6", tone === "light" ? "text-pedra" : "text-muted")}>{intro}</p>
        </FadeIn>
      )}
    </div>
  );
}

export const words = (s: string) => s.split(" ");
