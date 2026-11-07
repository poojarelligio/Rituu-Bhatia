import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { 
  title: "Refund & Cancellation Policy",
  description: "Read the refund and cancellation policy for Rituu Bhatia's spiritual and wellness services.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <PageHeader eyebrow="LEGAL" title="Refund & Cancellation Policy" />
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <div className="space-y-8 text-charcoal/70 leading-relaxed">
          {/* Last Updated */}
          <p className="text-sm text-charcoal/40 font-label tracking-wider">
            Last Updated: January 1, 2025
          </p>

          {/* Introduction */}
          <p className="text-charcoal/60 italic border-l-2 border-gold/30 pl-4">
            At Rituu Bhatia Tarot Card Consultations, we are committed to offering you a meaningful and respectful experience. Please take a moment to review our refund and cancellation policy before booking your session.
          </p>

          {/* Section 1 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              1. Booking Amount
            </h2>
            <ul className="list-disc list-inside space-y-2 text-charcoal/70 ml-4">
              <li>To confirm your appointment, a non-refundable booking amount is required.</li>
              <li>This amount secures your slot and is not refundable under any circumstances.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              2. Full Payment
            </h2>
            <ul className="list-disc list-inside space-y-2 text-charcoal/70 ml-4">
              <li>If you cancel a session 24 hours prior to your scheduled time, you may be eligible for a reschedule or partial refund.</li>
              <li>Cancellations made less than 24 hours before the session will not be eligible for any refund.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              3. Cancellation Policy
            </h2>
            <ul className="list-disc list-inside space-y-2 text-charcoal/70 ml-4">
              <li>Cancellations made at least 24 hours prior to the scheduled session are eligible for a refund of the balance amount (if full payment was made).</li>
              <li>Same-day cancellations or no-shows are not eligible for any refund or rescheduling.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              4. Rescheduling
            </h2>
            <ul className="list-disc list-inside space-y-2 text-charcoal/70 ml-4">
              <li>You may request one-time rescheduling free of charge, as long as the request is made minimum 24 hours before the appointment.</li>
              <li>Rescheduled sessions must be used within 15 days from the original date.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              5. In Case of Provider Cancellation
            </h2>
            <p>
              If the session is canceled from our end due to unavoidable reasons, you will be given the option of a full refund or rescheduling at your convenience.
            </p>
          </div>

          {/* Divider */}
          <div className="pt-6 border-t border-line">
            <p className="text-xs text-charcoal/30 text-center">
              If you have any questions about our refund policy, please{' '}
              <a 
                href="/contact" 
                className="text-burgundy hover:underline underline-offset-2 transition-colors"
              >
                contact us
              </a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}