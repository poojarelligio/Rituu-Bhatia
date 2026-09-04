"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Mail, MessageCircle, Search, Eye, X } from "lucide-react";

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

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-gold/15 text-gold border-gold/30",
  CONTACTED: "bg-charcoal/10 text-charcoal/60 border-charcoal/20",
  INTERESTED: "bg-burgundy/10 text-burgundy border-burgundy/30",
  BOOKED: "bg-burgundy/15 text-burgundy border-burgundy/40",
  COMPLETED: "bg-charcoal/10 text-charcoal/70 border-charcoal/20",
  LOST: "bg-charcoal/5 text-charcoal/40 border-charcoal/10",
};

const SOURCE_LABELS: Record<string, string> = {
  contact_form: "Contact Form",
  resource_download: "Resource Download",
  energy_assessment: "Energy Assessment",
  newsletter: "Newsletter",
};

type Tab = "all" | "new" | "in_progress" | "won" | "lost";

const TAB_STATUSES: Record<Tab, string[] | null> = {
  all: null,
  new: ["NEW"],
  in_progress: ["CONTACTED", "INTERESTED", "BOOKED"],
  won: ["COMPLETED"],
  lost: ["LOST"],
};

function whatsappDigitsOnly(phone: string) {
  return phone.replace(/\D/g, "");
}

export default function LeadsAdminPage() {
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (selectedLead?.id === id) {
      setSelectedLead((prev) => prev ? { ...prev, status } : null);
    }
    await fetch(`/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { all: rows.length, new: 0, in_progress: 0, won: 0, lost: 0 };
    for (const row of rows) {
      if (TAB_STATUSES.new!.includes(row.status)) c.new++;
      else if (TAB_STATUSES.in_progress!.includes(row.status)) c.in_progress++;
      else if (TAB_STATUSES.won!.includes(row.status)) c.won++;
      else if (TAB_STATUSES.lost!.includes(row.status)) c.lost++;
    }
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    let result = rows;
    const statuses = TAB_STATUSES[tab];
    if (statuses) result = result.filter((r) => statuses.includes(r.status));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rows, tab, search]);

  const TABS: { key: Tab; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "new", label: `New (${counts.new})` },
    { key: "in_progress", label: `In Progress (${counts.in_progress})` },
    { key: "won", label: `Won (${counts.won})` },
    { key: "lost", label: `Lost (${counts.lost})` },
  ];

  function openModal(lead: LeadRow) {
    setSelectedLead(lead);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setTimeout(() => setSelectedLead(null), 200);
  }

  return (
    <div className="max-w-full">
      <h1 className="font-display text-2xl text-charcoal mb-8">Leads</h1>

      {/* Tabs + search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
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
          {rows.length === 0 ? "No leads yet." : "No leads match your search."}
        </p>
      ) : (
        <div className="bg-white border border-line rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ivory-deep text-left text-xs uppercase tracking-wide text-charcoal/50">
              <tr>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Interested In</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-line hover:bg-ivory-deep/30">
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">{row.name}</p>
                    <p className="text-xs text-charcoal/50">{row.email}</p>
                  </td>
                  <td className="px-4 py-3">{row.service_title || "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    {SOURCE_LABELS[row.source || ""] || row.source || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.status}
                      onChange={(e) => updateStatus(row.id, e.target.value)}
                      className={`border rounded-full px-3 py-1 text-xs font-medium focus:outline-none ${STATUS_STYLES[row.status] || "border-line text-charcoal/60"}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openModal(row)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-line text-charcoal/60 hover:text-burgundy hover:border-burgundy transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
  {isModalOpen && selectedLead && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm px-4">
      <div
        className="relative bg-ivory rounded-sm w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl border border-line"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl text-charcoal">{selectedLead.name}</h2>
              <p className="text-sm text-charcoal/50">{selectedLead.email}</p>
              {selectedLead.phone && (
                <p className="text-sm text-charcoal/50">{selectedLead.phone}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedLead.status}
                onChange={(e) => updateStatus(selectedLead.id, e.target.value)}
                className={`border rounded-full px-3 py-1 text-xs font-medium focus:outline-none ${STATUS_STYLES[selectedLead.status] || "border-line text-charcoal/60"}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-charcoal/40 uppercase tracking-wide mb-1">Interested In</p>
              <p className="text-charcoal">{selectedLead.service_title || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-charcoal/40 uppercase tracking-wide mb-1">Message</p>
              <p className="text-charcoal/70 whitespace-pre-wrap">{selectedLead.message || "No message"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-charcoal/40 uppercase tracking-wide mb-1">Source</p>
                <p className="text-charcoal">{SOURCE_LABELS[selectedLead.source || ""] || selectedLead.source || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-charcoal/40 uppercase tracking-wide mb-1">Received</p>
                <p className="text-charcoal">{new Date(selectedLead.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-line flex flex-wrap gap-3">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedLead.email)}&su=${encodeURIComponent(
                `Re: Your enquiry${selectedLead.service_title ? ` about ${selectedLead.service_title}` : ""}`
              )}&body=${encodeURIComponent(`Hi ${selectedLead.name},\n\n`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line text-sm text-charcoal/60 hover:text-burgundy hover:border-burgundy transition-colors"
            >
              <Mail size={16} />
              Email (Gmail)
            </a>
            {selectedLead.phone && (
              <a
                href={`https://wa.me/${whatsappDigitsOnly(selectedLead.phone)}?text=${encodeURIComponent(
                  `Hi ${selectedLead.name}, this is Rituu Bhatia — `
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-line text-sm text-charcoal/60 hover:text-burgundy hover:border-burgundy transition-colors"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            )}
            <button
              onClick={closeModal}
              className="ml-auto px-4 py-2 text-sm text-charcoal/40 hover:text-charcoal transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
}