import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { rateLimitOrError } from "@/lib/rateLimit";
import { sendEmail, getAdminNotificationEmail } from "@/lib/email";
import { adminLeadNotificationEmail } from "@/lib/emailTemplates";

interface CourseLeadBody {
  course_id: number;
  course_title?: string;
  name: string;
  email: string;
  phone: string;
  best_time?: string;
  message?: string;
  website?: string;
}

export async function POST(request: NextRequest) {
  const limited = rateLimitOrError(request);
  if (limited) return limited;

  let connection;

  try {
    const body = (await request.json()) as CourseLeadBody;

    // Honeypot protection
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const courseId = Number(body.course_id);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const bestTime =
      typeof body.best_time === "string" ? body.best_time.trim() : "";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    const courseTitle =
      typeof body.course_title === "string" && body.course_title.trim()
        ? body.course_title.trim()
        : `Course #${courseId}`;

    // Validate input
    if (
      !Number.isInteger(courseId) ||
      courseId <= 0 ||
      !name ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      !phone
    ) {
      return NextResponse.json(
        { success: false, error: "Please enter valid course and contact details." },
        { status: 400 }
      );
    }

    // Message for the general leads table
    const leadMessage = [
      `Course Enquiry: ${courseTitle}`,
      `Course ID: ${courseId}`,
      `Best time to call: ${bestTime || "Anytime"}`,
      message ? `Customer Message: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Save both records in one database transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Course-specific enquiry
      await connection.execute(
        `INSERT INTO course_enrollments
          (
            course_id,
            customer_name,
            customer_email,
            customer_phone,
            best_time,
            message,
            status
          )
         VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`,
        [courseId, name, email, phone, bestTime || null, message || null]
      );

      // 2. General leads table
      await connection.execute(
        `INSERT INTO leads
          (
            name,
            email,
            phone,
            service_id,
            message,
            source,
            utm,
            status
          )
         VALUES (?, ?, ?, NULL, ?, 'course_enquiry', ?, 'NEW')`,
        [name, email, phone, leadMessage, JSON.stringify({})]
      );

      await connection.commit();
    } catch (dbError: any) {
      await connection.rollback();

      // Same email already enquired for this course (unique_course_customer)
      if (dbError?.code === "ER_DUP_ENTRY") {
        return NextResponse.json(
          {
            success: false,
            duplicate: true,
            error:
              "You have already submitted an enquiry for this course. We will contact you soon.",
          },
          { status: 409 }
        );
      }

      throw dbError;
    }

    // 3. Admin notification email (must never break the response)
    let emailSent = false;
    try {
      const adminEmail = getAdminNotificationEmail();

      if (!adminEmail) {
        console.error(
          "Course enquiry saved, but ADMIN_NOTIFICATION_EMAIL is missing."
        );
      } else {
        const emailResult = await sendEmail({
          to: adminEmail,
          replyTo: email,
          ...adminLeadNotificationEmail({
            name,
            email,
            phone,
            message: leadMessage,
            source: "course_enquiry",
          }),
        });

        emailSent = !!emailResult;

        if (!emailResult) {
          console.error(
            "Course enquiry saved, but admin notification email failed."
          );
        }
      }
    } catch (mailError) {
      console.error("Admin notification email threw an error:", mailError);
    }

    // 4. Success
    return NextResponse.json({
      success: true,
      message: "Your course enquiry has been submitted successfully.",
      emailSent,
    });
  } catch (error) {
    console.error("Course enquiry API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to submit your enquiry. Please try again.",
      },
      { status: 500 }
    );
  } finally {
    connection?.release();
  }
}