import { disciplines } from "@/content/site";

/** Faixa contínua de disciplinas. Pausa no hover; para em movimento reduzido. */
export function Marquee() {
  const row = [...disciplines, ...disciplines];
  return (
    <div data-theme="light" className="group overflow-hidden border-b border-pedra/60 bg-marfim py-7" aria-label="Disciplinas">
      <div className="flex w-max animate-[marquee_42s_linear_infinite] group-hover:[animation-play-state:paused]">
        {[0, 1].map((k) => (
          <ul key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {row.map((d, i) => (
              <li key={i} className="flex items-center font-serif text-[clamp(1.75rem,3.4vw,3rem)] italic leading-none text-tinta">
                <span className="px-8">{d}</span>
                <svg viewBox="0 0 48 48" className="size-5 text-latao" fill="none" stroke="currentColor" aria-hidden>
                  <circle cx="24" cy="24" r="17" strokeWidth="2" />
                  <line x1="2" y1="24" x2="46" y2="24" strokeWidth="2" />
                </svg>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
