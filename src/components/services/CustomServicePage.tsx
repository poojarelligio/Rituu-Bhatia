import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles as SparklesIcon, type LucideIcon } from "lucide-react";
import IndexTab from "@/components/ui/IndexTab";

export type CustomService = {
  slug: string;
  code: string;
  eyebrow: string;
  heroImage: string;
  heroAlt: string;
  introImage: string;
  introAlt: string;
  headlineStart: string;
  headlineHighlight: string;
  sub: string;
  introLabel: string;
  introHeading: string;
  introHighlight: string;
  introParagraphs: string[];
  exploreTitle: string;
  explore: { icon: LucideIcon; title: string; text: string }[];
  stepsTitle: string;
  steps: { title: string; text: string }[];
  ctaStart: string;
  ctaHighlight: string;
  ctaButton: string;
};

/* Pure-CSS animations (no client JS). Scroll fade-ins need a recent
   Chrome/Edge/Safari; elsewhere the content simply appears. */
const css = `
@keyframes v-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes v-settle  { from { transform: scale(1.12); } to { transform: scale(1); } }
@keyframes v-spin    { to { transform: rotate(360deg); } }
@keyframes v-draw    { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes v-twinkle { 0%,100% { opacity: .3; } 50% { opacity: 1; } }
@keyframes v-pulse   { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-gold) 45%, transparent); } 50% { box-shadow: 0 0 0 14px transparent; } }
.v-hero-in { opacity: 0; animation: v-fade-up .9s ease-out forwards; animation-delay: var(--d, 0s); }
.v-settle  { animation: v-settle 2.4s ease-out both; }
.v-spin    { animation: v-spin 140s linear infinite; transform-origin: 200px 200px; }
.v-twinkle { animation: v-twinkle 3.2s ease-in-out infinite; animation-delay: var(--d, 0s); }
.v-pulse   { animation: v-pulse 2.8s ease-out infinite; }
@supports (animation-timeline: view()) {
  .v-reveal {
    animation: v-fade-up linear both;
    animation-timeline: view();
    animation-range: entry calc(var(--i, 0) * 6%) entry calc(38% + var(--i, 0) * 6%);
  }
  .v-line {
    transform-origin: left;
    animation: v-draw linear both;
    animation-timeline: view();
    animation-range: entry 5% cover 35%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .v-hero-in, .v-reveal, .v-settle, .v-spin, .v-twinkle, .v-pulse, .v-line { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`;

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
const i = (n: number) => ({ "--i": n }) as CSSProperties;

const goldBtn =
  "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-10px_var(--color-gold)]";
const shine =
  "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full";

export default function CustomServicePage({ service }: { service: CustomService }) {
  const contactHref = `/contact?service=${service.slug}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ───────────── HERO ───────────── */}
      <section className="relative isolate h-[80vh] min-h-[560px] w-full overflow-hidden">
        <div className="v-settle absolute inset-0 -z-20">
          <Image src={service.heroImage} alt={service.heroAlt} fill priority sizes="100vw" className="object-cover" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink-mid/55 to-ink/25" />
        <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-violet/30 blur-3xl" />

        {/* ornament (desktop) */}
        <div aria-hidden className="pointer-events-none absolute right-[5%] top-1/2 hidden -translate-y-1/2 opacity-60 lg:block">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" className="text-gold">
            <g className="v-spin" stroke="currentColor">
              <circle cx="200" cy="200" r="190" strokeOpacity="0.5" />
              <circle cx="200" cy="200" r="150" strokeOpacity="0.35" strokeDasharray="2 8" />
              <circle cx="200" cy="200" r="110" strokeOpacity="0.4" />
              <path d="M200 90 L295 255 L105 255 Z" strokeOpacity="0.55" fill="currentColor" fillOpacity="0.06" />
              <path d="M200 310 L105 145 L295 145 Z" strokeOpacity="0.55" fill="currentColor" fillOpacity="0.06" />
            </g>
            <circle cx="200" cy="200" r="5" fill="currentColor" />
          </svg>
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-16 lg:px-10">
            <div className="v-hero-in mb-5 flex flex-wrap items-center gap-3" style={d(0.1)}>
              <IndexTab code={service.code} index={0} className="border-ivory/40 text-ivory" />
              <span className="index-tab inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs uppercase text-ivory backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" style={{ boxShadow: "0 0 10px var(--color-accent)" }} />
                {service.eyebrow}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold text-ink">
                <SparklesIcon size={11} /> CUSTOMISED FOR YOU
              </span>
            </div>

            <h1
              className="v-hero-in mb-5 max-w-3xl font-display text-4xl font-light leading-tight text-ivory sm:text-5xl lg:text-6xl"
              style={d(0.25)}
            >
              {service.headlineStart}{" "}
              <span className="bg-gradient-to-r from-gold-soft via-gold to-accent bg-clip-text text-transparent">
                {service.headlineHighlight}
              </span>
            </h1>

            <p className="v-hero-in mb-9 max-w-xl text-lg leading-relaxed text-ivory/80" style={d(0.4)}>
              {service.sub}
            </p>

            <div className="v-hero-in flex flex-wrap gap-4" style={d(0.55)}>
              <Link href={contactHref} className={goldBtn}>
                <span className={shine} />
                <span className="relative">{service.ctaButton}</span>
                <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-medium text-ivory backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/20"
              >
                <ArrowLeft size={15} /> All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── INTRO + IMAGE ───────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
            <div className="v-reveal lg:col-span-6">
              <span className="accent-line mb-4" />
              <p className="index-tab mb-4 mt-4 text-xs text-gold-deep">{service.introLabel}</p>
              <h2 className="mb-6 font-display text-3xl font-light leading-tight text-charcoal md:text-4xl">
                {service.introHeading}{" "}
                <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text italic text-transparent">
                  {service.introHighlight}
                </span>
              </h2>
              {service.introParagraphs.map((p, n) => (
                <p key={n} className="mb-4 text-lg leading-relaxed text-charcoal/70 last:mb-0">
                  {p}
                </p>
              ))}
            </div>

            <div className="v-reveal lg:col-span-6" style={i(2)}>
              <div className="group relative mt-6">
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border border-gold/60 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"
                />
                <div className="relative aspect-[4/4] overflow-hidden rounded-2xl border border-line shadow-[0_30px_70px_-30px_var(--color-ink)]">
                  <Image
                    src={service.introImage}
                    alt={service.introAlt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                </div>
                <span className="absolute -bottom-4 left-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white shadow-xl">
                  <span className="v-pulse h-2 w-2 rounded-full bg-gold" />
                  Personal consultation with Rituu
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── WHAT WE EXPLORE ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-mid to-ink py-24">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="v-reveal mb-14 text-center">
            <p className="index-tab mb-4 text-xs text-gold">THE SCOPE</p>
            <h2 className="font-display text-3xl font-light leading-tight text-white md:text-5xl">{service.exploreTitle}</h2>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden>
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/80" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/80" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.explore.map((item, n) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="v-reveal group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-accent/60 hover:shadow-[0_24px_60px_-20px_var(--color-accent)]"
                  style={i(n)}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(260px_circle_at_50%_0%,color-mix(in_srgb,var(--color-accent)_25%,transparent),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span
                    aria-hidden
                    className="absolute right-5 top-4 font-display text-5xl leading-none text-transparent"
                    style={{ WebkitTextStroke: "1px rgba(255,255,255,0.25)" }}
                  >
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <div className="relative">
                    <div className="mb-6 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent to-gold text-ink shadow-[0_10px_30px_-8px_var(--color-accent)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                      <Icon size={24} strokeWidth={1.75} />
                    </div>
                    <h3 className="mb-2 font-display text-2xl text-white">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-white/70">{item.text}</p>
                  </div>
                  <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-accent to-gold transition-all duration-700 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section className="relative overflow-hidden border-y border-line bg-ivory-deep py-24">
        <div aria-hidden className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="v-reveal mb-16 text-center">
            <p className="index-tab mb-4 text-xs text-gold-deep">THE PROCESS</p>
            <h2 className="font-display text-3xl font-light leading-tight text-charcoal md:text-5xl">
              {service.stepsTitle}
            </h2>
          </div>

          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-[52px] hidden h-[2px] bg-line md:block">
              <div className="v-line h-full bg-gradient-to-r from-accent to-gold" />
            </div>
            {service.steps.map((step, n) => (
              <div
                key={step.title}
                className="v-reveal group relative rounded-2xl border border-transparent p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:bg-white hover:shadow-[0_24px_60px_-24px_var(--color-accent)]"
                style={i(n)}
              >
                <div className="relative z-10 mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent to-gold font-display text-lg text-ink shadow-[0_10px_30px_-8px_var(--color-accent)] ring-8 ring-ivory-deep transition-all duration-500 group-hover:scale-110 group-hover:ring-white">
                  {String(n + 1).padStart(2, "0")}
                </div>
                <h3 className="mb-2 font-display text-2xl text-charcoal">{step.title}</h3>
                <p className="text-sm leading-relaxed text-charcoal/65">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FINAL CTA ───────────── */}
      <section className="relative overflow-hidden py-28">
        <Image src={service.heroImage} alt="" fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-ink/95 via-ink-mid/90 to-ink/95" />
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-violet/30 blur-3xl" />

        <div className="v-reveal relative mx-auto max-w-2xl px-6 text-center lg:px-10">
          <p className="index-tab mb-4 text-xs text-gold">CUSTOMISED FOR YOU</p>
          <h2 className="mb-9 font-display text-3xl font-light leading-tight text-ivory sm:text-5xl">
            {service.ctaStart}{" "}
            <span className="bg-gradient-to-r from-gold-soft via-gold to-accent bg-clip-text text-transparent">
              {service.ctaHighlight}
            </span>
          </h2>
          <Link href={contactHref} className={goldBtn}>
            <span className={shine} />
            <span className="relative">{service.ctaButton}</span>
            <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}