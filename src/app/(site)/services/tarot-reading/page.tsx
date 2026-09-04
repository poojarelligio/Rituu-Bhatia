import type { Metadata } from "next";
import Image from "next/image";
import { Check, Sparkles, Star } from "lucide-react";
import IndexTab from "@/components/ui/IndexTab";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Tarot Reading",
  description: "Clarity on the decision in front of you, read card by card. Free session with Rituu Bhatia.",
};

export default function TarotReadingPage() {
  return (
    <>
      {/* Full-bleed hero */}
      <section className="hero-photo relative h-[80vh] min-h-[560px] w-full">
        <Image
          src="/images/services/tarotcards.jpg"
          alt="Tarot cards spread on a table"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 photo-overlay-bottom" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-16 w-full">
            <div className="flex items-center gap-3 mb-5">
              <IndexTab code="TR" index={0} className="border-ivory/40 text-ivory" />
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-charcoal bg-gold-soft rounded-full px-2.5 py-1">
                <Sparkles size={11} /> FREE SESSION
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl text-ivory font-light leading-tight mb-4 max-w-2xl">
              Tarot Reading
            </h1>
            <p className="text-ivory/80 max-w-lg leading-relaxed mb-8 text-lg">
              Clarity on the decision in front of you, read card by card.
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
          <div>
            <p className="font-display text-3xl text-gold-soft">1,200+</p>
            <p className="text-xs tracking-wide text-ivory/60 mt-1 uppercase">Readings Given</p>
          </div>
          <div>
            <p className="font-display text-3xl text-gold-soft">12+</p>
            <p className="text-xs tracking-wide text-ivory/60 mt-1 uppercase">Years Reading</p>
          </div>
          <div>
            <p className="font-display text-3xl text-gold-soft">4.9/5</p>
            <p className="text-xs tracking-wide text-ivory/60 mt-1 uppercase">Average Rating</p>
          </div>
        </div>
      </section>

      {/* About + two images */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="accent-line mb-4" />
            <p className="index-tab text-xs text-gold mb-4 mt-4">ABOUT THIS SESSION</p>
            <h2 className="font-display text-3xl text-charcoal font-light leading-tight mb-6">
              A conversation, not a performance.
            </h2>
            <p className="text-charcoal/70 leading-relaxed text-lg mb-4">
              A tarot session with Rituu isn&apos;t theatre — it&apos;s a focused conversation
              using the cards as a mirror. You bring the real question; she reads
              what&apos;s actually there and helps you see the path forward clearly.
            </p>
            <p className="text-charcoal/70 leading-relaxed text-lg">
              No vague reassurance, no generic script. Every reading is built
              entirely around the specific thing you&apos;re trying to decide.
            </p>
          </div>
          <div className="lg:col-span-6 gap-4">
            <div className="photo-card relative aspect-[4/4] rounded-sm overflow-hidden border border-line mt-8">
              <Image
                src="/images/services/tarot-card.jpg"
                alt="Close-up of tarot cards"
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
              <li className="flex items-start gap-3 text-charcoal/75 leading-relaxed">
                <Check size={16} className="text-burgundy mt-1 shrink-0" />
                Anyone facing a decision they keep going back and forth on
              </li>
              <li className="flex items-start gap-3 text-charcoal/75 leading-relaxed">
                <Check size={16} className="text-burgundy mt-1 shrink-0" />
                People who want a second, non-judgmental perspective
              </li>
              <li className="flex items-start gap-3 text-charcoal/75 leading-relaxed">
                <Check size={16} className="text-burgundy mt-1 shrink-0" />
                Those curious about tarot who&apos;ve never had a reading before
              </li>
            </ul>
          </div>
          <div>
            <p className="index-tab text-xs text-gold mb-6">WHAT YOU GET</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-charcoal/75 leading-relaxed">
                <Check size={16} className="text-burgundy mt-1 shrink-0" />
                A clear read on the situation as it stands today
              </li>
              <li className="flex items-start gap-3 text-charcoal/75 leading-relaxed">
                <Check size={16} className="text-burgundy mt-1 shrink-0" />
                Practical next steps, not vague reassurance
              </li>
              <li className="flex items-start gap-3 text-charcoal/75 leading-relaxed">
                <Check size={16} className="text-burgundy mt-1 shrink-0" />
                Room for follow-up questions within the session
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="max-w-4xl mx-auto px-6 lg:px-10 py-24">
        <p className="index-tab text-xs text-gold mb-10 text-center">HOW IT WORKS</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-6 left-[16.5%] right-[16.5%] h-px bg-line" />
          {[
            { title: "Share the question", description: "Tell Rituu what's actually on your mind — the more specific, the more useful the reading." },
            { title: "The reading", description: "Cards are drawn and read live, with Rituu narrating what she sees as she goes." },
            { title: "Discuss & plan", description: "You leave with a clear takeaway, not just a description of the cards." },
          ].map((step, i) => (
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
            My tarot reading with Rituu was direct and specific. I left with an
            actual plan, not just nice words.
          </p>
          <div className="flex justify-center gap-1 mb-2 text-gold">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
          </div>
          <p className="text-xs text-charcoal/50 uppercase tracking-wide">Arjun S.</p>
        </div>
      </section>

      {/* Gallery strip
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            "/images/services/tarotcards.jpg",
            "/images/services/tarotcards.jpg",
            "/images/services/tarotcards.jpg",
          ].map((src, i) => (
            <div key={i} className="photo-card relative aspect-square rounded-sm overflow-hidden border border-line">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </section> */}

      {/* Final CTA with background image */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="/images/services/tarotcards.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/80" />
        <div className="relative max-w-2xl mx-auto px-6 lg:px-10 text-center">
          <p className="index-tab text-xs text-gold-soft mb-4">100% FREE · NO CATCH</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ivory font-light leading-tight mb-6">
            Ready for your free tarot session?
          </h2>
          <Button href="/book" variant="onDark">Book Your Free Session</Button>
        </div>
      </section>
    </>
  );
}