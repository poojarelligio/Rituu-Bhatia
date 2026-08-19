"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { loadRazorpayScript } from "@/lib/client/razorpay";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CourseEnrollModal({
  courseId, courseTitle, priceDisplay, onClose,
}: { courseId: number; courseTitle: string; priceDisplay: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_type: "course",
          service_id: courseId,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      const ready = await loadRazorpayScript();
      if (!ready) {
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
        description: `Enrollment: ${courseTitle}`,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#6B1B2C" },
        handler: function () {
          setPaid(true);
        },
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-charcoal/60 flex items-center justify-center z-50 px-6" onClick={onClose}>
      <div className="bg-ivory rounded-sm p-8 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        {paid ? (
          <div className="text-center">
            <p className="index-tab text-xs text-gold mb-4">PAYMENT RECEIVED</p>
            <h3 className="font-display text-xl text-charcoal mb-3">You&apos;re enrolled</h3>
            <p className="text-sm text-charcoal/65 mb-6">
              We&apos;re confirming your enrollment now — course details and joining instructions will arrive by email shortly.
            </p>
            <button onClick={onClose} className="text-xs text-charcoal/40 underline">Close</button>
          </div>
        ) : (
          <>
            <p className="index-tab text-xs text-gold mb-2">ENROLL</p>
            <h3 className="font-display text-xl text-charcoal mb-1">{courseTitle}</h3>
            <p className="text-burgundy font-medium mb-6">{priceDisplay}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-line rounded-sm px-4 py-2.5 bg-ivory focus-visible:outline-burgundy" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-line rounded-sm px-4 py-2.5 bg-ivory focus-visible:outline-burgundy" />
              <input required type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-line rounded-sm px-4 py-2.5 bg-ivory focus-visible:outline-burgundy" />
              {error && <p className="text-xs text-burgundy">{error}</p>}
              <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                {submitting ? "Processing…" : `Pay ${priceDisplay} & Enroll`}
              </Button>
            </form>
            <button onClick={onClose} className="text-xs text-charcoal/40 mt-4 underline">Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}
