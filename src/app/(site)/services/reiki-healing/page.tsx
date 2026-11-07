import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Link2, Moon, Pause, Sparkles, Star, Waves } from "lucide-react";
import IndexTab from "@/components/ui/IndexTab";
import { getStaticServiceBySlug } from "@/lib/staticServices";
import TestimonialSlider from "@/components/site/TestimonialSlider";

export const metadata: Metadata = {
  title: "Reiki Sessions",
  description:
    "Create a little space to pause, breathe and reconnect. Book a guided Reiki session with Rituu Bhatia.",
};

/* Animations are pure CSS (no client JS) so this stays ONE server file
   and `metadata` keeps working. Scroll-reveal uses CSS scroll-driven
   animations; browsers without support simply show the content. */
const css = `
@keyframes v-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes v-settle  { from { transform: scale(1.12); } to { transform: scale(1); } }
@keyframes v-spin    { to { transform: rotate(360deg); } }
@keyframes v-draw    { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes v-breathe { 0%,100% { transform: scale(.94); opacity: .45; } 50% { transform: scale(1.06); opacity: 1; } }
@keyframes v-twinkle { 0%,100% { opacity: .3; } 50% { opacity: 1; } }
@keyframes v-pulse   { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-gold) 45%, transparent); } 50% { box-shadow: 0 0 0 14px transparent; } }

.v-hero-in { opacity: 0; animation: v-fade-up .9s ease-out forwards; animation-delay: var(--d, 0s); }
.v-settle  { animation: v-settle 2.4s ease-out both; }
.v-spin    { animation: v-spin 200s linear infinite; transform-origin: 200px 200px; }
.v-breathe { animation: v-breathe 7s ease-in-out infinite; animation-delay: var(--d, 0s); transform-box: fill-box; transform-origin: center; }
.v-breathe-html { animation: v-breathe 7s ease-in-out infinite; animation-delay: var(--d, 0s); }
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
  .v-hero-in, .v-reveal, .v-settle, .v-spin, .v-breathe, .v-breathe-html, .v-twinkle, .v-pulse, .v-line { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`;

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

const goldBtn =
  "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-10px_var(--color-gold)]";
const shine =
  "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full";

const moments = [
  { icon: Pause, title: "Pause", text: "Step away from everyday demands." },
  { icon: Link2, title: "Reconnect", text: "Bring attention back to yourself." },
  { icon: Waves, title: "Relax", text: "Experience a quiet, guided session." },
  { icon: Moon, title: "Reflect", text: "Create space for your inner journey." },
];

const steps = [
  { number: "01", title: "Connect" },
  { number: "02", title: "Relax" },
  { number: "03", title: "Receive" },
  { number: "04", title: "Reflect" },
];

// Lotus petals for the hero ornament (static)
const petals = Array.from({ length: 8 }, (_, n) => n * 45);

export default function ReikiHealingPage() {
  const service = getStaticServiceBySlug("reiki-healing");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ───────────── HERO ───────────── */}
      <section className="relative isolate h-[88vh] min-h-[620px] w-full overflow-hidden">
        <div className="v-settle absolute inset-0 -z-20">
          <Image
            src="/images/services/reiki.jpg"
            alt="Reiki session with Rituu Bhatia"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink-mid/65 to-ink/25" />
        <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-accent/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />

        {/* Breathing lotus ornament (decorative) */}
        <div aria-hidden className="pointer-events-none absolute right-[5%] top-1/2 hidden -translate-y-1/2 opacity-70 lg:block">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
            <g className="text-accent" stroke="currentColor">
              <circle className="v-breathe" cx="200" cy="200" r="190" strokeOpacity="0.5" style={d(0)} />
              <circle className="v-breathe" cx="200" cy="200" r="150" strokeOpacity="0.4" style={d(1.2)} />
              <circle className="v-breathe" cx="200" cy="200" r="110" strokeOpacity="0.35" style={d(2.4)} />
            </g>
            <g className="v-spin text-gold" stroke="currentColor">
              {petals.map((a) => (
                <ellipse
                  key={a}
                  cx="200"
                  cy="132"
                  rx="26"
                  ry="62"
                  transform={`rotate(${a} 200 200)`}
                  strokeOpacity="0.6"
                  fill="currentColor"
                  fillOpacity="0.07"
                />
              ))}
            </g>
            <g className="text-accent" stroke="currentColor">
              {petals.map((a) => (
                <ellipse
                  key={a}
                  cx="200"
                  cy="160"
                  rx="14"
                  ry="36"
                  transform={`rotate(${a + 22.5} 200 200)`}
                  strokeOpacity="0.55"
                  fill="currentColor"
                  fillOpacity="0.08"
                />
              ))}
            </g>
            <g className="text-gold" fill="currentColor">
              <circle cx="200" cy="200" r="6" />
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
              <IndexTab code={service?.code || "RE"} index={0} className="border-ivory/40 text-ivory" />
              <span className="index-tab inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs text-ivory backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" style={{ boxShadow: "0 0 10px var(--color-accent)" }} />
                REIKI
              </span>
            </div>

            <h1
              className="v-hero-in mb-5 max-w-3xl font-display text-4xl font-light leading-tight text-ivory sm:text-5xl lg:text-6xl"
              style={d(0.25)}
            >
              Create a little space to{" "}
              <span className="bg-gradient-to-r">
                pause, breathe and reconnect.
              </span>
            </h1>

            <p className="v-hero-in mb-9 max-w-xl text-lg leading-relaxed text-ivory/80" style={d(0.4)}>
              Life can leave very little room to simply stop.
            </p>

            <div className="v-hero-in flex flex-wrap gap-4" style={d(0.55)}>
              <Link href="/appointment" className={goldBtn}>
                <span className={shine} />
                <span className="relative">Book a Reiki Session</span>
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
              <p className="mb-6 font-display text-3xl font-light leading-snug text-charcoal md:text-4xl">
                Reiki is a{" "}
                <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text text-transparent">
                  traditional Japanese energy-based practice
                </span>{" "}
                that is experienced by many people as a calming and restorative session.
              </p>
              <p className="text-lg leading-relaxed text-charcoal/70">
                Rituu provides a guided space where you can step away from the noise, slow down and
                focus on yourself.
              </p>
            </div>

            <div className="v-reveal lg:col-span-6" style={i(2)}>
              <div className="group relative mt-6">
                <div
                  aria-hidden
                  className="v-breathe-html absolute -inset-5 rounded-[2rem] bg-accent/20 blur-2xl"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border border-accent/60 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"
                />
                <div className="relative aspect-[4/4] overflow-hidden rounded-2xl border border-line shadow-[0_30px_70px_-30px_var(--color-ink)]">
                  <Image
                    src="/images/services/reiki-session.jpg"
                    alt="Reiki session in progress"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-mid/45 to-transparent" />
                </div>
                <span className="absolute -bottom-4 left-6 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-white shadow-xl">
                  <span className="v-pulse h-2 w-2 rounded-full bg-gold" />
                  30-minute session
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── A SESSION CAN BE YOUR TIME TO… ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-mid to-ink py-24">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="v-reveal mb-14 text-center">
            <p className="index-tab mb-4 text-xs text-gold">THE SESSION</p>
            <h2 className="font-display text-3xl font-light leading-tight text-white md:text-5xl">
              A Session Can Be Your Time to&hellip;
            </h2>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden>
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/80" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/80" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {moments.map((m, n) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="v-reveal group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-7 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-accent/60 hover:shadow-[0_24px_60px_-20px_var(--color-accent)]"
                  style={i(n)}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(260px_circle_at_50%_0%,color-mix(in_srgb,var(--color-accent)_28%,transparent),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="relative">
                    <div className="relative mx-auto mb-6 grid h-16 w-16 place-items-center">
                      <span aria-hidden className="v-breathe-html absolute inset-0 rounded-full bg-accent/30 blur-md" style={d(n * 0.8)} />
                      <div className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent to-gold text-ink shadow-[0_10px_30px_-8px_var(--color-accent)] transition-transform duration-500 group-hover:scale-110">
                        <Icon size={26} strokeWidth={1.75} />
                      </div>
                    </div>
                    <h3 className="mb-2 font-display text-2xl uppercase tracking-[0.2em] text-white">{m.title}</h3>
                    <span aria-hidden className="mx-auto mb-3 block h-px w-10 bg-gold/60 transition-all duration-500 group-hover:w-20" />
                    <p className="text-sm leading-relaxed text-white/70">{m.text}</p>
                  </div>
                  <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-accent to-gold transition-all duration-700 group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── YOUR REIKI EXPERIENCE ───────────── */}
      <section className="relative overflow-hidden border-y border-line bg-ivory-deep py-24">
        <div aria-hidden className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="v-reveal mb-16 text-center">
            <p className="index-tab mb-4 text-xs text-gold-deep">THE PROCESS</p>
            <h2 className="font-display text-3xl font-light leading-tight text-charcoal md:text-5xl">
              Your Reiki{" "}
              <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text text-transparent">Experience</span>
            </h2>
          </div>

          <div className="relative grid grid-cols-2 gap-6 md:grid-cols-4">
            <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-[52px] hidden h-[2px] bg-line md:block">
              <div className="v-line h-full bg-gradient-to-r from-accent to-gold" />
            </div>

            {steps.map((step, n) => (
              <div
                key={step.number}
                className="v-reveal group relative rounded-2xl border border-transparent p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:border-accent/50 hover:bg-white hover:shadow-[0_24px_60px_-24px_var(--color-accent)]"
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

          {/* Individual / distance note */}
          <div className="v-reveal relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-3xl border border-accent/40 bg-white/80 px-8 py-8 text-center shadow-[0_30px_80px_-40px_var(--color-accent)] backdrop-blur">
            <p className="font-display text-xl leading-snug text-charcoal md:text-2xl">
              Sessions can be offered individually and, where appropriate, through distance sessions.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-charcoal/50">
              Reiki is offered as a wellbeing and relaxation practice and is not a substitute for medical care.
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
              I walked in completely drained and walked out feeling lighter than I have in months.
              Rituu has a very calm, healing presence.
            </p>
            <div className="mb-2 flex justify-center gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, n) => (
                <Star key={n} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-xs uppercase tracking-wide text-charcoal/50">Priya M.</p>
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
            quote:"I walked in completely drained and walked out feeling lighter than I have in months.Rituu has a very calm, healing presence.",
            name: "Priya M.",
            role: "reiki-healing",
            rating: 5,
          },
          
        ]}
      />

      {/* ───────────── FINAL CTA ───────────── */}
      <section className="relative overflow-hidden py-28">
        <Image src="/images/services/reiki-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-ink/95 via-ink-mid/90 to-ink/95" />
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />

        <div className="v-reveal relative mx-auto max-w-2xl px-6 text-center lg:px-10">
          <p className="index-tab mb-4 text-xs text-gold">30-MINUTE SESSION</p>
          <h2 className="mb-9 font-display text-3xl font-light leading-tight text-ivory sm:text-5xl">
            Sometimes, slowing down is{" "}
            <span className="bg-gradient-to-r">
              where the journey begins.
            </span>
          </h2>
          <Link href="/appointment" className={goldBtn}>
            <span className={shine} />
            <span className="relative">Book a Reiki Session </span>
            <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}