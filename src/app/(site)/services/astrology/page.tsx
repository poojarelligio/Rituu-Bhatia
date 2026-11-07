import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import IndexTab from "@/components/ui/IndexTab";
import { getStaticServiceBySlug } from "@/lib/staticServices";
import TestimonialSlider from "@/components/site/TestimonialSlider";

export const metadata: Metadata = {
  title: "Astrology Consultation",
  description:
    "Your chart tells a story. Learn how to read yours with a personalised astrology consultation by Rituu Bhatia.",
};

/* Animations are pure CSS (no client JS) so this stays ONE server file
   and `metadata` keeps working. Scroll-reveal uses CSS scroll-driven
   animations; browsers without support simply show the content. */
const css = `
@keyframes v-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes v-settle  { from { transform: scale(1.12); } to { transform: scale(1); } }
@keyframes v-spin    { to { transform: rotate(360deg); } }
@keyframes v-spin-r  { to { transform: rotate(-360deg); } }
@keyframes v-draw-y  { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes v-twinkle { 0%,100% { opacity: .3; } 50% { opacity: 1; } }
@keyframes v-pulse   { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-gold) 45%, transparent); } 50% { box-shadow: 0 0 0 14px transparent; } }

.v-hero-in { opacity: 0; animation: v-fade-up .9s ease-out forwards; animation-delay: var(--d, 0s); }
.v-settle  { animation: v-settle 2.4s ease-out both; }
.v-spin    { animation: v-spin 160s linear infinite; transform-origin: 200px 200px; }
.v-spin-r  { animation: v-spin-r 100s linear infinite; transform-origin: 200px 200px; }
.v-twinkle { animation: v-twinkle 3.2s ease-in-out infinite; animation-delay: var(--d, 0s); }
.v-pulse   { animation: v-pulse 2.8s ease-out infinite; }

@supports (animation-timeline: view()) {
  .v-reveal {
    animation: v-fade-up linear both;
    animation-timeline: view();
    animation-range: entry calc(var(--i, 0) * 6%) entry calc(38% + var(--i, 0) * 6%);
  }
  .v-line-y {
    transform-origin: top;
    animation: v-draw-y linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 55%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .v-hero-in, .v-reveal, .v-settle, .v-spin, .v-spin-r, .v-twinkle, .v-pulse, .v-line-y { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`;

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

const goldBtn =
  "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-10px_var(--color-gold)]";
const shine =
  "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full";

// \uFE0E forces the text (not emoji) version of each symbol
const topics = [
  { glyph: "\u2644\uFE0E", title: "Career & Business", text: "Explore professional direction and important cycles." },
  { glyph: "\u2640\uFE0E", title: "Relationships", text: "Gain perspective on relationship patterns and dynamics." },
  { glyph: "\u263D\uFE0E", title: "Timing & Life Cycles", text: "Understand significant periods and transitions." },
  { glyph: "\u2609\uFE0E", title: "Personal Growth", text: "Explore tendencies, strengths and areas of development." },
];

const journey = [
  "Your Birth Details",
  "Chart Analysis",
  "Your Questions",
  "Guided Consultation",
  "Greater Perspective",
];

// Zodiac ring for the hero ornament (static)
const signs = "\u2648\u2649\u264A\u264B\u264C\u264D\u264E\u264F\u2650\u2651\u2652\u2653".split("").map((g, n) => {
  const a = ((n * 30 + 15) * Math.PI) / 180;
  return {
    g: g + "\uFE0E",
    x: (200 + 166 * Math.sin(a)).toFixed(2),
    y: (200 - 166 * Math.cos(a) + 6).toFixed(2),
  };
});
const dividers = Array.from({ length: 12 }, (_, n) => {
  const a = (n * 30 * Math.PI) / 180;
  return {
    x1: (200 + 148 * Math.sin(a)).toFixed(2),
    y1: (200 - 148 * Math.cos(a)).toFixed(2),
    x2: (200 + 190 * Math.sin(a)).toFixed(2),
    y2: (200 - 190 * Math.cos(a)).toFixed(2),
  };
});

export default function AstrologyPage() {
  const service = getStaticServiceBySlug("astrology");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ───────────── HERO ───────────── */}
      <section className="relative isolate h-[88vh] min-h-[620px] w-full overflow-hidden">
        <div className="v-settle absolute inset-0 -z-20">
          <Image
            src="/images/services/astro.jpg"
            alt="Astrology chart reading with Rituu Bhatia"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink-mid/65 to-ink/25" />
        <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />

        {/* Zodiac wheel ornament (decorative) */}
        <div aria-hidden className="pointer-events-none absolute right-[5%] top-1/2 hidden -translate-y-1/2 opacity-60 lg:block">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
            <g className="v-spin text-gold" stroke="currentColor">
              <circle cx="200" cy="200" r="190" strokeOpacity="0.55" />
              <circle cx="200" cy="200" r="148" strokeOpacity="0.4" />
              {dividers.map((l, n) => (
                <line key={n} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} strokeOpacity="0.45" />
              ))}
              <g fill="currentColor" stroke="none" fontSize="16" textAnchor="middle" fontFamily="serif">
                {signs.map((s, n) => (
                  <text key={n} x={s.x} y={s.y}>{s.g}</text>
                ))}
              </g>
            </g>
            <g className="v-spin-r text-accent" stroke="currentColor">
              <circle cx="200" cy="200" r="110" strokeOpacity="0.45" />
              <circle cx="200" cy="200" r="70" strokeOpacity="0.3" strokeDasharray="2 6" />
              {/* two interlocking triangles */}
              <path d="M200 90 L295 255 L105 255 Z" strokeOpacity="0.65" fill="currentColor" fillOpacity="0.07" />
              <path d="M200 310 L105 145 L295 145 Z" strokeOpacity="0.65" fill="currentColor" fillOpacity="0.07" />
            </g>
            <g className="text-gold" fill="currentColor">
              <circle cx="200" cy="200" r="5" />
              <circle className="v-twinkle" cx="92" cy="92" r="2.5" style={d(0)} />
              <circle className="v-twinkle" cx="322" cy="104" r="2" style={d(1)} />
              <circle className="v-twinkle" cx="334" cy="308" r="2.5" style={d(2)} />
              <circle className="v-twinkle" cx="70" cy="296" r="2" style={d(0.6)} />
            </g>
          </svg>
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-16 lg:px-10">
            <div className="v-hero-in mb-5 flex flex-wrap items-center gap-3" style={d(0.1)}>
              <IndexTab code={service?.code || "AS"} index={0} className="border-ivory/40 text-ivory" />
              <span className="index-tab inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs text-ivory backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" style={{ boxShadow: "0 0 10px var(--color-accent)" }} />
                ASTROLOGY CONSULTATION
              </span>
            </div>

            <h1
              className="v-hero-in mb-5 max-w-3xl font-display text-4xl font-light leading-tight text-ivory sm:text-5xl lg:text-6xl"
              style={d(0.25)}
            >
              Your chart tells a story.{" "}
              <span className="bg-gradient-to-r">
                Learn how to read yours.
              </span>
            </h1>

            <p className="v-hero-in mb-9 max-w-xl text-lg leading-relaxed text-ivory/80" style={d(0.4)}>
              Astrology isn&apos;t simply about knowing your zodiac sign.
            </p>

            <div className="v-hero-in flex flex-wrap gap-4" style={d(0.55)}>
              <Link href="/appointment" className={goldBtn}>
                <span className={shine} />
                <span className="relative">Book an Astrology Appointment</span>
                <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-medium text-ivory backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/20"
              >
                All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── STATS ───────────── */}
      {service?.stats?.length ? (
        <section className="relative overflow-hidden bg-ink py-12 text-ivory">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 text-center lg:px-10">
            {service.stats.map((stat, n) => (
              <div key={n} className="v-reveal" style={i(n)}>
                <p className="font-display text-3xl text-gold-soft md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-ivory/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ───────────── INTRO + IMAGE ───────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
            <div className="v-reveal lg:col-span-6">
              <span className="accent-line mb-4" />
              <p className="index-tab mb-4 mt-4 text-xs text-gold-deep">ABOUT THE PRACTICE</p>
              <h2 className="mb-6 font-display text-3xl font-light leading-tight text-charcoal md:text-4xl">
                Your birth chart is{" "}
                <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text text-transparent">
                  a unique map created from your date, time and place of birth.
                </span>
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-charcoal/70">
                It can be explored to understand patterns, cycles and possibilities that may influence
                different chapters of your life.
              </p>
              <p className="text-lg leading-relaxed text-charcoal/70">
                Rituu&apos;s consultations help you move beyond a generic horoscope towards a more
                personalised conversation around your life and your questions.
              </p>
            </div>

            <div className="v-reveal lg:col-span-6" style={i(2)}>
              <div className="group relative mt-6">
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border border-accent/60 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"
                />
                <div className="relative aspect-[4/4] overflow-hidden rounded-2xl border border-line shadow-[0_30px_70px_-30px_var(--color-ink)]">
                  <Image
                    src="/images/services/astro-chart.jpg"
                    alt="Astrology chart analysis"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-mid/55 to-transparent" />

                  {/* Birth-detail chips */}
                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs text-white backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
                    <span className="v-twinkle h-1.5 w-1.5 rounded-full bg-gold" style={d(0)} /> Date of birth
                  </span>
                  <span className="absolute right-4 top-1/3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs text-white backdrop-blur-md transition-transform duration-500 group-hover:translate-x-1">
                    <span className="v-twinkle h-1.5 w-1.5 rounded-full bg-accent" style={d(1)} /> Time of birth
                  </span>
                  <span className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs text-white backdrop-blur-md transition-transform duration-500 group-hover:translate-y-1">
                    <span className="v-twinkle h-1.5 w-1.5 rounded-full bg-gold" style={d(2)} /> Place of birth
                  </span>
                </div>
                <span className="absolute -bottom-4 right-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white shadow-xl">
                  <span className="v-pulse h-2 w-2 rounded-full bg-gold" />
                  30-minute session
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── WHAT WOULD YOU LIKE TO UNDERSTAND ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-mid to-ink py-24">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="v-reveal mb-14 text-center">
            <p className="index-tab mb-4 text-xs text-gold">THE SCOPE</p>
            <h2 className="font-display text-3xl font-light leading-tight text-white md:text-5xl">
              What Would You Like to Understand?
            </h2>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden>
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/80" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/80" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((t, n) => (
              <div
                key={t.title}
                className="v-reveal group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-accent/60 hover:shadow-[0_24px_60px_-20px_var(--color-accent)]"
                style={i(n)}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(260px_circle_at_50%_0%,color-mix(in_srgb,var(--color-accent)_28%,transparent),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                {/* constellation dots */}
                <span aria-hidden className="v-twinkle absolute right-6 top-6 h-1 w-1 rounded-full bg-gold" style={d(n * 0.5)} />
                <span aria-hidden className="v-twinkle absolute right-12 top-10 h-[3px] w-[3px] rounded-full bg-white" style={d(n * 0.5 + 1)} />
                <span aria-hidden className="v-twinkle absolute right-8 top-14 h-1 w-1 rounded-full bg-accent" style={d(n * 0.5 + 2)} />

                <div className="relative">
                  <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent to-gold font-serif text-3xl leading-none text-ink shadow-[0_10px_30px_-8px_var(--color-accent)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    {t.glyph}
                  </div>
                  <h3 className="mb-2 font-display text-xl text-white">{t.title}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{t.text}</p>
                </div>
                <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-accent to-gold transition-all duration-700 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FROM CHART TO CLARITY ───────────── */}
      <section className="relative overflow-hidden border-y border-line bg-ivory-deep py-24">
        <div aria-hidden className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 lg:px-10">
          <div className="v-reveal mb-16 text-center">
            <p className="index-tab mb-4 text-xs text-gold-deep">THE PROCESS</p>
            <h2 className="font-display text-3xl font-light leading-tight text-charcoal md:text-5xl">
              From Chart to{" "}
              <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text text-transparent">Clarity</span>
            </h2>
          </div>

          <div className="relative">
            {/* vertical line – draws itself while scrolling */}
            <div aria-hidden className="absolute bottom-7 left-7 top-7 w-[2px] bg-line">
              <div className="v-line-y h-full w-full bg-gradient-to-b from-accent to-gold" />
            </div>

            <ol className="space-y-6">
              {journey.map((label, n) => {
                const last = n === journey.length - 1;
                return (
                  <li key={label} className="v-reveal group relative flex items-center gap-5" style={i(n)}>
                    <div
                      className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-gold font-display text-lg text-ink ring-8 ring-ivory-deep transition-all duration-500 group-hover:scale-110 group-hover:ring-white ${
                        last ? "v-pulse shadow-[0_10px_30px_-8px_var(--color-gold)]" : "shadow-[0_10px_30px_-8px_var(--color-accent)]"
                      }`}
                    >
                      {String(n + 1).padStart(2, "0")}
                    </div>
                    <div
                      className={`flex-1 rounded-2xl border px-6 py-4 transition-all duration-500 group-hover:translate-x-2 ${
                        last
                          ? "border-gold/60 bg-white shadow-[0_20px_50px_-24px_var(--color-gold)]"
                          : "border-transparent bg-white/60 group-hover:border-accent/40 group-hover:bg-white group-hover:shadow-[0_20px_50px_-24px_var(--color-accent)]"
                      }`}
                    >
                      <h3 className="font-display text-xl text-charcoal md:text-2xl">{label}</h3>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────────── TESTIMONIAL ───────────── */}
      {/* <section className="relative overflow-hidden py-24">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
        <div className="v-reveal relative mx-auto max-w-2xl px-6 lg:px-10">
          <div className="rounded-3xl border border-gold/40 bg-white/70 px-8 py-12 text-center shadow-[0_30px_80px_-40px_var(--color-gold)] backdrop-blur">
            <div className="quote-mark" />
            <p className="mb-6 font-display text-2xl leading-snug text-charcoal">
              Rituu didn&apos;t just tell me what my chart said — she showed me how it applied to what
              I&apos;m going through right now. It was incredibly grounding.
            </p>
            <div className="mb-2 flex justify-center gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, n) => (
                <Star key={n} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-xs uppercase tracking-wide text-charcoal/50">Rajesh K.</p>
          </div>
        </div>
      </section> */}

<TestimonialSlider
  eyebrow="TAROT CARD READING CLIENT EXPERIENCES"
  title="Stories of Harmony & Transformation"
  autoplaySpeed={3000}
  testimonials={[
    {
      id: 1,
      quote:"Rituu did'nt just tell me what my chart said — she showed me how it applied to what I'm going through right now. It was incredibly grounding.",
      name: "Rajesh K.",
      role: "astrology",
      rating: 5,
    },
    
  ]}
/>

      {/* ───────────── FINAL CTA ───────────── */}
      <section className="relative overflow-hidden py-28">
        <Image src="/images/services/astro-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-ink/95 via-ink-mid/90 to-ink/95" />
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />

        <div className="v-reveal relative mx-auto max-w-2xl px-6 text-center lg:px-10">
          <p className="index-tab mb-4 text-xs text-gold">FROM ₹99 · 30-MINUTE SESSION</p>
          <h2 className="mb-9 font-display text-3xl font-light leading-tight text-ivory sm:text-5xl">
            Your story is unique.{" "}
            <span className="bg-gradient-to-r">
              Your reading should be too.
            </span>
          </h2>
          <Link href="/appointment" className={goldBtn}>
            <span className={shine} />
            <span className="relative">Book an Astrology Appointment</span>
            <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}