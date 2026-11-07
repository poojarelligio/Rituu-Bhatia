"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  status: string;
  mode: string;
  meetLink: string | null;
  hasEvent: boolean;
  phone: string;
  name: string;
  when: string;
}

const btn = "rounded-lg border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-50";
const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function AppointmentActions({ id, status, mode, meetLink, hasEvent, phone, name, when }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  async function call(body: Record<string, unknown>, label: string, okMsg: string) {
    setBusy(label);
    setMsg("");
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...body }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) setMsg(j.error || "Failed");
      else {
        setMsg(j.warning || okMsg);
        router.refresh();
      }
    } finally {
      setBusy("");
    }
  }

  function changeStatus(value: string) {
    if (value === status) return;
    const text =
      value === "confirmed"
        ? "Confirm this appointment? A calendar event with a Meet link will be created and the client will be emailed."
        : value === "cancelled"
          ? "Cancel this appointment? The time will be freed and the calendar event removed."
          : null;
    if (text && !confirm(text)) return;
    call({ action: "status", value }, "status", "Status updated");
  }

  async function copy() {
    if (!meetLink) return;
    try {
      await navigator.clipboard.writeText(meetLink);
      setMsg("Link copied");
    } catch {
      setMsg("Copy failed");
    }
  }

  const digits = phone.replace(/\D/g, "");
  const wa = `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}?text=${encodeURIComponent(
    `Hi ${name}, your appointment on ${when} IST.${meetLink ? ` Join here: ${meetLink}` : ""}`,
  )}`;
  const live = status === "confirmed" || status === "completed";

  return (
    <div className="flex max-w-[220px] flex-wrap items-center gap-1.5">
      <select
        value={status}
        disabled={!!busy}
        onChange={(e) => changeStatus(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs capitalize"
        aria-label="Appointment status"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {live && (!hasEvent || (mode === "online" && !meetLink)) && (
        <button className={`${btn} border-amber-400 bg-amber-50`} disabled={!!busy} onClick={() => call({ action: "sync" }, "sync", "Created")}>
          {busy === "sync" ? "Creating…" : mode === "online" ? "Create Meet link" : "Add to calendar"}
        </button>
      )}
      {live && meetLink && (
        <>
          <button className={btn} onClick={copy}>Copy link</button>
          <button className={btn} disabled={!!busy} onClick={() => call({ action: "email" }, "email", "Email sent")}>
            {busy === "email" ? "Sending…" : "Email link"}
          </button>
          <a className={btn} href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </>
      )}
      {busy === "status" && <span className="w-full text-xs text-gray-500">Updating…</span>}
      {msg && <span className="w-full text-xs text-gray-500">{msg}</span>}
    </div>
  );
}
