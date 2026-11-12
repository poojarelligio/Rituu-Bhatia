"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const css = `
@keyframes vh-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes vh-spin  { to { transform: rotate(360deg); } }
@keyframes vh-pulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-gold) 45%, transparent); } 50% { box-shadow: 0 0 0 12px transparent; } }
.vh-float { animation: vh-float 6s ease-in-out infinite; animation-delay: var(--d, 0s); }
.vh-spin  { animation: vh-spin 90s linear infinite; }
.vh-pulse { animation: vh-pulse 2.6s ease-out infinite; }
@media (prefers-reduced-motion: reduce) { .vh-float, .vh-spin, .vh-pulse { animation: none !important; } }
`;

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function VaastuHero() {
  const reduce = useReducedMotion();

  // Gentle 3D tilt on the portrait
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 140, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 140, damping: 16 });

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-ivory via-ivory-deep to-ivory">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-violet/15 blur-3xl" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ───────── Left content ───────── */}
          <motion.div
            variants={stagger}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div
              variants={rise}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 backdrop-blur"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              <span className="font-label text-[10px] uppercase tracking-wider text-gold-deep">Featured Service</span>
            </motion.div>

            <motion.h2
              variants={rise}
              className="mb-6 font-display text-4xl font-light leading-tight text-charcoal sm:text-5xl lg:text-6xl"
            >
             THE WISDOM
              <br />
              <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text italic text-transparent">
               BEHIND THE PRACTICE
              </span>
            </motion.h2>

            <motion.div variants={rise} className="mb-2 flex items-center gap-3" aria-hidden>
              <span className="h-px w-14 bg-gradient-to-r from-gold to-transparent" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            </motion.div>

            <motion.div variants={rise} className="mt-4 max-w-lg space-y-4 leading-relaxed text-charcoal/70">
              <p>
                Ancient Wisdom. A Deeper Understanding of Life.
In a world that moves faster every day, we often look for answers to life's most important questions — about our homes, relationships, career, prosperity and personal growth.
              </p>
              <p>
                For centuries, practices like Vaastu, Astrology, Tarot Card and Reiki have offered different ways to explore our surroundings, understand life's patterns and reconnect with ourselves.
              </p>
              <p>
                Rooted in traditional knowledge and the spiritual legacy of her Guru, Rituu Bhatia brings these practices together through a grounded, personalised approach to spiritual guidance and transformation.
              </p>
              <p>
                Her philosophy is simple: it's not just about finding answers, but gaining clarity, understanding your choices and moving forward with greater awareness.
              </p>
            </motion.div>

            <motion.div variants={rise} className="mt-8">
              <Link
                href="/appointment"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-mid hover:shadow-[0_14px_40px_-12px_var(--color-ink)]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Book Appointment Now</span>
                <ArrowRight size={16} className="relative text-gold transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* ───────── Right: tilting portrait ───────── */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            style={{ perspective: 1200 }}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              mx.set((e.clientX - r.left) / r.width - 0.5);
              my.set((e.clientY - r.top) / r.height - 0.5);
            }}
            onMouseLeave={() => {
              mx.set(0);
              my.set(0);
            }}
          >
            {/* rotating ring behind */}
            <svg
              aria-hidden
              className="vh-spin pointer-events-none absolute -right-10 -top-10 hidden h-48 w-48 text-gold/60 md:block"
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="100" cy="100" r="95" strokeOpacity="0.6" />
              <circle cx="100" cy="100" r="72" strokeDasharray="2 8" strokeOpacity="0.6" />
              <path d="M100 40 L148 130 L52 130 Z" strokeOpacity="0.5" />
            </svg>

            <motion.div style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative">
              {/* offset gold frame */}
              <div aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border border-gold/60" />

              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line shadow-[0_30px_80px_-30px_var(--color-ink)]">
                <Image
                  src="/images/home/rituu-home.jpg"
                  alt="Rituu Bhatia - Vaastu Expert"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                  priority
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

                {/* Stats */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="font-display text-2xl text-gold-soft"><CountUp to={10000} suffix="+" /></p>
                      <p className="font-label text-[10px] uppercase tracking-wider text-ivory/70">Happy Clients</p>
                    </div>
                    <div className="border-x border-ivory/20">
                      <p className="font-display text-2xl text-gold-soft"><CountUp to={12} suffix="+" /></p>
                      <p className="font-label text-[10px] uppercase tracking-wider text-ivory/70">Years Experience</p>
                    </div>
                    <div>
                      <p className="font-display text-2xl text-gold-soft">Expert</p>
                      <p className="font-label text-[10px] uppercase tracking-wider text-ivory/70">Vastu Knowledge</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* floating badge */}
              <div
                className="vh-float absolute -left-4 top-10 hidden items-center gap-2 rounded-2xl border border-white/40 bg-white/80 px-4 py-2.5 shadow-xl backdrop-blur-md sm:flex"
                style={{ ["--d" as string]: "0s", transform: "translateZ(40px)" }}
              >
                <span className="vh-pulse grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-gold text-ink">
                  <Sparkles size={15} />
                </span>
                <span className="text-xs font-medium leading-tight text-charcoal">
                 	Thoughtful 
                  <br />
                  guidance
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust badges */}
        {/* <motion.div
          variants={stagger}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-line pt-8 text-xs text-charcoal/60"
        >
          {["Trusted by 10,000+ clients", "12+ years of expertise", "Non-disruptive solutions"].map((t, i) => (
            <motion.span key={t} variants={rise} className="flex items-center gap-2">
              {i > 0 && <span className="mr-6 hidden h-4 w-px bg-line sm:block" />}
              <Check className="h-4 w-4 text-gold" />
              {t}
            </motion.span>
          ))}
        </motion.div> */}
      </div>
    </section>
  );
}