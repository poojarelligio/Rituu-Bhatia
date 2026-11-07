"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaWhatsapp } from "react-icons/fa";

interface Settings {
  phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp_community_link: string | null;
  telegram_link: string | null;
}

// ✅ Moved outside to guarantee identical server/client render
const socialLinks = [
  { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/rituu_bhatia/", color: "hover:text-[#E4405F]" },
  { name: "Facebook", icon: FaFacebook, href: "https://www.facebook.com/RituuBhatia33/", color: "hover:text-[#1877F2]" },
  { name: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com/in/rituu-bhatia-7472501a9", color: "hover:text-[#0A66C2]" },
  { name: "YouTube", icon: FaYoutube, href: "https://www.youtube.com/channel/UCY2_TVQc0aMYpf4c_V7OJIw", color: "hover:text-[#FF0000]" },
  { name: "WhatsApp", icon: FaWhatsapp, href: "https://wa.me/+917021063008", color: "hover:text-[#25D366]" },
];

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
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-charcoal/65" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <img src="/images/logo-light.png" alt="Logo" className="h-12 mb-6" />
            <p className="text-ivory/70 text-sm leading-relaxed max-w-sm">
              Your holistic life transformation guide — Vaastu, Astrology, Tarot Card, Reiki, and spiritual education.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center text-ivory/50 transition-all duration-300 hover:border-gold/50 hover:shadow-md ${social.color}`}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>

            {/* Community Links */}
            <div className="flex items-center gap-3 mt-4">
              {settings?.whatsapp_community_link && (
                <a href={settings.whatsapp_community_link} target="_blank" rel="noreferrer" className="index-tab text-[11px] text-ivory/70 hover:text-gold-soft transition-colors border border-ivory/20 rounded-full px-3 py-1">
                  WhatsApp Community
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
          <p>© {new Date().getFullYear()} Rituu Bhatia. All rights reserved. | Designed By <a href="https://www.relligio.com/" className="hover:text-ivory transition-colors">Relligio</a></p>
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