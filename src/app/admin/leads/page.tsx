"use client";

import { useEffect, useState, useCallback } from "react";

interface LeadRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service_title: string | null;
  message: string | null;
  source: string | null;
  status: string;
  created_at: string;
}

const STATUSES = ["NEW", "CONTACTED", "INTERESTED", "BOOKED", "COMPLETED", "LOST"];

export default function LeadsAdminPage() {
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/leads");
    setRows(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-8">Leads</h1>
      {loading ? (
        <p className="text-charcoal/50 text-sm">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-charcoal/50 text-sm">No leads yet.</p>
      ) : (
        <div className="bg-white border border-line rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ivory-deep text-left text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Interested In</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <p>{row.name}</p>
                    <p className="text-xs text-charcoal/50">{row.email} {row.phone ? `· ${row.phone}` : ""}</p>
                  </td>
                  <td className="px-4 py-3">{row.service_title || "—"}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{row.message}</td>
                  <td className="px-4 py-3 text-xs">{row.source}</td>
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
