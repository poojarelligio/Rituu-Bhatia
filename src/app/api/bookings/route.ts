import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAvailableSlots } from "@/lib/availability";
import { getStaticServiceBySlug, getStaticServiceDurationMinutes } from "@/lib/staticServices";
import { createRazorpayOrder } from "@/lib/razorpay";
import { rateLimitOrError } from "@/lib/rateLimit";

const FREE_INTRO_MINUTES = 15;

interface BookingBody {
  item_type?: "service" | "free_intro" | "course";
  service_slug?: string;
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
  const { customer_name, customer_email, customer_phone } = body;

  if (!["service", "free_intro", "course"].includes(itemType)) {
    return NextResponse.json({ error: "Unknown booking type." }, { status: 400 });
  }
  if (!customer_name || !isEmail(customer_email) || !customer_phone) {
    return NextResponse.json({ error: "Missing or invalid required fields." }, { status: 400 });
  }

  if (itemType === "course") {
    const courseId = body.item_id ?? body.service_id;
    if (!courseId) {
      return NextResponse.json({ error: "Missing course." }, { status: 400 });
    }
    return createCourseBooking(courseId, body);
  }

  // Free intro call — no payment
  if (itemType === "free_intro") {
    return createFreeIntroBooking(body);
  }

  // Paid service booking — ₹99
  return createServiceBooking(body);
}

async function createServiceBooking(body: BookingBody) {
  const slug = body.service_slug;
  if (!slug) {
    return NextResponse.json({ error: "Missing service." }, { status: 400 });
  }
  const service = getStaticServiceBySlug(slug);
  if (!service) {
    return NextResponse.json({ error: "Unknown service." }, { status: 404 });
  }
  if (!body.date || !body.time) {
    return NextResponse.json({ error: "Date and time are required." }, { status: 400 });
  }

  // ✅ Price comes from staticServices.ts, not from the request body
  const amountPaise = service.price_amount;
  if (!amountPaise || amountPaise <= 0) {
    return NextResponse.json({ error: "This service does not have a price configured." }, { status: 500 });
  }

  const duration = getStaticServiceDurationMinutes(slug);
  const stillAvailable = (await getAvailableSlots(body.date, duration)).includes(body.time);
  if (!stillAvailable) {
    return NextResponse.json({ error: "That time slot is no longer available. Please choose another." }, { status: 409 });
  }

  // Insert PENDING booking
  const result = await query<{ insertId: number }>(
    `INSERT INTO bookings (item_type, item_id, service_slug, booking_date, booking_time, customer_name, customer_email, customer_phone, notes, amount_paise, status)
     VALUES ('service', 0, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
    [
      slug,
      body.date,
      body.time,
      body.customer_name,
      body.customer_email,
      body.customer_phone,
      body.notes || "",
      amountPaise,
    ]
  );

  try {
    const order = await createRazorpayOrder(result.insertId, amountPaise);
    await query("UPDATE bookings SET razorpay_order_id = ? WHERE id = ?", [order.order_id, result.insertId]);
    return NextResponse.json({
      booking_id: result.insertId,
      order,
      requires_payment: true,
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    // Clean up the pending booking if Razorpay fails
    await query("DELETE FROM bookings WHERE id = ?", [result.insertId]).catch(() => undefined);
    return NextResponse.json({ error: "Could not start payment. Please try again shortly." }, { status: 502 });
  }
}

async function createFreeIntroBooking(body: BookingBody) {
  const slug = body.service_slug || "free-intro";
  if (!body.date || !body.time) {
    return NextResponse.json({ error: "Date and time are required." }, { status: 400 });
  }

  const stillAvailable = (await getAvailableSlots(body.date, FREE_INTRO_MINUTES)).includes(body.time);
  if (!stillAvailable) {
    return NextResponse.json({ error: "That time slot is no longer available. Please choose another." }, { status: 409 });
  }

  const result = await query<{ insertId: number }>(
    `INSERT INTO bookings (item_type, item_id, service_slug, booking_date, booking_time, customer_name, customer_email, customer_phone, notes, amount_paise, status)
     VALUES ('free_intro', 0, ?, ?, ?, ?, ?, ?, ?, 0, 'CONFIRMED')`,
    [
      slug,
      body.date,
      body.time,
      body.customer_name,
      body.customer_email,
      body.customer_phone,
      body.notes || "",
    ]
  );

  return NextResponse.json({ booking_id: result.insertId, confirmed: true, free: true });
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

  try {
    const order = await createRazorpayOrder(result.insertId, amountPaise);
    await query("UPDATE bookings SET razorpay_order_id = ? WHERE id = ?", [order.order_id, result.insertId]);
    return NextResponse.json({ booking_id: result.insertId, order, requires_payment: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not start payment. Please try again shortly." }, { status: 502 });
  }
}

function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}