"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { loadRazorpayScript } from "@/lib/client/razorpay";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface Service {
  id: number;
  slug: string;
  title: string;
  price_display: string;
}

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
function toYMD(date: Date) {
  return date.toISOString().slice(0, 10);
}

function BookForm() {
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("service");

  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(toYMD(new Date()));
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const days = useMemo(() => nextNDays(10), []);
  const selectedService = services.find((s) => s.id === serviceId);

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then((data: Service[]) => {
      setServices(data);
      const match = preselectedSlug ? data.find((s) => s.slug === preselectedSlug) : null;
      setServiceId((match || data[0])?.id || null);
    });
  }, [preselectedSlug]);

  useEffect(() => {
    if (!serviceId) return;
    setSlotsLoading(true);
    setSelectedTime(null);
    fetch(`/api/availability?service_id=${serviceId}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [serviceId, selectedDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!serviceId || !selectedTime || !form.name || !form.email || !form.phone) {
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
          service_id: serviceId,
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

      const razorpayReady = await loadRazorpayScript();
      if (!razorpayReady) {
        setError("Could not load the payment gateway. Please check your connection and try again.");
        setSubmitting(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.order.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.order_id,
        name: "Rituu Bhatia",
        description: selectedService?.title,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#6B1B2C" },
        handler: function () {
          setConfirmed(true);
        },
      });
      rzp.open();
    } catch {
      setError("Something went wrong creating your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto px-6 py-32 text-center">
        <p className="font-display text-3xl mb-4">Payment received.</p>
        <p className="text-charcoal/65 leading-relaxed">We&apos;re confirming your booking now — you&apos;ll get an email confirmation within a few minutes.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow="BOOK A SESSION" title="Schedule your consultation" />
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <p className="index-tab text-xs text-gold mb-3">01 · SERVICE</p>
            <select value={serviceId || ""} onChange={(e) => setServiceId(Number(e.target.value))} className="w-full border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy">
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.title} — {s.price_display}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="index-tab text-xs text-gold mb-3">02 · DATE</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map((d) => {
                const ymd = toYMD(d);
                const isSelected = ymd === selectedDate;
                return (
                  <button type="button" key={ymd} onClick={() => setSelectedDate(ymd)} className={`shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-sm border text-sm transition-colors ${isSelected ? "bg-burgundy text-ivory border-burgundy" : "border-line text-charcoal/70 hover:border-burgundy"}`}>
                    <span className="text-[10px] uppercase">{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                    <span className="text-base font-medium">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="index-tab text-xs text-gold mb-3">03 · TIME</p>
            {slotsLoading ? (
              <p className="text-sm text-charcoal/50">Checking availability…</p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-charcoal/50">No openings this day — try another date.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {slots.map((slot) => (
                  <button type="button" key={slot} onClick={() => setSelectedTime(slot)} className={`py-2.5 rounded-sm border text-sm transition-colors ${selectedTime === slot ? "bg-burgundy text-ivory border-burgundy" : "border-line text-charcoal/70 hover:border-burgundy"}`}>
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="index-tab text-xs text-gold mb-3">04 · YOUR DETAILS</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy" />
              <input required type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy sm:col-span-2" />
              <textarea placeholder="Anything you'd like Rituu to know ahead of the session (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="border border-line rounded-sm px-4 py-3 bg-ivory focus-visible:outline-burgundy sm:col-span-2" />
            </div>
          </div>

          {error && <p className="text-sm text-burgundy">{error}</p>}

          <div className="flex items-center justify-between border-t border-line pt-8">
            <div>
              <p className="text-xs text-charcoal/50 uppercase tracking-wide">Total</p>
              <p className="font-display text-2xl text-charcoal">{selectedService?.price_display || "—"}</p>
            </div>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Processing…" : "Proceed to Payment"}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-charcoal/50">Loading…</div>}>
      <BookForm />
    </Suspense>
  );
}
