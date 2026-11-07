function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface BookingEmailData {
  serviceOrCourseName: string;
  date?: string; // present for free service/free_intro bookings, absent for course enrollments
  time?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

/**
 * Sent to the customer when a FREE service/free_intro booking is confirmed
 * (src/app/api/bookings/route.ts). Course purchases already have their own
 * dedicated emails — sendCourseEnrollmentEmail / sendPasswordSetupEmail in
 * src/lib/email.ts — so this is deliberately scoped to the free-session flow only.
 */
export function customerBookingConfirmationEmail(data: BookingEmailData): { subject: string; html: string } {
  const subject = `You're booked: ${data.serviceOrCourseName}${data.date ? ` on ${data.date}` : ""}`;

  const html = `
  <div style="font-family:Georgia,'Times New Roman',serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FAF6EE;color:#241F1B;">
    <p style="font-size:11px;letter-spacing:0.08em;color:#A9803D;text-transform:uppercase;margin:0 0 16px;">BOOKING CONFIRMED</p>
    <h1 style="font-size:24px;font-weight:400;margin:0 0 16px;">Hi ${escapeHtml(data.customerName)}, you're all set.</h1>
    <p style="font-size:15px;line-height:1.6;color:#57504A;margin:0 0 24px;">
      Your free session with Rituu Bhatia is confirmed. Here are the details:
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr><td style="padding:8px 0;border-top:1px solid #DED2BC;color:#8a8177;font-size:12px;text-transform:uppercase;">Service</td><td style="padding:8px 0;border-top:1px solid #DED2BC;text-align:right;font-weight:600;">${escapeHtml(data.serviceOrCourseName)}</td></tr>
      <tr><td style="padding:8px 0;border-top:1px solid #DED2BC;color:#8a8177;font-size:12px;text-transform:uppercase;">Date</td><td style="padding:8px 0;border-top:1px solid #DED2BC;text-align:right;font-weight:600;">${escapeHtml(data.date || "")}</td></tr>
      <tr><td style="padding:8px 0;border-top:1px solid #DED2BC;color:#8a8177;font-size:12px;text-transform:uppercase;">Time</td><td style="padding:8px 0;border-top:1px solid #DED2BC;text-align:right;font-weight:600;">${escapeHtml(data.time || "")}</td></tr>
    </table>
    <p style="font-size:13px;color:#8a8177;line-height:1.6;">If anything changes or you have questions, just reply to this email.</p>
  </div>`;

  return { subject, html };
}

/**
 * Sent to Rituu (via ADMIN_NOTIFICATION_EMAIL) when a new booking comes in.
 * Used by the free service/free_intro flow directly. If you also want Rituu
 * notified on paid course enrollments, call this from your webhook's
 * handlePaymentCaptured() alongside the existing sendCourseEnrollmentEmail
 * call — see the note below.
 */
export function adminBookingNotificationEmail(data: BookingEmailData): { subject: string; html: string } {
  const subject = `New booking: ${data.serviceOrCourseName} — ${data.customerName}`;

  const dateTimeRows = data.date
    ? `
      <tr><td style="padding:6px 0;color:#FAF6EE99;font-size:12px;">Date</td><td style="padding:6px 0;text-align:right;">${escapeHtml(data.date)}</td></tr>
      <tr><td style="padding:6px 0;color:#FAF6EE99;font-size:12px;">Time</td><td style="padding:6px 0;text-align:right;">${escapeHtml(data.time || "")}</td></tr>
    `
    : "";

  const html = `
  <div style="font-family:Georgia,'Times New Roman',serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#241F1B;color:#FAF6EE;">
    <p style="font-size:11px;letter-spacing:0.08em;color:#C9A868;text-transform:uppercase;margin:0 0 16px;">NEW BOOKING</p>
    <h1 style="font-size:22px;font-weight:400;margin:0 0 20px;">${escapeHtml(data.serviceOrCourseName)}</h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:6px 0;color:#FAF6EE99;font-size:12px;">Client</td><td style="padding:6px 0;text-align:right;">${escapeHtml(data.customerName)}</td></tr>
      <tr><td style="padding:6px 0;color:#FAF6EE99;font-size:12px;">Email</td><td style="padding:6px 0;text-align:right;">${escapeHtml(data.customerEmail)}</td></tr>
      <tr><td style="padding:6px 0;color:#FAF6EE99;font-size:12px;">Phone</td><td style="padding:6px 0;text-align:right;">${escapeHtml(data.customerPhone)}</td></tr>
      ${dateTimeRows}
    </table>
    ${data.notes ? `<p style="font-size:13px;color:#FAF6EEcc;line-height:1.6;margin-bottom:20px;"><strong>Notes:</strong> ${escapeHtml(data.notes)}</p>` : ""}
    <p style="font-size:12px;color:#FAF6EE66;margin-top:8px;">View full details in your admin dashboard → /admin/bookings</p>
  </div>`;

  return { subject, html };
}

interface LeadEmailData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: string;
}

/** Sent to Rituu the moment a new contact-form lead comes in. */
export function adminLeadNotificationEmail(data: LeadEmailData): { subject: string; html: string } {
  const subject = `New enquiry from ${data.name}`;
  const html = `
  <div style="font-family:Georgia,'Times New Roman',serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#241F1B;color:#FAF6EE;">
    <p style="font-size:11px;letter-spacing:0.08em;color:#C9A868;text-transform:uppercase;margin:0 0 16px;">NEW ENQUIRY</p>
    <h1 style="font-size:22px;font-weight:400;margin:0 0 20px;">${escapeHtml(data.name)}</h1>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:6px 0;color:#FAF6EE99;font-size:12px;">Email</td><td style="padding:6px 0;text-align:right;">${escapeHtml(data.email)}</td></tr>
      ${data.phone ? `<tr><td style="padding:6px 0;color:#FAF6EE99;font-size:12px;">Phone</td><td style="padding:6px 0;text-align:right;">${escapeHtml(data.phone)}</td></tr>` : ""}
      <tr><td style="padding:6px 0;color:#FAF6EE99;font-size:12px;">Source</td><td style="padding:6px 0;text-align:right;">${escapeHtml(data.source)}</td></tr>
    </table>
    ${data.message ? `<p style="font-size:13px;color:#FAF6EEcc;line-height:1.6;margin-bottom:20px;"><strong>Message:</strong> ${escapeHtml(data.message)}</p>` : ""}
    <p style="font-size:12px;color:#FAF6EE66;margin-top:8px;">View full details in your admin dashboard → /admin/leads</p>
  </div>`;
  return { subject, html };
}