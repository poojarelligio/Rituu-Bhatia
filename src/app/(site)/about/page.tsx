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
  { icon: Compass, title: "Grounded, Not Vague", description: "Every session is built around your actual question - not a generic script." },
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
      {/* Hero - portrait + intro, dark panel */}
      <section className="relative overflow-hidden bg-charcoal text-ivory">
        {/* Background Image - very subtle */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: "url('/images/bg/pageheader.jpg')",
            }}
          />
          {/* Strong overlay to make image barely visible */}
          <div className="absolute inset-0 bg-charcoal/5" />
          {/* Optional: slight gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/60 to-charcoal/65" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
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
              Twelve years of reading rooms, charts, and cards - and telling
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

      {/* My Story - pull quote + narrative + second image */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-7">
            <p className="index-tab text-xs text-gold mb-6">MY STORY</p>
            <p className="pull-quote mb-8">
              &ldquo;I don&apos;t read cards to perform - I read them to help someone
              see clearly enough to act.&rdquo;
            </p>
            <p className="text-charcoal/75 leading-relaxed text-lg mb-4">
              Rituu Bhatia has spent over a decade working across Tarot, Vaastu,
              Astrology, and Reiki - helping people see a situation clearly
              enough to act on it, rather than just feel better about it for an
              afternoon.
            </p>
            <p className="text-charcoal/75 leading-relaxed text-lg">
              Her approach is grounded and direct. Sessions focus on the
              specific question a client brings in, and every consultation
              ends with something concrete to do next - not a vague sense of
              having been &ldquo;read.&rdquo;
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden border border-line">
              <Image
                src="/images/about/rituu-abt.jpg"
                alt="A quiet consultation space"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy pillars - Bold Charcoal Dark */}
      <section className="relative py-24 overflow-hidden bg-charcoal">
        {/* Background */}
        <div className="absolute inset-0 opacity-[0.04]">
          <Image
            src="/images/bg/pageheader.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        
        {/* Gold decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
          {/* Heading */}
          <div className="text-center mb-14">
            <p className="index-tab text-xs text-gold-soft tracking-wider mb-3">HOW SHE WORKS</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ivory font-light leading-tight">
              The principles behind <span className="text-gold">the practice</span>
            </h2>
            <div className="w-16 h-px bg-gold/30 mx-auto mt-5"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar) => (
              <div 
                key={pillar.title} 
                className="group relative bg-white/5 backdrop-blur-sm border border-ivory/10 rounded-sm p-8 text-center transition-all duration-500 hover:bg-white/10 hover:border-gold/40 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-gold/5 to-transparent"></div>
                
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-5 relative">
                    <div className="absolute inset-0 rounded-full border border-ivory/10 group-hover:border-gold/40 transition-colors duration-500"></div>
                    <div className="absolute inset-0 rounded-full flex items-center justify-center">
                      <pillar.icon size={24} className="text-gold-soft group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>
                  
                  <h3 className="font-display text-lg text-ivory mb-2 group-hover:text-gold-soft transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-ivory/50 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-ivory/5 text-center">
            <span className="text-xs text-ivory/20 font-label tracking-widest">
              GUIDED BY PURPOSE · ROOTED IN WISDOM
            </span>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Option 2: The Journey */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/bg/cta.jpg"
            alt=""
            fill
            className="object-cover opacity-[0.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory/60 via-ivory/40 to-ivory/30" />
          {/* Decorative gold orb */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Mission - larger, more prominent */}
            <div className="lg:pt-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl font-display text-gold/20 font-light">01</span>
                <span className="w-12 h-px bg-gold/30"></span>
                <p className="index-tab text-xs text-gold tracking-wider">MISSION</p>
              </div>
              <h3 className="font-display text-3xl text-charcoal font-light leading-tight mb-4">
                Balance. Clarity. <br />
                <span className="text-burgundy">Prosperity. Transformation.</span>
              </h3>
              <p className="text-charcoal/70 leading-relaxed text-lg max-w-lg">
                To guide individuals and organizations toward greater balance,
                clarity, prosperity, and personal transformation through
                holistic spiritual practices.
              </p>
              {/* Decorative quote mark */}
              <div className="mt-6 text-6xl font-display text-gold/10 leading-none">"</div>
            </div>

            {/* Right: Vision with decorative border */}
            <div className="relative lg:pl-12 lg:border-l border-line">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl font-display text-gold/20 font-light">02</span>
                <span className="w-12 h-px bg-gold/30"></span>
                <p className="index-tab text-xs text-gold tracking-wider">VISION</p>
              </div>
              <h3 className="font-display text-2xl text-charcoal font-light leading-tight mb-4">
                Ancient wisdom, <br />
                <span className="text-burgundy">modern guidance.</span>
              </h3>
              <p className="text-charcoal/70 leading-relaxed text-lg max-w-lg">
                To create a trusted platform for holistic transformation by
                combining ancient wisdom with practical, modern guidance.
              </p>
              {/* Bottom accent */}
              <div className="mt-8 w-16 h-1 bg-gold/20 rounded-full"></div>
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="mt-16 pt-8 border-t border-line text-center">
            <p className="text-sm text-charcoal/40 font-label tracking-widest">
              ROOTED IN WISDOM · GUIDED BY PURPOSE · DRIVEN BY IMPACT
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
          src="/images/bg/cta.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-burgundy/75" />
        <div className="relative max-w-2xl mx-auto px-6 lg:px-10 text-center">
          <p className="index-tab text-xs text-ivory mb-4">CLARITY · BALANCE · PROSPERITY</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ivory font-light leading-tight mb-6">
            Your journey toward transformation begins here.
          </h2>
          <Button href="/book" variant="onDark">Book a Consultation</Button>
        </div>
      </section>
    </>
  );
}