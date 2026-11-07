import type { CSSProperties } from "react";

/* Place in: src/components/ui/Decor.tsx
   Shared building blocks lifted from the homepage so every page uses the
   same design language. Server-safe (no hooks). Works with the v-* motion
   classes in motion-additions.css (add that to globals.css). */

/* Scroll-reveal stagger index + float delay helpers */
export const idx = (n: number) => ({ "--i": n }) as CSSProperties;
export const dly = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M12 0 C12.8 7.5 16.5 11.2 24 12 C16.5 12.8 12.8 16.5 12 24 C11.2 16.5 7.5 12.8 0 12 C7.5 11.2 11.2 7.5 12 0Z" />
    </svg>
  );
}

const sparklePoints = [
  { top: "10%", left: "6%", size: 12, d: 0 },
  { top: "22%", left: "88%", size: 14, d: 0.8 },
  { top: "72%", left: "12%", size: 10, d: 1.4 },
  { top: "84%", left: "80%", size: 12, d: 0.4 },
  { top: "48%", left: "50%", size: 9, d: 2 },
  { top: "14%", left: "46%", size: 10, d: 1.1 },
];

/** Twinkling sparkles for dark sections. Parent needs `relative isolate`. */
export function Sparkles() {
  return (
    <>
      {sparklePoints.map((s, n) => (
        <Sparkle
          key={n}
          className="v-twinkle pointer-events-none absolute -z-10 text-gold"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, ["--d" as string]: `${s.d}s` }}
        />
      ))}
    </>
  );
}

/** Scrolling keyword strip (same as the homepage). */
export function Marquee({ words }: { words: string[] }) {
  return (
    <div className="v-marquee-wrap relative overflow-hidden border-y border-gold/30 bg-ink py-4">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <div className="v-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {words.map((w) => (
              <span key={`${copy}-${w}`} className="flex items-center">
                <span className="px-8 font-display text-lg font-light uppercase tracking-[0.3em] text-gold-soft sm:text-xl">
                  {w}
                </span>
                <Sparkle className="h-3.5 w-3.5 text-gold" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Shared class strings (identical to the homepage) */
export const goldBtn =
  "group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-10px_var(--color-gold)]";
export const inkBtn =
  "group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-mid hover:shadow-[0_14px_40px_-12px_var(--color-ink)]";
export const shine =
  "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full";
export const pill =
  "index-tab mb-5 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 text-xs uppercase text-gold-deep backdrop-blur";
export const pillDark =
  "index-tab mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs uppercase text-gold-soft backdrop-blur-md";