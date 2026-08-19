import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { getUpcomingEvents, getPastEvents } from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Workshops & Events" };

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);

  return (
    <>
      <PageHeader 
        eyebrow="LEARN LIVE" 
        title="Workshops & Events" 
        description="Group sessions, masterclasses, and certification cohorts." 
      />
      <section className="max-w-4xl mx-auto px-6 lg:px-10 py-16 space-y-12">
        <div>
          <h2 className="font-display text-xl text-charcoal mb-6">Upcoming</h2>
          <div className="space-y-6">
            {upcoming.length === 0 && (
              <p className="text-charcoal/50 text-sm">Nothing scheduled right now — check back soon.</p>
            )}
            {upcoming.map((event) => (
              <Link 
                key={event.id} 
                href={`/workshops-events/${event.slug}`}
                className="block border border-line rounded-sm p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-gold/30 hover:shadow-lg transition-all group"
              >
                <div>
                  <p className="font-display text-xl text-charcoal mb-1 group-hover:text-burgundy transition-colors">
                    {event.title}
                  </p>
                  <p className="text-sm text-charcoal/60 mb-2">{event.excerpt}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal/50">
                    <span>{event.event_date}</span>
                    <span>{event.event_time}</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-burgundy font-medium mb-2">{event.fee_display}</p>
                  <span className="text-xs text-charcoal/40 group-hover:text-burgundy transition-colors">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {past.length > 0 && (
          <div>
            <h2 className="font-display text-xl text-charcoal mb-6">Past</h2>
            <div className="space-y-4">
              {past.map((event) => (
                <Link
                  key={event.id}
                  href={`/workshops-events/${event.slug}`}
                  className="block border border-line rounded-sm p-6 hover:border-gold/30 hover:shadow-lg transition-all group"
                >
                  <p className="font-display text-lg text-charcoal mb-1 group-hover:text-burgundy transition-colors">
                    {event.title}
                  </p>
                  <p className="text-xs text-charcoal/50">
                    {event.event_date} · {event.location}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}