import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP settings are missing in .env.local.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

export async function sendPasswordSetupEmail({
  name,
  email,
  token,
}: {
  name: string;
  email: string;
  token: string;
}) {
  const from = process.env.SMTP_FROM;
  if (!from) {
    throw new Error("SMTP_FROM is missing in .env.local.");
  }

  const setupUrl = `${getSiteUrl()}/student/set-password?token=${token}`;
  const safeName = escapeHtml(name);

  await getTransporter().sendMail({
    from,
    to: email,
    subject: "Set your password for Rituu Bhatia Courses",
    text: `Hello ${name},

Your course payment has been confirmed.

Set your password to access your course:
${setupUrl}

This link expires in 24 hours.

Rituu Bhatia`,
    html: `
      <p>Hello ${safeName},</p>
      <p>Your course payment has been confirmed.</p>
      <p>
        <a href="${setupUrl}"
           style="display:inline-block;background:#6B1B2C;color:#fff;padding:12px 20px;text-decoration:none;">
          Set your password
        </a>
      </p>
      <p>This link expires in 24 hours.</p>
      <p>Rituu Bhatia</p>
    `,
  });
}

export async function sendCourseEnrollmentEmail({
  name,
  email,
  courseTitle,
}: {
  name: string;
  email: string;
  courseTitle: string;
}) {
  const from = process.env.SMTP_FROM;
  if (!from) {
    throw new Error("SMTP_FROM is missing in .env.local.");
  }

  const courseUrl = `${getSiteUrl()}/my-courses`;
  const safeName = escapeHtml(name);
  const safeCourseTitle = escapeHtml(courseTitle);

  await getTransporter().sendMail({
    from,
    to: email,
    subject: `Enrollment confirmed: ${courseTitle}`,
    text: `Hello ${name},

Your enrollment for ${courseTitle} is confirmed.

Sign in to access your course:
${courseUrl}

Rituu Bhatia`,
    html: `
      <p>Hello ${safeName},</p>
      <p>Your enrollment for <strong>${safeCourseTitle}</strong> is confirmed.</p>
      <p>
        <a href="${courseUrl}"
           style="display:inline-block;background:#6B1B2C;color:#fff;padding:12px 20px;text-decoration:none;">
          Go to My Courses
        </a>
      </p>
      <p>Rituu Bhatia</p>
    `,
  });
}

// ---------------------------------------------------------------------
// Generic email + admin-notification support, used by booking/lead
// notifications (src/lib/emailTemplates.ts). Reuses the same transporter
// and SMTP_* env vars as everything above — no separate config needed.
// ---------------------------------------------------------------------

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends an arbitrary email via the same SMTP transporter used above. Fails
 * silently — logs the error and returns false rather than throwing —
 * because these notifications are layered on top of a booking or lead; a
 * flaky SMTP connection should never cause the underlying action to fail.
 */
export async function sendEmail({ to, subject, html, replyTo }: SendEmailInput): Promise<boolean> {
  try {
    const from = process.env.SMTP_FROM;
    if (!from) {
      throw new Error("SMTP_FROM is missing in .env.local.");
    }
    await getTransporter().sendMail({ from, to, subject, html, replyTo });
    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    return false;
  }
}

export function getAdminNotificationEmail(): string | null {
  return process.env.ADMIN_NOTIFICATION_EMAIL || null;
}