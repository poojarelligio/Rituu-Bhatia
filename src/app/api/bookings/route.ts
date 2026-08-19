import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAvailableSlots } from "@/lib/availability";
import { createRazorpayOrder } from "@/lib/razorpay";
import { rateLimitOrError } from "@/lib/rateLimit";

const FREE_INTRO_MINUTES = 15;

interface BookingBody {
  item_type?: "service" | "free_intro" | "course";
  service_id?: number;
  item_id?: number;
  date?: string;
  time?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  const limited = rateLimitOrError(request);
  if (limited) return limited;

  const body = (await request.json()) as BookingBody;
  const itemType = body.item_type || "service";
  const itemId = body.service_id ?? body.item_id;
  const { customer_name, customer_email, customer_phone } = body;

  if (!["service", "free_intro", "course"].includes(itemType)) {
    return NextResponse.json({ error: "Unknown booking type." }, { status: 400 });
  }
  if (!itemId || !customer_name || !isEmail(customer_email) || !customer_phone) {
    return NextResponse.json({ error: "Missing or invalid required fields." }, { status: 400 });
  }

  if (itemType === "course") {
    return createCourseBooking(itemId, body);
  }

  // service and free_intro both need a validated date/time slot
  if (!body.date || !body.time) {
    return NextResponse.json({ error: "Date and time are required." }, { status: 400 });
  }

  const serviceRows = await query<{ id: number; price_amount: number }[]>(
    "SELECT id, price_amount FROM services WHERE id = ? AND status = 'published'",
    [itemId]
  );
  const service = serviceRows[0];
  if (!service) {
    return NextResponse.json({ error: "Unknown or unavailable service." }, { status: 404 });
  }

  const durationOverride = itemType === "free_intro" ? FREE_INTRO_MINUTES : undefined;
  const stillAvailable = (await getAvailableSlots(body.date, itemId, durationOverride)).includes(body.time);
  if (!stillAvailable) {
    return NextResponse.json({ error: "That time slot is no longer available. Please choose another." }, { status: 409 });
  }

  if (itemType === "free_intro") {
    const result = await query<{ insertId: number }>(
      `INSERT INTO bookings (item_type, item_id, booking_date, booking_time, customer_name, customer_email, customer_phone, notes, amount_paise, status)
       VALUES ('free_intro', ?, ?, ?, ?, ?, ?, ?, 0, 'CONFIRMED')`,
      [itemId, body.date, body.time, customer_name, customer_email, customer_phone, body.notes || ""]
    );
    return NextResponse.json({ booking_id: result.insertId, confirmed: true, free: true });
  }

  // Paid service — amount from the server-side price, never from the request.
  const amountPaise = service.price_amount;
  if (!amountPaise || amountPaise <= 0) {
    return NextResponse.json({ error: "This service does not have a price configured yet." }, { status: 500 });
  }

  const result = await query<{ insertId: number }>(
    `INSERT INTO bookings (item_type, item_id, booking_date, booking_time, customer_name, customer_email, customer_phone, notes, amount_paise, status)
     VALUES ('service', ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
    [itemId, body.date, body.time, customer_name, customer_email, customer_phone, body.notes || "", amountPaise]
  );

  return createOrderResponse(result.insertId, amountPaise);
}

async function createCourseBooking(courseId: number, body: BookingBody) {
  const rows = await query<{ id: number; price_amount: number; discount_price_amount: number }[]>(
    "SELECT id, price_amount, discount_price_amount FROM courses WHERE id = ? AND status = 'published'",
    [courseId]
  );
  const course = rows[0];
  if (!course) {
    return NextResponse.json({ error: "Unknown or unavailable course." }, { status: 404 });
  }

  const amountPaise = course.discount_price_amount > 0 ? course.discount_price_amount : course.price_amount;
  if (!amountPaise || amountPaise <= 0) {
    return NextResponse.json({ error: "This course does not have a price configured yet." }, { status: 500 });
  }

  const result = await query<{ insertId: number }>(
    `INSERT INTO bookings (item_type, item_id, customer_name, customer_email, customer_phone, notes, amount_paise, status)
     VALUES ('course', ?, ?, ?, ?, ?, ?, 'PENDING')`,
    [courseId, body.customer_name, body.customer_email, body.customer_phone, body.notes || "", amountPaise]
  );

  return createOrderResponse(result.insertId, amountPaise);
}

async function createOrderResponse(bookingId: number, amountPaise: number) {
  try {
    const order = await createRazorpayOrder(bookingId, amountPaise);
    await query("UPDATE bookings SET razorpay_order_id = ? WHERE id = ?", [order.order_id, bookingId]);
    return NextResponse.json({ booking_id: bookingId, order });
  } catch (err) {
    console.error(err);
    // Booking stays PENDING — admin can retry from the dashboard, or the
    // customer can re-attempt. We never silently confirm without payment.
    return NextResponse.json({ error: "Could not start payment. Please try again shortly." }, { status: 502 });
  }
}

function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}
