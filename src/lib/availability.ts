import { query } from "./db";
import { AvailabilitySettings } from "./types";

interface AvailabilityRow {
  working_days: number[] | string;
  start_time: string;
  end_time: string;
  slot_minutes: number;
  buffer_minutes: number;
  blocked_dates: string[] | string;
  blocked_slots: string[] | string;
}

function parseMaybeJson<T>(value: T | string): T {
  return typeof value === "string" ? (JSON.parse(value) as T) : value;
}

export async function getAvailabilitySettings(): Promise<AvailabilitySettings> {
  const rows = await query<AvailabilityRow[]>("SELECT * FROM availability_settings WHERE id = 1");
  const row = rows[0];
  return {
    working_days: parseMaybeJson<number[]>(row?.working_days ?? [1, 2, 3, 4, 5, 6]),
    start_time: row?.start_time ?? "10:00",
    end_time: row?.end_time ?? "19:00",
    slot_minutes: row?.slot_minutes ?? 30,
    buffer_minutes: row?.buffer_minutes ?? 15,
    blocked_dates: parseMaybeJson<string[]>(row?.blocked_dates ?? []),
    blocked_slots: parseMaybeJson<string[]>(row?.blocked_slots ?? []),
  };
}

async function getServiceDurationMinutes(serviceId: number, fallback: number): Promise<number> {
  const rows = await query<{ duration: string | null }[]>("SELECT duration FROM services WHERE id = ?", [serviceId]);
  const label = rows[0]?.duration || "";
  const match = label.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : fallback;
}

async function getBookedTimesForDate(date: string): Promise<string[]> {
  const rows = await query<{ booking_time: string }[]>(
    `SELECT booking_time FROM bookings WHERE booking_date = ? AND status IN ('PENDING','CONFIRMED')`,
    [date]
  );
  return rows.map((r) => r.booking_time);
}

/**
 * Computes genuinely bookable time slots for a given service on a given
 * date — the single source of truth for availability, called both by the
 * public GET /api/availability endpoint (to display slots) and again by
 * POST /api/bookings (to re-validate right before creating a booking, so
 * a slot can never be double-booked in the race-condition window between
 * "browse" and "submit").
 */
export async function getAvailableSlots(
  date: string,
  serviceId: number,
  durationOverrideMinutes?: number
): Promise<string[]> {
  const settings = await getAvailabilitySettings();

  const target = new Date(`${date}T00:00:00Z`);
  if (isNaN(target.getTime())) return [];

  const dayOfWeek = target.getUTCDay();
  if (!settings.working_days.includes(dayOfWeek)) return [];
  if (settings.blocked_dates.includes(date)) return [];

  const todayStr = new Date().toISOString().slice(0, 10);
  if (date < todayStr) return [];

  const duration = durationOverrideMinutes ?? (await getServiceDurationMinutes(serviceId, settings.slot_minutes));
  const step = duration + settings.buffer_minutes;

  const [startH, startM] = settings.start_time.split(":").map(Number);
  const [endH, endM] = settings.end_time.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  const bookedTimes = await getBookedTimesForDate(date);
  const nowMinutes = date === todayStr ? new Date().getHours() * 60 + new Date().getMinutes() : -1;

  const slots: string[] = [];
  for (let t = startMinutes; t + duration <= endMinutes; t += step) {
    const hh = String(Math.floor(t / 60)).padStart(2, "0");
    const mm = String(t % 60).padStart(2, "0");
    const slotTime = `${hh}:${mm}`;

    if (settings.blocked_slots.includes(`${date}|${slotTime}`)) continue;
    if (bookedTimes.includes(slotTime)) continue;
    if (date === todayStr && t < nowMinutes) continue;

    slots.push(slotTime);
  }

  return slots;
}
