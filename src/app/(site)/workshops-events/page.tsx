import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, MoonStar } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import EventNotifyForm from "@/components/site/EventNotifyForm";
import { getUpcomingEvents, getPastEvents } from "@/lib/publicQueries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workshops & Events",
  description: "Group sessions, masterclasses, and certification cohorts.",
};

/* Scroll-reveal + small animations (pure CSS; recent Chrome/Edge/Safari.
   Other browsers simply show the content without the fade). */
const css = `
@keyframes v-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes v-pulse   { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-gold) 55%, transparent); } 50% { box-shadow: 0 0 0 10px transparent; } }
@keyframes v-float   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes v-twinkle { 0%,100% { opacity: .25; } 50% { opacity: 1; } }
.v-pulse   { animation: v-pulse 2.6s ease-out infinite; }
.v-float   { animation: v-float 7s ease-in-out infinite; animation-delay: var(--d, 0s); }
.v-twinkle { animation: v-twinkle 3.4s ease-in-out infinite; animation-delay: var(--d, 0s); }
@supports (animation-timeline: view()) {
  .v-reveal {
    animation: v-fade-up linear both;
    animation-timeline: view();
    animation-range: entry calc(var(--i, 0) * 6%) entry calc(38% + var(--i, 0) * 6%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .v-reveal, .v-pulse, .v-float, .v-twinkle { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`;

const idx = (n: number) => ({ "--i": n }) as CSSProperties;
const dly = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const goldBtn =
  "group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition-all duration-300 group-hover:shadow-[0_14px_44px_-10px_var(--color-gold)]";
const shine =
  "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full";

const pill =
  "index-tab mb-5 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 text-xs uppercase text-gold-deep backdrop-blur";
const pillDark =
  "index-tab mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs uppercase text-gold-soft backdrop-blur-md";

const sparkles = [
  { top: "14%", left: "8%", s: 12, d: 0 },
  { top: "26%", left: "88%", s: 9, d: 1.1 },
  { top: "74%", left: "14%", s: 8, d: 0.6 },
  { top: "82%", left: "82%", s: 12, d: 1.7 },
];

function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M12 0 C12.8 7.5 16.5 11.2 24 12 C16.5 12.8 12.8 16.5 12 24 C11.2 16.5 7.5 12.8 0 12 C7.5 11.2 11.2 7.5 12 0Z" />
    </svg>
  );
}

function Ornament() {
  return (
    <div className="mx-auto flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold/80" />
      <Sparkle className="v-twinkle h-4 w-4 text-gold" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold/80" />
    </div>
  );
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  const [featured, ...others] = upcoming;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <PageHeader
        eyebrow="LEARN LIVE"
        title="Workshops & Events"
        description="Group sessions, masterclasses, and certification cohorts."
      />

      {/* ───────────────────── Upcoming + Past ───────────────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-20 lg:py-24">
        <div aria-hidden className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet/15 blur-3xl" />

        <div className="mx-auto max-w-6xl space-y-20 px-6 lg:px-10">
          {/* Upcoming */}
          <div>
            <div className="v-reveal mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={pill}>
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" style={{ boxShadow: "0 0 10px var(--color-gold)" }} />
                  Upcoming
                </p>
                <h2 className="font-display text-3xl font-light leading-tight text-charcoal sm:text-4xl">
                  Join us{" "}
                  <span className="bg-gradient-to-r from-charcoal via-violet to-gold-deep bg-clip-text italic text-transparent">
                    live
                  </span>
                </h2>
              </div>
              {upcoming.length > 0 && (
                <span className="index-tab rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 text-[11px] uppercase text-gold-deep">
                  {upcoming.length} scheduled
                </span>
              )}
            </div>

            {upcoming.length === 0 && (
              <div className="v-reveal relative overflow-hidden rounded-3xl border border-gold/30 bg-white/80 px-8 py-14 text-center shadow-[0_24px_60px_-36px_var(--color-gold)] backdrop-blur">
                <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-ink-mid to-ink text-gold-soft">
                  <MoonStar size={26} strokeWidth={1.6} />
                </div>
                <p className="font-display text-2xl text-charcoal">Nothing scheduled right now — check back soon.</p>
                <p className="mx-auto mt-3 max-w-md text-sm text-charcoal/60">
                  Leave your details below and we&apos;ll let you know the moment a new session opens.
                </p>
              </div>
            )}

            {/* Featured: the next event */}
            {featured && (
              <Link
                href={`/workshops-events/${featured.slug}`}
                className="v-reveal group relative isolate mb-8 block overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink p-8 text-ivory shadow-[0_30px_70px_-30px_var(--color-ink)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_44px_100px_-30px_var(--color-violet)] lg:p-12"
              >
                <div aria-hidden className="v-float pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-violet/30 blur-3xl" />
                <div aria-hidden className="v-float pointer-events-none absolute -bottom-24 -left-16 -z-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" style={dly(3)} />
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                {sparkles.map((s, n) => (
                  <Sparkle
                    key={n}
                    className="v-twinkle pointer-events-none absolute -z-10 text-gold"
                    style={{ top: s.top, left: s.left, width: s.s, height: s.s, ...dly(s.d) }}
                  />
                ))}

                <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-8">
                    <p className="index-tab mb-5 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs uppercase text-gold-soft">
                      <span className="v-pulse h-2 w-2 rounded-full bg-gold" />
                      Next up
                    </p>
                    <h3 className="mb-4 font-display text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
                      {featured.title}
                    </h3>
                    {featured.excerpt && (
                      <p className="mb-6 max-w-2xl leading-relaxed text-ivory/70 lg:text-lg">{featured.excerpt}</p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm">
                      {featured.event_date && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                          <CalendarDays size={15} className="text-gold" />
                          {featured.event_date}
                        </span>
                      )}
                      {featured.event_time && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                          <Clock size={15} className="text-gold" />
                          {featured.event_time}
                        </span>
                      )}
                      {featured.location && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                          <MapPin size={15} className="text-gold" />
                          {featured.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-5 lg:col-span-4 lg:items-end">
                    {featured.fee_display && (
                      <p className="bg-gradient-to-r from-gold-soft via-gold to-gold-deep bg-clip-text font-display text-4xl font-light text-transparent lg:text-5xl">
                        {featured.fee_display}
                      </p>
                    )}
                    <span className={goldBtn}>
                      <span className={shine} />
                      <span className="relative">View Details</span>
                      <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Other upcoming events */}
            {others.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {others.map((event, i) => (
                  <Link
                    key={event.id}
                    href={`/workshops-events/${event.slug}`}
                    style={idx(i)}
                    className="v-reveal group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/80 p-7 shadow-[0_18px_40px_-28px_var(--color-ink)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_32px_70px_-28px_var(--color-gold)]"
                  >
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-soft via-gold to-violet transition-transform duration-700 group-hover:scale-x-100" />

                    <div className="mb-5 flex items-start justify-between gap-4">
                      {event.event_date && (
                        <span className="index-tab inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-[11px] text-gold-deep">
                          <CalendarDays size={13} />
                          {event.event_date}
                        </span>
                      )}
                      {event.fee_display && (
                        <span className="rounded-full bg-gradient-to-br from-gold-soft to-gold px-3 py-1 text-[11px] font-semibold text-ink">
                          {event.fee_display}
                        </span>
                      )}
                    </div>

                    <h3 className="mb-2 font-display text-2xl leading-snug text-charcoal transition-colors group-hover:text-gold-deep">
                      {event.title}
                    </h3>
                    {event.excerpt && (
                      <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-charcoal/65">{event.excerpt}</p>
                    )}

                    <div className="mt-auto space-y-2 border-t border-line pt-5 text-xs text-charcoal/60">
                      {event.event_time && (
                        <p className="flex items-center gap-2">
                          <Clock size={14} className="text-gold-deep" />
                          {event.event_time}
                        </p>
                      )}
                      {event.location && (
                        <p className="flex items-center gap-2">
                          <MapPin size={14} className="text-gold-deep" />
                          {event.location}
                        </p>
                      )}
                      <p className="flex items-center gap-1.5 pt-2 text-sm font-medium text-gold-deep">
                        View Details
                        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Past */}
          {past.length > 0 && (
            <div>
              <div className="v-reveal mb-10">
                <p className={pill}>
                  <span className="h-1.5 w-1.5 rounded-full bg-charcoal/40" />
                  Past
                </p>
                <h2 className="font-display text-3xl font-light leading-tight text-charcoal sm:text-4xl">Past Events</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((event, i) => (
                  <Link
                    key={event.id}
                    href={`/workshops-events/${event.slug}`}
                    style={idx(i % 3)}
                    className="v-reveal group relative overflow-hidden rounded-2xl border border-line bg-white/60 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:bg-white hover:shadow-[0_24px_50px_-30px_var(--color-gold)]"
                  >
                    <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-line to-line transition-all duration-500 group-hover:from-gold-soft group-hover:to-gold" />
                    <p className="mb-2 font-display text-lg leading-snug text-charcoal/85 transition-colors group-hover:text-gold-deep">
                      {event.title}
                    </p>
                    <p className="flex flex-wrap items-center gap-x-2 text-xs text-charcoal/50">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} />
                        {event.event_date}
                      </span>
                      {event.location && (
                        <>
                          <span aria-hidden>·</span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={13} />
                            {event.location}
                          </span>
                        </>
                      )}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ───────────────────── Notify me ───────────────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-ink via-ink-mid to-ink py-24 lg:py-28">
        <div aria-hidden className="v-float pointer-events-none absolute -left-24 top-0 -z-10 h-80 w-80 rounded-full bg-violet/30 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-gold/20 blur-3xl" style={dly(3)} />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
        {sparkles.map((s, n) => (
          <Sparkle
            key={n}
            className="v-twinkle pointer-events-none absolute -z-10 text-gold"
            style={{ top: s.top, left: s.left, width: s.s, height: s.s, ...dly(s.d) }}
          />
        ))}

        <div className="mx-auto max-w-2xl px-6 text-center lg:px-10">
          <div className="v-reveal">
            <p className={pillDark}>
              <span className="h-1.5 w-1.5 rounded-full bg-gold" style={{ boxShadow: "0 0 10px var(--color-gold)" }} />
              Can&apos;t find what you&apos;re looking for?
            </p>
            <h2 className="mb-5 font-display text-3xl font-light leading-tight text-ivory sm:text-4xl lg:text-5xl">
              Notify me about{" "}
              <span className="bg-gradient-to-r from-gold-soft via-gold to-gold-deep bg-clip-text italic text-transparent">
                upcoming workshops &amp; events
              </span>
            </h2>
            <Ornament />
            <p className="mx-auto mb-10 mt-5 max-w-md text-sm leading-relaxed text-ivory/70">
              Drop your name and email, and we&apos;ll let you know as soon as we schedule new workshops,
              masterclasses, and events.
            </p>
          </div>

          {/* Light card keeps the form's inputs readable */}
          <div className="v-reveal relative rounded-3xl bg-gradient-to-br from-gold-soft via-gold to-gold-deep p-[1.5px] text-left shadow-[0_30px_80px_-30px_var(--color-gold)]" style={idx(1)}>
            <div className="rounded-3xl bg-gradient-to-br from-ivory via-ivory-deep to-ivory p-6 sm:p-8">
              {/* ✅ Client Component for the interactive form */}
              <EventNotifyForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}