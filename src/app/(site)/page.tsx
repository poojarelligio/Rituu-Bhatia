import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import IndexTab from "@/components/ui/IndexTab";
import HeroCarousel from "@/components/site/HeroCarousel";
import TestimonialSlider from "@/components/site/TestimonialSlider";
import HappyClients from "@/components/site/HappyClients";
import VaastuHero from "@/components/site/VaastuHero";
import HoroscopeSection from "@/components/site/HoroscopeSection";
import { BookOpen, Hand, Sprout } from "lucide-react";
import {
  getPublishedCourses, getFeaturedTestimonials,
  getSuccessStories, getUpcomingEvents, getMediaFeatures,
} from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

/* ==================================================================
   ANIMATIONS — pure CSS, so the page stays a server component.
   • Scroll reveals use CSS scroll-driven animations (recent Chrome,
     Edge, Safari). Other browsers simply show the content.
   • Looping effects (float, shimmer, marquee, twinkle) work everywhere.
   • All motion is switched off for visitors who prefer reduced motion.
================================================================== */
const homeCss = `
@keyframes v-fade-up    { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: none; } }
@keyframes v-fade-left  { from { opacity: 0; transform: translateX(-48px); } to { opacity: 1; transform: none; } }
@keyframes v-fade-right { from { opacity: 0; transform: translateX(48px); } to { opacity: 1; transform: none; } }
@keyframes v-pop        { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: none; } }
@keyframes v-blur-in    { from { opacity: 0; filter: blur(14px); transform: translateY(22px); } to { opacity: 1; filter: none; transform: none; } }
@keyframes v-draw       { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes v-drift      { from { transform: translate3d(0, -70px, 0); } to { transform: translate3d(0, 70px, 0); } }
@keyframes v-float      { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes v-shimmer    { to { background-position: 200% center; } }
@keyframes v-marquee    { to { transform: translateX(-50%); } }
@keyframes v-twinkle    { 0%, 100% { opacity: .25; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes v-ring       { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-gold) 55%, transparent); } 100% { box-shadow: 0 0 0 18px transparent; } }

.v-float   { animation: v-float 8s ease-in-out infinite; animation-delay: var(--d, 0s); }
.v-twinkle { animation: v-twinkle 3.4s ease-in-out infinite; animation-delay: var(--d, 0s); }
.v-ring    { animation: v-ring 2.4s ease-out infinite; }
.v-marquee { display: flex; width: max-content; animation: v-marquee 45s linear infinite; }
.v-marquee-wrap:hover .v-marquee { animation-play-state: paused; }

/* Gradient headline words that slowly shimmer */
.v-grad-text {
  background-image: linear-gradient(90deg, var(--color-charcoal), var(--color-violet), var(--color-gold-deep), var(--color-violet), var(--color-charcoal));
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: v-shimmer 9s linear infinite;
}
.v-grad-gold {
  background-image: linear-gradient(90deg, var(--color-gold-soft), var(--color-gold), var(--color-gold-deep), var(--color-gold), var(--color-gold-soft));
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: v-shimmer 7s linear infinite;
}

@supports (animation-timeline: view()) {
  .v-reveal, .v-left, .v-right, .v-pop, .v-blur {
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: view();
    animation-range: entry calc(var(--i, 0) * 7%) entry calc(36% + var(--i, 0) * 7%);
  }
  .v-reveal { animation-name: v-fade-up; }
  .v-left   { animation-name: v-fade-left; }
  .v-right  { animation-name: v-fade-right; }
  .v-pop    { animation-name: v-pop; }
  .v-blur   { animation-name: v-blur-in; }
  .v-draw {
    transform-origin: left;
    animation: v-draw linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 40%;
  }
  .v-drift {
    animation: v-drift linear both;
    animation-timeline: view();
    animation-range: cover;
  }
}

@media (prefers-reduced-motion: reduce) {
  .v-reveal, .v-left, .v-right, .v-pop, .v-blur, .v-draw, .v-drift,
  .v-float, .v-twinkle, .v-ring, .v-marquee, .v-grad-text, .v-grad-gold {
    animation: none !important; opacity: 1 !important; transform: none !important; filter: none !important;
  }
  .v-grad-text, .v-grad-gold { background-position: 0 center; }
}
`;

const idx = (n: number) => ({ "--i": n }) as CSSProperties;
const dly = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M12 0 C12.8 7.5 16.5 11.2 24 12 C16.5 12.8 12.8 16.5 12 24 C11.2 16.5 7.5 12.8 0 12 C7.5 11.2 11.2 7.5 12 0Z" />
    </svg>
  );
}

// Twinkling sparkles scattered on dark sections
const sparklePoints = [
  { top: "10%", left: "6%", size: 12, d: 0 },
  { top: "22%", left: "88%", size: 14, d: 0.8 },
  { top: "72%", left: "12%", size: 10, d: 1.4 },
  { top: "84%", left: "80%", size: 12, d: 0.4 },
  { top: "48%", left: "50%", size: 9, d: 2 },
  { top: "14%", left: "46%", size: 10, d: 1.1 },
];

function Sparkles() {
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

const marqueeWords = ["Uncomfortable Spaces", "Vaastu", "Emotional Imbalance", "Reiki Healing", "Clarity & Direction", "Tarot Card Reading", "Life & Career Questions","Astrology"];

const homeServices = [
  {
    href: "/services/tarot-reading",
    code: "TR",
    title: "Tarot Card Reading",
    image: "/images/home/tarot-portrait.jpg",
    alt: "Tarot Card Reading with Rituu Bhatia",
    text: "Use the cards as a tool for reflection, clarity and direction.",
  },
  {
    href: "/services/vaastu",
    code: "VA",
    title: "Vaastu Consultation",
    image: "/images/home/vaastu-portrait.jpg",
    alt: "Vaastu Consultation with Rituu Bhatia",
    text: "Bring greater harmony to the spaces you live and work in.",
  },
  {
    href: "/services/astrology",
    code: "AS",
    title: "Astrology Reading",
    image: "/images/home/astrology-portrait.jpg",
    alt: "Astrology Reading with Rituu Bhatia",
    text: "Understand the patterns, possibilities and cycles reflected in your birth chart.",
  },
  {
    href: "/services/reiki-healing",
    code: "RE",
    title: "Reiki Healing",
    image: "/images/home/reiki-portrait.jpg",
    alt: "Reiki Healing with Rituu Bhatia",
    text: "Experience a guided practice focused on balance, relaxation and wellbeing.",
  },
];

const journeySteps = [
  { step: "LEARN", body: "Understand the principles and foundations.", icon: BookOpen },
  { step: "PRACTISE", body: "Apply what you learn through guided sessions.", icon: Hand },
  { step: "GROW", body: "Build confidence through continued practice.", icon: Sprout },
];

const goldBtn =
  "group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-10px_var(--color-gold)]";
const inkBtn =
  "group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-mid hover:shadow-[0_14px_40px_-12px_var(--color-ink)]";
const shine =
  "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full";

const pill =
  "index-tab mb-5 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 text-xs uppercase text-gold-deep backdrop-blur";
const pillDark =
  "index-tab mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs uppercase text-gold-soft backdrop-blur-md";

export default async function HomePage() {
  const [courses, testimonials, stories, events, mediaFeatures] = await Promise.all([
    getPublishedCourses(),
    getFeaturedTestimonials(4),
    getSuccessStories(),
    getUpcomingEvents(3),
    getMediaFeatures(),
  ]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: homeCss }} />

      {/* Hero */}
      <HeroCarousel />

      {/* ───────────── Scrolling keyword strip ───────────── */}
      <div className="v-marquee-wrap relative overflow-hidden border-y border-gold/30 bg-ink py-4">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
        <div className="v-marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {marqueeWords.map((w) => (
                <span key={`${copy}-${w}`} className="flex items-center">
                  <span className="px-8 font-display text-lg font-light uppercase tracking-[0.3em] text-gold-soft sm:text-xl">{w}</span>
                  <Sparkle className="h-3.5 w-3.5 text-gold" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────── Services – poster cards ───────────────────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-24">
        {/* floating orbs with scroll parallax */}
        <div aria-hidden className="v-drift pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="v-drift pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute right-[12%] top-24 -z-10 h-3 w-3 rounded-full bg-gold/70 blur-[1px]" />
        <div aria-hidden className="v-float pointer-events-none absolute left-[8%] top-[60%] -z-10 h-2 w-2 rounded-full bg-violet/60" style={dly(2)} />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-14 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="v-blur max-w-2xl">
              <p className={pill}>
                <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
                THE PRACTICE
              </p>
              <h2 className="mb-5 font-display text-3xl font-light leading-tight text-charcoal sm:text-5xl">
                Clarity for <span className="v-grad-text">the questions that matter to you</span>
              </h2>
              <div className="v-draw mb-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-gold-soft to-gold" />
              <p className="leading-relaxed text-charcoal/65">
                Every person’s journey is unique, and so are their questions and needs. Through Vaastu,
                Astrology, Tarot Card Reading and Reiki, Rituu offers personalised guidance to help you
                find clarity and perspective in your home, career, relationships, business and personal
                life.
              </p>
            </div>
            <div className="v-right">
              <Button href="/services" variant="ghost" className="sm:mb-2">
                Explore Consultations →
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homeServices.map((s, n) => (
              <Link
                key={s.href}
                href={s.href}
                style={idx(n)}
                className="v-reveal group relative isolate block aspect-[3/4.3] overflow-hidden rounded-2xl shadow-[0_20px_50px_-25px_var(--color-ink)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_36px_80px_-24px_var(--color-gold)]"
              >
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="-z-20 object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
                />
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink/45 to-ink/5 transition-opacity duration-500 group-hover:via-ink/60" />
                <div aria-hidden className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15 transition-all duration-500 group-hover:ring-2 group-hover:ring-gold/70" />
                <div aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                  <span className="index-tab rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] text-ivory backdrop-blur-md">
                    {s.code}
                  </span>
                  {/* <span className="rounded-full bg-gradient-to-br from-gold-soft to-gold px-3 py-1 text-[11px] font-semibold text-ink shadow-[0_6px_20px_-6px_var(--color-gold)] transition-transform duration-500 group-hover:scale-110">
                    ₹99
                  </span> */}
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="index-tab mb-3 text-[10px] uppercase tracking-[0.2em] text-gold-soft">30 min</p>
                  <h3 className="mb-3 font-display text-2xl leading-tight text-ivory">{s.title}</h3>
                  <span className="mb-3 block h-[3px] w-10 rounded-full bg-gradient-to-r from-gold-soft to-gold transition-all duration-500 group-hover:w-24" />
                  <p className="text-sm leading-relaxed text-ivory/75">{s.text}</p>
                  <span className="mt-4 inline-flex translate-y-0 items-center gap-2 text-sm font-medium text-gold-soft opacity-100 transition-all duration-500 lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                    Book Your Session Now
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Success stories ───────────────────────── */}
      {stories.length > 0 && (
        <section className="relative isolate overflow-hidden bg-ivory-deep py-24">
          <div aria-hidden className="v-drift pointer-events-none absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
          <div aria-hidden className="v-drift pointer-events-none absolute -left-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-violet/15 blur-3xl" />

          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="v-blur mx-auto mb-14 max-w-2xl text-center">
              <p className={pill}>
                <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
                CASE FILES
              </p>
              <h2 className="mb-4 font-display text-3xl font-light leading-tight text-charcoal sm:text-5xl">
                Real questions, <span className="v-grad-text">real outcomes</span>
              </h2>
              <p className="leading-relaxed text-charcoal/65">A few of the situations clients brought to Rituu.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {stories.slice(0, 3).map((story, i) => (
                <Link
                  key={story.id}
                  href={`/success-stories/${story.slug}`}
                  style={idx(i)}
                  className="v-reveal group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white/80 p-8 shadow-[0_18px_40px_-28px_var(--color-ink)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_32px_70px_-28px_var(--color-gold)]"
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-soft via-gold to-violet transition-transform duration-700 group-hover:scale-x-100" />
                  <span aria-hidden className="pointer-events-none absolute -right-4 -top-6 font-display text-[7rem] leading-none text-gold/15 transition-all duration-500 group-hover:-translate-y-1 group-hover:text-gold/30">
                    &ldquo;
                  </span>
                  <IndexTab code="SS" index={i} className="relative mb-5 self-start" />
                  <p className="relative mb-6 font-display text-lg leading-snug text-charcoal">{story.summary}</p>
                  <span className="relative mt-auto inline-flex items-center gap-2 text-xs font-medium text-gold-deep">
                    Read the full story
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Daily Horoscope */}
      <HoroscopeSection />

      {/* ───────────────────────── Learn – two paths ───────────────────────── */}
      {(events.length > 0 || courses.length > 0) && (
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-24 lg:py-28">
          <div aria-hidden className="v-drift pointer-events-none absolute -right-32 top-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-gold/20 blur-3xl" />
          <div aria-hidden className="v-drift pointer-events-none absolute -left-32 bottom-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-violet/20 blur-3xl" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            {/* Header */}
            <div className="v-blur mx-auto mb-16 max-w-3xl text-center lg:mb-20">
              <p className={pill}>
                <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
                Go Deeper
              </p>
              <h2 className="mb-5 font-display text-4xl font-light leading-[1.15] text-charcoal sm:text-5xl">
                Two paths to <span className="v-grad-text italic">go beyond</span>
              </h2>
              <div className="mx-auto mb-5 flex items-center justify-center gap-3" aria-hidden>
                <span className="v-draw h-px w-14 origin-right bg-gradient-to-r from-transparent to-gold/80" />
                <Sparkle className="v-twinkle h-4 w-4 text-gold" />
                <span className="v-draw h-px w-14 bg-gradient-to-l from-transparent to-gold/80" />
              </div>
              <p className="mx-auto max-w-xl leading-relaxed text-charcoal/65">
                Experience the practice live, or learn it properly from the ground up.
              </p>
            </div>

            {/* Two panels */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              {/* LEFT: Learn Live */}
              <div className="v-left group relative isolate flex min-h-[560px] flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink text-ivory shadow-[0_30px_70px_-30px_var(--color-ink)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_44px_100px_-30px_var(--color-violet)]">
                <Image
                  src="/images/hero/hero-assessment.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="-z-20 object-cover opacity-25 transition-all duration-[1200ms] group-hover:scale-105 group-hover:opacity-35"
                />
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />
                <div aria-hidden className="v-float pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-violet/30 blur-3xl" />
                <div aria-hidden className="v-float pointer-events-none absolute -bottom-24 -left-16 -z-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" style={dly(3)} />
                <Sparkles />
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

                <span aria-hidden className="absolute right-7 top-5 font-display text-6xl leading-none text-transparent transition-transform duration-500 group-hover:-translate-y-1" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.25)" }}>
                  01
                </span>

                <div className="relative z-10 flex flex-1 flex-col p-8 lg:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                      <span className="v-ring h-2 w-2 rounded-full bg-gold" />
                    </div>
                    <p className="index-tab text-[11px] uppercase tracking-widest text-gold-soft">Learn Live</p>
                  </div>

                  <h3 className="mb-4 font-display text-3xl font-light leading-tight sm:text-4xl">
                    Don&apos;t just listen. <br />
                    <span className="v-grad-gold italic">Experience the practice.</span>
                  </h3>
                  <p className="mb-8 max-w-sm text-sm leading-relaxed text-ivory/70">
                    Step beyond online content through live workshops, interactive sessions and experiential learning, from introductory experiences to deeper guided practice.
                  </p>

                  <div className="mb-8 flex-1">
                    <p className="index-tab mb-4 text-[10px] uppercase tracking-widest text-ivory/40">Upcoming Sessions</p>
                    {events.length > 0 ? (
                      <div className="space-y-3">
                        {events.slice(0, 3).map((event) => (
                          <Link
                            key={event.id}
                            href={`/workshops-events/${event.slug}`}
                            className="group/item flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 backdrop-blur-md transition-all duration-300 hover:translate-x-1.5 hover:border-gold/60 hover:bg-white/10"
                          >
                            <div className="flex min-w-0 items-center gap-4">
                              <span className="index-tab shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-[10px] text-gold-soft">
                                {event.event_date?.split(",")[0] || event.event_date}
                              </span>
                              <p className="truncate text-sm text-ivory/90 transition-colors group-hover/item:text-gold-soft">{event.title}</p>
                            </div>
                            <span className="shrink-0 text-ivory/40 transition-all group-hover/item:translate-x-1 group-hover/item:text-gold-soft">→</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="py-4 text-sm italic text-ivory/50">New sessions announced soon.</p>
                    )}
                  </div>

                  <Link href="/workshops-events" className={`${goldBtn} self-start`}>
                    <span className={shine} />
                    <span className="relative">View Upcoming Events</span>
                    <span aria-hidden className="relative transition-transform group-hover/btn:translate-x-1">→</span>
                  </Link>
                </div>
              </div>

              {/* RIGHT: Learn the Practice */}
              <div className="v-right group relative isolate flex min-h-[560px] flex-col overflow-hidden rounded-3xl border border-gold/30 bg-white/80 shadow-[0_30px_70px_-35px_var(--color-gold)] backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_44px_100px_-35px_var(--color-gold)]">
                <Image
                  src="/images/hero/hero-courses.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="-z-20 object-cover opacity-10 transition-all duration-[1200ms] group-hover:scale-105 group-hover:opacity-[0.16]"
                />
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-ivory-deep/60 via-ivory/85 to-ivory" />
                <div aria-hidden className="v-float pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

                <span aria-hidden className="absolute right-7 top-5 font-display text-6xl leading-none text-transparent transition-transform duration-500 group-hover:-translate-y-1" style={{ WebkitTextStroke: "1px color-mix(in srgb, var(--color-gold) 55%, transparent)" }}>
                  02
                </span>

                <div className="relative z-10 flex flex-1 flex-col p-8 lg:p-10">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                      <span className="h-2 w-2 rounded-full bg-gold" />
                    </div>
                    <p className="index-tab text-[11px] uppercase tracking-widest text-gold-deep">Learn the Practice</p>
                  </div>

                  <h3 className="mb-4 font-display text-3xl font-light leading-tight text-charcoal sm:text-4xl">
                    Go beyond a consultation.
                    <br />
                    <span className="v-grad-text italic">Learn the practice yourself.</span>
                  </h3>
                  <p className="mb-8 max-w-sm text-sm leading-relaxed text-charcoal/70">
                    Explore structured courses in Vaastu, Tarot Card, Astrology, Reiki and related disciplines, with guided learning and practice for personal growth or a new professional path.
                  </p>

                  <div className="mb-8 flex-1">
                    <p className="index-tab mb-4 text-[10px] uppercase tracking-widest text-charcoal/40">Featured Courses</p>
                    {courses.length > 0 ? (
                      <div className="space-y-3">
                        {courses.slice(0, 3).map((course, i) => (
                          <Link
                            key={course.id}
                            href={`/courses/${course.slug}`}
                            className="group/item flex items-center justify-between gap-4 rounded-xl border border-line bg-white/80 px-4 py-3.5 transition-all duration-300 hover:translate-x-1.5 hover:border-gold/60 hover:bg-white hover:shadow-[0_14px_30px_-18px_var(--color-gold)]"
                          >
                            <div className="flex min-w-0 items-center gap-4">
                              <span className="index-tab shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-[10px] text-gold-deep">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <p className="truncate text-sm text-charcoal/85 transition-colors group-hover/item:text-gold-deep">{course.title}</p>
                            </div>
                            <span className="shrink-0 text-charcoal/30 transition-all group-hover/item:translate-x-1 group-hover/item:text-gold-deep">→</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="py-4 text-sm italic text-charcoal/50">New courses opening soon.</p>
                    )}
                  </div>

                  <Link href="/courses" className={`${inkBtn} self-start`}>
                    <span className={shine} />
                    <span className="relative">Explore Courses &amp; Training</span>
                    <span aria-hidden className="relative text-gold transition-transform group-hover/btn:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* The learning journey */}
            <div className="v-reveal relative isolate mt-20 overflow-hidden rounded-3xl lg:mt-24">
              <div aria-hidden className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/home/learning-journey-bg.jpg')" }} />
              <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-ink/85 via-ink-mid/80 to-ink/85" />
              <div aria-hidden className="v-float pointer-events-none absolute -left-16 -top-16 -z-10 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
              <div aria-hidden className="v-float pointer-events-none absolute -bottom-20 -right-16 -z-10 h-72 w-72 rounded-full bg-violet/30 blur-3xl" style={dly(2)} />
              <Sparkles />
              <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

              <div className="relative px-6 py-14 md:px-10">
                <div className="mb-14 flex items-center gap-6">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/50" />
                  <p className="whitespace-nowrap font-display text-lg font-light uppercase tracking-[0.25em] text-gold-soft sm:text-xl">
                    The Learning Journey
                  </p>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/50" />
                </div>

                <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-6">
                  {/* line draws itself as you scroll */}
                  <div aria-hidden className="absolute left-[16.6%] right-[16.6%] top-8 hidden h-px bg-gold/10 md:block">
                    <div className="v-draw h-full bg-gradient-to-r from-gold/20 via-gold to-gold/20" />
                  </div>

                  {journeySteps.map((item, n) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.step} className="group/step relative text-center">
                        <div style={idx(n)} className="v-pop relative z-10 mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-gold/60 bg-ink/80 text-gold shadow-[0_0_30px_-8px_var(--color-gold)] backdrop-blur transition-all duration-500 group-hover/step:scale-110 group-hover/step:bg-gold group-hover/step:text-ink">
                          <Icon size={26} strokeWidth={1.5} />
                        </div>
                        <div style={idx(n + 1)} className="v-reveal">
                          <p className="index-tab mb-3 text-[11px] uppercase tracking-widest text-gold-soft">{item.step}</p>
                          <p className="mx-auto max-w-[16rem] text-sm leading-relaxed text-ivory/80">{item.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Vaastu section */}
      <VaastuHero />

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <TestimonialSlider testimonials={testimonials} title="What our clients say" eyebrow="TESTIMONIALS" />
      )}

      {/* Videos / happy clients */}
      <HappyClients />

      {/* ───────────────────────── Media features ───────────────────────── */}
      {mediaFeatures.length > 0 && (
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-ink via-ink-mid to-ink py-24 text-ivory">
          <div aria-hidden className="v-float pointer-events-none absolute -left-24 top-0 -z-10 h-80 w-80 rounded-full bg-violet/30 blur-3xl" />
          <div aria-hidden className="v-float pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl" style={dly(3)} />
          <Sparkles />
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

          <div className="mx-auto max-w-5xl px-6 lg:px-10">
            <div className="v-blur mb-14 text-center">
              <p className={pillDark}>
                <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
                AS FEATURED IN
              </p>
              <h2 className="font-display text-3xl font-light leading-tight text-ivory sm:text-5xl">
                Media <span className="v-grad-gold">&amp; Recognition</span>
              </h2>
              <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden>
                <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/80" />
                <Sparkle className="v-twinkle h-4 w-4 text-gold" />
                <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/80" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {mediaFeatures.slice(0, 3).map((f, n) => (
                <a
                  key={f.id}
                  href={f.link || "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={idx(n)}
                  className="v-pop group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] p-7 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:bg-white/10 hover:shadow-[0_28px_70px_-28px_var(--color-gold)]"
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-soft via-gold to-violet transition-transform duration-700 group-hover:scale-x-100" />
                  <p className="index-tab mb-4 inline-block rounded-full bg-gold/15 px-3 py-1 text-[11px] uppercase text-gold-soft">{f.feature_type}</p>
                  <p className="mb-2 font-display text-lg leading-snug text-ivory">{f.title}</p>
                  <p className="text-xs text-ivory/55">{f.publication}</p>
                  <span aria-hidden className="mt-4 inline-block text-gold opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────────────────── Lead magnet ───────────────────────── */}
      <section className="relative isolate overflow-hidden border-y border-line py-28">
        <div
          aria-hidden
          className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat md:bg-fixed"
          style={{ backgroundImage: "url('/images/home/assessment-bg.jpg')" }}
        />
        <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-br from-ink/80 via-ink-mid/60 to-ink/80" />
        <div aria-hidden className="v-float pointer-events-none absolute -left-20 top-0 -z-10 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-violet/35 blur-3xl" style={dly(2.5)} />
        <Sparkles />

        <div className="v-blur relative z-10 mx-auto max-w-2xl px-6 text-center lg:px-10">
          <p className={pillDark}>
            <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
            FREE ASSESSMENT
          </p>
          <h2 className="mb-9 font-display text-3xl font-light leading-tight text-ivory sm:text-5xl">
            Discover what may be blocking your <span className="v-grad-gold">energy, prosperity &amp; growth.</span>
          </h2>
          <Link href="/assessment" className={`${goldBtn} v-ring`}>
            <span className={shine} />
            <span className="relative">Get Your Free Energy Assessment</span>
            <span aria-hidden className="relative transition-transform group-hover/btn:translate-x-1">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}