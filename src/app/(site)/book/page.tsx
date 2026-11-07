"use client";

import { useEffect, useMemo, useState, Suspense, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Check, Clock, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { staticServices } from "@/lib/staticServices";
import { loadRazorpayScript } from "@/lib/client/razorpay";

function nextNDays(n: number) {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

// Local calendar date (YYYY-MM-DD). The old version used toISOString(), which is UTC
// and could shift the date by one day for users in India early in the morning.
function toYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatLong(ymd: string) {
  const d = new Date(`${ymd}T12:00:00`);
  if (isNaN(d.getTime())) return ymd;
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-charcoal outline-none transition-all duration-300 placeholder:text-charcoal/40 focus:border-gold focus:ring-4 focus:ring-gold/20";

const css = `
@keyframes bk-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes bk-twinkle { 0%,100% { opacity: .25; } 50% { opacity: 1; } }
.bk-float { animation: bk-float 7s ease-in-out infinite; animation-delay: var(--d, 0s); }
.bk-twinkle { animation: bk-twinkle 3.4s ease-in-out infinite; animation-delay: var(--d, 0s); }
@media (prefers-reduced-motion: reduce) { .bk-float, .bk-twinkle { animation: none !important; } }
`;

function Sparkle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M12 0 C12.8 7.5 16.5 11.2 24 12 C16.5 12.8 12.8 16.5 12 24 C11.2 16.5 7.5 12.8 0 12 C7.5 11.2 11.2 7.5 12 0Z" />
    </svg>
  );
}

/* A numbered "step" card */
function StepCard({
  num,
  label,
  delay = 0,
  children,
}: {
  num: string;
  label: string;
  delay?: number;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className="relative overflow-hidden rounded-3xl border border-line bg-white/80 p-6 shadow-[0_18px_40px_-30px_var(--color-ink)] backdrop-blur sm:p-8"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold-soft via-gold to-violet" />
      <div className="mb-6 flex items-center gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-gold font-display text-base text-ink shadow-[0_10px_24px_-10px_var(--color-gold)]">
          {num}
        </span>
        <p className="index-tab text-xs uppercase tracking-wider text-gold-deep">{label}</p>
        <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
      </div>
      {children}
    </motion.div>
  );
}

function BookForm() {
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("service");
  const initialSlug =
    preselectedSlug && staticServices.some((s) => s.slug === preselectedSlug)
      ? preselectedSlug
      : staticServices[0].slug;

  const [serviceSlug, setServiceSlug] = useState(initialSlug);
  const [selectedDate, setSelectedDate] = useState(toYMD(new Date()));
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const days = useMemo(() => nextNDays(10), []);
  const selectedService = staticServices.find((s) => s.slug === serviceSlug);
  const priceDisplay = selectedService?.price_display ?? "₹99";

  useEffect(() => {
    setSlotsLoading(true);
    setSelectedTime(null);
    fetch(`/api/availability?service=${serviceSlug}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [serviceSlug, selectedDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!serviceSlug || !selectedTime || !form.name || !form.email || !form.phone) {
      setError("Please fill in all required fields and select a time.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_type: "service",
          service_slug: serviceSlug,
          date: selectedDate,
          time: selectedTime,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // If payment is required, open Razorpay checkout
      if (data.requires_payment && data.order) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          setError("Could not load Razorpay. Please check your connection and try again.");
          setSubmitting(false);
          return;
        }

        const rzp = new (window as any).Razorpay({
          key: data.order.key_id,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Rituu Bhatia",
          description: selectedService?.title || "Consultation",
          order_id: data.order.order_id,
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#1B1550" },
          handler: function () {
            // Payment succeeded — webhook will confirm server-side.
            setConfirmed(true);
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
              setError("Payment was cancelled. You can try again when you're ready.");
            },
          },
        });
        rzp.open();
        return;
      }

      // Free booking (shouldn't happen here, but safe fallback)
      setConfirmed(true);
    } catch {
      setError("Something went wrong creating your booking. Please try again.");
      setSubmitting(false);
    }
  }

  /* ───────────────────────── Success screen ───────────────────────── */
  if (confirmed) {
    return (
      <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-br from-ink via-ink-mid to-ink px-6 py-24">
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div aria-hidden className="bk-float pointer-events-none absolute -left-24 top-0 -z-10 h-80 w-80 rounded-full bg-violet/30 blur-3xl" />
        <div aria-hidden className="bk-float pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-gold/25 blur-3xl" style={{ ["--d" as string]: "2s" }} />
        {[
          { top: "16%", left: "12%", s: 14, d: 0 },
          { top: "24%", left: "86%", s: 10, d: 1 },
          { top: "76%", left: "18%", s: 9, d: 0.5 },
          { top: "70%", left: "84%", s: 13, d: 1.6 },
        ].map((p, n) => (
          <Sparkle
            key={n}
            className="bk-twinkle pointer-events-none absolute -z-10 text-gold"
            style={{ top: p.top, left: p.left, width: p.s, height: p.s, ["--d" as string]: `${p.d}s` }}
          />
        ))}

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto w-full max-w-xl rounded-3xl bg-gradient-to-br from-gold-soft via-gold to-gold-deep p-[1.5px] shadow-[0_30px_90px_-30px_var(--color-gold)]"
        >
          <div className="rounded-3xl bg-gradient-to-br from-ivory via-ivory-deep to-ivory px-8 py-12 text-center sm:px-12">
            <motion.div
              initial={reduce ? false : { scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.25 }}
              className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-gold text-ink shadow-[0_16px_40px_-12px_var(--color-gold)]"
            >
              <Check size={38} strokeWidth={2.5} />
            </motion.div>
            <p className="mb-4 font-display text-4xl font-light text-charcoal">You&apos;re booked!</p>
            <p className="leading-relaxed text-charcoal/70">
              Your {selectedService?.title} session is confirmed for {selectedDate} at {selectedTime}.
              You&apos;ll get an email confirmation shortly.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-gold-deep">
                <CalendarDays size={15} /> {formatLong(selectedDate)}
              </span>
              {selectedTime && (
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-gold-deep">
                  <Clock size={15} /> {selectedTime}
                </span>
              )}
            </div>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-mid"
              >
                Back to Home
                <ArrowRight size={16} className="text-gold transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center rounded-full border border-line bg-white px-7 py-3 text-sm font-medium text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:border-gold"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  /* ───────────────────────── Booking form ───────────────────────── */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <PageHeader eyebrow="BOOK A SESSION" title="Schedule your consultation" />

      <section className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory-deep to-ivory py-16 lg:py-20">
        <div aria-hidden className="bk-float pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div aria-hidden className="bk-float pointer-events-none absolute -right-32 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet/15 blur-3xl" style={{ ["--d" as string]: "3s" }} />

        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* ───────── Left: steps ───────── */}
            <div className="space-y-6 lg:col-span-7">
              {/* 01 Service */}
              <StepCard num="01" label="Service">
                <div role="radiogroup" aria-label="Service" className="grid gap-3 sm:grid-cols-2">
                  {staticServices.map((s) => {
                    const active = s.slug === serviceSlug;
                    return (
                      <button
                        key={s.slug}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setServiceSlug(s.slug)}
                        className={`group relative flex items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                          active
                            ? "border-gold bg-gradient-to-br from-white to-gold-soft/40 shadow-[0_16px_36px_-20px_var(--color-gold)]"
                            : "border-line bg-white hover:-translate-y-0.5 hover:border-gold/60"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                              active ? "border-transparent bg-gradient-to-br from-gold-soft to-gold" : "border-charcoal/25 bg-white"
                            }`}
                          >
                            {active && <Check size={12} strokeWidth={3} className="text-ink" />}
                          </span>
                          <span className="font-display text-lg leading-tight text-charcoal">{s.title}</span>
                        </span>
                        <span className="index-tab shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] text-gold-deep">
                          {s.price_display}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </StepCard>

              {/* 02 Date */}
              <StepCard num="02" label="Date" delay={0.05}>
                <div className="-mx-2 flex snap-x gap-3 overflow-x-auto px-2 pb-3">
                  {days.map((d, i) => {
                    const ymd = toYMD(d);
                    const isSelected = ymd === selectedDate;
                    return (
                      <button
                        type="button"
                        key={ymd}
                        onClick={() => setSelectedDate(ymd)}
                        aria-pressed={isSelected}
                        className={`flex h-24 w-[4.5rem] shrink-0 snap-start flex-col items-center justify-center rounded-2xl border transition-all duration-300 ${
                          isSelected
                            ? "-translate-y-1 border-transparent bg-gradient-to-br from-gold-soft via-gold to-gold-deep text-ink shadow-[0_16px_32px_-14px_var(--color-gold)]"
                            : "border-line bg-white text-charcoal/70 hover:-translate-y-1 hover:border-gold/60"
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-wide opacity-80">
                          {i === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" })}
                        </span>
                        <span className="font-display text-2xl leading-none">{d.getDate()}</span>
                        <span className="mt-1 text-[10px] uppercase opacity-70">
                          {d.toLocaleDateString("en-IN", { month: "short" })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </StepCard>

              {/* 03 Time */}
              <StepCard num="03" label="Time" delay={0.1}>
                {slotsLoading ? (
                  <p className="flex items-center gap-2 text-sm text-charcoal/60">
                    <Loader2 size={16} className="animate-spin text-gold-deep" />
                    Checking availability…
                  </p>
                ) : slots.length === 0 ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-gold/40 bg-gold/5 px-4 py-5 text-sm text-charcoal/65">
                    <Clock size={18} className="shrink-0 text-gold-deep" />
                    No openings this day — try another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {slots.map((slot) => {
                      const active = selectedTime === slot;
                      return (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          aria-pressed={active}
                          className={`rounded-xl border py-3 text-sm font-medium transition-all duration-300 ${
                            active
                              ? "-translate-y-0.5 border-transparent bg-gradient-to-br from-gold-soft via-gold to-gold-deep text-ink shadow-[0_12px_28px_-12px_var(--color-gold)]"
                              : "border-line bg-white text-charcoal/75 hover:-translate-y-0.5 hover:border-gold/60 hover:text-gold-deep"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </StepCard>

              {/* 04 Details */}
              <StepCard num="04" label="Your details" delay={0.15}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-charcoal/70">Full name *</span>
                    <input
                      required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-charcoal/70">Email *</span>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-medium text-charcoal/70">Phone *</span>
                    <input
                      required
                      type="tel"
                      placeholder="Your phone number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputCls}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-medium text-charcoal/70">Notes (optional)</span>
                    <textarea
                      placeholder="Anything you'd like Rituu to know ahead of the session (optional)"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      className={inputCls}
                    />
                  </label>
                </div>
              </StepCard>
            </div>

            {/* ───────── Right: sticky summary ───────── */}
            <motion.aside
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="lg:sticky lg:top-24 lg:col-span-5"
            >
              <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink-mid to-ink p-7 text-ivory shadow-[0_30px_80px_-30px_var(--color-ink)] sm:p-9">
                <div aria-hidden className="bk-float pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-violet/35 blur-3xl" />
                <div aria-hidden className="bk-float pointer-events-none absolute -bottom-20 -left-16 -z-10 h-64 w-64 rounded-full bg-gold/25 blur-3xl" style={{ ["--d" as string]: "2.5s" }} />
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

                <p className="index-tab mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] uppercase text-gold-soft backdrop-blur-md">
                  <Sparkles size={13} className="text-gold" />
                  Your booking
                </p>

                <dl className="space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <dt className="text-ivory/60">Service</dt>
                    <dd className="text-right font-display text-lg leading-snug text-ivory">{selectedService?.title}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <dt className="text-ivory/60">Date</dt>
                    <dd className="text-right text-ivory">{formatLong(selectedDate)}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <dt className="text-ivory/60">Time</dt>
                    <dd className={`text-right ${selectedTime ? "text-ivory" : "text-ivory/40"}`}>
                      {selectedTime ?? "Select a time"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex items-end justify-between">
                  <p className="index-tab text-[11px] uppercase tracking-wide text-ivory/60">Total</p>
                  <p className="bg-gradient-to-r from-gold-soft via-gold to-gold-deep bg-clip-text font-display text-4xl font-light text-transparent">
                    {priceDisplay}
                  </p>
                </div>

                {error && (
                  <p role="alert" className="mt-6 rounded-xl border border-rose-300/60 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative mt-7 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gold px-7 py-4 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-10px_var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="relative animate-spin" />
                      <span className="relative">Processing…</span>
                    </>
                  ) : (
                    <>
                      <span className="relative">Pay {priceDisplay} &amp; Confirm</span>
                      <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <ul className="mt-6 space-y-2.5 text-xs text-ivory/60">
                  <li className="flex items-center gap-2.5">
                    <Lock size={14} className="shrink-0 text-gold" />
                    Secure payment with Razorpay
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail size={14} className="shrink-0 text-gold" />
                    Confirmation sent to your email
                  </li>
                </ul>
              </div>
            </motion.aside>
          </form>
        </div>
      </section>
    </>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center gap-2 py-32 text-charcoal/60">
          <Loader2 size={18} className="animate-spin text-gold-deep" />
          Loading…
        </div>
      }
    >
      <BookForm />
    </Suspense>
  );
}