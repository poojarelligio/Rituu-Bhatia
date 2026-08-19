"use client";

import { useEffect, useState } from "react";

const DAYS = [
  { value: 0, label: "Sunday" }, { value: 1, label: "Monday" }, { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" }, { value: 4, label: "Thursday" }, { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

interface AvailabilitySettings {
  working_days: number[];
  start_time: string;
  end_time: string;
  slot_minutes: number;
  buffer_minutes: number;
  blocked_dates: string[];
  blocked_slots: string[];
}

export default function AvailabilityAdminPage() {
  const [settings, setSettings] = useState<AvailabilitySettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/availability").then((r) => r.json()).then((data) =>
      setSettings({
        ...data,
        working_days: typeof data.working_days === "string" ? JSON.parse(data.working_days) : data.working_days,
        blocked_dates: typeof data.blocked_dates === "string" ? JSON.parse(data.blocked_dates) : data.blocked_dates,
        blocked_slots: typeof data.blocked_slots === "string" ? JSON.parse(data.blocked_slots) : data.blocked_slots,
      })
    );
  }, []);

  function toggleDay(day: number) {
    if (!settings) return;
    const has = settings.working_days.includes(day);
    setSettings({
      ...settings,
      working_days: has ? settings.working_days.filter((d) => d !== day) : [...settings.working_days, day],
    });
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
  }

  if (!settings) return <p className="text-charcoal/50 text-sm">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-8">Booking Availability</h1>
      <div className="bg-white border border-line rounded-sm p-8 space-y-6 max-w-2xl">
        <div>
          <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-2">Working Days</label>
          <div className="flex flex-wrap gap-3">
            {DAYS.map((d) => (
              <label key={d.value} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" checked={settings.working_days.includes(d.value)} onChange={() => toggleDay(d.value)} />
                {d.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-1">Start Time</label>
            <input type="time" value={settings.start_time} onChange={(e) => setSettings({ ...settings, start_time: e.target.value })} className="w-full border border-line rounded-sm px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-1">End Time</label>
            <input type="time" value={settings.end_time} onChange={(e) => setSettings({ ...settings, end_time: e.target.value })} className="w-full border border-line rounded-sm px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-1">Slot Length (minutes)</label>
            <input type="number" value={settings.slot_minutes} onChange={(e) => setSettings({ ...settings, slot_minutes: Number(e.target.value) })} className="w-full border border-line rounded-sm px-3 py-2" />
          </div>
          <div>
            <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-1">Buffer Between Bookings (minutes)</label>
            <input type="number" value={settings.buffer_minutes} onChange={(e) => setSettings({ ...settings, buffer_minutes: Number(e.target.value) })} className="w-full border border-line rounded-sm px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-1">Blocked Dates (holidays)</label>
          <textarea
            value={settings.blocked_dates.join("\n")}
            onChange={(e) => setSettings({ ...settings, blocked_dates: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean) })}
            rows={4}
            placeholder="One date per line, YYYY-MM-DD"
            className="w-full border border-line rounded-sm px-3 py-2 font-mono text-xs"
          />
        </div>

        <div>
          <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-1">Blocked Specific Slots</label>
          <textarea
            value={settings.blocked_slots.join("\n")}
            onChange={(e) => setSettings({ ...settings, blocked_slots: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean) })}
            rows={4}
            placeholder="One per line: YYYY-MM-DD|HH:MM"
            className="w-full border border-line rounded-sm px-3 py-2 font-mono text-xs"
          />
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-line">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-burgundy text-ivory rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-burgundy-deep transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {saved && <span className="text-sm text-charcoal/60">Saved.</span>}
        </div>
      </div>
    </div>
  );
}
