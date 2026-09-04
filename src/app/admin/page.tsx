import Link from "next/link";
import { query } from "@/lib/db";

interface CountRow {
  count: number;
}

async function getCount(sql: string) {
  const rows = await query<CountRow[]>(sql);
  return rows[0]?.count ?? 0;
}

export default async function AdminDashboardPage() {
  const [services, courses, bookings, leads, pendingBookings, newLeads] = await Promise.all([
    getCount("SELECT COUNT(*) AS count FROM services"),
    getCount("SELECT COUNT(*) AS count FROM courses"),
    getCount("SELECT COUNT(*) AS count FROM bookings"),
    getCount("SELECT COUNT(*) AS count FROM leads"),
    getCount("SELECT COUNT(*) AS count FROM bookings WHERE status = 'PENDING'"),
    getCount("SELECT COUNT(*) AS count FROM leads WHERE status = 'NEW'"),
  ]);

  const cards = [
    // { label: "Services", value: services, href: "/admin/services" },
    { label: "Courses", value: courses, href: "/admin/courses" },
    { label: "Total Bookings", value: bookings, href: "/admin/bookings" },
    { label: "Pending Bookings", value: pendingBookings, href: "/admin/bookings", highlight: pendingBookings > 0 },
    { label: "Total Leads", value: leads, href: "/admin/leads" },
    { label: "New Leads", value: newLeads, href: "/admin/leads", highlight: newLeads > 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`border rounded-sm p-6 bg-white hover:shadow-md transition-shadow ${
              card.highlight ? "border-burgundy" : "border-line"
            }`}
          >
            <p className={`font-display text-3xl ${card.highlight ? "text-burgundy" : "text-charcoal"}`}>{card.value}</p>
            <p className="text-xs text-charcoal/50 uppercase tracking-wide mt-1">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
