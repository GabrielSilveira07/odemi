"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  tone?: "light" | "dark";
  className?: string;
  onClick?: () => void;
};

/**
 * Botão contorno Latão com efeito magnético e preenchimento que sobe no hover.
 * tone="light" para fundos escuros (texto marfim), "dark" para fundos claros.
 */
export function Button({ children, href, type = "button", disabled, tone = "light", className, onClick }: Props) {
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };

  const classes = cn(
    "group relative inline-flex min-h-14 items-center justify-center gap-4 overflow-hidden border border-latao px-8",
    "text-[12px] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
    "disabled:pointer-events-none disabled:opacity-50",
    tone === "light" ? "text-marfim" : "text-tinta",
    "hover:text-tinta focus-visible:text-tinta",
    className,
  );

  const inner = (
    <>
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 bg-latao transition-transform duration-500 ease-out-expo group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span className="relative">{children}</span>
      <svg viewBox="0 0 16 16" className="relative size-3.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" aria-hidden>
        <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    </>
  );

  const common = {
    ref: ref as never,
    style: { x, y },
    onPointerMove: onMove,
    onPointerLeave: reset,
    whileTap: { scale: 0.98 },
    className: classes,
    "data-cursor": "hover",
  };

  return href ? (
    <motion.a href={href} {...common}>{inner}</motion.a>
  ) : (
    <motion.button type={type} disabled={disabled} onClick={onClick} {...common}>{inner}</motion.button>
  );
}
