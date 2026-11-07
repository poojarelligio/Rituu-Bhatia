import { randomUUID } from "node:crypto";
import { BOOKING } from "./bookingConfig";
// Reuses the Google connection you made in Admin -> Settings (token stored in google_calendar_connection).
import { getValidAccessToken } from "./googleCalendar";

const EVENTS = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

/** True when the Google client env vars exist. Whether the admin has connected is checked per call. */
export const googleConfigured = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

/** Busy periods on the connected calendar (uses events.list, which the calendar.events scope allows). */
export async function getBusy(timeMin: Date, timeMax: Date): Promise<{ start: Date; end: Date }[]> {
  const token = await getValidAccessToken();
  if (!token) return []; // not connected -> rely on DB bookings only

  const params = new URLSearchParams({
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
  });
  const res = await fetch(`${EVENTS}?${params}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(`Google events.list error: ${JSON.stringify(json)}`);

  type Ev = {
    status?: string;
    transparency?: string;
    start?: { dateTime?: string; date?: string };
    end?: { dateTime?: string; date?: string };
  };
  return ((json.items ?? []) as Ev[])
    .filter((e) => e.status !== "cancelled" && e.transparency !== "transparent")
    .map((e) => ({
      start: new Date(e.start?.dateTime ?? `${e.start?.date}T00:00:00${BOOKING.offset}`),
      end: new Date(e.end?.dateTime ?? `${e.end?.date}T00:00:00${BOOKING.offset}`),
    }))
    .filter((b) => !Number.isNaN(b.start.getTime()) && !Number.isNaN(b.end.getTime()));
}

export interface EventInput {
  summary: string;
  description: string;
  start: Date;
  end: Date;
  attendeeEmail: string;
  attendeeName: string;
  online: boolean;
  location?: string;
}

export async function createEvent(e: EventInput): Promise<{ id: string; meetLink: string | null; htmlLink: string | null }> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Google Calendar is not connected (Admin -> Settings)");

  const res = await fetch(`${EVENTS}?conferenceDataVersion=1&sendUpdates=all`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: e.summary,
      description: e.description,
      location: e.location,
      start: { dateTime: e.start.toISOString(), timeZone: BOOKING.timezone },
      end: { dateTime: e.end.toISOString(), timeZone: BOOKING.timezone },
      attendees: [{ email: e.attendeeEmail, displayName: e.attendeeName }],
      reminders: { useDefault: true },
      ...(e.online
        ? { conferenceData: { createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } } } }
        : {}),
    }),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Google createEvent error: ${JSON.stringify(json)}`);
  return { id: json.id, meetLink: json.hangoutLink ?? null, htmlLink: json.htmlLink ?? null };
}

export async function deleteEvent(eventId: string) {
  const token = await getValidAccessToken();
  if (!token) return;
  await fetch(`${EVENTS}/${eventId}?sendUpdates=all`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

/** Adds a Meet link to an existing event that was created without one. */
export async function addMeet(eventId: string): Promise<string | null> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Google Calendar is not connected (Admin -> Settings)");
  const res = await fetch(`${EVENTS}/${eventId}?conferenceDataVersion=1&sendUpdates=all`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      conferenceData: { createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } } },
    }),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Google addMeet error: ${JSON.stringify(json)}`);
  return json.hangoutLink ?? null;
}
