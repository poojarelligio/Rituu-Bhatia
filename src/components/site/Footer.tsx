"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";

interface Settings {
  phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp_community_link: string | null;
  telegram_link: string | null;
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then(setSettings).catch(() => {});
  }, []);

  return (
    <footer className="relative text-ivory">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/bg/footer-bg.jpg')" }}
      />
      
      {/* Overlay – controls image visibility */}
      <div className="absolute inset-0 bg-charcoal/65" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            {/* Logo */}
            <img src="/images/logo.png" alt="Logo" className="h-12 mb-6" />
            <p className="text-ivory/70 text-sm leading-relaxed max-w-sm">
              Your holistic life transformation guide — Vaastu, Astrology, Tarot, Reiki, and spiritual education.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {settings?.whatsapp_community_link && (
                <a href={settings.whatsapp_community_link} target="_blank" rel="noreferrer" className="index-tab text-[11px] text-ivory/70 hover:text-gold-soft transition-colors border border-ivory/20 rounded-full px-3 py-1">
                  WhatsApp
                </a>
              )}
              {settings?.telegram_link && (
                <a href={settings.telegram_link} target="_blank" rel="noreferrer" className="index-tab text-[11px] text-ivory/70 hover:text-gold-soft transition-colors border border-ivory/20 rounded-full px-3 py-1">
                  Telegram
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="index-tab text-xs text-gold-soft mb-4">EXPLORE</p>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li><Link href="/services" className="hover:text-ivory transition-colors">Services</Link></li>
              <li><Link href="/courses" className="hover:text-ivory transition-colors">Courses & Training</Link></li>
              <li><Link href="/workshops-events" className="hover:text-ivory transition-colors">Workshops & Events</Link></li>
              <li><Link href="/success-stories" className="hover:text-ivory transition-colors">Success Stories</Link></li>
              <li><Link href="/resources" className="hover:text-ivory transition-colors">Free Resources</Link></li>
              <li><Link href="/knowledge" className="hover:text-ivory transition-colors">Blog</Link></li>
              <li><Link href="/community" className="hover:text-ivory transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <p className="index-tab text-xs text-gold-soft mb-4">CONTACT</p>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li className="flex items-center gap-2"><Phone size={14} /> {settings?.phone || ""}</li>
              <li className="flex items-center gap-2"><Mail size={14} /> {settings?.email || ""}</li>
              <li>{settings?.address || ""}</li>
            </ul>
          </div>
        </div>

        <div className="ledger-divider my-10 opacity-20" />

        <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs text-ivory/50">
          <p>© {new Date().getFullYear()} Rituu Bhatia. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-ivory transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ivory transition-colors">Terms</Link>
            <Link href="/refund-policy" className="hover:text-ivory transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}