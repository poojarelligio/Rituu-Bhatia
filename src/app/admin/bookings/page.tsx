"use client";

import { useEffect, useState, useCallback } from "react";

interface BookingRow {
  id: number;
  item_type: string;
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

export default function BookingsAdminPage() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

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
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-8">Bookings</h1>
      {loading ? (
        <p className="text-charcoal/50 text-sm">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-charcoal/50 text-sm">No bookings yet.</p>
      ) : (
        <div className="bg-white border border-line rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ivory-deep text-left text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Service/Course</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="px-4 py-3 capitalize">{row.item_type.replace("_", " ")}</td>
                  <td className="px-4 py-3">{row.item_title || "—"}</td>
                  <td className="px-4 py-3">
                    <p>{row.customer_name}</p>
                    <p className="text-xs text-charcoal/50">{row.customer_email} · {row.customer_phone}</p>
                  </td>
                  <td className="px-4 py-3">{row.booking_date ? `${row.booking_date} at ${row.booking_time}` : "—"}</td>
                  <td className="px-4 py-3">{row.amount_paise > 0 ? `₹${(row.amount_paise / 100).toFixed(2)}` : "Free"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={row.status}
                      onChange={(e) => updateStatus(row.id, e.target.value)}
                      className="border border-line rounded-sm px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
