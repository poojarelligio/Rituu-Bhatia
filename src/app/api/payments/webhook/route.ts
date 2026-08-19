import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
      };
    };
  };
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Signature verification failed." }, { status: 400 });
  }

  const payload = JSON.parse(rawBody) as RazorpayWebhookPayload;

  if (payload.event === "payment.captured") {
    await handlePaymentCaptured(payload);
  } else if (payload.event === "payment.failed") {
    await handlePaymentFailed(payload);
  }
  // Other events are acknowledged but ignored — Razorpay expects a 2xx for
  // any event it sends, whether or not we act on it.

  return NextResponse.json({ received: true });
}

async function handlePaymentCaptured(payload: RazorpayWebhookPayload) {
  const { order_id, id: paymentId } = payload.payload.payment.entity;

  const rows = await query<{ id: number; status: string }[]>(
    "SELECT id, status FROM bookings WHERE razorpay_order_id = ? LIMIT 1",
    [order_id]
  );
  const booking = rows[0];
  if (!booking) return; // unknown order — nothing to confirm

  // Idempotency: webhooks can be delivered more than once.
  if (booking.status === "CONFIRMED") return;

  await query("UPDATE bookings SET status = 'CONFIRMED', razorpay_payment_id = ? WHERE id = ?", [
    paymentId,
    booking.id,
  ]);
}

async function handlePaymentFailed(payload: RazorpayWebhookPayload) {
  const { order_id } = payload.payload.payment.entity;

  const rows = await query<{ id: number; status: string }[]>(
    "SELECT id, status FROM bookings WHERE razorpay_order_id = ? LIMIT 1",
    [order_id]
  );
  const booking = rows[0];
  if (!booking) return;
  if (booking.status === "CONFIRMED") return; // a later successful retry already confirmed it

  await query("UPDATE bookings SET status = 'CANCELLED' WHERE id = ?", [booking.id]);
}
