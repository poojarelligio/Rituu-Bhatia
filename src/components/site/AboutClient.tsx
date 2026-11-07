"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Compass, Heart, Sparkles, Star, Users } from "lucide-react";

/* Place in: src/components/site/AboutClient.tsx
   Interactive pieces for the About page, styled to match the homepage
   (rounded glass cards, gold gradients). Icons are referenced by name
   because server components can't pass component functions to client ones. */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* 1. CountUp — "12+" / "10,000+" count up when scrolled into view      */
/* ------------------------------------------------------------------ */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const m = value.match(/^([\d,]+)(.*)$/);
  const target = m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
  const suffix = m ? m[2] : "";
  const [n, setN] = useState(0);

  useEffect(() => {
    if (target === null) return;
    if (reduce) {
      setN(target);
      return;
    }
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, reduce]);

  if (target === null) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 2. TiltFrame — gentle 3D tilt that follows the cursor                */
/* ------------------------------------------------------------------ */
export function TiltFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 120, damping: 16 });
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 16 });

  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. ApproachExplorer — pick a step, the big glass panel changes       */
/* ------------------------------------------------------------------ */
interface ApproachItem {
  num: string;
  step: string;
  body: string;
}

export function ApproachExplorer({ items }: { items: ApproachItem[] }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const item = items[i];

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      setI((i + 1) % items.length);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      setI((i - 1 + items.length) % items.length);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div
        role="tablist"
        aria-orientation="vertical"
        onKeyDown={onKey}
        className="flex flex-col gap-3 lg:col-span-5"
      >
        {items.map((it, idx) => {
          const on = idx === i;
          return (
            <button
              key={it.num}
              role="tab"
              id={`approach-tab-${idx}`}
              aria-selected={on}
              aria-controls="approach-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setI(idx)}
              onMouseEnter={() => setI(idx)}
              className={`group flex w-full items-center gap-5 rounded-2xl border px-6 py-5 text-left backdrop-blur-md transition-all duration-500 ${
                on
                  ? "translate-x-1.5 border-gold/60 bg-white/10 shadow-[0_20px_50px_-24px_var(--color-gold)]"
                  : "border-white/10 bg-white/[0.04] hover:border-gold/40 hover:bg-white/[0.07]"
              }`}
            >
              <span
                aria-hidden
                className="font-display text-4xl font-light leading-none text-transparent transition-all duration-500"
                style={{
                  WebkitTextStroke: `1.5px ${on ? "#EDB24E" : "rgba(237, 178, 78, 0.4)"}`,
                }}
              >
                {it.num}
              </span>
              <span
                className={`font-display text-2xl font-light transition-colors duration-500 lg:text-3xl ${
                  on ? "text-gold-soft" : "text-ivory/75 group-hover:text-ivory"
                }`}
              >
                {it.step}
              </span>
              <span
                aria-hidden
                className={`ml-auto h-[3px] rounded-full bg-gradient-to-r from-gold-soft to-gold transition-all duration-500 ${
                  on ? "w-12" : "w-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="approach-panel"
        aria-labelledby={`approach-tab-${i}`}
        className="relative min-h-[340px] overflow-hidden rounded-3xl border border-white/15 bg-white/[0.05] p-8 backdrop-blur-md lg:col-span-7 lg:p-14"
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet/30 blur-3xl" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.num}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative flex h-full min-h-[260px] flex-col justify-between"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[140px] font-light leading-none text-transparent lg:text-[200px]"
              style={{ WebkitTextStroke: "1.5px rgba(237, 178, 78, 0.25)" }}
            >
              {item.num}
            </span>
            <div className="relative pt-16 lg:pt-24">
              <h3 className="v-grad-gold mb-5 font-display text-4xl font-light lg:text-6xl">{item.step}</h3>
              <p className="max-w-md text-lg leading-relaxed text-ivory/80 lg:text-xl">{item.body}</p>
            </div>
            <div className="relative mt-10 flex items-center gap-2">
              {items.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    idx === i ? "w-10 bg-gradient-to-r from-gold-soft to-gold" : "w-5 bg-ivory/20"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. PillarsExpand — five rounded panels, the active one opens         */
/* ------------------------------------------------------------------ */
const ICONS = { compass: Compass, sparkles: Sparkles, heart: Heart, users: Users, star: Star } as const;

interface PillarItem {
  num: string;
  icon: keyof typeof ICONS;
  title: string;
  description: string;
    image: string;
}

export function PillarsExpand({ items }: { items: PillarItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <ul className="flex flex-col gap-4 lg:h-[480px] lg:flex-row">
      {items.map((p, i) => {
        const Icon = ICONS[p.icon];
        const on = i === active;
        return (
          
          <li
          
            key={p.num}
            onMouseEnter={() => setActive(i)}
            className={`relative isolate min-w-0 overflow-hidden rounded-2xl border transition-[flex,background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex-1 ${
              on
                ? "border-gold/60 bg-gradient-to-br from-ink via-ink-mid to-ink text-ivory shadow-[0_30px_70px_-30px_var(--color-violet)] lg:flex-[3]"
                : "border-line bg-white/80 text-charcoal backdrop-blur hover:border-gold/60"
            }`}
          >
            <img
  src={p.image}
  alt={p.title}
  className={`absolute inset-0 -z-10 h-full w-full object-cover transition-all duration-700 ${
    on ? "scale-100 opacity-30" : "scale-105 opacity-15"
  }`}
/>
            {on && (
              <>
                <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-violet/30 blur-3xl" />
              </>
            )}
            <button
              type="button"
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-expanded={on}
              className="flex h-full min-h-[120px] w-full flex-col justify-between gap-10 p-7 text-left lg:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className={`index-tab text-xs ${on ? "text-gold-soft" : "text-charcoal/50"}`}>
                    {p.num}
                  </span>
                  <span
                    className={`h-[3px] rounded-full bg-gradient-to-r from-gold-soft to-gold transition-all duration-500 ${
                      on ? "w-14" : "w-6"
                    }`}
                  />
                </span>
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full border transition-colors duration-500 ${
                    on ? "border-gold/60 bg-gold/15 text-gold" : "border-gold/30 bg-gold/10 text-gold-deep"
                  }`}
                >
                  <Icon size={20} strokeWidth={1.5} />
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl leading-tight lg:text-2xl">{p.title}</h3>
                <div
                  className={`grid transition-all duration-500 ${
                    on ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-ivory/75 lg:text-base">
                    {p.description}
                  </p>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}