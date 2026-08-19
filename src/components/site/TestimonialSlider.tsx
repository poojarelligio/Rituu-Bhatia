"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

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
      className={`bg-ivory-deep py-24 relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Testimonials"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-6 lg:px-10 relative z-10">
        <SectionHeading 
          eyebrow={eyebrow} 
          title={title} 
          align="center"
        />
        
        {/* Testimonial Slider */}
        <div className="relative mt-12">
          {/* Navigation Arrows - Only show if more than 1 testimonial */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-ivory border border-line text-charcoal/60 hover:text-burgundy hover:border-burgundy transition-all shadow-sm hover:shadow-md"
              >
                <ChevronLeft size={18} />
              </button>
              
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-ivory border border-line text-charcoal/60 hover:text-burgundy hover:border-burgundy transition-all shadow-sm hover:shadow-md"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Slide Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="w-full shrink-0 px-4 md:px-6"
                >
                  <div className="bg-ivory border border-line rounded-sm p-8 md:p-10 text-center relative">
                    {/* Large decorative quote mark */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <span className="font-display text-7xl text-gold/20 leading-none">"</span>
                    </div>
                    
                    {/* Quote text */}
                    <p className="font-display text-xl md:text-base text-charcoal leading-relaxed mt-4 mb-6">
                      "{t.quote}"
                    </p>
                    
                    {/* Divider with gold line */}
                    <div className="flex items-center justify-center gap-4 mb-5">
                      <span className="w-12 h-px bg-gold/30"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                      <span className="w-12 h-px bg-gold/30"></span>
                    </div>
                    
                    {/* Client info */}
                    <div className="flex flex-col items-center">
                      <p className="text-base font-medium text-charcoal">{t.name}</p>
                      {t.role && (
                        <p className="text-xs text-charcoal/50 mt-0.5">{t.role}</p>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(t.rating || DEFAULT_RATING)].map((_, starIndex) => (
                          <svg 
                            key={starIndex} 
                            className="w-4 h-4 text-gold" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots - Only show if more than 1 testimonial */}
          {testimonials.length > 1 && (
            <>
              <div className="flex items-center justify-center gap-2 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={i === index}
                    className="group py-1 px-0.5"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        i === index
                          ? "w-8 bg-burgundy"
                          : "w-4 bg-line group-hover:bg-charcoal/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              {/* Counter */}
              <div className="text-center mt-4">
                <span className="text-xs text-charcoal/30 font-label tracking-wider">
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