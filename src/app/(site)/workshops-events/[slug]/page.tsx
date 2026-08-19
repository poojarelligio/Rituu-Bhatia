import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, User, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import IndexTab from "@/components/ui/IndexTab";
import { getEventBySlug } from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.excerpt || event.description || "",
  };
}

// Main page component
export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const isUpcoming = event.event_status === "upcoming";

  // Parse gallery if it exists
  const gallery: string[] = Array.isArray(event.gallery)
    ? event.gallery
    : typeof event.gallery === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(event.gallery);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-ivory-deep border-b border-line overflow-hidden">
        {/* Background image if exists */}
        {event.image_url && (
          <div className="absolute inset-0 opacity-10">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 py-16">
          {/* Back button */}
          <Link 
            href="/workshops-events" 
            className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-charcoal transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Events
          </Link>

          {/* Status badge */}
          <div className="flex items-center gap-3 mb-6">
            <IndexTab code={isUpcoming ? "UP" : "PA"} index={0} />
            <span className={`text-xs font-label tracking-wider px-3 py-1 rounded-full ${
              isUpcoming 
                ? "bg-gold/20 text-gold" 
                : "bg-charcoal/10 text-charcoal/50"
            }`}>
              {isUpcoming ? "Upcoming" : "Past Event"}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-charcoal font-light leading-tight mb-4">
            {event.title}
          </h1>
          
          {event.excerpt && (
            <p className="text-lg text-charcoal/65 max-w-2xl leading-relaxed mb-8">
              {event.excerpt}
            </p>
          )}

          {/* Event details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {event.event_date && (
              <div className="flex items-center gap-3 text-sm text-charcoal/60">
                <Calendar size={18} className="text-gold shrink-0" />
                <span>{new Date(event.event_date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}</span>
              </div>
            )}
            
            {event.event_time && (
              <div className="flex items-center gap-3 text-sm text-charcoal/60">
                <Clock size={18} className="text-gold shrink-0" />
                <span>{event.event_time}</span>
              </div>
            )}
            
            {event.location && (
              <div className="flex items-center gap-3 text-sm text-charcoal/60">
                <MapPin size={18} className="text-gold shrink-0" />
                <span>{event.location}</span>
              </div>
            )}
            
            {event.speaker && (
              <div className="flex items-center gap-3 text-sm text-charcoal/60">
                <User size={18} className="text-gold shrink-0" />
                <span>{event.speaker}</span>
              </div>
            )}
          </div>

          {/* CTA - Only show for upcoming events */}
          {isUpcoming && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button 
                href={event.registration_link || `/contact?event=${event.slug}`} 
                variant="primary"
                className="group"
              >
                Register Now
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              {event.fee_display && (
                <span className="text-sm text-charcoal/50">
                  Fee: <span className="text-burgundy font-medium">{event.fee_display}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        {/* Description */}
        {event.description && (
          <div className="mb-12">
            <p className="index-tab text-xs text-gold mb-4">ABOUT THIS EVENT</p>
            <div className="prose-content text-charcoal/70 leading-relaxed">
              {event.description.split("\n").map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <div>
            <p className="index-tab text-xs text-gold mb-4">GALLERY</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((img: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-sm overflow-hidden border border-line">
                  <Image
                    src={img}
                    alt={`Event photo ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to events */}
        <div className="mt-12 pt-8 border-t border-line">
          <Link 
            href="/workshops-events" 
            className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-charcoal transition-colors"
          >
            <ArrowLeft size={16} />
            Back to all events
          </Link>
        </div>
      </section>
    </>
  );
}