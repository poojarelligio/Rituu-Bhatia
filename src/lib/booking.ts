import { randomBytes } from "node:crypto";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "./bookingDb";
import { addMeet, createEvent, deleteEvent, getBusy, googleConfigured } from "./google";
import { sendBookingEmails, sendConfirmedEmail, sendMeetEmail, type MailBooking } from "./mail";
import {
  BOOKING,
  SERVICES,
  addDays,
  fmt12,
  hmOf,
  istDateOf,
  istInstant,
  isDateString,
  weekdayOf,
} from "./bookingConfig";

export interface Slot {
  time: string; // HH:mm IST
  label: string;
}

/* ------------------------------ availability ------------------------------ */

export async function getSlots(date: string): Promise<Slot[]> {
  if (!isDateString(date)) return [];
  const today = istDateOf(new Date());
  if (date < today || date > addDays(today, BOOKING.maxDaysAhead)) return [];

  const windows = BOOKING.hours[weekdayOf(date)];
  if (!windows) return [];

  const dayStart = istInstant(date, "00:00");
  const dayEnd = new Date(dayStart.getTime() + 24 * 3600_000);

  // Busy from Google Calendar (fail-soft: DB bookings still protect against double booking)
  let busy: { start: Date; end: Date }[] = [];
  if (googleConfigured()) {
    try {
      busy = await getBusy(dayStart, dayEnd);
    } catch (err) {
      console.error("[booking] freeBusy failed, using DB only:", err);
    }
  }
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT start_at, end_at FROM appointments WHERE status IN ('pending','confirmed','completed') AND start_at < ? AND end_at > ?",
    [dayEnd, dayStart],
  );
  rows.forEach((r) => busy.push({ start: new Date(r.start_at), end: new Date(r.end_at) }));

  const earliest = Date.now() + BOOKING.minNoticeHours * 3600_000;
  const slotMs = BOOKING.slotMinutes * 60_000;
  const bufMs = BOOKING.bufferMinutes * 60_000;
  const slots: Slot[] = [];

  for (const [from, to] of windows) {
    const end = istInstant(date, to).getTime();
    for (let t = istInstant(date, from).getTime(); t + slotMs <= end; t += slotMs) {
      if (t < earliest) continue;
      const clash = busy.some((b) => t < b.end.getTime() + bufMs && t + slotMs > b.start.getTime() - bufMs);
      if (!clash) {
        const time = hmOf(new Date(t));
        slots.push({ time, label: fmt12(time) });
      }
    }
  }
  return slots;
}

/* -------------------------------- booking --------------------------------- */

export interface BookingInput {
  service: string;
  mode: "online" | "studio";
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export class SlotTakenError extends Error {
  constructor() {
    super("SLOT_TAKEN");
  }
}

const newReference = () => "RB-" + randomBytes(3).toString("hex").toUpperCase();

export async function createBooking(input: BookingInput) {
  const service = SERVICES.find((s) => s.id === input.service);
  if (!service) throw new Error("Unknown service");

  // Re-validate against live availability (never trust the client)
  const slots = await getSlots(input.date);
  if (!slots.some((s) => s.time === input.time)) throw new SlotTakenError();

  const start = istInstant(input.date, input.time);
  const end = new Date(start.getTime() + BOOKING.slotMinutes * 60_000);
  const reference = newReference();

  // 1) Reserve the slot. UNIQUE(slot_lock) makes a simultaneous second request fail.
  let id: number;
  try {
    const [res] = await pool.query<ResultSetHeader>(
      `INSERT INTO appointments
        (reference, service, mode, name, email, phone, message, start_at, end_at, status, slot_lock)
       VALUES (?,?,?,?,?,?,?,?,?, 'pending', ?)`,
      [reference, service.name, input.mode, input.name, input.email, input.phone, input.message || null, start, end, start],
    );
    id = res.insertId;
  } catch (err) {
    if ((err as { code?: string }).code === "ER_DUP_ENTRY") throw new SlotTakenError();
    throw err;
  }

  // 2) Lead + emails (never fail the booking because of these). The calendar event is created when the admin confirms.
  await saveLead(input, service.name).catch((e) => console.error("[booking] lead failed:", e));

  const sent = await sendBookingEmails({
    reference,
    service: service.name,
    mode: input.mode,
    name: input.name,
    email: input.email,
    phone: input.phone,
    message: input.message,
    date: input.date,
    time: input.time,
    meetLink: null,
  }).catch((e) => {
    console.error("[booking] email failed:", e);
    return false;
  });
  if (sent) await pool.query("UPDATE appointments SET email_sent=1 WHERE id=?", [id]);

  return { reference, status: "pending" as const };
}

/** Copies the booking into your existing `leads` table. Adjust columns to match yours. */
async function saveLead(input: BookingInput, serviceName: string) {
  await pool.query("INSERT INTO leads (name, email, phone, message, source) VALUES (?,?,?,?,?)", [
    input.name,
    input.email,
    input.phone,
    `Appointment: ${serviceName} on ${input.date} ${input.time} IST (${input.mode})${input.message ? ` — ${input.message}` : ""}`,
    "appointment",
  ]);
}

/* ------------------------------ admin actions ------------------------------ */

async function loadRow(id: number) {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM appointments WHERE id=?", [id]);
  if (!rows[0]) throw new Error("Appointment not found");
  return rows[0];
}

function toMail(r: RowDataPacket): MailBooking {
  const s = new Date(r.start_at);
  return {
    reference: r.reference,
    service: r.service,
    mode: r.mode,
    name: r.name,
    email: r.email,
    phone: r.phone,
    message: r.message,
    date: istDateOf(s),
    time: hmOf(s),
    meetLink: r.meet_link,
  };
}

/** Creates the calendar event (and Meet link) for a booking that is missing one, then emails the client the link. */
export async function adminSync(id: number, notify = true) {
  const r = await loadRow(id);
  if (r.status === "cancelled") throw new Error("This appointment is cancelled");

  let eventId: string | null = r.google_event_id;
  let meet: string | null = r.meet_link;

  if (!eventId) {
    const ev = await createEvent({
      summary: `${r.service} — ${r.name}`,
      description: `Booked via website\nRef: ${r.reference}\nPhone: ${r.phone}\nEmail: ${r.email}\n${r.message ? `Notes: ${r.message}` : ""}`,
      start: new Date(r.start_at),
      end: new Date(r.end_at),
      attendeeEmail: r.email,
      attendeeName: r.name,
      online: r.mode === "online",
      location: r.mode === "studio" ? BOOKING.studioAddress : undefined,
    });
    eventId = ev.id;
    meet = ev.meetLink;
  } else if (r.mode === "online" && !meet) {
    meet = await addMeet(eventId);
  }

  await pool.query("UPDATE appointments SET google_event_id=?, meet_link=? WHERE id=?", [eventId, meet, id]);
  if (notify && meet && meet !== r.meet_link) {
    await sendMeetEmail({ ...toMail(r), meetLink: meet }).catch((e) => console.error("[booking] meet email failed:", e));
  }
  return { meetLink: meet, eventId };
}

export async function adminResend(id: number) {
  const r = await loadRow(id);
  if (!r.meet_link) throw new Error("No Meet link yet - create it first");
  await sendMeetEmail(toMail(r));
  return { meetLink: r.meet_link as string };
}

/** Cancels the booking, frees the time slot, and removes the calendar event (Google notifies the client). */
export async function adminCancel(id: number) {
  const r = await loadRow(id);
  await pool.query("UPDATE appointments SET status='cancelled', slot_lock=NULL, google_event_id=NULL, meet_link=NULL WHERE id=?", [id]);
  if (r.google_event_id) await deleteEvent(r.google_event_id).catch((e) => console.error("[booking] delete event failed:", e));
  return {};
}

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

/** Admin changes the status. Confirming creates the calendar event + Meet link and emails the client. */
export async function adminSetStatus(id: number, status: string): Promise<{ meetLink?: string | null; warning?: string }> {
  if (!STATUSES.includes(status)) throw new Error("Invalid status");
  const r = await loadRow(id);
  if (r.status === status) return {};
  if (status === "cancelled") return adminCancel(id);

  // Re-open a cancelled booking: take the slot again if nobody else has.
  if (r.status === "cancelled") {
    try {
      await pool.query("UPDATE appointments SET slot_lock=? WHERE id=?", [new Date(r.start_at), id]);
    } catch (err) {
      if ((err as { code?: string }).code === "ER_DUP_ENTRY") throw new Error("That time has since been booked by someone else");
      throw err;
    }
  }
  await pool.query("UPDATE appointments SET status=? WHERE id=?", [status, id]);

  if (status !== "confirmed") return {};

  let warning: string | undefined;
  try {
    await adminSync(id, false);
  } catch (err) {
    console.error("[booking] calendar sync on confirm failed:", err);
    warning = "Confirmed, but the calendar event could not be created. Check Google is connected, then use Create Meet link.";
  }
  const fresh = await loadRow(id);
  await sendConfirmedEmail(toMail(fresh)).catch((e) => console.error("[booking] confirm email failed:", e));
  return { meetLink: fresh.meet_link, warning };
}
