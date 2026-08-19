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

          {/* Right Content - Stats Card */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white border border-line rounded-sm p-8 lg:p-10 shadow-xl relative z-10">
              {/* Decorative corner accent */}
              <div className="absolute -top-3 -right-3 w-16 h-16 border-t-2 border-r-2 border-gold/30 rounded-tr-sm"></div>
              <div className="absolute -bottom-3 -left-3 w-16 h-16 border-b-2 border-l-2 border-gold/30 rounded-bl-sm"></div>

              <div className="text-center mb-8">
                <p className="index-tab text-xs text-gold tracking-wider mb-2">SERVICE AND CONSULTANT</p>
                <h2 className="font-display text-2xl text-charcoal font-light">
                  Rituu Bhatia
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="w-8 h-px bg-gold/40"></span>
                  <span className="text-xs text-charcoal/40 font-label">VASTU EXPERT</span>
                  <span className="w-8 h-px bg-gold/40"></span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* Stat 1 */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-gold" />
                  </div>
                  <p className="font-display text-2xl text-charcoal font-light">10,000+</p>
                  <p className="text-[10px] text-charcoal/40 font-label tracking-wider uppercase">Happy Clients</p>
                </div>

                {/* Stat 2 */}
                <div className="text-center border-x border-line">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-gold" />
                  </div>
                  <p className="font-display text-2xl text-charcoal font-light">12+</p>
                  <p className="text-[10px] text-charcoal/40 font-label tracking-wider uppercase">Years of Experience</p>
                </div>

                {/* Stat 3 */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Sparkles className="w-5 h-5 text-gold" />
                  </div>
                  <p className="font-display text-2xl text-charcoal font-light">Expert</p>
                  <p className="text-[10px] text-charcoal/40 font-label tracking-wider uppercase">Deep Knowledge in Vastu</p>
                </div>
              </div>
            </div>

            {/* Decorative floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 border border-gold/10 rounded-full z-0"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-gold/10 rounded-full z-0"></div>
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