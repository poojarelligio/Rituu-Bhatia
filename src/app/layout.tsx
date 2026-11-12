
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rituu Bhatia — Tarot Card, Vaastu, Astrology & Reiki",
    template: "%s | Rituu Bhatia",
  },
  description:
    "Your holistic life transformation guide for prosperity, relationships, health & spiritual growth — Vaastu, Astrology, Tarot, Reiki and spiritual education.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
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

      <body>{children}</body>
    </html>
  );
}
