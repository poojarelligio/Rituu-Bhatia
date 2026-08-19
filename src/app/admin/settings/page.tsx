"use client";

import { useEffect, useState } from "react";

interface Settings {
  whatsapp_community_link: string;
  whatsapp_number: string;
  telegram_link: string;
  phone: string;
  email: string;
  address: string;
  google_maps_embed_url: string;
  newsletter_embed_html: string;
}

export default function SiteSettingsAdminPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings);
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
  }

  if (!settings) return <p className="text-charcoal/50 text-sm">Loading…</p>;

  const field = (key: keyof Settings, label: string, multiline = false) => (
    <div>
      <label className="text-xs text-charcoal/60 uppercase tracking-wide block mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={settings[key] || ""}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
          rows={4}
          className="w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy"
        />
      ) : (
        <input
          type="text"
          value={settings[key] || ""}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
          className="w-full border border-line rounded-sm px-3 py-2 focus-visible:outline-burgundy"
        />
      )}
    </div>
  );

  return (
    <div>
      <h1 className="font-display text-2xl text-charcoal mb-8">Site Settings</h1>
      <div className="bg-white border border-line rounded-sm p-8 space-y-5 max-w-2xl">
        {field("phone", "Phone")}
        {field("email", "Email")}
        {field("address", "Address")}
        {field("whatsapp_number", "WhatsApp Number", false)}
        {field("whatsapp_community_link", "WhatsApp Community Link")}
        {field("telegram_link", "Telegram Group Link")}
        {field("google_maps_embed_url", "Google Maps Embed URL")}
        {field("newsletter_embed_html", "Newsletter Signup Embed (HTML)", true)}

        <div className="flex items-center gap-4 pt-4 border-t border-line">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-burgundy text-ivory rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-burgundy-deep transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
          {saved && <span className="text-sm text-charcoal/60">Saved.</span>}
        </div>
      </div>
    </div>
  );
}
