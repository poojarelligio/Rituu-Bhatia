"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Mail, MessageCircle, Search } from "lucide-react";
import Pagination from "@/components/admin/Pagination";

interface BookingRow {
  id: number;
  item_type: "service" | "free_intro" | "course";
  item_title: string | null;
  booking_date: string | null;
  booking_time: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  amount_paise: number;
  status: string;
  created_at: string;
}

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "REFUNDED"];

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-gold/15 text-gold border-gold/30",
  CONFIRMED: "bg-burgundy/10 text-burgundy border-burgundy/30",
  COMPLETED: "bg-charcoal/10 text-charcoal/60 border-charcoal/20",
  CANCELLED: "bg-charcoal/5 text-charcoal/40 border-charcoal/10",
  REFUNDED: "bg-charcoal/5 text-charcoal/40 border-charcoal/10",
};

type Tab = "all" | "services" | "courses";

function whatsappDigitsOnly(phone: string) {
  return phone.replace(/\D/g, "");
}

export default function BookingsAdminPage() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/bookings");
    setRows(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: number, status: string) {
    // Optimistic update so the dropdown feels instant, not a full reload-and-wait.
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  const counts = useMemo(
    () => ({
      all: rows.length,
      services: rows.filter((r) => r.item_type === "service" || r.item_type === "free_intro").length,
      courses: rows.filter((r) => r.item_type === "course").length,
    }),
    [rows]
  );

  const filtered = useMemo(() => {
    let result = rows;
    if (tab === "services") result = result.filter((r) => r.item_type === "service" || r.item_type === "free_intro");
    if (tab === "courses") result = result.filter((r) => r.item_type === "course");

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) => r.customer_name.toLowerCase().includes(q) || r.customer_email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rows, tab, search]);

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 whenever the tab or search changes the result set,
  // so switching tabs never leaves you stranded on an empty page 4.
  useEffect(() => {
    setPage(1);
  }, [tab, search]);

  const TABS: { key: Tab; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "services", label: `Services (${counts.services})` },
    { key: "courses", label: `Courses (${counts.courses})` },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-8">Bookings</h1>

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                tab === t.key
                  ? "bg-burgundy text-ivory border-burgundy"
                  : "bg-white text-charcoal/60 border-line hover:border-burgundy/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" />
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-line rounded-full pl-9 pr-4 py-2 text-sm focus-visible:outline-burgundy"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-charcoal/50 text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-charcoal/50 text-sm">
          {rows.length === 0 ? "No bookings yet." : "No bookings match your search."}
        </p>
      ) : (
        <div className="bg-white border border-line rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ivory-deep text-left text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Service/Course</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date &amp; Time</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => {
                const mailtoHref = `mailto:${row.customer_email}?subject=${encodeURIComponent(
                  `Re: Your ${row.item_title || "booking"}`
                )}&body=${encodeURIComponent(`Hi ${row.customer_name},\n\n`)}`;
                const whatsappHref = `https://wa.me/${whatsappDigitsOnly(row.customer_phone)}?text=${encodeURIComponent(
                  `Hi ${row.customer_name}, this is Rituu Bhatia — `
                )}`;

                return (
                  <tr key={row.id} className="border-t border-line hover:bg-ivory-deep/30">
                    <td className="px-4 py-3 capitalize whitespace-nowrap">{row.item_type.replace("_", " ")}</td>
                    <td className="px-4 py-3">{row.item_title || "—"}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{row.customer_name}</p>
                      <p className="text-xs text-charcoal/50">{row.customer_email} · {row.customer_phone}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.booking_date ? `${row.booking_date} at ${row.booking_time}` : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.amount_paise > 0 ? `₹${(row.amount_paise / 100).toFixed(2)}` : "Free"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={row.status}
                        onChange={(e) => updateStatus(row.id, e.target.value)}
                        className={`border rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[row.status] || "border-line text-charcoal/60"}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <a
                          href={mailtoHref}
                          aria-label={`Email ${row.customer_name}`}
                          title="Email reply"
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-line text-charcoal/50 hover:text-burgundy hover:border-burgundy transition-colors"
                        >
                          <Mail size={14} />
                        </a>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`WhatsApp ${row.customer_name}`}
                          title="WhatsApp reply"
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-line text-charcoal/50 hover:text-burgundy hover:border-burgundy transition-colors"
                        >
                          <MessageCircle size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}