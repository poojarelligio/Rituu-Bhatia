/**
 * Everything you are likely to tweak lives here.
 * All times are Indian Standard Time (UTC+05:30, no daylight saving).
 */
export const BOOKING = {
  timezone: "Asia/Kolkata",
  offset: "+05:30",
  slotMinutes: 30,
  bufferMinutes: 0, // gap kept free before/after each booking
  minNoticeHours: 4, // can't book sooner than this
  maxDaysAhead: 30,
  studioAddress:
    "Office No: 8, 8th Floor, Arunachal Bhavan, Plot No. 19, Sector 30A, Vashi, Navi Mumbai, Maharashtra 400703",
  // 0 = Sunday … 6 = Saturday. null = closed. Several windows per day are allowed.
  hours: {
    0: null,
    1: [["10:00", "13:00"], ["14:00", "18:00"]],
    2: [["10:00", "13:00"], ["14:00", "18:00"]],
    3: [["10:00", "13:00"], ["14:00", "18:00"]],
    4: [["10:00", "13:00"], ["14:00", "18:00"]],
    5: [["10:00", "13:00"], ["14:00", "18:00"]],
    6: [["10:00", "14:00"]],
  } as Record<number, [string, string][] | null>,
} as const;

/** Edit names / prices to match your real services. */
export const SERVICES = [
  { id: "tarot", name: "Tarot Card Reading", duration: "30 min" },
  { id: "astrology", name: "Astrology Consultation", duration: "30 min" },
  { id: "vaastu", name: "Vaastu Consultation", duration: "30 min" },
  { id: "reiki", name: "Reiki Session", duration: "30 min" },
] as const;

export const SERVICE_IDS = SERVICES.map((s) => s.id) as string[];

/* ---------- IST date helpers (dates are "YYYY-MM-DD" strings) ---------- */

export const istInstant = (date: string, hm: string) => new Date(`${date}T${hm}:00${BOOKING.offset}`);

export const weekdayOf = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

export const istDateOf = (d: Date) => new Date(d.getTime() + 330 * 60000).toISOString().slice(0, 10);

export const addDays = (date: string, n: number) => {
  const t = new Date(`${date}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
};

export const isDateString = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(`${s}T00:00:00Z`).getTime());

export const fmt12 = (hm: string) => {
  const [h, m] = hm.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

export const hmOf = (d: Date) => new Date(d.getTime() + 330 * 60000).toISOString().slice(11, 16);

export const prettyDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
