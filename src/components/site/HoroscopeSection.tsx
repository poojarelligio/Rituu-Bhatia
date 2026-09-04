"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Sparkles, MoonStar } from "lucide-react";
import Button from "@/components/ui/Button";
import { ZODIAC_SIGNS } from "@/lib/zodiacSigns";

interface HoroscopeResult {
  date: string;
  sign: string;
  horoscope: string;
}

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
    <section className="bg-charcoal py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="index-tab text-xs text-gold-soft mb-4">DAILY HOROSCOPE</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ivory font-light leading-tight">
            What does today hold for you?
          </h2>
          <p className="mt-4 text-ivory/60 leading-relaxed">
            Select your sign from the wheel for a free daily reading.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <div
              className="zodiac-wheel-outer relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px]
                [--icon-radius:108px] [--label-radius:150px]
                sm:[--icon-radius:156px] sm:[--label-radius:206px]"
            >
              <div className="absolute inset-16 sm:inset-20 rounded-full border border-ivory/10" />

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
                          className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                            isSelected
                              ? "bg-burgundy border-burgundy text-ivory"
                              : "bg-charcoal-soft border-ivory/20 text-ivory/70 hover:border-gold hover:text-gold-soft"
                          }`}
                        >
                          <Icon size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
                        </button>
                      </RadialItem>

                      <RadialItem angle={angle} radiusVar="--label-radius">
                        <button
                          onClick={() => handleSelect(sign.slug)}
                          className={`text-[9px] sm:text-[11px] uppercase tracking-wide whitespace-nowrap transition-colors duration-300 ${
                            isSelected ? "text-gold-soft font-medium" : "text-ivory/45 hover:text-ivory/80"
                          }`}
                        >
                          {sign.name}
                        </button>
                      </RadialItem>
                    </div>
                  );
                })}
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="zodiac-center-emblem w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-ivory-deep  flex items-center justify-center">
                   <Image
                    src="/images/logo2.png"  // ← Replace with your logo path
                    alt="Rituu Bhatia Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-[280px] flex items-center">
            {!selectedSlug && !loading && (
              <div className="text-center lg:text-left w-full">
                <MoonStar size={28} className="text-gold-soft mx-auto lg:mx-0 mb-4" strokeWidth={1.5} />
                <p className="text-ivory/60 leading-relaxed max-w-sm mx-auto lg:mx-0">
                  Choose your sign from the wheel — your free reading for today will appear right here.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-ivory/50 text-sm w-full justify-center lg:justify-start">
                <Loader2 size={16} className="animate-spin" />
                Reading the stars…
              </div>
            )}

            {error && !loading && (
              <p className="text-center lg:text-left text-sm text-gold-soft w-full">{error}</p>
            )}

            {result && !loading && selectedSign && (
              <div className="w-full">
                <div className="flex items-center gap-3 mb-5">
                  <selectedSign.icon size={28} className="text-gold-soft" strokeWidth={1.5} />
                  <div>
                    <p className="font-display text-2xl text-ivory">{selectedSign.name}</p>
                    <p className="text-xs text-ivory/40 uppercase tracking-wide">{formatDate(result.date)}</p>
                  </div>
                </div>
                <div className="h-px bg-ivory/10 mb-5" />
                <p className="text-ivory/75 leading-relaxed text-lg mb-8">{result.horoscope}</p>
                <Button href="/book" variant="onDark">Book a Consultation</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}