"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { buildGoogleCalendarLink } from "@/lib/client/googleCalendar";

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

export default function FreeConsultModal({
  serviceId, serviceTitle, onClose,
}: { serviceId: number; serviceTitle: string; onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState(toYMD(new Date()));
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const days = useMemo(() => nextNDays(7), []);

  useEffect(() => {
    setSlotsLoading(true);
    setSelectedTime(null);
    fetch(`/api/availability?service_id=${serviceId}&date=${selectedDate}&type=free_intro`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, serviceId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!selectedTime || !form.name || !form.email || !form.phone) {
      setError("Please select a time and fill in your details.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_type: "free_intro",
          service_id: serviceId,
          date: selectedDate,
          time: selectedTime,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setConfirmed(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const calendarLink = confirmed && selectedTime
    ? buildGoogleCalendarLink({
        title: `Free 15-min Intro Call — ${serviceTitle} with Rituu Bhatia`,
        description: "Your free 15-minute intro call. Look out for a confirmation email with joining details.",
        date: selectedDate,
        time: selectedTime,
        durationMinutes: 15,
      })
    : null;

  return (
    <div className="fixed inset-0 bg-charcoal/60 flex items-center justify-center z-50 px-6 py-10 overflow-y-auto" onClick={onClose}>
      <div className="bg-ivory rounded-sm p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {confirmed ? (
          <div className="text-center">
            <p className="index-tab text-xs text-gold mb-4">CONFIRMED</p>
            <h3 className="font-display text-2xl text-charcoal mb-3">You&apos;re booked</h3>
            <p className="text-sm text-charcoal/65 mb-6">
              Free 15-minute intro call for {serviceTitle} on {selectedDate} at {selectedTime}. A confirmation email is on its way.
            </p>
            <Button href={calendarLink!} variant="primary" className="w-full mb-3">Add to Google Calendar</Button>
            <button onClick={onClose} className="text-xs text-charcoal/40 underline">Close</button>
          </div>
        ) : (
          <>
            <p className="index-tab text-xs text-gold mb-2">FREE 15-MIN INTRO</p>
            <h3 className="font-display text-xl text-charcoal mb-6">{serviceTitle}</h3>

            <p className="text-xs text-charcoal/50 mb-2 uppercase tracking-wide">Date</p>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
              {days.map((d) => {
                const ymd = toYMD(d);
                const isSelected = ymd === selectedDate;
                return (
                  <button
                    type="button"
                    key={ymd}
                    onClick={() => setSelectedDate(ymd)}
                    className={`shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-sm border text-sm transition-colors ${isSelected ? "bg-burgundy text-ivory border-burgundy" : "border-line text-charcoal/70 hover:border-burgundy"}`}
                  >
                    <span className="text-[9px] uppercase">{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                    <span className="text-sm font-medium">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-charcoal/50 mb-2 uppercase tracking-wide">Time</p>
            {slotsLoading ? (
              <p className="text-sm text-charcoal/50 mb-5">Checking availability…</p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-charcoal/50 mb-5">No openings this day — try another date.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2 mb-5">
                {slots.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 rounded-sm border text-xs transition-colors ${selectedTime === slot ? "bg-burgundy text-ivory border-burgundy" : "border-line text-charcoal/70 hover:border-burgundy"}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-line rounded-sm px-4 py-2.5 bg-ivory focus-visible:outline-burgundy" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-line rounded-sm px-4 py-2.5 bg-ivory focus-visible:outline-burgundy" />
              <input required type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-line rounded-sm px-4 py-2.5 bg-ivory focus-visible:outline-burgundy" />
              {error && <p className="text-xs text-burgundy">{error}</p>}
              <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                {submitting ? "Booking…" : "Confirm Free Call"}
              </Button>
            </form>
            <button onClick={onClose} className="text-xs text-charcoal/40 mt-4 underline">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}
