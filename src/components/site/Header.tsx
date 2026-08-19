"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Courses", href: "/courses" },
  { label: "Workshops", href: "/workshops-events" },
  { label: "Blogs", href: "/knowledge" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? "bg-ivory/95 backdrop-blur border-b border-line" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Rituu Bhatia"
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors ${pathname === link.href ? "text-burgundy" : "text-charcoal/80 hover:text-burgundy"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/book" variant="primary">Book a Consultation</Button>
        </div>

        <button className="lg:hidden p-2 text-charcoal" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-ivory border-t border-line px-6 pb-6 pt-2">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-base py-1 text-charcoal/80">
                {link.label}
              </Link>
            ))}
            <Button href="/book" variant="primary" className="mt-2 w-full">Book a Consultation</Button>
          </nav>
        </div>
      )}
    </header>
  );
}
