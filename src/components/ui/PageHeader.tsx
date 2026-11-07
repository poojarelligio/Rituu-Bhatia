"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" as const, delay },
  });

  return (
    <section className="relative isolate overflow-hidden py-10 md:py-15">
      {/* Background image – slow settle-in zoom */}
      <motion.div
        className="absolute inset-0 -z-20"
        initial={reduceMotion ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
      >
        <Image
          src="/images/bg/pageheader.jpg"
          alt="Page header background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Readability overlay (dark burgundy tint, heavier at the bottom) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(42,15,28,0.55) 0%, rgba(42,15,28,0.45) 45%, rgba(42,15,28,0.75) 100%)",
        }}
      />

      {/* Soft colour glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 -z-10 h-80 w-80 rounded-full bg-[#D4AF5A]/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#7B3FB5]/25 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-10">
        {eyebrow && (
          <motion.p
            {...fadeUp(0.1)}
            className="index-tab mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs text-ivory backdrop-blur-md"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-gold"
              style={{ boxShadow: "0 0 10px #D4AF5A" }}
            />
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          {...fadeUp(0.25)}
          className="font-display text-5xl font-light leading-tight text-gold drop-shadow-[0_2px_24px_rgba(212,175,90,0.35)] sm:text-6xl"
        >
          {title}
        </motion.h1>

        {/* Gold divider */}
        <motion.div
          {...fadeUp(0.4)}
          className="mx-auto mt-6 flex items-center justify-center gap-3"
          aria-hidden
        >
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/80" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/80" />
        </motion.div>

        {description && (
          <motion.p
            {...fadeUp(0.55)}
            className="mx-auto mt-6 max-w-2xl leading-relaxed text-white/80"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}