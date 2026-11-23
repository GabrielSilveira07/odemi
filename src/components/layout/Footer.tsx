"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Monogram } from "@/components/brand/Logo";
import { nav, site } from "@/content/site";

/** Rodapé com wordmark gigante que sobe conforme o rodapé entra na tela. */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-90, 0]);

  return (
    <footer ref={ref} data-theme="dark" className="grain relative overflow-hidden bg-tinta pt-24 text-pedra">
      <div className="wrap relative z-10">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 border-b border-marfim/10 pb-16">
          <div className="col-span-12 md:col-span-6">
            <p className="serif-title text-[clamp(2rem,3.4vw,3rem)] italic leading-tight text-marfim">{site.claim}</p>
            <a href="#contato" className="group mt-8 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-latao-claro">
              Solicitar uma conversa
              <span className="h-px w-8 bg-latao transition-all duration-500 ease-out-expo group-hover:w-14" />
            </a>
          </div>
          <nav aria-label="Rodapé" className="col-span-6 md:col-span-3 md:col-start-10">
            <p className="mb-5 text-[11px] uppercase tracking-[0.22em] text-pedra/60">Navegação</p>
            <ul className="flex flex-col gap-3">
              {nav.map((n) => (
                <li key={n.href}><a href={n.href} className="text-[15px] text-marfim/80 transition-colors hover:text-marfim">{n.label}</a></li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 py-6 text-[13px] sm:flex-row sm:justify-between">
          <p>{site.legal.company}</p>
          <p>{site.legal.privacy}</p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-center overflow-hidden" aria-hidden>
        <motion.div style={{ y }} className="flex items-center gap-[2vw] pb-[1vw]">
          <motion.div style={{ rotate }}>
            <Monogram className="size-[12vw] text-latao" strokeWidth={1} />
          </motion.div>
          <span className="font-serif text-[22vw] font-medium uppercase leading-[0.78] tracking-[0.06em] text-marfim/[0.08]">
            Odemi
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
