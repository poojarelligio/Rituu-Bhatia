import type { Metadata } from "next";
import Image from "next/image";
import { Check, Sparkles, Star } from "lucide-react";
import IndexTab from "@/components/ui/IndexTab";
import Button from "@/components/ui/Button";
import { getStaticServiceBySlug } from "@/lib/staticServices";

export const metadata: Metadata = {
  title: "Reiki Healing",
  description: "A hands-on energy session for stress, fatigue, or feeling stuck. Free session with Rituu Bhatia.",
};

export default function ReikiHealingPage() {
  const service = getStaticServiceBySlug("reiki-healing");
  
  return (
    <>
      {/* Full-bleed hero */}
      <section className="hero-photo relative h-[80vh] min-h-[560px] w-full">
        <Image
          src="/images/services/reiki.jpg"
          alt="Reiki healing session with Rituu Bhatia"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 photo-overlay-bottom" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-16 w-full">
            <div className="flex items-center gap-3 mb-5">
              <IndexTab code={service?.code || "RE"} index={0} className="border-ivory/40 text-ivory" />
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-charcoal bg-gold-soft rounded-full px-2.5 py-1">
                <Sparkles size={11} /> FREE SESSION
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl text-ivory font-light leading-tight mb-4 max-w-2xl">
              {service?.title || "Reiki Healing"}
            </h1>
            <p className="text-ivory/80 max-w-lg leading-relaxed mb-8 text-lg">
              {service?.tagline || "A hands-on energy session for stress, fatigue, or feeling stuck."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/book" variant="onDark">Book Your Free Session</Button>
              <Button href="/services" variant="secondary" className="border-ivory/50 text-ivory hover:border-ivory">
                All Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="bg-charcoal text-ivory py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 grid grid-cols-3 gap-8 text-center">
          {service?.stats.map((stat, i) => (
            <div key={i}>
              <p className="font-display text-3xl text-gold-soft">{stat.value}</p>
              <p className="text-xs tracking-wide text-ivory/60 mt-1 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About + two images */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="accent-line mb-4" />
            <p className="index-tab text-xs text-gold mb-4 mt-4">ABOUT THIS SESSION</p>
            <h2 className="font-display text-3xl text-charcoal font-light leading-tight mb-6">
              A quiet, unhurried session for real rest.
            </h2>
            <p className="text-charcoal/70 leading-relaxed text-lg mb-4">
              {service?.description || "A quiet, unhurried session designed to help your body and mind actually rest. Reiki with Rituu is offered as a complement to — never a replacement for — any medical or mental health care you're already receiving."}
            </p>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="photo-card relative aspect-[3/4] rounded-sm overflow-hidden border border-line mt-8">
              <Image
                src="/images/services/reiki-session.jpg"
                alt="Reiki healing session in progress"
                fill
                className="object-cover"
              />
            </div>
            <div className="photo-card relative aspect-[3/4] rounded-sm overflow-hidden border border-line">
              <Image
                src="/images/services/reiki-hands.jpg"
                alt="Hands-on Reiki energy healing"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for + What you get */}
      <section className="bg-ivory-deep py-24 border-y border-line">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="index-tab text-xs text-gold mb-6">WHO THIS IS FOR</p>
            <ul className="space-y-4">
              {service?.audience.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-charcoal/75 leading-relaxed">
                  <Check size={16} className="text-burgundy mt-1 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="index-tab text-xs text-gold mb-6">WHAT YOU GET</p>
            <ul className="space-y-4">
              {service?.benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-charcoal/75 leading-relaxed">
                  <Check size={16} className="text-burgundy mt-1 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="max-w-4xl mx-auto px-6 lg:px-10 py-24">
        <p className="index-tab text-xs text-gold mb-10 text-center">HOW IT WORKS</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-6 left-[16.5%] right-[16.5%] h-px bg-line" />
          {service?.process.map((step, i) => (
            <div key={i} className="relative bg-ivory">
              <span className="font-display text-2xl text-burgundy bg-ivory relative z-10">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-medium text-charcoal mt-4 mb-2">{step.title}</p>
              <p className="text-sm text-charcoal/60 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-ivory-deep py-20">
        <div className="max-w-2xl mx-auto px-6 lg:px-10 text-center">
          <div className="quote-mark" />
          <p className="font-display text-2xl text-charcoal leading-snug mb-6">
            I walked in completely drained and walked out feeling lighter than I have in months. Rituu has a very calm, healing presence.
          </p>
          <div className="flex justify-center gap-1 mb-2 text-gold">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
          </div>
          <p className="text-xs text-charcoal/50 uppercase tracking-wide">Priya M.</p>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            "/images/services/reiki-aura.jpg",
            "/images/services/reiki-crystals.jpg",
            "/images/services/reiki-light.jpg",
          ].map((src, i) => (
            <div key={i} className="photo-card relative aspect-square rounded-sm overflow-hidden border border-line">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA with background image */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="/images/services/reiki-bg.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/80" />
        <div className="relative max-w-2xl mx-auto px-6 lg:px-10 text-center">
          <p className="index-tab text-xs text-gold-soft mb-4">100% FREE · NO CATCH</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ivory font-light leading-tight mb-6">
            Ready to feel truly rested?
          </h2>
          <Button href="/book" variant="onDark">Book Your Free Session</Button>
        </div>
      </section>
    </>
  );
}