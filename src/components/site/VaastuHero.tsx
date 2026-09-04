"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { Check, Users, Calendar, Sparkles } from "lucide-react";

export default function VaastuHero() {
  return (
    <section className="relative bg-ivory overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-ivory-deep border border-gold/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
              <span className="text-[10px] font-label text-gold tracking-wider uppercase">Featured Service</span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal font-light leading-tight mb-6">
              Best Vaastu For
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 italic text-burgundy">Home in Mumbai</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-gold/15 -z-0"></span>
              </span>
            </h1>

            {/* Description */}
            <div className="space-y-4 text-charcoal/70 leading-relaxed max-w-lg">
              <p>
                In modern society, we expect quick fixes. Western medicine focuses on curing people through surgery, pharmaceuticals and other medical interventions.
              </p>
              <p>
                In India, alternative healing methods have always complemented traditional medicine, so the Indian mind is already open to mysticism and the possibility of spiritual healing — and now even the West is attracted towards it.
              </p>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <Button href="/book" variant="primary" className="group">
                Book Appointment Now!
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Right Content - Portrait with Stats Overlay */}
          <div className="relative">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden border border-line shadow-xl">
              <Image
                src="/images/home/rituut-vaastu.jpg"
                alt="Rituu Bhatia - Vaastu Expert"
                fill
                className="object-cover"
                priority
              />
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent"></div>
              
              {/* Stats overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-display text-2xl text-gold-soft">10,000+</p>
                    <p className="text-[10px] text-ivory/60 font-label tracking-wider uppercase">Happy Clients</p>
                  </div>
                  <div className="border-x border-ivory/20">
                    <p className="font-display text-2xl text-gold-soft">12+</p>
                    <p className="text-[10px] text-ivory/60 font-label tracking-wider uppercase">Years Experience</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl text-gold-soft">Expert</p>
                    <p className="text-[10px] text-ivory/60 font-label tracking-wider uppercase">Vastu Knowledge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badge - Bottom */}
        <div className="mt-16 pt-8 border-t border-line flex flex-wrap items-center justify-center gap-8 text-xs text-charcoal/40">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-gold" />
            Trusted by 10,000+ clients
          </span>
          <span className="w-px h-4 bg-line hidden sm:block"></span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-gold" />
            12+ years of expertise
          </span>
          <span className="w-px h-4 bg-line hidden sm:block"></span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-gold" />
            Non-disruptive solutions
          </span>
          <span className="w-px h-4 bg-line hidden sm:block"></span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-gold" />
            Free consultation
          </span>
        </div>
      </div>
    </section>
  );
}