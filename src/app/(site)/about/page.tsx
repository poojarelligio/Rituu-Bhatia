import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import {
  Marquee,
  Sparkle,
  Sparkles,
  dly,
  goldBtn,
  idx,
  inkBtn,
  pill,
  pillDark,
  shine,
} from "@/components/ui/Decor";
import {
  ApproachExplorer,
  CountUp,
  PillarsExpand,
  TiltFrame,
} from "@/components/site/AboutClient";

export const metadata: Metadata = {
  title: "About Rituu Bhatia",
  description:
    "Meet Rituu Bhatia, a Spiritual Coach specialising in Astrology, Tarot Card, Vaastu and Reiki to guide you toward clarity, balance and personal growth.",
};

const CERTIFICATIONS = [
  "Certified Vaastu Consultant",
  "Certified Astrologer",
  "Certified Tarot Card Practitioner",
  "Certified Reiki Master",
];

const PILLARS = [
  {
    num: "01",
    icon: "compass" as const,
    title: "Listen Before You Guide",
    description: "Every session begins with understanding the person's actual question and circumstances.",
    image: "/images/about/pillars/pillar-1.jpg",
  },
  {
    num: "02",
    icon: "sparkles" as const,
    title: "Practice With Purpose",
    description:
      "Tarot Card, Astrology, Vaastu and Reiki are approached as practices with their own principles, methods and disciplines.",
        image: "/images/about/pillars/pillar-2.jpg",
  },
  {
    num: "03",
    icon: "heart" as const,
    title: "Keep It Grounded",
    description:
      "Spiritual guidance should connect with real life, relationships, work, choices, emotions and everyday situations.",
        image: "/images/about/pillars/pillar-3.jpg",
  },
  {
    num: "04",
    icon: "users" as const,
    title: "Encourage Conscious Action",
    description:
      "The objective is not dependency. It is to help a person develop clarity and move forward with greater awareness.",
        image: "/images/about/pillars/pillar-4.jpg",
  },
  {
    num: "05",
    icon: "star" as const,
    title: "Respect the Individual Journey",
    description:
      "There is no single path that works for everyone. Every consultation and learning journey is approached individually.",
        image: "/images/about/pillars/pillar-5.jpg",
  },
];

const STATS = [
  {
    value: "12+",
    label: "Years of Experience",
    description: "Across Tarot Card, Astrology, Vaastu, Reiki, consultations and teaching.",
  },
  {
    value: "10,000+",
    label: "People Guided",
    description: "Individuals who have experienced her consultations, sessions, workshops or guidance.",
  },
  {
    value: "4",
    label: "Core Practices",
    description: "Tarot Card · Astrology · Vaastu · Reiki",
  },
  {
    value: "∞",
    label: "A Journey of Learning",
    description: "Continuing to learn, practise, teach and share the knowledge received through her spiritual journey.",
  },
];

const APPROACH = [
  { num: "01", step: "Listen", body: "Understand the question behind the question." },
  {
    num: "02",
    step: "Explore",
    body: "Use the appropriate practice - Tarot Card, Astrology, Vaastu or Reiki to gain another perspective.",
  },
  { num: "03", step: "Reflect", body: "Connect insights with your real-life circumstances." },
  { num: "04", step: "Act", body: "Leave with greater clarity about your next step." },
];

/* Decorative marquee: only words that already appear on this page */
const MARQUEE_WORDS = ["Tarot Card", "Astrology", "Vaastu", "Reiki", "Clarity", "Balance", "Prosperity", "Transformation"];

/* Small repeated title ornament */
function Ornament({ dark = false }: { dark?: boolean }) {
  return (
    <div className="mx-auto flex items-center justify-center gap-3" aria-hidden>
      <span className={`h-px w-14 bg-gradient-to-r from-transparent ${dark ? "to-gold/80" : "to-gold/80"}`} />
      <Sparkle className="v-twinkle h-4 w-4 text-gold" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/80" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="HER JOURNEY"
        title="ABOUT RITUU BHATIA"
        description="A Spiritual Coach specialising in Astrology, Tarot Card, Vaastu and Reiki to guide you toward clarity, balance and personal growth."
      />

      {/* ───────────── 1. Intro ───────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-24 lg:py-32">
        <div aria-hidden className="v-drift pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="v-drift pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute right-[10%] top-24 -z-10 h-3 w-3 rounded-full bg-gold/70 blur-[1px]" />
        <div aria-hidden className="v-float pointer-events-none absolute left-[6%] top-[62%] -z-10 h-2 w-2 rounded-full bg-violet/60" style={dly(2)} />

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <div className="v-blur">
              <p className={pill}>
                <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
                About Rituu Bhatia
              </p>
              <p className="index-tab mb-6 text-[11px] uppercase text-charcoal/55">
                Spiritual Coach · Holistic Life Transformation Guide
              </p>
              <h2 className="mb-5 max-w-2xl font-display text-4xl font-light leading-[1.1] text-charcoal sm:text-5xl lg:text-6xl">
                Helping you find clarity, reconnect with yourself &amp;{" "}
                <span className="v-grad-text italic">move forward with intention.</span>
              </h2>
              <div className="v-draw mb-8 h-[3px] w-24 rounded-full bg-gradient-to-r from-gold-soft to-gold" />
            </div>

            <div className="mb-10 max-w-xl space-y-5 leading-relaxed text-charcoal/70 lg:text-lg">
              <p className="v-reveal" style={idx(0)}>
                For over a decade, Rituu has worked with people navigating questions around
                relationships, prosperity, career, health, personal growth and life direction.
              </p>
              <p className="v-reveal" style={idx(1)}>
                Her work brings together Tarot Card, Astrology, Vaastu and Reiki not as isolated
                practices, but as different pathways to understand a person&apos;s circumstances,
                energy, patterns and possibilities.
              </p>
              <p className="v-reveal text-charcoal" style={idx(2)}>
                As a Spiritual Coach, her focus goes beyond giving an answer, it is about helping
                you understand, reflect, make conscious choices, and take the next step.
              </p>
            </div>

            <div className="v-reveal flex flex-wrap items-center gap-4" style={idx(3)}>
              <Link href="#approach" className={inkBtn}>
                <span className={shine} />
                <span className="relative">Explore Her Approach</span>
                <span aria-hidden className="relative text-gold transition-transform group-hover/btn:translate-x-1">→</span>
              </Link>
              <Button href="/appointment" variant="secondary">
                Book an Appointment
              </Button>
            </div>
          </div>

          <div className="v-right order-1 lg:order-2 lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <TiltFrame>
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border border-gold/60 lg:translate-x-6 lg:translate-y-6"
                />
                <div className="relative isolate aspect-[4/5] overflow-hidden rounded-3xl bg-ivory-deep shadow-[0_36px_80px_-30px_var(--color-ink)]">
                  <Image
                    src="/images/about/rituu-bhatia.jpg"
                    alt="Rituu Bhatia — Spiritual Coach & Holistic Life Transformation Guide"
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="-z-10 object-cover"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
                  <div aria-hidden className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
                </div>
              </TiltFrame>

              {/* Rotating designation ring */}
              <div className="v-ring absolute -bottom-10 -left-6 flex h-36 w-36 items-center justify-center rounded-full border border-gold/40 bg-ink text-gold-soft shadow-2xl sm:-left-10">
                <svg
                  viewBox="0 0 140 140"
                  aria-hidden
                  className="absolute inset-0 h-full w-full animate-[spin_36s_linear_infinite]"
                >
                  <defs>
                    <path id="about-ring" d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
                  </defs>
                  <text className="fill-current uppercase" style={{ fontFamily: "var(--font-label)", fontSize: 7.5 }}>
                    <textPath href="#about-ring" textLength="320" lengthAdjust="spacing">
                      Spiritual Coach · Holistic Life Transformation Guide ·
                    </textPath>
                  </text>
                </svg>
                <Sparkle className="v-twinkle h-5 w-5 text-gold" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Keyword strip ───────────── */}
      <Marquee words={MARQUEE_WORDS} />

      {/* ───────────── 2. Stats ───────────── */}
      <section className="relative isolate overflow-hidden bg-ivory-deep py-20 lg:py-24">
        <div aria-hidden className="v-drift pointer-events-none absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div aria-hidden className="v-drift pointer-events-none absolute -left-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-violet/15 blur-3xl" />
<h2 className="mb-10 font-display text-3xl font-light leading-[1.15] text-charcoal sm:text-4xl lg:text-5xl text-center">
                The Impact Behind {" "}
                <span className="v-grad-text italic">the Journey</span>
              </h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={idx(i)}
              className="v-pop group relative overflow-hidden rounded-2xl border border-line bg-white/80 p-7 text-center shadow-[0_18px_40px_-28px_var(--color-ink)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_32px_70px_-28px_var(--color-gold)]"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-soft via-gold to-violet transition-transform duration-700 group-hover:scale-x-100" />
              <p className="v-grad-text font-display text-5xl font-light leading-none lg:text-6xl">
                <CountUp value={stat.value} />
              </p>
              <p className="index-tab mt-5 text-[11px] uppercase text-charcoal">{stat.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── 3. Story ───────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory to-ivory-deep py-24 lg:py-32">
        <div aria-hidden className="v-drift pointer-events-none absolute -right-32 top-20 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="v-left lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <div className="group relative isolate aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_36px_80px_-30px_var(--color-ink)]">
                  <Image
                    src="/images/about/rituu-str.jpg"
                    alt="Rituu Bhatia — a quiet consultation space"
                    fill
                    sizes="(min-width: 1024px) 38vw, 90vw"
                    className="-z-10 object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                  <div aria-hidden className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 transition-all duration-500 group-hover:ring-2 group-hover:ring-gold/70" />
                  <div aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="v-blur">
                <p className={pill}>
                  <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
                  My Story
                </p>
                <h2 className="mb-5 font-display text-3xl font-light leading-[1.15] text-charcoal sm:text-4xl lg:text-5xl">
                  A journey that began with learning {" "}
                  <span className="v-grad-text italic">and became a calling to guide others.</span>
                </h2>
                <div className="v-draw mb-10 h-[3px] w-24 rounded-full bg-gradient-to-r from-gold-soft to-gold" />
              </div>

              <div className="space-y-6 text-lg leading-relaxed text-charcoal/75">
                <p
                  style={idx(0)}
                  className="v-reveal relative overflow-hidden rounded-2xl border border-line bg-white/80 p-6 font-display text-xl text-charcoal shadow-[0_18px_40px_-28px_var(--color-ink)] backdrop-blur lg:text-2xl"
                >
                  <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-gold-soft to-gold" />
                  Rituu&apos;s journey spans over 12+ years of learning, practice, consultation and
                  teaching across Tarot Card, Vaastu, Astrology and Reiki.
                </p>
                <p style={idx(1)} className="v-reveal">
                  But the foundation of her work goes deeper than the techniques themselves. It is a
                  legacy received from her Guru — a journey of Diksha, Sadhana and Siddhi that shaped
                  the way she understands and practises these disciplines.
                </p>
                <p style={idx(2)} className="v-reveal">
                  Over the years, thousands of individuals have approached Rituu with questions they
                  could not always answer on their own. Her role is not to make decisions for them —
                  it is to create a space for clarity, perspective and conscious action.
                </p>
                <p style={idx(3)} className="v-reveal text-charcoal">
                  Today, she brings that experience into her work as a{" "}
                  <span className="font-medium">Spiritual Coach, Consultant and Educator</span> —
                  helping people not only seek guidance, but also learn and explore these practices
                  themselves.
                </p>
              </div>
            </div>
          </div>

          {/* Pull quote */}
          <figure className="v-reveal relative isolate mt-24 overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink px-8 py-16 text-center text-ivory shadow-[0_30px_70px_-30px_var(--color-ink)] lg:mt-32 lg:px-20 lg:py-24">
            <div aria-hidden className="v-float pointer-events-none absolute -left-16 -top-16 -z-10 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
            <div aria-hidden className="v-float pointer-events-none absolute -bottom-20 -right-16 -z-10 h-72 w-72 rounded-full bg-violet/30 blur-3xl" style={dly(2)} />
            <Sparkles />
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
            <span aria-hidden className="v-grad-gold absolute left-1/2 top-2 -translate-x-1/2 select-none font-display text-[120px] leading-none">
              &ldquo;
            </span>
            <blockquote className="relative mx-auto max-w-3xl pt-10 font-display text-2xl font-light italic leading-snug sm:text-3xl lg:text-4xl">
              &ldquo;I don&apos;t read cards to perform. I read them to help someone see clearly enough
              to move forward.&rdquo;
            </blockquote>
            <figcaption className="index-tab mt-8 text-[11px] uppercase text-gold-soft">— Rituu Bhatia</figcaption>
          </figure>
        </div>
      </section>

      {/* ───────────── 4. Beyond a Reading + Approach ───────────── */}
        <section
        id="approach"
        className="relative isolate scroll-mt-20 overflow-hidden bg-gradient-to-b from-ivory-deep via-ivory to-ivory-deep py-20 lg:py-24"
      >
        <div aria-hidden className="v-drift pointer-events-none absolute -left-24 top-0 -z-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div aria-hidden className="v-drift pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-violet/15 blur-3xl" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
 
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          {/* Header: text + framed image */}
          <div className="mb-16 grid items-center gap-12 lg:mb-20 lg:grid-cols-12 lg:gap-14">
            <div className="v-blur lg:col-span-7">
              <p className={pill}>
                <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
                Beyond a Reading
              </p>
              <h2 className="mb-6 font-display text-3xl font-light leading-[1.15] text-charcoal sm:text-4xl lg:text-5xl">
                Guidance is not about{" "}
                <span className="italic text-charcoal/40 line-through decoration-gold decoration-2">predicting</span>{" "}
                your life. It&apos;s about <span className="v-grad-text italic">understanding your journey.</span>
              </h2>
              <p className="max-w-xl leading-relaxed text-charcoal/65 lg:text-lg">
                Rituu&apos;s approach to spiritual coaching combines traditional practices with a
                practical, grounded way of working with people. A consultation may begin with a
                question about career, relationships, business, home, wellbeing or personal growth —
                but the deeper objective is to help you understand what may be influencing the
                situation and what you can consciously do next.
              </p>
            </div>
 
            <div className="v-right lg:col-span-5">
              <div className="group relative mx-auto max-w-sm lg:max-w-none">
                {/* offset gold frame */}
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border border-gold/60 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"
                />
                <div className="relative isolate aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_36px_80px_-30px_var(--color-ink)]">
                  <Image
                    src="/images/about/approach-tarot.jpg"
                    alt="Tarot cards, a crystal and a journal on a consultation table"
                    fill
                    sizes="(min-width: 1024px) 36vw, 90vw"
                    className="-z-10 object-cover object-bottom brightness-[0.82] saturate-[0.95] transition-transform duration-[1100ms] ease-out group-hover:scale-105"
                  />
                  {/* calms the lamp glare at the top and darkens the bottom corner */}
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/25" />
                  <div aria-hidden className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
                </div>
              </div>
            </div>
          </div>
 
          {/* The Approach – 4 open steps on a connecting line */}
          <p className="index-tab mb-10 text-center text-[16px] uppercase text-gold-deep">The Approach</p>
 
          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            <div
              aria-hidden
              className="absolute left-[12.5%] right-[12.5%] top-[52px] hidden h-px bg-gradient-to-r from-gold/10 via-gold/60 to-gold/10 lg:block"
            />
            {APPROACH.map((item, i) => (
              <div
                key={item.num}
                style={idx(i)}
                className="v-reveal group relative rounded-2xl border border-transparent p-6 text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40 hover:bg-white hover:shadow-[0_24px_60px_-28px_var(--color-gold)]"
              >
                <div className="relative z-10 mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border border-gold/50 bg-white font-display text-lg text-gold-deep shadow-[0_10px_30px_-14px_var(--color-gold)] ring-8 ring-ivory transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-ink group-hover:ring-white">
                  {item.num}
                </div>
                <h3 className="mb-2 font-display text-2xl text-charcoal">{item.step}</h3>
                <p className="text-sm leading-relaxed text-charcoal/65">{item.body}</p>
              </div>
            ))}
          </div>
 
          {/* Closing statement */}
          <div className="v-reveal mx-auto mt-14 max-w-2xl rounded-3xl border border-gold/30 bg-white/70 px-8 py-8 text-center shadow-[0_24px_60px_-36px_var(--color-gold)] backdrop-blur lg:mt-16">
            <p className="font-display text-xl font-light text-charcoal sm:text-2xl">
              The practice provides perspective.
            </p>
            <p className="v-grad-text mt-1 font-display text-xl font-light italic sm:text-2xl">
              The choice remains yours.
            </p>
            <div className="mt-5">
              <Ornament />
              <p className="index-tab mt-3 text-[11px] uppercase text-charcoal/50">Rituu Bhatia</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── 5. Pillars ───────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-24 lg:py-32">
        <div aria-hidden className="v-drift pointer-events-none absolute -right-32 top-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-gold/20 blur-3xl" />
        <div aria-hidden className="v-drift pointer-events-none absolute -left-32 bottom-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-violet/20 blur-3xl" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-14 grid items-end gap-10 lg:mb-16 lg:grid-cols-12 lg:gap-16">
            <div className="v-blur lg:col-span-7">
              <p className={pill}>
                <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
                How She Works
              </p>
              <h2 className="mb-5 font-display text-4xl font-light leading-[1.1] text-charcoal sm:text-5xl">
                A practice built on knowledge,{" "}
                <span className="v-grad-text italic">discipline &amp; responsibility.</span>
              </h2>
              <div className="v-draw h-[3px] w-24 rounded-full bg-gradient-to-r from-gold-soft to-gold" />
            </div>
            <div className="v-right lg:col-span-5 lg:pb-2">
              <p className="max-w-md text-lg leading-relaxed text-charcoal/65">
                Every person&apos;s journey is different. That&apos;s why Rituu doesn&apos;t believe in a
                one-size-fits-all approach.
              </p>
              <p className="mt-3 text-sm text-charcoal/55">Her work is guided by five principles.</p>
            </div>
          </div>

          <div className="v-reveal">
            <PillarsExpand items={PILLARS} />
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
            <span className="index-tab text-[11px] uppercase text-charcoal/55">
              Guided by Purpose · Rooted in Wisdom
            </span>
            <span className="index-tab text-[11px] uppercase text-gold-deep">Est. Rituu Bhatia</span>
          </div>
        </div>
      </section>

      {/* ───────────── 6. Mission & Vision ───────────── */}
      <section className="relative isolate overflow-hidden bg-ivory-deep py-24 lg:py-32">
        <div aria-hidden className="v-drift pointer-events-none absolute -left-24 top-10 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Mission */}
            <div className="v-left group relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink p-8 text-ivory shadow-[0_30px_70px_-30px_var(--color-ink)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_44px_100px_-30px_var(--color-violet)] lg:p-12">
              <div aria-hidden className="v-float pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-violet/30 blur-3xl" />
              <div aria-hidden className="v-float pointer-events-none absolute -bottom-24 -left-16 -z-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" style={dly(3)} />
              <Sparkles />
              <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="mb-8 flex items-center gap-4">
                <span
                  aria-hidden
                  className="select-none font-display text-6xl font-light leading-none text-transparent"
                  style={{ WebkitTextStroke: "1.25px #EDB24E" }}
                >
                  01
                </span>
                <span className="h-[3px] w-12 rounded-full bg-gradient-to-r from-gold-soft to-gold transition-all duration-500 group-hover:w-24" />
                <p className="index-tab text-xs uppercase text-gold-soft">Mission</p>
              </div>
              <h3 className="mb-6 font-display text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
                Balance. Clarity. <br />
                <span className="v-grad-gold italic">Prosperity. Transformation.</span>
              </h3>
              <p className="max-w-md text-lg leading-relaxed text-ivory/75">
                To guide individuals and organizations toward greater balance, clarity, prosperity,
                and personal transformation through holistic spiritual practices.
              </p>
            </div>

            {/* Vision */}
            <div className="v-right group relative isolate overflow-hidden rounded-3xl border border-gold/30 bg-white/80 p-8 shadow-[0_30px_70px_-35px_var(--color-gold)] backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_44px_100px_-35px_var(--color-gold)] lg:p-12">
              <div aria-hidden className="v-float pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
              <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="mb-8 flex items-center gap-4">
                <span
                  aria-hidden
                  className="select-none font-display text-6xl font-light leading-none text-transparent"
                  style={{ WebkitTextStroke: "1.25px #BE8420" }}
                >
                  02
                </span>
                <span className="h-[3px] w-12 rounded-full bg-gradient-to-r from-gold-soft to-gold transition-all duration-500 group-hover:w-24" />
                <p className="index-tab text-xs uppercase text-gold-deep">Vision</p>
              </div>
              <h3 className="mb-6 font-display text-3xl font-light leading-tight text-charcoal sm:text-4xl lg:text-5xl">
                Ancient wisdom, <br />
                <span className="v-grad-text italic">modern guidance.</span>
              </h3>
              <p className="max-w-md text-lg leading-relaxed text-charcoal/70">
                To create a trusted platform for holistic transformation by combining ancient wisdom
                with practical, modern guidance.
              </p>
            </div>
          </div>

          <p className="index-tab mt-14 text-center text-[11px] uppercase text-charcoal/55">
            Rooted in Wisdom · Guided by Purpose · Driven by Impact
          </p>
        </div>
      </section>

      {/* ───────────── 7. Certifications ───────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-24 lg:py-28">
        <div aria-hidden className="v-drift pointer-events-none absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-violet/15 blur-3xl" />

        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="v-blur mb-12 text-center">
            <p className={pill}>
              <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
              Certifications &amp; Credentials
            </p>
            <Ornament />
          </div>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CERTIFICATIONS.map((cert, i) => (
              <li
                key={cert}
                style={idx(i)}
                className="v-pop group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white/80 p-7 shadow-[0_18px_40px_-28px_var(--color-ink)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_32px_70px_-28px_var(--color-gold)]"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-soft via-gold to-violet transition-transform duration-700 group-hover:scale-x-100" />
                <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-deep transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-ink">
                  <BadgeCheck size={24} strokeWidth={1.5} />
                </span>
                <span className="font-display text-xl leading-snug text-charcoal">{cert}</span>
              </li>
            ))}
          </ul>

          <div className="v-reveal pt-14 text-center">
            <Link href="/appointment" className={inkBtn}>
              <span className={shine} />
              <span className="relative">Begin Your Transformation Journey</span>
              <span aria-hidden className="relative text-gold transition-transform group-hover/btn:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── 8. Final CTA ───────────── */}
      <section className="relative isolate overflow-hidden border-y border-line py-28 lg:py-32">
        <Image src="/images/bg/cta.jpg" alt="" fill sizes="100vw" className="-z-30 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-br from-ink/85 via-ink-mid/70 to-ink/85" />
        <div aria-hidden className="v-float pointer-events-none absolute -left-20 top-0 -z-10 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-violet/35 blur-3xl" style={dly(2.5)} />
        <Sparkles />

        <div className="v-blur relative z-10 mx-auto max-w-2xl px-6 text-center lg:px-10">
          <p className={pillDark}>
            <span className="v-ring h-1.5 w-1.5 rounded-full bg-gold" />
            CLARITY · BALANCE · PROSPERITY
          </p>
          <h2 className="mb-9 font-display text-3xl font-light leading-tight text-ivory sm:text-5xl">
            Your journey toward <span className="v-grad-gold italic">transformation</span> begins here.
          </h2>
          <Link href="/appointment" className={`${goldBtn} v-ring`}>
            <span className={shine} />
            <span className="relative">Book an Appointment</span>
            <span aria-hidden className="relative transition-transform group-hover/btn:translate-x-1">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}