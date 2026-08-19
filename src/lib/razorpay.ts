import crypto from "crypto";

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

/**
 * Same security model as before: amount always comes from a server-side
 * lookup (services/courses table), never from the request body, and a
 * booking only becomes CONFIRMED after the Razorpay webhook verifies
 * payment server-side (see /api/payments/webhook) — the client-side
 * checkout "success" callback is never trusted on its own.
 */
export async function createRazorpayOrder(bookingId: number, amountPaise: number) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in .env.local.");
  }

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: `booking_${bookingId}`,
      notes: { booking_id: String(bookingId) },
    }),
  });

  if (!response.ok) {
    throw new Error("Could not create Razorpay order.");
  }

  const order = (await response.json()) as RazorpayOrder;
  return { order_id: order.id, amount: order.amount, currency: order.currency, key_id: keyId };
}

export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signatureHeader) return false;

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return timingSafeEqualStrings(expected, signatureHeader);
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  return timingSafeEqualStrings(expected, signature);
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
