import { cn } from "@/lib/cn";

/** Monograma: círculo atravessado por uma linha horizontal. */
export function Monogram({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="17" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      <line x1="2" y1="24" x2="46" y2="24" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <a
      href="#topo"
      aria-label="Odemi, voltar ao início"
      className={cn(
        "group inline-flex items-center gap-3 transition-colors duration-300",
        tone === "light" ? "text-marfim" : "text-tinta",
        className,
      )}
    >
      <Monogram className="size-7 transition-transform duration-700 ease-out-expo group-hover:rotate-180" />
      <span className="pt-0.5 font-serif text-lg font-semibold uppercase leading-none tracking-[0.2em]">Odemi</span>
    </a>
  );
}
