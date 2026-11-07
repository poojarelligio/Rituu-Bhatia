import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, House, MapPin, MessageCircle, Search, Sparkles, Star } from "lucide-react";
import IndexTab from "@/components/ui/IndexTab";
import { getStaticServiceBySlug } from "@/lib/staticServices";
import TestimonialSlider from "@/components/site/TestimonialSlider";

export const metadata: Metadata = {
  title: "Vaastu Consultation",
  description:
    "Your space influences the way you experience it. Book a practical Vaastu consultation with Rituu Bhatia.",
};

/* ------------------------------------------------------------------
   Animations are pure CSS (no client JS), so this stays ONE server file
   and `metadata` keeps working. Scroll-reveal uses CSS scroll-driven
   animations; browsers that don't support them simply show the content.
------------------------------------------------------------------- */
const css = `
@keyframes v-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes v-settle  { from { transform: scale(1.12); } to { transform: scale(1); } }
@keyframes v-spin    { to { transform: rotate(360deg); } }
@keyframes v-draw    { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes v-pulse   { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-gold) 45%, transparent); } 50% { box-shadow: 0 0 0 14px transparent; } }

.v-hero-in { opacity: 0; animation: v-fade-up .9s ease-out forwards; animation-delay: var(--d, 0s); }
.v-settle  { animation: v-settle 2.4s ease-out both; }
.v-spin    { animation: v-spin 140s linear infinite; }
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
  .v-hero-in, .v-reveal, .v-settle, .v-spin, .v-pulse, .v-line { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`;

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;
const i = (n: number) => ({ "--i": n }) as React.CSSProperties;

const goldBtn =
  "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-10px_var(--color-gold)]";
const shine =
  "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full";

const explore = [
  { icon: House, number: "01", title: "Home", text: "Creating greater harmony in your living environment." },
  { icon: Building2, number: "02", title: "Office & Business", text: "Exploring the energy and layout of your workplace." },
  { icon: MapPin, number: "03", title: "New Property", text: "Guidance while evaluating or planning a new space." },
  { icon: Search, number: "04", title: "Existing Space", text: "Identifying areas that may need attention or correction." },
];

const steps = [
  { number: "01", title: "Understand", text: "Your concern, property and objectives." },
  { number: "02", title: "Assess", text: "Study the relevant Vaastu aspects of the space." },
  {
    number: "03",
    title: "Guide",
    text: "Discuss observations and recommendations.",
    note: "Without structural demolition",
  },
  {
    number: "04",
    title: "Implement",
    text: "Receive practical steps that can be considered for your space.",
    note: "Including remedy installations",
  },
];

// Compass ticks (static, computed once)
const ticks = Array.from({ length: 72 }, (_, n) => {
  const a = (n * 5 * Math.PI) / 180;
  const long = n % 9 === 0;
  const r2 = long ? 168 : 180;
  return {
    x1: (200 + 190 * Math.sin(a)).toFixed(2),
    y1: (200 - 190 * Math.cos(a)).toFixed(2),
    x2: (200 + r2 * Math.sin(a)).toFixed(2),
    y2: (200 - r2 * Math.cos(a)).toFixed(2),
    long,
  };
});

export default function VaastuPage() {
  const service = getStaticServiceBySlug("vaastu");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ───────────── HERO ───────────── */}
      <section className="relative isolate h-[88vh] min-h-[620px] w-full overflow-hidden">
        <div className="v-settle absolute inset-0 -z-20">
          <Image
            src="/images/services/vaastu.jpg"
            alt="Vaastu consultation - home layout analysis"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink-mid/55 to-ink/25"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-accent/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-violet/30 blur-3xl"
        />

        {/* Rotating compass (decorative) */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[5%] top-1/2 hidden -translate-y-1/2 opacity-60 lg:block"
        >
          <svg className="v-spin" width="400" height="400" viewBox="0 0 400 400" fill="none">
            <g className="text-gold" stroke="currentColor">
              <circle cx="200" cy="200" r="190" strokeOpacity="0.55" />
              <circle cx="200" cy="200" r="150" strokeOpacity="0.35" strokeDasharray="2 8" />
              {ticks.map((t, n) => (
                <line
                  key={n}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  strokeOpacity={t.long ? 0.9 : 0.4}
                  strokeWidth={t.long ? 1.5 : 1}
                />
              ))}
              <path d="M200 70 L210 200 L200 330 L190 200 Z" strokeOpacity="0.55" fill="currentColor" fillOpacity="0.08" />
              <circle cx="200" cy="200" r="5" fill="currentColor" />
            </g>
            <g className="text-accent" stroke="currentColor">
              <circle cx="200" cy="200" r="105" strokeOpacity="0.4" />
              <path d="M70 200 L200 190 L330 200 L200 210 Z" strokeOpacity="0.55" fill="currentColor" fillOpacity="0.08" />
            </g>
            <g className="text-gold" fill="currentColor" fontSize="15" textAnchor="middle" fontFamily="serif">
              <text x="200" y="58">N</text>
              <text x="350" y="205">E</text>
              <text x="200" y="352">S</text>
              <text x="50" y="205">W</text>
            </g>
          </svg>
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-16 lg:px-10">
            <div className="v-hero-in mb-5 flex flex-wrap items-center gap-3" style={d(0.1)}>
              <IndexTab code={service?.code || "VA"} index={0} className="border-ivory/40 text-ivory" />
              <span className="index-tab inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs text-ivory backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" style={{ boxShadow: "0 0 10px var(--color-accent)" }} />
                VAASTU CONSULTATION
              </span>
            </div>

            <h1
              className="v-hero-in mb-5 max-w-3xl font-display text-4xl font-light leading-tight text-ivory sm:text-5xl lg:text-6xl"
              style={d(0.25)}
            >
              Your space influences{" "}
              <span className="bg-gradient-to-r">
                the way you experience it.
              </span>
            </h1>

            <p className="v-hero-in mb-9 max-w-xl text-lg leading-relaxed text-ivory/80" style={d(0.4)}>
              We spend our lives inside spaces — our homes, offices, businesses and workplaces.
            </p>

            <div className="v-hero-in flex flex-wrap gap-4" style={d(0.55)}>
              <Link href="/appointment" className={goldBtn}>
                <span className={shine} />
                <span className="relative">Book a Vaastu Consultation</span>
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
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 px-6 text-center lg:px-10">
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
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
            <div className="v-reveal lg:col-span-6">
              <span className="accent-line mb-4" />
              <p className="index-tab mb-4 mt-4 text-xs text-gold-deep">ABOUT THE PRACTICE</p>
              <h2 className="mb-6 font-display text-3xl font-light leading-tight text-charcoal md:text-4xl">
                Sometimes a space feels naturally comfortable.{" "}
                <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text text-transparent">
                  Sometimes, despite everything looking right, something just doesn&apos;t feel right.
                </span>
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-charcoal/70">
                Vaastu offers a traditional framework for understanding the relationship between space,
                direction, elements and energy.
              </p>
              <p className="text-lg leading-relaxed text-charcoal/70">
                Rituu brings this practice into a practical consultation designed around your actual
                space and your specific concerns.
              </p>
            </div>

            <div className="v-reveal lg:col-span-6" style={i(2)}>
              <div className="group relative mt-6">
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border border-gold/60 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"
                />
                <div className="relative aspect-[4/4] overflow-hidden rounded-2xl border border-line shadow-[0_30px_70px_-30px_var(--color-ink)]">
                  <Image
                    src="/images/services/vaastu-consultation.jpg"
                    alt="Home layout analysis"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
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

      {/* ───────────── WHAT CAN WE EXPLORE ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-ink-mid to-ink py-24">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="v-reveal mb-14 text-center">
            <p className="index-tab mb-4 text-xs text-gold">THE SCOPE</p>
            <h2 className="font-display text-3xl font-light leading-tight text-white md:text-5xl">What Can We Explore?</h2>
            <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden>
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/80" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/80" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {explore.map((item, n) => {
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
                    {item.number}
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

      {/* ───────────── HOW THE CONSULTATION WORKS ───────────── */}
      <section className="relative overflow-hidden border-y border-line bg-ivory-deep py-24">
        <div aria-hidden className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="v-reveal mb-16 text-center">
            <p className="index-tab mb-4 text-xs text-gold-deep">THE PROCESS</p>
            <h2 className="font-display text-3xl font-light leading-tight text-charcoal md:text-5xl">
              How the Consultation{" "}
              <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text text-transparent">Works</span>
            </h2>
          </div>

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* connecting line – draws itself while scrolling */}
            <div
  aria-hidden
  className="absolute left-[16.66%] right-[16.66%] top-[52px] hidden h-[2px] bg-line md:block"
>
  <div className="v-line h-full bg-gradient-to-r from-accent to-gold" />
</div>

            {steps.slice(0, 3).map((step, n) => (
              <div
                key={step.number}
                className="v-reveal group relative rounded-2xl border border-transparent p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:bg-white hover:shadow-[0_24px_60px_-24px_var(--color-accent)]"
                style={i(n)}
              >
                <div className="relative z-10 mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent to-gold font-display text-lg text-ink shadow-[0_10px_30px_-8px_var(--color-accent)] ring-8 ring-ivory-deep transition-all duration-500 group-hover:scale-110 group-hover:ring-white">
                  {step.number}
                </div>
                <h3 className="mb-2 font-display text-2xl text-charcoal">{step.title}</h3>
                <p className="text-sm leading-relaxed text-charcoal/65">{step.text}</p>
                {step.note && (
                  <p className="mt-4 inline-flex rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent-deep">
                    {step.note}
                  </p>
                )}
              </div>
            ))}
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
              Rituu&apos;s Vaastu consultation completely changed how I think about my home. She gave me
              simple changes that made a real difference.
            </p>
            <div className="mb-2 flex justify-center gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, n) => (
                <Star key={n} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-xs uppercase tracking-wide text-charcoal/50">Meera S.</p>
          </div>
        </div>
      </section> */}
      {/* ───────────── TESTIMONIAL ───────────── */}

<TestimonialSlider
  eyebrow="VAASTU CLIENT EXPERIENCES"
  title="Stories of Harmony & Transformation"
  autoplaySpeed={3000}
  testimonials={[
    {
      id: 1,
      quote:
        "Rituu's Vaastu consultation completely changed how I think about my home. She gave me simple, practical changes that made a real difference.",
      name: "Meera S.",
      role: "Vaastu Consultation",
      rating: 5,
    },
    
  ]}
/>


      {/* ───────────── FINAL CTA ───────────── */}
      <section className="relative overflow-hidden py-28">
        <Image src="/images/services/vaastu-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-ink/95 via-ink-mid/90 to-ink/95" />
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-violet/30 blur-3xl" />

        <div className="v-reveal relative mx-auto max-w-2xl px-6 text-center lg:px-10">
          <p className="index-tab mb-4 text-xs text-gold">FROM ₹99 · 30-MINUTE SESSION</p>
          <h2 className="mb-5 font-display text-3xl font-light leading-tight text-ivory sm:text-5xl">
            Ready to look at your space{" "}
            <span className="bg-gradient-to-r">differently?</span>
          </h2>
          <p className="mx-auto mb-9 flex max-w-md items-start justify-center gap-2 text-base leading-relaxed text-ivory/70">
            <MessageCircle size={16} className="mt-1 shrink-0 text-gold" />
            <span>
              In a focused 30-minute call, you get clear, direct answers to your questions — plus a
              short list of changes you can act on right away.
            </span>
          </p>
          <Link href="/appointment" className={goldBtn}>
            <span className={shine} />
            <span className="relative">Book Your Vaastu Consultation Appointment</span>
            <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}