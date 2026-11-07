import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { pool, query } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { createPasswordSetupToken } from "@/lib/studentPassword";
import {
  sendCourseEnrollmentEmail,
  sendPasswordSetupEmail,
  sendEmail,
  getAdminNotificationEmail,
} from "@/lib/email";
import {
  customerBookingConfirmationEmail,
  adminBookingNotificationEmail,
} from "@/lib/emailTemplates";
import { syncBookingToGoogleCalendar } from "@/lib/syncBookingToCalendar";
import { getStaticServiceBySlug, getStaticServiceDurationMinutes } from "@/lib/staticServices";

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

interface BookingRow extends RowDataPacket {
  id: number;
  item_type: "service" | "free_intro" | "course";
  item_id: number;
  service_slug: string | null;
  booking_date: string | null;
  booking_time: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string | null;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  course_title: string | null;
}

interface StudentRow extends RowDataPacket {
  id: number;
  password_hash: string | null;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      { error: "Signature verification failed." },
      { status: 400 }
    );
  }

  const payload = JSON.parse(rawBody) as RazorpayWebhookPayload;

  if (payload.event === "payment.captured") {
    await handlePaymentCaptured(payload);
  } else if (payload.event === "payment.failed") {
    await handlePaymentFailed(payload);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentCaptured(payload: RazorpayWebhookPayload) {
  const { order_id: orderId, id: paymentId } = payload.payload.payment.entity;
  const connection = await pool.getConnection();

  // --- Course email job (only set for course bookings) ---
  let emailJob:
    | {
        type: "setup-password";
        studentId: number;
        name: string;
        email: string;
      }
    | {
        type: "course-confirmation";
        name: string;
        email: string;
        courseTitle: string;
      }
    | null = null;

  // --- Snapshot of the confirmed booking (for service emails / calendar sync) ---
  let bookingSnapshot: BookingRow | null = null;

  try {
    await connection.beginTransaction();

    const [bookingRows] = await connection.query<BookingRow[]>(
      `SELECT
         b.id,
         b.item_type,
         b.item_id,
         b.service_slug,
         b.booking_date,
         b.booking_time,
         b.customer_name,
         b.customer_email,
         b.customer_phone,
         b.notes,
         b.status,
         c.title AS course_title
       FROM bookings b
       LEFT JOIN courses c ON c.id = b.item_id AND b.item_type = 'course'
       WHERE b.razorpay_order_id = ?
       LIMIT 1
       FOR UPDATE`,
      [orderId]
    );

    const booking = bookingRows[0];

    // Unknown order — acknowledge so Razorpay stops retrying.
    if (!booking) {
      await connection.commit();
      return;
    }

    // Idempotency — Razorpay may deliver the same event more than once.
    if (booking.status === "CONFIRMED") {
      await connection.commit();
      return;
    }

    // Mark booking as paid.
    await connection.query(
      `UPDATE bookings
       SET status = 'CONFIRMED', razorpay_payment_id = ?
       WHERE id = ?`,
      [paymentId, booking.id]
    );

    // ---- COURSE FLOW: create student + enrollment ----
    if (booking.item_type === "course") {
      const email = booking.customer_email.trim().toLowerCase();

      await connection.query(
        `INSERT INTO students (name, email, phone)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           phone = VALUES(phone)`,
        [booking.customer_name, email, booking.customer_phone]
      );

      const [studentRows] = await connection.query<StudentRow[]>(
        `SELECT id, password_hash
         FROM students
         WHERE email = ?
         LIMIT 1`,
        [email]
      );

      const student = studentRows[0];
      if (!student) {
        throw new Error("Student could not be created.");
      }

      await connection.query(
        `INSERT INTO course_enrollments
           (course_id, customer_email, customer_name, customer_phone, booking_id, status, enrolled_at)
         VALUES (?, ?, ?, ?, ?, 'ACTIVE', NOW())
         ON DUPLICATE KEY UPDATE
           customer_name = VALUES(customer_name),
           customer_phone = VALUES(customer_phone),
           booking_id = VALUES(booking_id),
           status = 'ACTIVE',
           enrolled_at = NOW()`,
        [
          booking.item_id,
          email,
          booking.customer_name,
          booking.customer_phone,
          booking.id,
        ]
      );

      const courseTitle = booking.course_title || "your course";

      if (student.password_hash) {
        emailJob = {
          type: "course-confirmation",
          name: booking.customer_name,
          email,
          courseTitle,
        };
      } else {
        emailJob = {
          type: "setup-password",
          studentId: student.id,
          name: booking.customer_name,
          email,
        };
      }
    }

    // Keep a snapshot for post-commit side effects.
    bookingSnapshot = booking;

    await connection.commit();
  } catch (error) {
    await connection.rollback().catch(() => undefined);
    throw error;
  } finally {
    connection.release();
  }

  // ============================================================
  //  SIDE EFFECTS — run AFTER the transaction is committed
  // ============================================================

  // ---- Course emails ----
  if (emailJob) {
    try {
      if (emailJob.type === "setup-password") {
        const token = await createPasswordSetupToken(emailJob.studentId);
        await sendPasswordSetupEmail({
          name: emailJob.name,
          email: emailJob.email,
          token,
        });
      } else {
        await sendCourseEnrollmentEmail(emailJob);
      }
    } catch (error) {
      console.error("Course enrollment email could not be sent:", error);
    }
  }

  // ---- Service booking emails + calendar sync ----
  if (bookingSnapshot && bookingSnapshot.item_type === "service") {
    const service = bookingSnapshot.service_slug
      ? getStaticServiceBySlug(bookingSnapshot.service_slug)
      : null;
    const serviceName = service?.title || "Consultation";

    const emailData = {
      serviceOrCourseName: serviceName,
      date: bookingSnapshot.booking_date || undefined,
      time: bookingSnapshot.booking_time || undefined,
      customerName: bookingSnapshot.customer_name,
      customerEmail: bookingSnapshot.customer_email,
      customerPhone: bookingSnapshot.customer_phone,
      notes: bookingSnapshot.notes || undefined,
    };

    // Customer confirmation
    try {
      await sendEmail({
        to: bookingSnapshot.customer_email,
        ...customerBookingConfirmationEmail(emailData),
      });
    } catch (err) {
      console.error("Customer confirmation email failed:", err);
    }

    // Admin notification
    try {
      const adminEmail = getAdminNotificationEmail();
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          replyTo: bookingSnapshot.customer_email,
          ...adminBookingNotificationEmail(emailData),
        });
      }
    } catch (err) {
      console.error("Admin notification email failed:", err);
    }

    // Calendar sync
    if (
      bookingSnapshot.booking_date &&
      bookingSnapshot.booking_time &&
      bookingSnapshot.service_slug
    ) {
      try {
        await syncBookingToGoogleCalendar({
          itemType: "service",
          serviceSlug: bookingSnapshot.service_slug,
          date: bookingSnapshot.booking_date,
          time: bookingSnapshot.booking_time,
          durationMinutes: getStaticServiceDurationMinutes(bookingSnapshot.service_slug),
          customerName: bookingSnapshot.customer_name,
          customerEmail: bookingSnapshot.customer_email,
        });
      } catch (err) {
        console.error("Calendar sync failed:", err);
      }
    }
  }
}

async function handlePaymentFailed(payload: RazorpayWebhookPayload) {
  const { order_id: orderId } = payload.payload.payment.entity;

  const rows = await query<{ id: number; status: string }[]>(
    "SELECT id, status FROM bookings WHERE razorpay_order_id = ? LIMIT 1",
    [orderId]
  );

  const booking = rows[0];
  if (!booking || booking.status === "CONFIRMED") return;

  await query("UPDATE bookings SET status = 'CANCELLED' WHERE id = ?", [
    booking.id,
  ]);
}