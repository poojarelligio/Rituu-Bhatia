import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import IndexTab from "@/components/ui/IndexTab";

// Static data directly in the page – no external file
const staticServices = [
  {
    slug: "tarot-reading",
    code: "TR",
    title: "Tarot Reading",
    tagline: "Clarity on the decision in front of you, read card by card.",
    heroImage: "/images/services/tarotcards.jpg",
    duration: "45 minutes · Free",
  },
  {
    slug: "vaastu",
    code: "VA",
    title: "Vaastu Consultation",
    tagline: "Practical, non-disruptive changes to how your space supports you.",
    heroImage: "/images/services/vaastu.jpg",
    duration: "60 minutes · Free",
  },
  {
    slug: "astrology",
    code: "AS",
    title: "Astrology Reading",
    tagline: "A grounded look at your chart and what it means for this season of life.",
    heroImage: "/images/services/astro.jpg",
    duration: "60 minutes · Free",
  },
  {
    slug: "reiki-healing",
    code: "RE",
    title: "Reiki Healing",
    tagline: "A hands-on energy session for stress, fatigue, or feeling stuck.",
    heroImage: "/images/services/reiki.jpg",
    duration: "45 minutes · Free",
  },
];

export const metadata: Metadata = {
  title: "Services",
  description: "Tarot, Vaastu, Astrology, and Reiki — every session is free.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="THE PRACTICE"
        title="Services"
        description="Four practices, one promise — every session is completely free."
      />
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {staticServices.map((service, i) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group relative flex flex-col bg-ivory border border-line rounded-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-ivory-deep">
                <Image
                  src={service.heroImage}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[11px] font-medium text-burgundy bg-ivory rounded-full px-2.5 py-1 shadow-sm">
                  <Sparkles size={11} /> FREE
                </span>
              </div>
              <div className="p-7 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <IndexTab code={service.code} index={i} />
                  <ArrowUpRight size={18} className="text-charcoal/30 group-hover:text-burgundy transition-colors" />
                </div>
                <h3 className="font-display text-2xl text-charcoal mb-2">{service.title}</h3>
                <p className="text-sm text-charcoal/65 leading-relaxed flex-1">{service.tagline}</p>
                <div className="ledger-divider my-5" />
                <span className="text-xs text-charcoal/50">{service.duration}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}