import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Compass, Heart, Sparkles, Star, TrendingUp } from "lucide-react";
import IndexTab from "@/components/ui/IndexTab";
import TestimonialSlider from "@/components/site/TestimonialSlider";

export const metadata: Metadata = {
  title: "Tarot Card Reading",
  description:
    "You already have the question. Explore it from a different perspective with a Tarot Card session by Rituu Bhatia.",
};

/* Animations are pure CSS (no client JS) so this stays ONE server file
   and `metadata` keeps working. Scroll-reveal uses CSS scroll-driven
   animations; browsers without support simply show the content. */
const css = `
@keyframes v-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes v-settle  { from { transform: scale(1.12); } to { transform: scale(1); } }
@keyframes v-spin    { to { transform: rotate(360deg); } }
@keyframes v-spin-r  { to { transform: rotate(-360deg); } }
@keyframes v-draw    { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes v-twinkle { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes v-pulse   { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-gold) 45%, transparent); } 50% { box-shadow: 0 0 0 14px transparent; } }

.v-hero-in { opacity: 0; animation: v-fade-up .9s ease-out forwards; animation-delay: var(--d, 0s); }
.v-settle  { animation: v-settle 2.4s ease-out both; }
.v-spin    { animation: v-spin 120s linear infinite; }
.v-spin-r  { animation: v-spin-r 90s linear infinite; transform-origin: 200px 200px; }
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
  .v-hero-in, .v-reveal, .v-settle, .v-spin, .v-spin-r, .v-twinkle, .v-pulse, .v-line { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`;

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

const goldBtn =
  "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-10px_var(--color-gold)]";
const shine =
  "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full";

const stats = [
  { value: "1,200+", label: "Readings Given" },
  { value: "12+", label: "Years Reading" },
  // { value: "4.9/5", label: "Average Rating" },
];

const questions = [
  "Should I take this opportunity?",
  "Where is this relationship heading?",
  "What is holding me back?",
  "Am I moving in the right direction?",
];

const topics = [
  { numeral: "I", icon: Briefcase, title: "Career", text: "Exploring opportunities and professional direction." },
  { numeral: "II", icon: Heart, title: "Relationships", text: "Understanding dynamics and perspectives." },
  { numeral: "III", icon: TrendingUp, title: "Business", text: "Reflecting on decisions and possibilities." },
  { numeral: "IV", icon: Compass, title: "Personal Journey", text: "Exploring questions around growth and direction." },
];

const steps = [
  { number: "01", title: "Your Question" },
  { number: "02", title: "The Reading" },
  { number: "03", title: "Reflection" },
  { number: "04", title: "Your Next Step" },
];

// Rays for the hero ornament (static)
const rays = Array.from({ length: 24 }, (_, n) => {
  const a = (n * 15 * Math.PI) / 180;
  const long = n % 2 === 0;
  const r1 = 150;
  const r2 = long ? 190 : 172;
  return {
    x1: (200 + r1 * Math.sin(a)).toFixed(2),
    y1: (200 - r1 * Math.cos(a)).toFixed(2),
    x2: (200 + r2 * Math.sin(a)).toFixed(2),
    y2: (200 - r2 * Math.cos(a)).toFixed(2),
    long,
  };
});

export default function TarotReadingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ───────────── HERO ───────────── */}
      <section className="relative isolate h-[88vh] min-h-[620px] w-full overflow-hidden">
        <div className="v-settle absolute inset-0 -z-20">
          <Image
            src="/images/services/tarotcards.jpg"
            alt="Tarot cards spread on a table"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink-mid/60 to-ink/25" />
        <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />

        {/* Mystic wheel ornament (decorative) */}
        <div aria-hidden className="pointer-events-none absolute right-[5%] top-1/2 hidden -translate-y-1/2 opacity-60 lg:block">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
            <g className="v-spin-r text-gold" stroke="currentColor">
              <circle cx="200" cy="200" r="190" strokeOpacity="0.5" />
              <circle cx="200" cy="200" r="150" strokeOpacity="0.35" strokeDasharray="2 8" />
              {rays.map((r, n) => (
                <line key={n} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} strokeOpacity={r.long ? 0.85 : 0.4} strokeWidth={r.long ? 1.5 : 1} />
              ))}
            </g>
            <g className="text-accent" stroke="currentColor">
              <circle cx="200" cy="200" r="110" strokeOpacity="0.45" />
              <circle cx="200" cy="200" r="70" strokeOpacity="0.3" />
              {/* eight-point star */}
              <path d="M200 110 L212 188 L290 200 L212 212 L200 290 L188 212 L110 200 L188 188 Z" strokeOpacity="0.7" fill="currentColor" fillOpacity="0.1" />
              <path d="M200 136 L207 193 L264 200 L207 207 L200 264 L193 207 L136 200 L193 193 Z" strokeOpacity="0.5" transform="rotate(45 200 200)" />
            </g>
            <g className="text-gold" fill="currentColor">
              <circle cx="200" cy="200" r="5" />
              <circle className="v-twinkle" cx="90" cy="95" r="2.5" style={d(0)} />
              <circle className="v-twinkle" cx="318" cy="110" r="2" style={d(1)} />
              <circle className="v-twinkle" cx="330" cy="305" r="2.5" style={d(2)} />
              <circle className="v-twinkle" cx="72" cy="290" r="2" style={d(0.6)} />
            </g>
          </svg>
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-16 lg:px-10">
            <div className="v-hero-in mb-5 flex flex-wrap items-center gap-3" style={d(0.1)}>
              <IndexTab code="TR" index={0} className="border-ivory/40 text-ivory" />
              <span className="index-tab inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs text-ivory backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" style={{ boxShadow: "0 0 10px var(--color-accent)" }} />
                TAROT CARD READING
              </span>

            </div>

            <h1
              className="v-hero-in mb-5 max-w-3xl font-display text-4xl font-light leading-tight text-ivory sm:text-5xl lg:text-6xl"
              style={d(0.25)}
            >
              You already have the question.{" "}
              <span className="bg-gradient-to-r">
                Let&apos;s explore it from a different perspective.
              </span>
            </h1>

            <p className="v-hero-in mb-9 max-w-xl text-lg leading-relaxed text-ivory/80" style={d(0.4)}>
              There are moments when you keep going back to the same question.
            </p>

            <div className="v-hero-in flex flex-wrap gap-4" style={d(0.55)}>
              <Link href="/appointment" className={goldBtn}>
                <span className={shine} />
                <span className="relative">Book a Tarot Card Session</span>
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
      <section className="relative overflow-hidden bg-ink py-12 text-ivory">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 text-center lg:px-10">
          {stats.map((stat, n) => (
            <div key={stat.label} className="v-reveal" style={i(n)}>
              <p className="font-display text-3xl text-gold-soft md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ivory/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── THE QUESTIONS + INTRO ───────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
            {/* Image */}
            <div className="v-reveal lg:col-span-5">
              <div className="group relative mb-6 lg:mb-0">
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border border-accent/60 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line shadow-[0_30px_70px_-30px_var(--color-ink)]">
                  <Image
                    src="/images/services/tarot-card.jpg"
                    alt="Close-up of tarot cards"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-mid/50 to-transparent" />
                </div>
                <span className="absolute -bottom-4 left-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white shadow-xl">
                  <span className="v-pulse h-2 w-2 rounded-full bg-gold" />
                  30-minute session
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7">
              <div className="v-reveal">
                <span className="accent-line mb-4" />
                <p className="index-tab mb-6 mt-4 text-xs text-gold-deep">THE QUESTIONS WE CARRY</p>
              </div>

              <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {questions.map((q, n) => (
                  <div
                    key={q}
                    className="v-reveal group relative overflow-hidden rounded-xl border border-line bg-white/80 p-5 pl-6 shadow-sm backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_40px_-20px_var(--color-accent)]"
                    style={i(n)}
                  >
                    <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-gold transition-all duration-500 group-hover:w-1.5" />
                    <p className="font-display text-lg italic leading-snug text-charcoal">&ldquo;{q}&rdquo;</p>
                  </div>
                ))}
              </div>

              <div className="v-reveal" style={i(2)}>
                <h2 className="mb-5 font-display text-3xl font-light leading-tight text-charcoal md:text-4xl">
                  A Tarot Card session is{" "}
                  <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text text-transparent">
                    a space to pause and explore those questions.
                  </span>
                </h2>
                <p className="text-lg leading-relaxed text-charcoal/70">
                  Rituu uses Tarot Card as a tool for insight and reflection, helping you look at your
                  situation from another perspective and identify what may need your attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── COME WITH YOUR QUESTION ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-mid to-ink py-24">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="v-reveal mb-14 text-center">
            <p className="index-tab mb-4 text-xs text-gold">THE SCOPE</p>
            <h2 className="font-display text-3xl font-light leading-tight text-white md:text-5xl">Come With Your Question</h2>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden>
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/80" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/80" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((t, n) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.title}
                  className="v-reveal group relative rounded-2xl bg-gradient-to-b from-gold/60 via-accent/30 to-gold/10 p-px transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_70px_-20px_var(--color-accent)]"
                  style={i(n)}
                >
                  <div className="relative flex h-full min-h-[340px] flex-col items-center overflow-hidden rounded-2xl bg-gradient-to-b from-ink-mid to-ink px-6 pb-8 pt-7 text-center">
                    {/* inner tarot-card border */}
                    <div aria-hidden className="absolute inset-3 rounded-xl border border-gold/20 transition-colors duration-500 group-hover:border-gold/60" />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(240px_circle_at_50%_30%,color-mix(in_srgb,var(--color-accent)_28%,transparent),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <span className="relative font-display text-sm tracking-[0.4em] text-gold">{t.numeral}</span>
                    <div className="relative mb-6 mt-6 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent to-gold text-ink shadow-[0_10px_30px_-8px_var(--color-accent)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                      <Icon size={26} strokeWidth={1.75} />
                    </div>
                    <h3 className="relative mb-3 font-display text-lg uppercase tracking-[0.18em] text-white">{t.title}</h3>
                    <span aria-hidden className="relative mb-3 h-px w-10 bg-gold/60 transition-all duration-500 group-hover:w-20" />
                    <p className="relative text-sm leading-relaxed text-white/70">{t.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── THE SESSION ───────────── */}
      <section className="relative overflow-hidden border-y border-line bg-ivory-deep py-24">
        <div aria-hidden className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="v-reveal mb-16 text-center">
            <p className="index-tab mb-4 text-xs text-gold-deep">THE PROCESS</p>
            <h2 className="font-display text-3xl font-light leading-tight text-charcoal md:text-5xl">
              The{" "}
              <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text text-transparent">Session</span>
            </h2>
          </div>

          <div className="relative grid grid-cols-2 gap-6 md:grid-cols-4">
            <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-[52px] hidden h-[2px] bg-line md:block">
              <div className="v-line h-full bg-gradient-to-r from-accent to-gold" />
            </div>

            {steps.map((step, n) => (
              <div
                key={step.number}
                className="v-reveal group relative rounded-2xl border border-transparent p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:bg-white hover:shadow-[0_24px_60px_-24px_var(--color-accent)]"
                style={i(n)}
              >
                <div className="relative z-10 mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent to-gold font-display text-lg text-ink shadow-[0_10px_30px_-8px_var(--color-accent)] ring-8 ring-ivory-deep transition-all duration-500 group-hover:scale-110 group-hover:ring-white">
                  {step.number}
                </div>
                <h3 className="font-display text-xl text-charcoal md:text-2xl">{step.title}</h3>
                {n < steps.length - 1 && (
                  <ArrowRight aria-hidden size={18} className="mx-auto mt-4 text-gold-deep md:hidden" />
                )}
              </div>
            ))}
          </div>

          {/* Closing statement */}
          <div className="v-reveal relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink px-8 py-12 text-center shadow-[0_30px_80px_-35px_var(--color-ink)]">
            <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-gold/25 blur-3xl" />
            <p className="relative font-display text-2xl font-light leading-snug text-white md:text-3xl">The cards provide the perspective.</p>
            <p className="relative font-display text-2xl font-light leading-snug text-white md:text-3xl">
              <span className="bg-gradient-to-r">
                You decide what you do with it.
              </span>
            </p>
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
              My tarot card reading with Rituu was direct and specific. I left with an actual plan, not
              just nice words.
            </p>
            <div className="mb-2 flex justify-center gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, n) => (
                <Star key={n} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-xs uppercase tracking-wide text-charcoal/50">Arjun S.</p>
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
      quote:"My tarot card reading with Rituu was direct and specific. I left with an actual plan, not just nice words.",
      name: "Arjun S.",
      role: "Tarot card",
      rating: 5,
    },
    
  ]}
/>

      {/* ───────────── FINAL CTA ───────────── */}
      <section className="relative overflow-hidden py-28">
        <Image src="/images/services/tarotcards.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-ink/95 via-ink-mid/90 to-ink/95" />
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />

        <div className="v-reveal relative mx-auto max-w-2xl px-6 text-center lg:px-10">
          <p className="index-tab mb-4 text-xs text-gold">FROM ₹99 · BOOK IN 2 MINUTES</p>
          <h2 className="mb-9 font-display text-3xl font-light leading-tight text-ivory sm:text-5xl">
            What question have you been{" "}
            <span className="bg-gradient-to-r">carrying?</span>
          </h2>
          <Link href="/appointment" className={goldBtn}>
            <span className={shine} />
            <span className="relative">Book a Tarot Card Session</span>
            <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}