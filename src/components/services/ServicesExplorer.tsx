"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Service = {
  slug: string;
  number: string;
  label: string;
  heading: string;
  heroImage: string;
  intro: string;
  more: string;
  forList: string[];
  cta: string;
  duration: string;
  glow: string; // bright accent (borders, glow, dots)
  deep: string; // deep tone (image overlay)
};

const services: Service[] = [
  {
    slug: "vaastu",
    number: "01",
    label: "Vaastu",
    heading: "When your space doesn't feel the way it should.",
    heroImage: "/images/services/vaastu.jpg",
    intro:
      "Your home and workplace are more than walls, furniture and directions. They are spaces where you live, work, rest, create and grow.",
    more: "Rituu uses the principles of Vaastu to understand your space and identify areas that may be creating imbalance — with practical guidance to help you create a more harmonious environment.",
    forList: ["Homes", "Offices", "Businesses", "New Properties"],
    cta: "Explore Vaastu",
    duration: "30 min · ₹99",
    glow: "var(--color-vaastu)",
    deep: "color-mix(in srgb, var(--color-vaastu) 28%, var(--color-ink))",
  },
  {
    slug: "tarot-reading",
    number: "02",
    label: "Tarot Card Reading",
    heading: "When you have a question but can't see the answer clearly.",
    heroImage: "/images/services/tarotcards.jpg",
    intro:
      "Sometimes you don't need someone to tell you what to do. You need a different perspective.",
    more: "Tarot Card can help you explore the situation you're facing, understand the energies and possibilities around it, and look at your choices with greater clarity.",
    forList: ["Relationships", "Career", "Business", "Personal Decisions", "Life Direction"],
    cta: "Explore Tarot Card",
    duration: "30 min · ₹99",
    glow: "var(--color-tarot)",
    deep: "color-mix(in srgb, var(--color-tarot) 28%, var(--color-ink))",
  },
  {
    slug: "astrology",
    number: "03",
    label: "Astrology",
    heading: "Your birth chart is a map. Understanding it is the journey.",
    heroImage: "/images/services/astro.jpg",
    intro:
      "Your date, time and place of birth create a unique astrological chart — a framework that can be explored to understand patterns, cycles, tendencies and possibilities in different areas of life.",
    more: "Rituu combines her astrological knowledge with a practical approach to help you make sense of what your chart may reveal.",
    forList: ["Career", "Business", "Relationships", "Life Cycles", "Personal Growth"],
    cta: "Explore Astrology",
    duration: "30 min · ₹99",
    glow: "var(--color-astrology)",
    deep: "color-mix(in srgb, var(--color-astrology) 28%, var(--color-ink))",
  },
  {
    slug: "reiki-healing",
    number: "04",
    label: "Reiki",
    heading: "Sometimes the first step is simply to pause.",
    heroImage: "/images/services/reiki.jpg",
    intro:
      "In a world that constantly asks you to do more, Reiki offers a space to slow down, reconnect and experience a guided energy-based practice.",
    more: "Sessions are designed as a calm, supportive experience for relaxation, balance and personal wellbeing, and can include Aura and Seven Chakra work.",
    forList: ["Relaxation", "Energy Work", "Personal Wellbeing", "Inner Balance"],
    cta: "Explore Reiki",
    duration: "30 min · ₹99",
    glow: "var(--color-reiki)",
    deep: "color-mix(in srgb, var(--color-reiki) 28%, var(--color-ink))",
  },
  {
    slug: "signature",
    number: "05",
    label: "Signature",
    heading: "Vaastu Inspired Corporate Signature.",
    heroImage: "/images/services/signature.jpg",
    intro:
      "A signature appears on every document, cheque and agreement you sign — a small detail you repeat thousands of times.",
    more: "Rituu guides you toward a customised signature that reflects your name, your goals and the energy you wish to carry.",
    forList: ["Professionals", "Business Owners", "Students", "New Beginnings"],
    cta: "Explore Signature",
    duration: "Customised for you",
    glow: "var(--color-signature)",
    deep: "color-mix(in srgb, var(--color-signature) 28%, var(--color-ink))",
  },
  {
    slug: "logo",
    number: "06",
    label: "Logo",
    heading: "Vaastu-Inspired Corporate Logo Design",
    heroImage: "/images/services/logo.jpg",
    intro:
      "A logo and its colours carry meaning. They shape how people first see and feel your business.",
    more: "Rituu guides you on the shapes, colours and symbols that align with your name, your work and your vision.",
    forList: ["New Businesses", "Rebranding", "Startups", "Professionals"],
    cta: "Explore Logo",
    duration: "Customised for you",
    glow: "var(--color-logo)",
    deep: "color-mix(in srgb, var(--color-logo) 28%, var(--color-ink))",
  },
];

const questions = [
  { id: "space", text: "It's about my home or office", matches: ["vaastu"] },
  { id: "decision", text: "I'm stuck on a decision", matches: ["tarot-reading"] },
  { id: "life", text: "Career or relationships", matches: ["tarot-reading", "astrology"] },
  { id: "pause", text: "I need to slow down", matches: ["reiki-healing"] },
  { id: "brand", text: "I want a signature or logo", matches: ["signature", "logo"] },
];

const bySlug = (slug: string) => services.find((s) => s.slug === slug)!;

function ServiceCard({
  service,
  index,
  highlighted,
  dimmed,
}: {
  service: Service;
  index: number;
  highlighted: boolean;
  dimmed: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();

  // Mouse-follow spotlight
  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay: (index % 2) * 0.12 }}
      className="h-full"
    >
      <Link
        ref={ref}
        href={`/services/${service.slug}`}
        onMouseMove={handleMove}
        style={{ ["--accent" as string]: service.glow }}
        className={`group relative isolate flex h-full min-h-[560px] flex-col justify-end overflow-hidden rounded-2xl text-white transition-all duration-500 hover:-translate-y-1.5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.45)] hover:shadow-[0_28px_70px_-18px_var(--accent)] ${
          highlighted ? "ring-2 ring-[var(--accent)]" : ""
        } ${dimmed ? "opacity-40 saturate-50" : "opacity-100"}`}
      >
        {/* Background image */}
        <Image
          src={service.heroImage}
          alt={service.label}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="-z-20 object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />

        {/* Colour tint (bottom → top) */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(to top, ${service.deep} 6%, color-mix(in srgb, ${service.deep} 92%, transparent) 32%, color-mix(in srgb, ${service.deep} 50%, transparent) 60%, color-mix(in srgb, ${service.deep} 10%, transparent) 100%)`,
          }}
        />

        {/* Mouse spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgba(255,255,255,0.20), transparent 45%)",
          }}
        />

        {/* Big outlined number */}
        <span
          aria-hidden
          className="absolute left-6 top-4 font-display text-7xl leading-none text-transparent transition-all duration-500 group-hover:translate-x-1"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.55)" }}
        >
          {service.number}
        </span>

        {/* Label chip */}
        <span
          className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.15em] backdrop-blur-md"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: service.glow, boxShadow: `0 0 10px ${service.glow}` }}
          />
          {service.label}
        </span>

        {/* Content */}
        <div className="relative z-10 flex flex-col p-7 md:p-8">
          <span
            className="mb-4 h-[3px] w-10 rounded-full transition-all duration-500 group-hover:w-20"
            style={{ background: service.glow }}
          />
          <h3 className="font-display text-3xl leading-tight mb-3">{service.heading}</h3>
          <p className="text-sm leading-relaxed text-white/85">{service.intro}</p>

          {/* Expands on hover/focus on desktop, always open on mobile */}
          <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
            <div className="min-h-0 overflow-hidden">
              <p className="pt-3 text-sm leading-relaxed text-white/85">{service.more}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-5">
            <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/60">For</p>
            <div className="flex flex-wrap gap-2">
              {service.forList.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] text-white/90 backdrop-blur-md transition-colors duration-300 group-hover:border-[var(--accent)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/15 pt-5">
            <span className="text-xs text-white/70">{service.duration}</span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-2 text-sm font-medium transition-all duration-300 group-hover:border-transparent group-hover:bg-gold group-hover:text-ink"
            >
              {service.cta}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </div>

      </Link>
    </motion.div>
  );
}

export default function ServicesExplorer() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = questions.find((q) => q.id === activeId) ?? null;

  return (
    <section className="relative max-w-6xl mx-auto px-6 lg:px-10 py-16">
      {/* Question picker */}
      <div className="mb-12 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-charcoal/50">
          What&apos;s on your mind?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {questions.map((q) => {
            const isActive = q.id === activeId;
            return (
              <button
                key={q.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveId(isActive ? null : q.id)}
                className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ${
                  isActive
                    ? "border-transparent bg-ink text-white shadow-lg -translate-y-0.5"
                    : "border-black/10 bg-white/70 text-charcoal/75 backdrop-blur hover:-translate-y-0.5 hover:border-black/25 hover:shadow-md"
                }`}
              >
                <span className="flex -space-x-1">
                  {q.matches.map((slug) => (
                    <span
                      key={slug}
                      className="h-2.5 w-2.5 rounded-full ring-2 ring-white/80"
                      style={{ background: bySlug(slug).glow }}
                    />
                  ))}
                </span>
                {q.text}
              </button>
            );
          })}
        </div>

        <p className="mt-5 h-6 text-sm text-charcoal/65" aria-live="polite">
          {active && (
            <>
              A good place to start:{" "}
              {active.matches.map((slug, i) => (
                <span key={slug} className="font-medium text-charcoal">
                  {i > 0 && " · "}
                  {bySlug(slug).label}
                </span>
              ))}
            </>
          )}
        </p>
      </div>

      {/* 2 columns x 3 rows */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {services.map((service, i) => {
          const isMatch = !active || active.matches.includes(service.slug);
          return (
            <ServiceCard
              key={service.slug}
              service={service}
              index={i}
              highlighted={!!active && isMatch}
              dimmed={!isMatch}
            />
          );
        })}
      </div>
    </section>
  );
}