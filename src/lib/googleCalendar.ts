import { query } from "./db";

const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const CALENDAR_EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

interface ConnectionRow {
  connected_email: string | null;
  access_token: string | null;
  refresh_token: string | null;
  token_expiry: string | null;
}

function getEnv() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google Calendar is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI in .env.local.");
  }
  return { clientId, clientSecret, redirectUri };
}

/** Step 1: the URL the admin is sent to in order to grant calendar access. */
export function buildGoogleAuthUrl() {
  const { clientId, redirectUri } = getEnv();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline", // required to receive a refresh_token
    prompt: "consent", // forces Google to re-issue a refresh_token even on repeat connects
  });
  return `${AUTH_URL}?${params.toString()}`;
}

/** Step 2: exchange the one-time authorization code for tokens, and store them. */
export async function exchangeCodeAndStoreTokens(code: string) {
  const { clientId, clientSecret, redirectUri } = getEnv();

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google token exchange failed: ${body}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  // Look up which Google account this is, purely so the admin UI can show
  // "Connected as rituu@gmail.com" rather than a bare confirmation.
  const userInfoRes = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${data.access_token}` },
  });
  const userInfo = userInfoRes.ok ? ((await userInfoRes.json()) as { email?: string }) : {};

  const expiry = new Date(Date.now() + data.expires_in * 1000);

  await query(
    `UPDATE google_calendar_connection
     SET connected_email = ?, access_token = ?, refresh_token = COALESCE(?, refresh_token), token_expiry = ?, connected_at = NOW()
     WHERE id = 1`,
    [userInfo.email || null, data.access_token, data.refresh_token || null, expiry]
  );
}

export async function disconnectGoogleCalendar() {
  await query(
    `UPDATE google_calendar_connection SET connected_email = NULL, access_token = NULL, refresh_token = NULL, token_expiry = NULL, connected_at = NULL WHERE id = 1`
  );
}

export async function getGoogleCalendarStatus() {
  const rows = await query<ConnectionRow[]>("SELECT connected_email, refresh_token FROM google_calendar_connection WHERE id = 1");
  const row = rows[0];
  return { connected: Boolean(row?.refresh_token), email: row?.connected_email || null };
}

/**
 * Returns a currently-valid access token, refreshing it first if it's
 * expired (access tokens last ~1 hour; the refresh_token is long-lived and
 * lets us silently mint new ones without asking Rituu to reconnect).
 */
async function getValidAccessToken(): Promise<string | null> {
  const rows = await query<ConnectionRow[]>("SELECT * FROM google_calendar_connection WHERE id = 1");
  const row = rows[0];
  if (!row?.refresh_token) return null; // not connected

  const expiry = row.token_expiry ? new Date(row.token_expiry) : null;
  const stillValid = expiry && expiry.getTime() - Date.now() > 60_000; // 1 min buffer
  if (row.access_token && stillValid) {
    return row.access_token;
  }

  const { clientId, clientSecret } = getEnv();
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: row.refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    // Refresh token was likely revoked or expired (see the Testing-mode
    // note in the setup guide) — treat as disconnected rather than throwing,
    // so a booking still succeeds even if calendar sync can't run right now.
    console.error("Google Calendar token refresh failed:", await response.text());
    return null;
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  const newExpiry = new Date(Date.now() + data.expires_in * 1000);
  await query("UPDATE google_calendar_connection SET access_token = ?, token_expiry = ? WHERE id = 1", [
    data.access_token,
    newExpiry,
  ]);

  return data.access_token;
}

export interface CalendarEventInput {
  summary: string;
  description?: string;
  startISO: string; // e.g. 2026-08-19T10:00:00+05:30
  endISO: string;
  attendeeEmail: string;
  attendeeName: string;
  timeZone?: string; // defaults to Asia/Kolkata
}

/**
 * Creates an event on Rituu's connected Google Calendar with the customer
 * added as an attendee — since this runs using her own OAuth-authorized
 * account (not a bare service account), Google sends the customer a real
 * invite email automatically. Fails silently (returns null, logs a
 * warning) if calendar isn't connected or the API call fails — calendar
 * sync is a nice-to-have layered on top of a booking, never a reason to
 * block or fail the booking itself.
 */
export async function createGoogleCalendarEvent(input: CalendarEventInput): Promise<string | null> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    console.warn("Google Calendar not connected — skipping calendar sync for this booking.");
    return null;
  }

  const timeZone = input.timeZone || "Asia/Kolkata";

  try {
    const response = await fetch(`${CALENDAR_EVENTS_URL}?sendUpdates=all`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: input.summary,
        description: input.description || "",
        start: { dateTime: input.startISO, timeZone },
        end: { dateTime: input.endISO, timeZone },
        attendees: [{ email: input.attendeeEmail, displayName: input.attendeeName }],
        reminders: { useDefault: true },
      }),
    });

    if (!response.ok) {
      console.error("Google Calendar event creation failed:", await response.text());
      return null;
    }

    const event = (await response.json()) as { id: string; htmlLink: string };
    return event.id;
  } catch (err) {
    console.error("Google Calendar event creation error:", err);
    return null;
  }
}