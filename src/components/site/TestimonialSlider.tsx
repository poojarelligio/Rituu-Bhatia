"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
  House,
  MoonStar,
  Quote,
  Sparkles,
  Waves,
  type LucideIcon,
} from "lucide-react";

interface Testimonial {
  id: number | string;
  quote: string;
  name: string;
  role?: string;
  rating?: number;
  image?: string;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
  title?: string;
  eyebrow?: string;
  autoplaySpeed?: number;
  className?: string;
}

const DEFAULT_RATING = 5;

/* ───────── small decorative helpers ───────── */

// Four-pointed sparkle (like the star in the mockup)
function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M12 0 C12.8 7.5 16.5 11.2 24 12 C16.5 12.8 12.8 16.5 12 24 C11.2 16.5 7.5 12.8 0 12 C7.5 11.2 11.2 7.5 12 0Z" />
    </svg>
  );
}

const sparkles = [
  { top: "9%", left: "17%", size: 14, delay: 0 },
  { top: "58%", left: "9%", size: 16, delay: 1.1 },
  { top: "14%", left: "84%", size: 12, delay: 0.5 },
  { top: "86%", left: "76%", size: 12, delay: 1.7 },
  { top: "90%", left: "30%", size: 10, delay: 0.9 },
  { top: "6%", left: "52%", size: 10, delay: 2.2 },
];

const dots = [
  { top: "30%", left: "24%" }, { top: "72%", left: "18%" }, { top: "46%", left: "88%" },
  { top: "78%", left: "58%" }, { top: "20%", left: "68%" }, { top: "64%", left: "94%" },
];

// Zodiac wheel (static geometry)
const GLYPHS = "\u2648\u2649\u264A\u264B\u264C\u264D\u264E\u264F\u2650\u2651\u2652\u2653".split("");
const wheelSigns = GLYPHS.map((g, n) => {
  const a = ((n * 30 + 15) * Math.PI) / 180;
  return { g: g + "\uFE0E", x: (300 + 258 * Math.sin(a)).toFixed(2), y: (300 - 258 * Math.cos(a) + 7).toFixed(2) };
});
const wheelDividers = Array.from({ length: 12 }, (_, n) => {
  const a = (n * 30 * Math.PI) / 180;
  return {
    x1: (300 + 225 * Math.sin(a)).toFixed(2), y1: (300 - 225 * Math.cos(a)).toFixed(2),
    x2: (300 + 290 * Math.sin(a)).toFixed(2), y2: (300 - 290 * Math.cos(a)).toFixed(2),
  };
});
const sunRays = Array.from({ length: 36 }, (_, n) => {
  const a = (n * 10 * Math.PI) / 180;
  const long = n % 2 === 0;
  const r2 = long ? 150 : 120;
  return {
    x1: (300 + 40 * Math.sin(a)).toFixed(2), y1: (300 - 40 * Math.cos(a)).toFixed(2),
    x2: (300 + r2 * Math.sin(a)).toFixed(2), y2: (300 - r2 * Math.cos(a)).toFixed(2),
    long,
  };
});


/* ───────── icon chosen from what the feedback talks about ───────── */
const TOPICS: { icon: LucideIcon; label: string; re: RegExp }[] = [
  { icon: House, label: "Vaastu & home", re: /(vaastu|vastu|home|house|flat|property|space)/i },
  { icon: Waves, label: "Reiki & healing", re: /(reiki|healing|energy|calm|peace)/i },
  { icon: MoonStar, label: "Astrology", re: /(astrolog|horoscope|kundli|birth chart|planet)/i },
  { icon: Sparkles, label: "Tarot card reading", re: /(tarot|card)/i },
  { icon: Briefcase, label: "Career guidance", re: /(career|job|business|profession|promotion|office)/i },
  { icon: Heart, label: "Relationships", re: /(relationship|marriage|love|partner|husband|wife)/i },
  { icon: GraduationCap, label: "Family & education", re: /(education|school|college|student|exam|child|son\b|daughter)/i },
];
const FALLBACK_TOPIC = { icon: Quote, label: "Client feedback" };

function topicFor(text: string) {
  return TOPICS.find((t) => t.re.test(text)) ?? FALLBACK_TOPIC;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function Avatar({ name, image, Icon }: { name: string; image?: string; Icon: LucideIcon }) {
  return (
    <div className="relative mx-auto mb-5 h-20 w-20">
      <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep opacity-90" />
      <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border-2 border-ivory bg-gradient-to-br from-ink-mid to-ink">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-2xl text-gold-soft">{initials(name)}</span>
        )}
      </div>
      {/* topic icon badge */}
      <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-ivory bg-gradient-to-br from-gold-soft to-gold text-ink shadow-md">
        <Icon size={15} strokeWidth={2} />
      </span>
    </div>
  );
}

function ZodiacWheel() {
  return (
    <svg viewBox="0 0 600 600" className="zodiac-wheel-spin h-full w-full" fill="none">
      <g className="text-gold" stroke="currentColor">
        <circle cx="300" cy="300" r="290" strokeOpacity="0.6" />
        <circle cx="300" cy="300" r="225" strokeOpacity="0.5" />
        <circle cx="300" cy="300" r="185" strokeOpacity="0.3" strokeDasharray="2 8" />
        <circle cx="300" cy="300" r="160" strokeOpacity="0.4" />
        {wheelDividers.map((l, n) => (
          <line key={n} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} strokeOpacity="0.45" />
        ))}
        {sunRays.map((r, n) => (
          <line key={n} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} strokeOpacity={r.long ? 0.8 : 0.4} strokeWidth={r.long ? 1.4 : 1} />
        ))}
        <g fill="currentColor" stroke="none" fontSize="24" textAnchor="middle" fontFamily="serif">
          {wheelSigns.map((s, n) => (
            <text key={n} x={s.x} y={s.y} fillOpacity="0.85">{s.g}</text>
          ))}
        </g>
      </g>
      <circle cx="300" cy="300" r="26" className="fill-gold" fillOpacity="0.9" />
      <circle cx="300" cy="300" r="46" className="fill-gold" fillOpacity="0.2" />
    </svg>
  );
}

export default function TestimonialSlider({
  testimonials,
  title = "In their own words",
  eyebrow = "WHAT CLIENTS SAY",
  autoplaySpeed = 6000,
  className = "",
}: TestimonialSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex(((i % testimonials.length) + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-play
  useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, autoplaySpeed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, testimonials.length, autoplaySpeed]);

  // If no testimonials, don't render
  if (testimonials.length === 0) return null;

  return (
    <section
      className={`relative isolate overflow-hidden bg-ink py-24 lg:py-28 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Testimonials"
    >
      {/* ── Background: nebula image + indigo wash ── */}
      <Image src="/images/bg/pageheader.jpg" alt="" fill sizes="100vw" className="-z-30 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-b from-ink/85 via-ink/60 to-ink/90" />
      <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-violet/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 top-1/3 -z-10 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

      {/* Zodiac wheel – left edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 -z-10 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 opacity-40 md:h-[560px] md:w-[560px] md:opacity-70"
      >
        <ZodiacWheel />
      </div>

      {/* Moon + orbit rings – top right */}
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 md:-right-10 md:h-80 md:w-80">
        <div className="absolute -inset-10 rounded-full border border-gold/25" />
        <div className="absolute -inset-20 rounded-full border border-dashed border-gold/20" />
        <div
          className="absolute inset-0 overflow-hidden rounded-full opacity-90 shadow-[0_0_80px_-10px_var(--color-gold-soft)]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, var(--color-gold-soft) 0%, color-mix(in srgb, var(--color-gold-soft) 40%, var(--color-violet)) 45%, var(--color-ink-mid) 100%)",
          }}
        >
          <span className="absolute left-[22%] top-[55%] h-8 w-8 rounded-full bg-ink/25" />
          <span className="absolute left-[48%] top-[68%] h-12 w-12 rounded-full bg-ink/20" />
          <span className="absolute left-[60%] top-[40%] h-6 w-6 rounded-full bg-ink/25" />
          <span className="absolute left-[30%] top-[78%] h-5 w-5 rounded-full bg-ink/20" />
        </div>
      </div>
      {/* hanging line + star */}
      <div aria-hidden className="pointer-events-none absolute right-8 top-56 -z-10 hidden flex-col items-center md:flex">
        <span className="h-20 w-px bg-gradient-to-b from-gold/60 to-gold/10" />
        <Sparkle className="h-7 w-7 text-gold drop-shadow-[0_0_10px_var(--color-gold)]" />
      </div>

      {/* Twinkling sparkles + dots */}
      {sparkles.map((s, n) => (
        <Sparkle
          key={n}
          className="absolute -z-10 animate-pulse text-gold"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: "3.4s" }}
        />
      ))}
      {dots.map((p, n) => (
        <span key={n} aria-hidden className="absolute -z-10 h-[3px] w-[3px] rounded-full bg-gold-soft/70" style={{ top: p.top, left: p.left }} />
      ))}

      <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-5">
            <span className="h-px w-16 bg-gold/60 md:w-28" />
            <p className="index-tab text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
            <span className="h-px w-16 bg-gold/60 md:w-28" />
          </div>
          <h2 className="font-display text-4xl font-light leading-tight text-ivory sm:text-5xl">{title}</h2>
          <div className="mt-6 flex items-center justify-center gap-3" aria-hidden>
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70 md:w-24" />
            <span className="h-1 w-1 rounded-full bg-gold" />
            <Sparkle className="h-7 w-7 text-gold drop-shadow-[0_0_10px_var(--color-gold)]" />
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70 md:w-24" />
          </div>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative mt-14">
          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="absolute -left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/70 bg-ink/80 text-ivory shadow-[0_0_20px_-6px_var(--color-gold)] backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-gold hover:text-ink md:-left-14 md:h-12 md:w-12"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="absolute -right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/70 bg-ink/80 text-ivory shadow-[0_0_20px_-6px_var(--color-gold)] backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-gold hover:text-ink md:-right-14 md:h-12 md:w-12"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Slide Container (padding so the glow isn't clipped) */}
          <div className="-my-8 overflow-hidden py-8">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="w-full shrink-0 px-4 md:px-6">
                  {(() => {
                    const topic = topicFor(`${t.quote} ${t.role ?? ""}`);
                    const TopicIcon = topic.icon;
                    return (
                      <div className="relative overflow-hidden rounded-2xl border border-gold/70 bg-gradient-to-br from-ivory via-ivory-deep to-gold-soft/50 px-7 pb-10 pt-9 text-center shadow-[0_0_70px_-20px_var(--color-gold)] md:px-14 md:pb-12">
                        {/* soft decoration */}
                        <Quote aria-hidden size={140} strokeWidth={0.8} className="pointer-events-none absolute -right-4 -top-4 rotate-6 text-gold/20" />
                        <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-violet/10 blur-3xl" />
                        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

                        <Avatar name={t.name} image={t.image} Icon={TopicIcon} />

                        <p className="index-tab mb-5 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-[11px] uppercase text-gold-deep">
                          <TopicIcon size={13} />
                          {topic.label}
                        </p>

                        {/* Quote text */}
                        <p className="relative mb-7 text-base leading-relaxed text-charcoal/85 md:text-lg">
                          &ldquo;{t.quote}&rdquo;
                        </p>

                        {/* Divider with sparkle */}
                        <div className="mb-5 flex items-center justify-center gap-3" aria-hidden>
                          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold md:w-24" />
                          <Sparkle className="h-4 w-4 text-gold" />
                          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold md:w-24" />
                        </div>

                        {/* Client info */}
                        <div className="flex flex-col items-center">
                          <p className="font-display text-xl text-charcoal">{t.name}</p>
                          {t.role && <p className="mt-0.5 text-xs text-charcoal/55">{t.role}</p>}
                          <div className="mt-3 flex items-center gap-1">
                            {[...Array(t.rating || DEFAULT_RATING)].map((_, starIndex) => (
                              <svg key={starIndex} className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>

          {/* Dots + counter */}
          {testimonials.length > 1 && (
            <>
              <div className="mt-10 flex items-center justify-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={i === index}
                    className="group px-0.5 py-1"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        i === index
                          ? "w-8 bg-gradient-to-r from-gold-soft to-gold shadow-[0_0_12px_var(--color-gold)]"
                          : "w-4 bg-white/20 group-hover:bg-white/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-4 text-center">
                <span className="font-label text-xs tracking-wider text-ivory/40">
                  {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}