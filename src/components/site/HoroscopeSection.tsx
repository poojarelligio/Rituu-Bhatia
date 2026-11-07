"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, MoonStar } from "lucide-react";
import { ZODIAC_SIGNS } from "@/lib/zodiacSigns";

interface HoroscopeResult {
  date: string;
  sign: string;
  horoscope: string;
}

/**
 * OPTIONAL: put an image path here (e.g. "/images/home/horoscope-card-bg.jpg")
 * to show a soft picture behind the right-hand card. Leave "" for plain cream.
 */
const CARD_IMAGE = "";

function formatDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/**
 * Places a child at a fixed angle + radius from the wheel's center, and
 * counter-rotates it so it stays upright as the parent wheel spins.
 * Used twice per sign (once for the icon, once for its name label) with
 * two different radii, so the label always sits further from center than
 * the icon regardless of which side of the wheel it's currently on.
 */
function RadialItem({
  angle, radiusVar, className, style, children,
}: { angle: number; radiusVar: string; className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 w-0 h-0"
      style={{ transform: `rotate(${angle}deg) translateY(calc(-1 * var(${radiusVar})))` }}
    >
      <div
        className={`zodiac-counter-spin absolute ${className || ""}`}
        style={{ ["--item-angle" as string]: `${-angle}deg`, ...style }}
      >
        {children}
      </div>
    </div>
  );
}

// Tiny twinkling stars scattered over the background
const stars = [
  { top: "12%", left: "8%", size: 3, delay: 0 },
  { top: "22%", left: "46%", size: 2, delay: 0.8 },
  { top: "9%", left: "78%", size: 3, delay: 1.4 },
  { top: "40%", left: "92%", size: 2, delay: 0.4 },
  { top: "64%", left: "5%", size: 2, delay: 1.1 },
  { top: "82%", left: "38%", size: 3, delay: 0.2 },
  { top: "88%", left: "72%", size: 2, delay: 1.7 },
  { top: "55%", left: "52%", size: 2, delay: 2.1 },
];

export default function HoroscopeSection() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [result, setResult] = useState<HoroscopeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSelect(slug: string) {
    setSelectedSlug(slug);
    setResult(null);
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/horoscope?sign=${slug}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load your horoscope. Please try again.");
        return;
      }
      setResult(data);
    } catch {
      setError("Could not load your horoscope. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const selectedSign = ZODIAC_SIGNS.find((s) => s.slug === selectedSlug);

  return (
    <section className="relative isolate overflow-hidden bg-ink py-24 lg:py-28">
      {/* ── Background: bb-bg.jpg + light indigo wash + glows + stars ── */}
      <Image src="/images/home/bb-bg.jpg" alt="" fill sizes="100vw" className="-z-30 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-b from-ink/65 via-ink/45 to-ink/75" />
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-violet/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-3xl" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      {stars.map((s, n) => (
        <span
          key={n}
          aria-hidden
          className="absolute -z-10 animate-pulse rounded-full bg-gold-soft"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: "3.2s" }}
        />
      ))}

      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="index-tab mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs text-gold-soft backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" style={{ boxShadow: "0 0 10px var(--color-gold)" }} />
            A MOMENT OF GUIDANCE, EVERY DAY
          </p>
          <h2 className="font-display text-3xl font-light leading-tight text-ivory sm:text-5xl">
            What might today{" "}
            <span className="bg-gradient-to-r from-gold-soft via-gold to-gold-deep bg-clip-text text-transparent">
              have in store for you?
            </span>
          </h2>
          <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden>
            <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/80" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/80" />
          </div>
          <p className="mt-6 leading-relaxed text-ivory/70">
            Sometimes, all you need is a moment to pause, reflect and look at the day from a different perspective.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* ───────── Zodiac Wheel (dark side) ───────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div
              className="zodiac-wheel-outer relative h-[340px] w-[340px] sm:h-[460px] sm:w-[460px]
                [--icon-radius:108px] [--label-radius:150px]
                sm:[--icon-radius:156px] sm:[--label-radius:206px]"
            >
              <div aria-hidden className="absolute inset-8 rounded-full bg-violet/25 blur-3xl" />
              <div aria-hidden className="absolute inset-0 rounded-full border border-gold/20" />
              <div aria-hidden className="absolute inset-6 rounded-full border border-dashed border-white/15 sm:inset-8" />
              <div aria-hidden className="absolute inset-16 rounded-full border border-gold/30 sm:inset-20" />

              <div className="zodiac-wheel-spin absolute inset-0">
                {ZODIAC_SIGNS.map((sign, i) => {
                  const angle = i * 30;
                  const Icon = sign.icon;
                  const isSelected = selectedSlug === sign.slug;
                  return (
                    <div key={sign.slug}>
                      <RadialItem angle={angle} radiusVar="--icon-radius">
                        <button
                          onClick={() => handleSelect(sign.slug)}
                          aria-label={`Show today's horoscope for ${sign.name}`}
                          aria-pressed={isSelected}
                          className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 sm:h-14 sm:w-14 ${
                            isSelected
                              ? "scale-110 border-transparent bg-gradient-to-br from-gold-soft to-gold text-ink shadow-[0_0_28px_-2px_var(--color-gold)]"
                              : "border-white/25 bg-white/10 text-ivory/80 hover:scale-110 hover:border-gold hover:bg-white/15 hover:text-gold-soft hover:shadow-[0_0_22px_-4px_var(--color-gold)]"
                          }`}
                        >
                          <Icon size={20} className="sm:h-6 sm:w-6" strokeWidth={1.5} />
                        </button>
                      </RadialItem>

                      <RadialItem angle={angle} radiusVar="--label-radius">
                        <button
                          onClick={() => handleSelect(sign.slug)}
                          className={`whitespace-nowrap text-[9px] uppercase tracking-wide transition-colors duration-300 sm:text-[11px] ${
                            isSelected ? "font-medium text-gold" : "text-ivory/55 hover:text-ivory"
                          }`}
                        >
                          {sign.name}
                        </button>
                      </RadialItem>
                    </div>
                  );
                })}
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="zodiac-center-emblem flex h-16 w-16 items-center justify-center rounded-full bg-ivory-deep ring-2 ring-gold/60 ring-offset-4 ring-offset-ink/60 sm:h-20 sm:w-20">
                  <Image src="/images/logo2.png" alt="Rituu Bhatia Logo" width={40} height={40} className="object-contain" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ───────── Right panel: LIGHT "parchment" card (contrasts with the dark side) ───────── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            {/* soft golden halo behind the card */}
            <div aria-hidden className="absolute -inset-4 -z-10 rounded-[2rem] bg-gold/25 blur-2xl" />

            {/* gold gradient border */}
            <div className="rounded-3xl bg-gradient-to-br from-gold-soft via-gold to-gold-deep p-[1.5px] shadow-[0_30px_80px_-30px_var(--color-gold)]">
              <div className="relative flex min-h-[320px] flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-ivory via-ivory-deep to-gold-soft/50 p-8 sm:p-10">
                {/* optional picture behind the card */}
                {CARD_IMAGE && (
                  <Image src={CARD_IMAGE} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="-z-10 object-cover opacity-10" />
                )}
                {/* decorative watermark + glows */}
                <MoonStar aria-hidden size={180} strokeWidth={0.8} className="pointer-events-none absolute -bottom-8 -right-8 text-gold/15" />
                <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/30 blur-3xl" />
                <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-violet/15 blur-3xl" />

                <div className="relative flex flex-1 flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {!selectedSlug && !loading && (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4 }}
                        className="text-center lg:text-left"
                      >
                        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-ink-mid to-ink text-gold-soft shadow-[0_10px_30px_-8px_var(--color-ink)] lg:mx-0">
                          <MoonStar size={26} strokeWidth={1.6} />
                        </div>
                        <p className="index-tab mb-3 text-[11px] text-gold-deep">FREE · DAILY</p>
                        <p className="max-w-sm leading-relaxed text-charcoal/75 lg:mx-0">
                          Choose your zodiac sign and discover your free daily horoscope — a simple ritual to begin your day with intention.
                        </p>
                      </motion.div>
                    )}

                    {loading && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2 text-sm text-charcoal/70 lg:justify-start"
                      >
                        <Loader2 size={16} className="animate-spin text-gold-deep" />
                        Reading the stars…
                      </motion.div>
                    )}

                    {error && !loading && (
                      <motion.p
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center text-sm text-gold-deep lg:text-left"
                      >
                        {error}
                      </motion.p>
                    )}

                    {result && !loading && selectedSign && (
                      <motion.div
                        key={selectedSign.slug}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="mb-5 flex items-center gap-4">
                          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ink-mid to-ink text-gold-soft shadow-[0_10px_30px_-8px_var(--color-ink)]">
                            <selectedSign.icon size={26} strokeWidth={1.6} />
                          </div>
                          <div>
                            <p className="font-display text-3xl text-charcoal">{selectedSign.name}</p>
                            <p className="mt-1 inline-flex rounded-full border border-gold/50 bg-gold/15 px-3 py-0.5 text-[11px] uppercase tracking-wide text-gold-deep">
                              {formatDate(result.date)}
                            </p>
                          </div>
                        </div>
                        <div className="mb-5 h-px bg-gradient-to-r from-gold/80 via-line to-transparent" />
                        <p className="text-lg leading-relaxed text-charcoal/85">{result.horoscope}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Deeper-reading nudge — always visible */}
                <div className="relative border-t border-gold/30 pt-7">
                  <p className="mb-4 max-w-sm text-center text-sm leading-relaxed text-charcoal/65 lg:text-left">
                    Want a deeper understanding than a daily reading can offer?
                  </p>
                  <div className="flex justify-center lg:justify-start">
                    <Link
                      href="/services/astrology"
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-7 py-3 text-sm font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-mid hover:shadow-[0_14px_40px_-12px_var(--color-ink)]"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <span className="relative">Explore Personal Astrology</span>
                      <ArrowRight size={16} className="relative text-gold transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}