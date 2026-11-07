"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2, MapPin, Video, CalendarCheck, Clock } from "lucide-react";

interface Service {
  id: string;
  name: string;
  duration: string;
}
interface Slot {
  time: string;
  label: string;
}
interface Props {
  services: Service[];
  today: string; // YYYY-MM-DD (IST)
  maxDaysAhead: number;
  openWeekdays: number[];
  studioAddress: string;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const addDays = (d: string, n: number) => {
  const t = new Date(`${d}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
};
const pretty = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

const field =
  "w-full rounded-xl border border-line bg-white/90 px-4 py-3 text-sm text-charcoal outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";

function StepTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-gold text-sm font-semibold text-ink">{n}</span>
      <h2 className="font-display text-xl text-charcoal">{children}</h2>
    </div>
  );
}

export default function BookingClient({ services, today, maxDaysAhead, openWeekdays, studioAddress }: Props) {
  const [service, setService] = useState<string>("");
  const [mode, setMode] = useState<"online" | "studio">("online");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsErr, setSlotsErr] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ reference: string; meetLink: string | null } | null>(null);

  const maxDate = addDays(today, maxDaysAhead);
  const [month, setMonth] = useState(() => {
    const [y, m] = today.split("-").map(Number);
    return { y, m };
  });

  const svc = services.find((s) => s.id === service);

  /* load slots when date changes */
  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setSlots(null);
    setSlotsErr("");
    setTime("");
    fetch(`/api/appointments/slots?date=${date}`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (j.error) setSlotsErr(j.error);
        else setSlots(j.slots);
      })
      .catch(() => !cancelled && setSlotsErr("Could not load times. Please try again."));
    return () => {
      cancelled = true;
    };
  }, [date]);

  /* month grid */
  const cells = useMemo(() => {
    const first = `${month.y}-${String(month.m).padStart(2, "0")}-01`;
    const lead = new Date(`${first}T00:00:00Z`).getUTCDay();
    const count = new Date(Date.UTC(month.y, month.m, 0)).getUTCDate();
    const out: ({ d: string; n: number; ok: boolean } | null)[] = Array(lead).fill(null);
    for (let n = 1; n <= count; n++) {
      const d = `${month.y}-${String(month.m).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
      const dow = new Date(`${d}T00:00:00Z`).getUTCDay();
      out.push({ d, n, ok: d >= today && d <= maxDate && openWeekdays.includes(dow) });
    }
    return out;
  }, [month, today, maxDate, openWeekdays]);

  const [ty, tm] = today.split("-").map(Number);
  const [my, mm] = maxDate.split("-").map(Number);
  const canPrev = month.y > ty || (month.y === ty && month.m > tm);
  const canNext = month.y < my || (month.y === my && month.m < mm);
  const step = (dir: 1 | -1) =>
    setMonth(({ y, m }) => {
      const n = m + dir;
      return n < 1 ? { y: y - 1, m: 12 } : n > 12 ? { y: y + 1, m: 1 } : { y, m: n };
    });

  const ready = service && date && time && form.name.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim().length >= 7;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, mode, date, time, ...form }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone({ reference: json.reference ?? "", meetLink: json.meetLink ?? null });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(json.error || "Something went wrong. Please try again.");
        if (res.status === 409) {
          const d = date;
          setDate("");
          setTimeout(() => setDate(d), 0); // reload slots
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  /* ------------------------------ success ------------------------------ */
  if (done && svc) {
    const label = slots?.find((s) => s.time === time)?.label ?? time;
    return (
      <div className="v-pop relative mx-auto max-w-xl overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink p-10 text-center text-ivory shadow-[0_30px_70px_-30px_var(--color-ink)]">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-gold text-ink">
          <Check size={30} />
        </span>
        <h2 className="mb-2 font-display text-3xl font-light">
          <span className="v-grad-gold">Request received</span>
        </h2>
        <p className="mb-6 text-ivory/75">We will confirm your appointment shortly. You will get an email at {form.email} once it is confirmed, with the calendar invite.</p>
        <div className="mb-6 rounded-2xl border border-white/15 bg-white/5 p-5 text-left text-sm">
          <p className="font-semibold text-gold-soft">{svc.name}</p>
          <p className="mt-1 text-ivory/80">{pretty(date)} · {label} IST</p>
          {done.reference && <p className="mt-3 text-xs text-ivory/50">Reference: {done.reference}</p>}
        </div>
        {done.meetLink && (
          <a href={done.meetLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-gold-soft to-gold px-6 py-3 text-sm font-semibold text-ink">
            <Video size={16} /> Open Google Meet link
          </a>
        )}
      </div>
    );
  }

  /* ------------------------------- form -------------------------------- */
  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-8 lg:col-span-8">
        {/* 1 service */}
        <div className="v-reveal rounded-3xl border border-line bg-white/80 p-6 backdrop-blur sm:p-8">
          <StepTitle n={1}>Choose a service</StepTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setService(s.id)}
                aria-pressed={service === s.id}
                className={`rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                  service === s.id ? "border-gold bg-gold/10 shadow-[0_14px_30px_-18px_var(--color-gold)]" : "border-line bg-white hover:border-gold/60"
                }`}
              >
                <span className="block font-display text-base text-charcoal">{s.name}</span>
                <span className="mt-1 flex items-center gap-3 text-xs text-charcoal/60">
                  <span className="flex items-center gap-1"><Clock size={12} /> {s.duration}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {([
              ["online", "Online (Google Meet)", Video],
              ["studio", "At the studio", MapPin],
            ] as const).map(([v, label, Icon]) => (
              <button
                type="button"
                key={v}
                onClick={() => setMode(v)}
                aria-pressed={mode === v}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
                  mode === v ? "border-gold bg-gold/10 text-charcoal" : "border-line bg-white text-charcoal/70 hover:border-gold/60"
                }`}
              >
                <Icon size={15} className="text-gold-deep" /> {label}
              </button>
            ))}
          </div>
          {mode === "studio" && <p className="mt-3 text-xs leading-relaxed text-charcoal/60">{studioAddress}</p>}
        </div>

        {/* 2 date + time */}
        <div className="v-reveal rounded-3xl border border-line bg-white/80 p-6 backdrop-blur sm:p-8">
          <StepTitle n={2}>Pick a date &amp; time</StepTitle>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <button type="button" onClick={() => step(-1)} disabled={!canPrev} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-full border border-line disabled:opacity-30">
                  <ChevronLeft size={16} />
                </button>
                <span className="font-display text-base text-charcoal">{MONTHS[month.m - 1]} {month.y}</span>
                <button type="button" onClick={() => step(1)} disabled={!canNext} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-full border border-line disabled:opacity-30">
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-charcoal/50">
                {DOW.map((d) => <span key={d} className="py-1">{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((c, i) =>
                  c ? (
                    <button
                      type="button"
                      key={c.d}
                      disabled={!c.ok}
                      onClick={() => setDate(c.d)}
                      aria-pressed={date === c.d}
                      className={`aspect-square rounded-xl text-sm transition ${
                        date === c.d
                          ? "bg-gradient-to-br from-gold-soft to-gold font-semibold text-ink shadow-[0_8px_20px_-8px_var(--color-gold)]"
                          : c.ok
                            ? "text-charcoal hover:bg-gold/15"
                            : "cursor-not-allowed text-charcoal/25"
                      }`}
                    >
                      {c.n}
                    </button>
                  ) : (
                    <span key={`e${i}`} />
                  ),
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm text-charcoal/70">{date ? pretty(date) : "Select a date to see available times"}</p>
              {date && slots === null && !slotsErr && (
                <p className="flex items-center gap-2 text-sm text-charcoal/60"><Loader2 size={15} className="animate-spin" /> Checking availability…</p>
              )}
              {slotsErr && <p className="text-sm text-red-600">{slotsErr}</p>}
              {slots && slots.length === 0 && <p className="text-sm text-charcoal/60">No times left on this day. Please choose another date.</p>}
              {slots && slots.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((s) => (
                    <button
                      type="button"
                      key={s.time}
                      onClick={() => setTime(s.time)}
                      aria-pressed={time === s.time}
                      className={`rounded-xl border px-2 py-2.5 text-sm transition ${
                        time === s.time ? "border-gold bg-gold/15 font-semibold text-charcoal" : "border-line bg-white text-charcoal/80 hover:border-gold/60"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-3 text-[11px] text-charcoal/45">All times are Indian Standard Time (IST).</p>
            </div>
          </div>
        </div>

        {/* 3 details */}
        <div className="v-reveal rounded-3xl border border-line bg-white/80 p-6 backdrop-blur sm:p-8">
          <StepTitle n={3}>Your details</StepTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={field} placeholder="Full name" autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={field} placeholder="Phone / WhatsApp" autoComplete="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className={`${field} sm:col-span-2`} type="email" placeholder="Email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <textarea className={`${field} sm:col-span-2`} rows={3} placeholder="Anything you'd like to share before the session? (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {/* honeypot: hidden from humans */}
            <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
        </div>
      </div>

      {/* summary */}
      <aside className="lg:col-span-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink p-7 text-ivory shadow-[0_30px_70px_-30px_var(--color-ink)] lg:sticky lg:top-28">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          <span className="index-tab mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] uppercase text-gold-soft">
            <CalendarCheck size={13} /> Your booking
          </span>
          <dl className="space-y-4 text-sm">
            <div><dt className="text-ivory/50">Service</dt><dd className="font-display text-lg">{svc?.name ?? "—"}</dd></div>
            <div><dt className="text-ivory/50">Mode</dt><dd>{mode === "online" ? "Online (Google Meet)" : "At the studio"}</dd></div>
            <div><dt className="text-ivory/50">When</dt><dd>{date && time ? `${pretty(date)} · ${slots?.find((s) => s.time === time)?.label}` : "—"}</dd></div>
          </dl>
          {error && <p role="alert" className="mt-5 rounded-xl bg-red-500/15 px-3 py-2 text-sm text-red-200">{error}</p>}
          <button
            type="submit"
            disabled={!ready || busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft to-gold px-6 py-3.5 text-sm font-semibold text-ink transition hover:shadow-[0_12px_30px_-10px_var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? <><Loader2 size={16} className="animate-spin" /> Booking…</> : "Request appointment"}
          </button>
        </div>
      </aside>
    </form>
  );
}
