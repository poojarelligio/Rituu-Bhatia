import type { Metadata } from "next";
import Image from "next/image";
import { Compass, Heart, Sparkles, Users, BadgeCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { getMediaFeatures } from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "About Rituu Bhatia" };

const CERTIFICATIONS = [
  "Certified Vaastu Consultant",
  "Certified Astrologer",
  "Certified Tarot Practitioner",
  "Certified Reiki Master",
  "Certified Life Transformation Coach",
];

const PILLARS = [
  { icon: Compass, title: "Grounded, Not Vague", description: "Every session is built around your actual question — not a generic script." },
  { icon: Heart, title: "Genuine Care", description: "A calm, non-judgmental space, whatever you're bringing into it." },
  { icon: Sparkles, title: "Practical Guidance", description: "You leave with something concrete to act on, not just a feeling." },
  { icon: Users, title: "A Growing Community", description: "3,000+ people guided through consultations, courses, and workshops." },
];

const STATS = [
  { value: "12+", label: "Years of Practice" },
  { value: "3,000+", label: "Consultations Held" },
  { value: "5", label: "Certifications" },
  { value: "4.9/5", label: "Average Rating" },
];

export default async function AboutPage() {
  const mediaFeatures = await getMediaFeatures();

  return (
    <>
      {/* Hero — portrait + intro, dark panel */}
      <section className="bg-charcoal text-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="portrait-frame">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden">
                <Image
                  src="/images/about/rituu-bhatia.jpg"
                  alt="Rituu Bhatia"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <p className="index-tab text-xs text-gold-soft mb-6">ABOUT RITUU</p>
            <h1 className="font-display text-4xl sm:text-5xl font-light leading-tight mb-6">
              Your holistic life transformation guide
              <span className="italic text-gold-soft"> for prosperity, relationships, health &amp; growth.</span>
            </h1>
            <p className="text-ivory/70 leading-relaxed max-w-xl mb-8">
              Twelve years of reading rooms, charts, and cards — and telling
              people the truth about them. Rituu combines Tarot, Vaastu,
              Astrology, and Reiki into one grounded, practical practice.
            </p>
            <Button href="/book" variant="onDark">Begin Your Transformation Journey</Button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-ivory-deep border-b border-line py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-glow">
              <p className="font-display text-3xl text-burgundy">{stat.value}</p>
              <p className="text-xs tracking-wide text-charcoal/60 mt-1 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* My Story — pull quote + narrative + second image */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-7">
            <p className="index-tab text-xs text-gold mb-6">MY STORY</p>
            <p className="pull-quote mb-8">
              &ldquo;I don&apos;t read cards to perform — I read them to help someone
              see clearly enough to act.&rdquo;
            </p>
            <p className="text-charcoal/75 leading-relaxed text-lg mb-4">
              Rituu Bhatia has spent over a decade working across Tarot, Vaastu,
              Astrology, and Reiki — helping people see a situation clearly
              enough to act on it, rather than just feel better about it for an
              afternoon.
            </p>
            <p className="text-charcoal/75 leading-relaxed text-lg">
              Her approach is grounded and direct. Sessions focus on the
              specific question a client brings in, and every consultation
              ends with something concrete to do next — not a vague sense of
              having been &ldquo;read.&rdquo;
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden border border-line">
              <Image
                src="/images/about/rituu-bhatia.jpg"
                alt="A quiet consultation space"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy pillars */}
      <section className="bg-ivory-deep py-24 border-y border-line">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <p className="index-tab text-xs text-gold mb-10 text-center">HOW SHE WORKS</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="bg-ivory border border-line rounded-sm p-7 text-center">
                <pillar.icon size={22} className="text-burgundy mx-auto mb-4" />
                <p className="font-medium text-charcoal mb-2">{pillar.title}</p>
                <p className="text-sm text-charcoal/60 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision — with a subtle background image */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about/rituu-bhatia.jpg"
            alt=""
            fill
            className="object-cover opacity-[0.06]"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div className="bg-ivory border border-line rounded-sm p-8">
            <p className="index-tab text-xs text-gold mb-4">MISSION</p>
            <p className="text-charcoal/70 leading-relaxed">
              To guide individuals and organizations toward greater balance,
              clarity, prosperity, and personal transformation through
              holistic spiritual practices.
            </p>
          </div>
          <div className="bg-ivory border border-line rounded-sm p-8">
            <p className="index-tab text-xs text-gold mb-4">VISION</p>
            <p className="text-charcoal/70 leading-relaxed">
              To create a trusted platform for holistic transformation by
              combining ancient wisdom with practical, modern guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-24">
        <p className="index-tab text-xs text-gold mb-10 text-center">CERTIFICATIONS &amp; CREDENTIALS</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CERTIFICATIONS.map((cert) => (
            <div key={cert} className="cert-card flex items-center gap-4 border border-line rounded-sm px-6 py-5 bg-ivory">
              <BadgeCheck size={20} className="text-burgundy shrink-0" />
              <span className="text-sm font-medium text-charcoal">{cert}</span>
            </div>
          ))}
        </div>
        <div className="pt-12 text-center">
          <Button href="/book" variant="primary">Begin Your Transformation Journey</Button>
        </div>
      </section>

      {/* Media & Recognition */}
      {/* {mediaFeatures.length > 0 && (
        <section className="bg-charcoal text-ivory py-20">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <p className="index-tab text-xs text-gold-soft mb-8 text-center">AS FEATURED IN</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {mediaFeatures.map((f) => (
                
                  key={f.id}
                  href={f.link || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-ivory/15 bg-charcoal rounded-sm p-6 text-center hover:border-ivory/40 transition-colors"
                >
                  <p className="index-tab text-[11px] text-gold-soft mb-3 uppercase">{f.feature_type}</p>
                  <p className="font-display text-base leading-snug mb-2">{f.title}</p>
                  <p className="text-xs text-ivory/50">{f.publication}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* Final CTA with background image */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="/images/about/rituu-bhatia.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-burgundy/90" />
        <div className="relative max-w-2xl mx-auto px-6 lg:px-10 text-center">
          <p className="index-tab text-xs text-gold-soft mb-4">CLARITY · BALANCE · PROSPERITY</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ivory font-light leading-tight mb-6">
            Your journey toward transformation begins here.
          </h2>
          <Button href="/book" variant="onDark">Book a Consultation</Button>
        </div>
      </section>
    </>
  );
}