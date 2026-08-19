"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

interface Slide {
  eyebrow: string;
  headline: string;
  highlightedText: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
  imageAlt: string;
}

const SLIDES: Slide[] = [
  {
    eyebrow: "TAROT · VAASTU · ASTROLOGY · REIKI",
    headline: "Clarity you can",
    highlightedText: "actually act on.",
    description:
      "Rituu Bhatia reads the situation in front of you — through Tarot, Vaastu, Astrology, and Reiki — and leaves you with something practical to do next.",
    primaryCta: { label: "Book a Consultation", href: "/book" },
    secondaryCta: { label: "Free Assessment", href: "/assessment" },
    image: "/images/hero/hero-tarot.jpg",
    imageAlt: "Rituu Bhatia Tarot Reading",
  },
  {
    eyebrow: "FREE 4-QUESTION QUIZ",
    headline: "Find out what's",
    highlightedText: "quietly holding you back.",
    description:
      "A short, honest assessment of your energy, prosperity, and growth — with a clear next step at the end, not just a score.",
    primaryCta: { label: "Take the Free Assessment", href: "/assessment" },
    secondaryCta: { label: "Explore Services", href: "/services" },
    image: "/images/hero/hero-assessment.jpg",
    imageAlt: "Energy Assessment with Rituu Bhatia",
  },
  {
    eyebrow: "CERTIFIED COURSES",
    headline: "Learn the practice —",
    highlightedText: "not just receive it.",
    description:
      "For people who want to go beyond a single session. Certified training in Tarot, Vaastu, Astrology, and Reiki, taught properly from the ground up.",
    primaryCta: { label: "Browse Courses", href: "/courses" },
    secondaryCta: { label: "Upcoming Workshops", href: "/workshops-events" },
    image: "/images/hero/hero-courses.jpg",
    imageAlt: "Rituu Bhatia Teaching Courses",
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <section
      className="relative overflow-hidden bg-charcoal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Highlights"
    >
      {/* Slide track */}
      <div className="relative min-h-[80vh] lg:min-h-[90vh]">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] h-full"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className="relative w-full shrink-0 min-h-[80vh] lg:min-h-[90vh] flex items-center"
              aria-hidden={i !== index}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="100vw"
                />
                {/* Dark gradient overlay - ensures text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/50 to-charcoal/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 w-full px-6 lg:px-12 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto">
                  <div className="max-w-2xl">
                    {/* Eyebrow with decorative line */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="w-12 h-px bg-gold"></span>
                      <p className="index-tab text-xs text-gold tracking-wider">
                        {slide.eyebrow}
                      </p>
                    </div>

                    {/* Headline */}
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-ivory font-light leading-[1.1]">
                      {slide.headline}
                      <br />
                      <span className="relative inline-block">
                        <span className="italic text-gold relative z-10">
                          {slide.highlightedText}
                        </span>
                       
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-6 text-base sm:text-lg text-ivory/80 max-w-lg leading-relaxed">
                      {slide.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                      <Button href={slide.primaryCta.href} variant="onDark" className="group">
                        {slide.primaryCta.label}
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button 
                        href={slide.secondaryCta.href} 
                        variant="secondary" 
                        className="border-ivory/30 text-ivory hover:bg-ivory/10 hover:border-ivory/60"
                      >
                        {slide.secondaryCta.label}
                      </Button>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-ivory/50">
                      {/* <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                        Free sessions
                      </span>
                      <span className="w-px h-3 bg-ivory/20"></span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                        No payment needed
                      </span>
                      <span className="w-px h-3 bg-ivory/20"></span> */}
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                        100% confidential
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls - positioned at bottom */}
      <div className="absolute bottom-8 left-0 right-0 z-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-2 bg-charcoal/40 backdrop-blur-sm rounded-full px-4 py-2 border border-ivory/10">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className="group py-1 px-0.5"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-8 bg-gold"
                      : "w-4 bg-ivory/30 group-hover:bg-ivory/60"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/40 backdrop-blur-sm border border-ivory/10 text-ivory/60 hover:text-gold hover:border-gold/30 transition-all hover:bg-charcoal/60"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/40 backdrop-blur-sm border border-ivory/10 text-ivory/60 hover:text-gold hover:border-gold/30 transition-all hover:bg-charcoal/60"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide number indicator */}
      <div className="absolute bottom-8 right-6 lg:right-12 z-10 hidden lg:block">
        <span className="font-label text-xs text-ivory/30 tracking-wider">
          {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* Decorative corner accent - bottom left */}
      <div className="absolute bottom-0 left-0 z-10 w-24 h-24 border-l-2 border-b-2 border-gold/20 hidden lg:block"></div>
    </section>
  );
}