import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { 
  title: "Terms & Conditions",
  description: "Read the terms and conditions for using Rituu Bhatia's spiritual and wellness services.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="LEGAL" title="Terms & Conditions" />
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <div className="space-y-8 text-charcoal/70 leading-relaxed">
          {/* Last Updated */}
          <p className="text-sm text-charcoal/40 font-label tracking-wider">
            Last Updated: January 1, 2025
          </p>

          {/* Section 1 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              1. Introduction
            </h2>
            <p>
              Welcome to our Platform. By accessing our services, you agree to abide by the following Terms and Conditions. If you disagree with any part of these terms, please do not use our website or services.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              2. Services
            </h2>
            <p>
              We provide spiritual and wellness-based services such as Vastu Shastra consultations, Tarot card readings, Astrology consultations, Seichem Reiki, Candle Magic and other related services. These services are intended for guidance and self-reflection only and are not to be used as a substitute for professional legal, financial, or medical advice.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              3. Client Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-charcoal/70 ml-4">
              <li>We implement appropriate security measures to protect your data from unauthorized access, loss, or misuse.</li>
              <li>Clients are responsible for providing accurate and complete information during consultations.</li>
              <li>Clients understand that results may vary and outcomes are not guaranteed.</li>
              <li>All sessions must be booked in advance and paid for as per our pricing structure.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              4. Intellectual Property
            </h2>
            <p>
              All content, images, logos, and service material on our website are the property of Rituu Bhatia and cannot be copied, redistributed, or used without our written consent.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              5. Limitation of Liability
            </h2>
            <p>
              We are not liable for any indirect, incidental, or consequential damages arising from the use of our services. All guidance provided is based on spiritual and astrological understanding, and decisions made by the client after sessions are their own responsibility.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              6. Amendments
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. It is your responsibility to review them periodically.
            </p>
          </div>

          {/* Divider */}
          <div className="pt-6 border-t border-line">
            <p className="text-xs text-charcoal/30 text-center">
              If you have any questions about these Terms & Conditions, please{' '}
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