import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Syne, Plus_Jakarta_Sans, Fira_Code } from "next/font/google";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rituubhatia.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rituu Bhatia — Tarot Card, Vaastu, Astrology & Reiki",
    template: "%s | Rituu Bhatia",
  },
  description:
    "Your holistic life transformation guide for prosperity, relationships, health & spiritual growth — Vaastu, Astrology, Tarot, Reiki and spiritual education.",
  openGraph: {
    type: "website",
    siteName: "Rituu Bhatia",
    locale: "en_IN",
    title: "Rituu Bhatia — Vaastu, Astrology,Tarot Card & Reiki",
    description:
      "Personalised guidance through Vaastu, Astrology, Tarot Card Reading and Reiki.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630, alt: "Rituu Bhatia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rituu Bhatia — Vaastu, Astrology,Tarot Card & Reiki",
    description:
      "Personalised guidance through Vaastu, Astrology, Tarot Card Reading and Reiki.",
    images: ["/images/og-default.jpg"],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#business`,
  name: "Rituu Bhatia",
  url: siteUrl,
  image: `${siteUrl}/images/og-default.jpg`,
  logo: `${siteUrl}/images/logo.png`,
  description:
    "Vaastu consultation, Astrology,Tarot card reading and Reiki healing, plus courses and workshops.",
  telephone: "+917021063008",
  areaServed: "IN",
  // Add this once you have the real details, or delete it if online-only:
  // address: { "@type": "PostalAddress", addressLocality: "CITY", addressRegion: "STATE", addressCountry: "IN" },
  sameAs: [
    "https://www.instagram.com/rituu_bhatia/",
    "https://www.facebook.com/RituuBhatia33/",
    "https://www.linkedin.com/in/rituu-bhatia-7472501a9",
    "https://www.youtube.com/channel/UCY2_TVQc0aMYpf4c_V7OJIw",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${syne.variable} ${plusJakartaSans.variable} ${firaCode.variable}`}
    >
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WHKRR7GZD0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-WHKRR7GZD0');
          `}
        </Script>
      </head>

      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {children}
      </body>
    </html>
  );
}