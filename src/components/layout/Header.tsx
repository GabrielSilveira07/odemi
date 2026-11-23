"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { nav } from "@/content/site";
import { cn } from "@/lib/cn";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Header fixo que:
 *  - adapta as cores à seção abaixo dele (data-theme="dark" | "light");
 *  - ganha fundo translúcido após o topo;
 *  - se esconde ao rolar para baixo e volta ao rolar para cima.
 */
export function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240 && !open);
    setScrolled(y > 24);

    // seção sob o header define o tema
    const sections = document.querySelectorAll<HTMLElement>("[data-theme]");
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.top <= 40 && r.bottom > 40) { setDark(s.dataset.theme === "dark"); break; }
    }
    // seção ativa na navegação
    let current: string | null = null;
    for (const item of nav) {
      const el = document.querySelector<HTMLElement>(item.href);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) current = item.href;
    }
    setActive(current);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const light = !dark || open;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.6, ease }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color] duration-500",
          scrolled || open
            ? light
              ? "border-pedra/60 bg-marfim/85 backdrop-blur-xl"
              : "border-marfim/10 bg-marinho/70 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="wrap flex h-[72px] items-center justify-between">
          <Logo tone={light ? "dark" : "light"} />

          <nav aria-label="Principal" className="hidden items-center gap-10 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className={cn(
                  "group relative py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300",
                  light ? "text-grafite hover:text-tinta" : "text-pedra hover:text-marfim",
                  active === item.href && (light ? "text-tinta" : "text-marfim"),
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-2 h-px origin-right scale-x-0 bg-latao transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100",
                    active === item.href && "origin-left scale-x-100",
                  )}
                />
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className={cn(
              "flex min-h-11 items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] md:hidden",
              light ? "text-tinta" : "text-marfim",
            )}
          >
            {open ? "Fechar" : "Menu"}
            <span className="relative block h-[7px] w-5" aria-hidden>
              <span className={cn("absolute left-0 h-px w-full bg-current transition-all duration-300", open ? "top-[3px] rotate-45" : "top-0")} />
              <span className={cn("absolute left-0 h-px w-full bg-current transition-all duration-300", open ? "top-[3px] -rotate-45" : "top-[6px]")} />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            className="fixed inset-0 z-40 flex flex-col bg-marfim pt-[72px] md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease }}
          >
            <nav aria-label="Menu" className="wrap mt-10 flex flex-col">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.2 + i * 0.06 }}
                  className="flex items-baseline gap-5 border-b border-pedra py-6 font-serif text-[2.25rem] leading-none text-tinta"
                >
                  <span className="font-sans text-[12px] font-medium tracking-[0.12em] text-latao">0{i + 1}</span>
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <p className="wrap mt-auto pb-10 font-serif text-xl italic text-muted">Forma que segue função.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
