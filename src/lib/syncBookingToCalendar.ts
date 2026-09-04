import { createGoogleCalendarEvent } from "@/lib/googleCalendar";
import { getStaticServiceBySlug } from "@/lib/staticServices";

interface BookingForCalendar {
  itemType: "service" | "free_intro" | "course";
  serviceSlug?: string | null;
  courseTitle?: string | null;
  date: string; // Y-m-d, only present for service/free_intro
  time: string; // H:i, only present for service/free_intro
  durationMinutes: number;
  customerName: string;
  customerEmail: string;
}

/**
 * Adds a confirmed booking to Rituu's Google Calendar with the customer
 * invited as an attendee. Safe to call even if Calendar isn't connected —
 * createGoogleCalendarEvent() already no-ops gracefully in that case, so
 * this never blocks or fails a booking.
 */
export async function syncBookingToGoogleCalendar(booking: BookingForCalendar) {
  let title: string;
  let startISO: string;
  let endISO: string;

  if (booking.itemType === "course") {
    // Courses don't have a specific date/time slot the way sessions do —
    // sync an all-day-ish placeholder isn't meaningful, so course
    // enrollments are intentionally not calendar-synced. Only service /
    // free_intro bookings (which have a real date+time) go on the calendar.
    return;
  }

  const service = booking.serviceSlug ? getStaticServiceBySlug(booking.serviceSlug) : null;
  title = `${service?.title || "Consultation"} with ${booking.customerName}`;

  const start = new Date(`${booking.date}T${booking.time}:00+05:30`);
  const end = new Date(start.getTime() + booking.durationMinutes * 60000);
  startISO = start.toISOString();
  endISO = end.toISOString();

  await createGoogleCalendarEvent({
    summary: title,
    description: `Booked via rituubhatia.in\nService: ${service?.title || "N/A"}\nClient: ${booking.customerName} (${booking.customerEmail})`,
    startISO,
    endISO,
    attendeeEmail: booking.customerEmail,
    attendeeName: booking.customerName,
  });
}