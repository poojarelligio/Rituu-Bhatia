"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Mail, MessageCircle, Search, Eye, X } from "lucide-react";
import Pagination from "@/components/admin/Pagination";

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
  workshop_notify: "Workshop Notify",
};

type SourceTab = "all" | "contact_form" | "resource_download" | "energy_assessment" | "newsletter" | "workshop_notify";

const SOURCE_TABS: { key: SourceTab; label: string; source: string | null }[] = [
  { key: "all", label: "All Sources", source: null },
  { key: "contact_form", label: "Contact Form", source: "contact_form" },
  { key: "resource_download", label: "Resource Downloads", source: "resource_download" },
  { key: "energy_assessment", label: "Energy Assessments", source: "energy_assessment" },
  { key: "workshop_notify", label: "Workshop Notify", source: "workshop_notify" },
  { key: "newsletter", label: "Newsletter", source: "newsletter" },
];

type StatusTab = "all" | "new" | "in_progress" | "won" | "lost";

const STATUS_TABS: Record<StatusTab, string[] | null> = {
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
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [sourceTab, setSourceTab] = useState<SourceTab>("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---------- Pagination state ----------
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

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

  // Counts by status
  const statusCounts = useMemo(() => {
    const c: Record<StatusTab, number> = { all: rows.length, new: 0, in_progress: 0, won: 0, lost: 0 };
    for (const row of rows) {
      if (STATUS_TABS.new!.includes(row.status)) c.new++;
      else if (STATUS_TABS.in_progress!.includes(row.status)) c.in_progress++;
      else if (STATUS_TABS.won!.includes(row.status)) c.won++;
      else if (STATUS_TABS.lost!.includes(row.status)) c.lost++;
    }
    return c;
  }, [rows]);

  // Counts by source
  const sourceCounts = useMemo(() => {
    const c: Record<SourceTab, number> = { all: rows.length, contact_form: 0, resource_download: 0, energy_assessment: 0, newsletter: 0, workshop_notify: 0 };
    for (const row of rows) {
      const source = row.source || "";
      if (source === "contact_form") c.contact_form++;
      else if (source === "resource_download") c.resource_download++;
      else if (source === "energy_assessment") c.energy_assessment++;
      else if (source === "newsletter") c.newsletter++;
      else if (source === "workshop_notify") c.workshop_notify++;
    }
    return c;
  }, [rows]);

  // Filtered data
  const filtered = useMemo(() => {
    let result = rows;

    // Filter by status
    const statuses = STATUS_TABS[statusTab];
    if (statuses) result = result.filter((r) => statuses.includes(r.status));

    // Filter by source
    if (sourceTab !== "all") {
      result = result.filter((r) => r.source === sourceTab);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rows, statusTab, sourceTab, search]);

  // ---------- Pagination slicing ----------
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [statusTab, sourceTab, search]);

  // Snap to last valid page if current page becomes empty
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const STATUS_TABS_UI: { key: StatusTab; label: string }[] = [
    { key: "all", label: `All (${statusCounts.all})` },
    { key: "new", label: `New (${statusCounts.new})` },
    { key: "in_progress", label: `In Progress (${statusCounts.in_progress})` },
    { key: "won", label: `Won (${statusCounts.won})` },
    { key: "lost", label: `Lost (${statusCounts.lost})` },
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

      {/* ========== SOURCE TABS ========== */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-charcoal/40 font-label tracking-wider uppercase mr-2 self-center">Source:</span>
        {SOURCE_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setSourceTab(t.key)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              sourceTab === t.key
                ? "bg-burgundy/10 text-burgundy border-burgundy/30"
                : "bg-white text-charcoal/50 border-line hover:border-burgundy/30"
            }`}
          >
            {t.label} ({sourceCounts[t.key]})
          </button>
        ))}
      </div>

      {/* ========== STATUS TABS ========== */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs text-charcoal/40 font-label tracking-wider uppercase mr-2 self-center">Status:</span>
        {STATUS_TABS_UI.map((t) => (
          <button
            key={t.key}
            onClick={() => setStatusTab(t.key)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              statusTab === t.key
                ? "bg-burgundy text-ivory border-burgundy"
                : "bg-white text-charcoal/50 border-line hover:border-burgundy/30"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ========== SEARCH BAR ========== */}
      <div className="flex justify-end mb-6">
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

      {/* ========== TABLE ========== */}
      {loading ? (
        <p className="text-charcoal/50 text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-charcoal/50 text-sm">
          {rows.length === 0 ? "No leads yet." : "No leads match your filters."}
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
              {paginated.map((row) => (
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
          {/* ========== PAGINATION ========== */}
          <div className="px-4 py-3 border-t border-line">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      {/* ========== MODAL ========== */}
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
                  <span className="text-[10px] text-charcoal/30 font-label tracking-wider px-2 py-1 border border-line rounded-full">
                    {SOURCE_LABELS[selectedLead.source || ""] || selectedLead.source || "Unknown"}
                  </span>
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