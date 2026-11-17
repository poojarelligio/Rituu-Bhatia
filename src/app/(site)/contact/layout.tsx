import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Book a Consultation",
  description:
    "Contact Rituu Bhatia for Tarot, Vaastu, Astrology & Reiki consultations. Visit her Vashi, Navi Mumbai studio, call, email or WhatsApp. Replies within 24 hours.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}