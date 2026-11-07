import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, User } from "lucide-react";
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

/* Animations are pure CSS (recent Chrome/Edge/Safari; elsewhere the content
   simply appears without the fade). */
const css = `
@keyframes v-fade-up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes v-pulse   { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-gold) 55%, transparent); } 50% { box-shadow: 0 0 0 10px transparent; } }
@keyframes v-float   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes v-twinkle { 0%,100% { opacity: .25; } 50% { opacity: 1; } }
@keyframes v-settle  { from { transform: scale(1.1); } to { transform: scale(1); } }
.v-hero-in { opacity: 0; animation: v-fade-up .9s ease-out forwards; animation-delay: var(--d, 0s); }
.v-pulse   { animation: v-pulse 2.6s ease-out infinite; }
.v-float   { animation: v-float 7s ease-in-out infinite; animation-delay: var(--d, 0s); }
.v-twinkle { animation: v-twinkle 3.4s ease-in-out infinite; animation-delay: var(--d, 0s); }
.v-settle  { animation: v-settle 2.4s ease-out both; }
@supports (animation-timeline: view()) {
  .v-reveal {
    animation: v-fade-up linear both;
    animation-timeline: view();
    animation-range: entry calc(var(--i, 0) * 6%) entry calc(38% + var(--i, 0) * 6%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .v-hero-in, .v-reveal, .v-pulse, .v-float, .v-twinkle, .v-settle { animation: none !important; opacity: 1 !important; transform: none !important; }
}
`;

const dly = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
const idx = (n: number) => ({ "--i": n }) as CSSProperties;

const sparkles = [
  { top: "16%", left: "8%", s: 12, d: 0 },
  { top: "28%", left: "90%", s: 9, d: 1.1 },
  { top: "74%", left: "14%", s: 8, d: 0.6 },
  { top: "80%", left: "84%", s: 12, d: 1.7 },
];

function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M12 0 C12.8 7.5 16.5 11.2 24 12 C16.5 12.8 12.8 16.5 12 24 C11.2 16.5 7.5 12.8 0 12 C7.5 11.2 11.2 7.5 12 0Z" />
    </svg>
  );
}

function formatDate(value?: string | null) {
  if (!value) return null;
  // Date-only strings (YYYY-MM-DD) are read at noon so the day never shifts with timezones.
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}

const goldBtn =
  "group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-10px_var(--color-gold)]";
const shine =
  "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full";

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

  const dateText = formatDate(event.event_date);
  const registerHref: string = event.registration_link || `/contact?event=${event.slug}`;
  const isExternal = /^https?:\/\//i.test(registerHref);

  const RegisterButton = ({ className = "" }: { className?: string }) => {
    const inner = (
      <>
        <span className={shine} />
        <span className="relative">Register Now</span>
        <ArrowRight size={16} className="relative transition-transform duration-300 group-hover/btn:translate-x-1" />
      </>
    );
    return isExternal ? (
      <a href={registerHref} target="_blank" rel="noreferrer" className={`${goldBtn} ${className}`}>
        {inner}
      </a>
    ) : (
      <Link href={registerHref} className={`${goldBtn} ${className}`}>
        {inner}
      </Link>
    );
  };

  const meta = [
    dateText && { icon: Calendar, label: "Date", value: dateText },
    event.event_time && { icon: Clock, label: "Time", value: event.event_time },
    event.location && { icon: MapPin, label: "Location", value: event.location },
    event.speaker && { icon: User, label: "Speaker", value: event.speaker },
  ].filter(Boolean) as { icon: typeof Calendar; label: string; value: string }[];

  const descriptionParagraphs = event.description ? event.description.split("\n").filter((p: string) => p.trim()) : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ───────────────────── Hero ───────────────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-ink via-ink-mid to-ink">
        {event.image_url && (
          <div className="v-settle absolute inset-0 -z-20">
            <Image src={event.image_url} alt={event.title} fill priority sizes="100vw" className="object-cover opacity-40" />
          </div>
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-ink/90 via-ink/70 to-ink/90" />
        <div aria-hidden className="v-float pointer-events-none absolute -left-24 top-0 -z-10 h-80 w-80 rounded-full bg-violet/30 blur-3xl" />
        <div aria-hidden className="v-float pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-gold/25 blur-3xl" style={dly(3)} />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        {sparkles.map((s, n) => (
          <Sparkle
            key={n}
            className="v-twinkle pointer-events-none absolute -z-10 text-gold"
            style={{ top: s.top, left: s.left, width: s.s, height: s.s, ...dly(s.d) }}
          />
        ))}

        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
          <Link
            href="/workshops-events"
            className="v-hero-in group mb-8 inline-flex items-center gap-2 text-sm text-ivory/60 transition-colors hover:text-gold-soft"
            style={dly(0.05)}
          >
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Events
          </Link>

          <div className="v-hero-in mb-6" style={dly(0.15)}>
            <span
              className={`index-tab inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs uppercase ${
                isUpcoming
                  ? "border-gold/50 bg-gold/15 text-gold-soft"
                  : "border-white/20 bg-white/10 text-ivory/60"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isUpcoming ? "v-pulse bg-gold" : "bg-ivory/40"}`} />
              {isUpcoming ? "Upcoming" : "Past Event"}
            </span>
          </div>

          <h1
            className="v-hero-in mb-5 max-w-3xl font-display text-4xl font-light leading-[1.1] text-ivory sm:text-5xl lg:text-6xl"
            style={dly(0.3)}
          >
            {event.title}
          </h1>

          {event.excerpt && (
            <p className="v-hero-in mb-8 max-w-2xl text-lg leading-relaxed text-ivory/75" style={dly(0.45)}>
              {event.excerpt}
            </p>
          )}

          {/* meta chips */}
          {meta.length > 0 && (
            <div className="v-hero-in mb-9 flex flex-wrap gap-3" style={dly(0.6)}>
              {meta.map(({ icon: Icon, value }) => (
                <span
                  key={value}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-ivory backdrop-blur-md"
                >
                  <Icon size={16} className="shrink-0 text-gold" />
                  {value}
                </span>
              ))}
            </div>
          )}

          {/* CTA – only for upcoming events */}
          {isUpcoming && (
            <div className="v-hero-in flex flex-wrap items-center gap-5" style={dly(0.75)}>
              <RegisterButton />
              {event.fee_display && (
                <span className="text-sm text-ivory/60">
                  Fee:{" "}
                  <span className="bg-gradient-to-r from-gold-soft via-gold to-gold-deep bg-clip-text font-display text-2xl text-transparent">
                    {event.fee_display}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ───────────────────── Content ───────────────────── */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-16 lg:py-24">
        <div aria-hidden className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet/15 blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
          {/* Left: description + gallery */}
          <div className="space-y-12 lg:col-span-8">
            {descriptionParagraphs.length > 0 && (
              <div
                className="v-reveal relative overflow-hidden rounded-3xl border border-line bg-white/80 p-8 shadow-[0_24px_60px_-40px_var(--color-ink)] backdrop-blur sm:p-10"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold-soft via-gold to-violet" />
                <p className="index-tab mb-5 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs uppercase text-gold-deep">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  About this event
                </p>
                <div className="prose-content text-lg leading-relaxed text-charcoal/75">
                  {descriptionParagraphs.map((paragraph: string, i: number) => (
                    <p key={i} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {descriptionParagraphs.length === 0 && gallery.length === 0 && (
              <div className="v-reveal rounded-3xl border border-dashed border-gold/40 bg-white/70 p-10 text-center text-charcoal/65">
                More details about this event are coming soon.
              </div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <p className="v-reveal index-tab mb-6 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-white/70 px-4 py-1.5 text-xs uppercase text-gold-deep backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Gallery
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {gallery.map((img: string, i: number) => (
                    <div
                      key={i}
                      style={idx(i % 3)}
                      className={`v-reveal group relative isolate overflow-hidden rounded-2xl border border-line shadow-[0_18px_40px_-28px_var(--color-ink)] ${
                        i === 0 && gallery.length >= 3 ? "col-span-2 row-span-2 min-h-[220px]" : "aspect-square"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Event photo ${i + 1}`}
                        fill
                        sizes="(min-width: 1024px) 30vw, 50vw"
                        className="-z-10 object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                      />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div aria-hidden className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 transition-all duration-500 group-hover:ring-2 group-hover:ring-gold/70" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: sticky details card */}
          <aside className="lg:col-span-4">
            <div className="v-reveal lg:sticky lg:top-24" style={idx(1)}>
              <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink p-7 text-ivory shadow-[0_30px_80px_-30px_var(--color-ink)]">
                <div aria-hidden className="v-float pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-violet/35 blur-3xl" />
                <div aria-hidden className="v-float pointer-events-none absolute -bottom-20 -left-16 -z-10 h-56 w-56 rounded-full bg-gold/25 blur-3xl" style={dly(2.5)} />
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

                <p className="index-tab mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] uppercase text-gold-soft backdrop-blur-md">
                  <span className={`h-1.5 w-1.5 rounded-full ${isUpcoming ? "v-pulse bg-gold" : "bg-ivory/40"}`} />
                  Event details
                </p>

                <dl className="space-y-5 text-sm">
                  {meta.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4 border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                        <Icon size={17} />
                      </span>
                      <div>
                        <dt className="mb-0.5 text-[11px] uppercase tracking-wider text-ivory/50">{label}</dt>
                        <dd className="leading-snug text-ivory">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>

                {isUpcoming ? (
                  <div className="mt-7 border-t border-white/10 pt-6">
                    {event.fee_display && (
                      <div className="mb-5 flex items-end justify-between">
                        <p className="index-tab text-[11px] uppercase tracking-wide text-ivory/60">Fee</p>
                        <p className="bg-gradient-to-r from-gold-soft via-gold to-gold-deep bg-clip-text font-display text-3xl font-light text-transparent">
                          {event.fee_display}
                        </p>
                      </div>
                    )}
                    <RegisterButton className="w-full justify-center" />
                  </div>
                ) : (
                  <div className="mt-7 border-t border-white/10 pt-6">
                    <p className="mb-4 text-sm leading-relaxed text-ivory/65">
                      This event has taken place. See what&apos;s coming up next.
                    </p>
                    <Link
                      href="/workshops-events"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium text-ivory backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-white/15"
                    >
                      Upcoming events
                      <ArrowRight size={16} className="text-gold transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Back to events */}
        <div className="mx-auto mt-16 max-w-6xl px-6 lg:px-10">
          <div className="border-t border-line pt-8">
            <Link
              href="/workshops-events"
              className="group inline-flex items-center gap-2 text-sm text-charcoal/60 transition-colors hover:text-gold-deep"
            >
              <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back to all events
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}