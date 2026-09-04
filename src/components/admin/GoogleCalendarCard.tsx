"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function GoogleCalendarCard() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<{ connected: boolean; email: string | null } | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/google-calendar/status").then((r) => r.json()).then(setStatus);
  }, []);

  async function handleDisconnect() {
    setDisconnecting(true);
    await fetch("/api/admin/google-calendar/disconnect", { method: "POST" });
    setStatus({ connected: false, email: null });
    setDisconnecting(false);
  }

  const justConnected = searchParams.get("calendar_connected") === "1";
  const calendarError = searchParams.get("calendar_error");

  return (
    <div className="bg-white border border-line rounded-sm p-8 max-w-2xl mt-6">
      <h2 className="font-display text-xl text-charcoal mb-2">Google Calendar</h2>
      <p className="text-sm text-charcoal/60 mb-6">
        When connected, every confirmed booking is automatically added to Rituu&apos;s Google Calendar,
        and the customer is sent a calendar invite to the email they booked with.
      </p>

      {justConnected && (
        <p className="text-sm text-burgundy mb-4">Google Calendar connected successfully.</p>
      )}
      {calendarError && (
        <p className="text-sm text-burgundy mb-4">Could not connect Google Calendar ({calendarError}). Please try again.</p>
      )}

      {!status ? (
        <p className="text-sm text-charcoal/50">Checking connection…</p>
      ) : status.connected ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-charcoal">
            Connected as <span className="font-medium">{status.email}</span>
          </p>
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="text-xs text-charcoal/50 hover:text-burgundy underline"
          >
            {disconnecting ? "Disconnecting…" : "Disconnect"}
          </button>
        </div>
      ) : (
        <a
          href="/api/admin/google-calendar/connect"
          className="inline-block bg-burgundy text-ivory rounded-sm px-5 py-2.5 text-sm font-medium hover:bg-burgundy-deep transition-colors"
        >
          Connect Google Calendar
        </a>
      )}
    </div>
  );
}