"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    label: "Content",
    items: [
      // { href: "/admin/services", label: "Services" },
      { href: "/admin/courses", label: "Courses" },
      { href: "/admin/success-stories", label: "Success Stories" },
      { href: "/admin/testimonials", label: "Testimonials" },
      { href: "/admin/faqs", label: "FAQs" },
      { href: "/admin/events", label: "Workshops & Events" },
      { href: "/admin/resources", label: "Free Resources" },
      { href: "/admin/media-features", label: "Media & Recognition" },
      { href: "/admin/blog", label: "Blog" },
      { href: "/admin/appointments", label: "Appointments" },

    ],
  },
  {
    label: "Business",
    items: [
      { href: "/admin/bookings", label: "Bookings" },
      { href: "/admin/leads", label: "Leads" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings", label: "Site Settings" },
      { href: "/admin/availability", label: "Booking Availability" },
      { href: "/admin/assessment", label: "Energy Assessment" },
    ],
  },
];

export default function AdminShell({
  children,
  adminName,
}: {
  children: React.ReactNode;
  adminName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-ivory-deep">
      <aside className="w-64 shrink-0 bg-charcoal text-ivory flex flex-col">
        <div className="px-6 py-6 border-b border-ivory/10">
          <p className="index-tab text-xs text-gold-soft">RITUU BHATIA</p>
          <p className="font-display text-lg">Admin</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-5">
              <p className="index-tab text-[10px] text-ivory/40 px-6 mb-2 uppercase">{section.label}</p>
              {section.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-6 py-2 text-sm transition-colors ${
                      active ? "bg-burgundy/20 text-ivory border-r-2 border-burgundy" : "text-ivory/70 hover:text-ivory hover:bg-ivory/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-ivory/10">
          <p className="text-xs text-ivory/50 mb-2">{adminName}</p>
          <button onClick={handleLogout} className="text-xs text-ivory/70 hover:text-ivory underline underline-offset-2">
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
