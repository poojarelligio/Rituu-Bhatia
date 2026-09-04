import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = { 
  title: "Privacy Policy",
  description: "Learn how Rituu Bhatia collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader eyebrow="LEGAL" title="Privacy Policy" />
      <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <div className="space-y-8 text-charcoal/70 leading-relaxed">
          {/* Last Updated */}
          <p className="text-sm text-charcoal/40 font-label tracking-wider">
            Last Updated: January 1, 2025
          </p>

          {/* Section 1 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              1. Information We Collect
            </h2>
            <p>
              <strong>Personal Information:</strong> We collect personal information such as name, contact number, email, birth details (for astrology), and any other data shared voluntarily during bookings or consultations.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              2. How We Use Your Information
            </h2>
            <p className="mb-2">Your information is used to:</p>
            <ul className="list-disc list-inside space-y-1 text-charcoal/70 ml-4">
              <li>Provide personalized services</li>
              <li>Improve our service offerings</li>
              <li>Send updates and confirmations</li>
            </ul>
            <p className="mt-3 text-sm text-charcoal/50 italic">
              We do not sell or share your personal data with third-party marketers.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              3. Data Protection
            </h2>
            <p>
              We implement appropriate security measures to protect your data from unauthorized access, loss, or misuse.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              4. Third-party Services
            </h2>
            <p>
              We may use third-party platforms (e.g., payment gateways or email services) that may have their own privacy policies. We advise you to review their policies before using those services.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              5. Your Consent
            </h2>
            <p>
              By using our website and submitting your information, you consent to this Privacy Policy.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="font-display text-xl text-charcoal font-light mb-3">
              6. Your Rights
            </h2>
            <p>
              You may contact us at{' '}
              <a 
                href="mailto:info@rituubhatia.in" 
                className="text-burgundy hover:underline underline-offset-2 transition-colors"
              >
                info@rituubhatia.in
              </a>
              {' '}to request access or removal of your data.
            </p>
          </div>

          {/* Divider */}
          <div className="pt-6 border-t border-line">
            <p className="text-xs text-charcoal/30 text-center">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}