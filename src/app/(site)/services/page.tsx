import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import ServicesExplorer from "@/components/services/ServicesExplorer";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Vaastu, Tarot Card, Astrology, Reiki, Signature and Logo Customisation — different questions, different paths to clarity. Book a session from just ₹99.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Banner – unchanged */}
      <PageHeader
        eyebrow="THE PRACTICE"
        title="Services"
        description="Four practices, two customised services, one place to find clarity."
      />

      {/* Intro with soft colour glow */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full bg-gold/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-violet/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl px-6 pt-20 text-center lg:px-10">
          <h2 className="mb-6 font-display text-3xl leading-tight text-charcoal md:text-5xl">
            Different questions.{" "}
            <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text text-transparent">
              Different paths to clarity.
            </span>
          </h2>
          <div className="space-y-2 leading-relaxed text-charcoal/70">
            <p>Sometimes the question is about your home.</p>
            <p>Sometimes it&apos;s your career, relationship or business.</p>
            <p>Sometimes, you simply feel that something needs to change.</p>
          </div>
          <p className="mt-6 leading-relaxed text-charcoal/70">
            Rituu&apos;s work brings together Vaastu, Tarot Card, Astrology and Reiki — four different
            practices that can offer perspective, insight and a deeper understanding of your
            journey.
          </p>
          <p className="mt-4 leading-relaxed text-charcoal/70">
            Beyond these, she also helps you shape the details that represent you — a customised
            Signature and a meaningful Logo for your business.
          </p>
          <div className="mx-auto mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold" />
            <p className="font-display text-lg text-gold-deep">
              Explore the practice that speaks to your question.
            </p>
            <span className="h-px w-12 bg-gold" />
          </div>
        </div>
      </section>

      {/* Interactive picker + cards */}
      <ServicesExplorer />

      {/* The Difference – dark highlighted band */}
      <section className="px-6 pb-24 lg:px-10">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink px-8 py-16 text-center text-white md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-violet/30 blur-3xl"
          />

          <div className="relative">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">The Difference</p>
            <h2 className="mb-6 font-display text-3xl leading-tight md:text-5xl">
              One question. One conversation. Your journey.
            </h2>
            <p className="mx-auto max-w-xl leading-relaxed text-white/75">
              You don&apos;t always know which practice is right for you — and you don&apos;t have
              to.
            </p>
            <p className="mx-auto mt-2 max-w-xl leading-relaxed text-white/75">
              If you&apos;re unsure whether you need Vaastu, Tarot Card, Astrology or Reiki, start with
              your question.
            </p>
            <Link
              href="/contact"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_var(--color-gold)]"
            >
              Talk to Rituu <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}