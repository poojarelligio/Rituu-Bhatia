import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "";

  const rows = await query<{ status: string; booking_date: string; booking_time: string; customer_email: string }[]>(
    "SELECT status, booking_date, booking_time, customer_email FROM bookings WHERE id = ?",
    [id]
  );
  const booking = rows[0];
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  const storedEmail = booking.customer_email.toLowerCase();
  const givenEmail = email.toLowerCase();
  const bufA = Buffer.from(storedEmail);
  const bufB = Buffer.from(givenEmail);
  const matches = bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);

  if (!matches) {
    return NextResponse.json({ error: "Not authorized to view this booking." }, { status: 403 });
  }

  return NextResponse.json({
    status: booking.status,
    date: booking.booking_date,
    time: booking.booking_time,
  });
}
