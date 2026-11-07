import nodemailer from "nodemailer";
import { BOOKING, prettyDate, fmt12 } from "./bookingConfig";

/**
 * Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM ("Rituu Bhatia <info@rituubhatia.in>"), ADMIN_EMAIL
 * If your project already has a nodemailer transport, reuse it instead.
 */
let transport: nodemailer.Transporter | null = null;
const getTransport = () =>
  (transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  }));

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export interface MailBooking {
  reference: string;
  service: string;
  mode: "online" | "studio";
  name: string;
  email: string;
  phone: string;
  message?: string | null;
  date: string; // YYYY-MM-DD (IST)
  time: string; // HH:mm (IST)
  meetLink?: string | null;
}

const row = (k: string, v: string) =>
  `<tr><td style="padding:6px 16px 6px 0;color:#7a7488;font-size:13px">${k}</td><td style="padding:6px 0;color:#1b1633;font-size:14px;font-weight:600">${v}</td></tr>`;

function shell(title: string, intro: string, rows: string, footer = "") {
  return `<!doctype html><html><body style="margin:0;background:#f6f1e7;font-family:Georgia,serif">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">
    <div style="background:#1b1633;border-radius:20px 20px 0 0;padding:28px 32px;text-align:center">
      <div style="color:#d4af37;letter-spacing:3px;font-size:11px">RITUU BHATIA</div>
      <h1 style="color:#fff;font-weight:300;font-size:24px;margin:10px 0 0">${title}</h1>
    </div>
    <div style="background:#fff;border-radius:0 0 20px 20px;padding:28px 32px;border:1px solid #e8e1d2;border-top:0">
      <p style="color:#3b3552;font-size:15px;line-height:1.6;margin:0 0 18px">${intro}</p>
      <table style="border-collapse:collapse">${rows}</table>
      ${footer}
    </div>
  </div></body></html>`;
}

export async function sendBookingEmails(b: MailBooking) {
  const when = `${prettyDate(b.date)}, ${fmt12(b.time)} IST`;
  const where =
    b.mode === "online"
      ? b.meetLink
        ? `Online — <a href="${esc(b.meetLink)}" style="color:#9a7b1c">Join Google Meet</a>`
        : "Online — the Google Meet link will be sent once confirmed"
      : esc(BOOKING.studioAddress);

  const clientRows =
    row("Reference", esc(b.reference)) + row("Service", esc(b.service)) + row("When", esc(when)) + row("Where", where);

  const from = process.env.MAIL_FROM || process.env.SMTP_USER!;
  const admin = process.env.ADMIN_EMAIL;
  const t = getTransport();

  const jobs: Promise<unknown>[] = [
    t.sendMail({
      from,
      to: b.email,
      subject: `Appointment request received — ${prettyDate(b.date)}, ${fmt12(b.time)}`,
      html: shell(
        "Request received",
        `Hi ${esc(b.name)}, thank you for your request. Your appointment is awaiting confirmation. We will email you as soon as it is confirmed.`,
        clientRows,
        `<p style="color:#7a7488;font-size:12px;margin:22px 0 0">Need to reschedule? Just reply to this email with your reference number.</p>`,
      ),
    }),
  ];

  if (!admin) console.warn("[booking] ADMIN_EMAIL is not set - admin notification skipped");
  if (admin) {
    jobs.push(
      t.sendMail({
        from,
        to: admin,
        replyTo: b.email,
        subject: `New appointment request: ${b.name} — ${b.service} (${b.date} ${fmt12(b.time)})`,
        html: shell(
          "New appointment request",
          "A new appointment request is waiting for your confirmation. Open Admin → Appointments to confirm it.",
          clientRows +
            row("Name", esc(b.name)) +
            row("Email", esc(b.email)) +
            row("Phone", esc(b.phone)) +
            row("Message", b.message ? esc(b.message) : "—"),
        ),
      }),
    );
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === "rejected" && console.error("[booking] mail failed:", r.reason));
  return results[0].status === "fulfilled";
}

/** Sends the client their Meet link (used by the admin "Create / Email link" buttons). */
export async function sendMeetEmail(b: MailBooking) {
  if (!b.meetLink) return false;
  const when = `${prettyDate(b.date)}, ${fmt12(b.time)} IST`;
  await getTransport().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER!,
    to: b.email,
    subject: `Your Google Meet link — ${prettyDate(b.date)}, ${fmt12(b.time)}`,
    html: shell(
      "Your session link",
      `Hi ${esc(b.name)}, here is the link for your online session.`,
      row("Service", esc(b.service)) +
        row("When", esc(when)) +
        row("Join", `<a href="${esc(b.meetLink)}" style="color:#9a7b1c">${esc(b.meetLink)}</a>`),
    ),
  });
  return true;
}

/** Sent to the client when the admin confirms the appointment. */
export async function sendConfirmedEmail(b: MailBooking) {
  const when = `${prettyDate(b.date)}, ${fmt12(b.time)} IST`;
  const where =
    b.mode === "online"
      ? b.meetLink
        ? `Online — <a href="${esc(b.meetLink)}" style="color:#9a7b1c">Join Google Meet</a>`
        : "Online — the Google Meet link will be sent shortly"
      : esc(BOOKING.studioAddress);
  await getTransport().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER!,
    to: b.email,
    subject: `Appointment confirmed — ${prettyDate(b.date)}, ${fmt12(b.time)}`,
    html: shell(
      "Appointment confirmed",
      `Hi ${esc(b.name)}, your appointment is confirmed. A calendar invite has also been sent to this email address.`,
      row("Reference", esc(b.reference)) + row("Service", esc(b.service)) + row("When", esc(when)) + row("Where", where),
      `<p style="color:#7a7488;font-size:12px;margin:22px 0 0">Need to reschedule? Just reply to this email with your reference number.</p>`,
    ),
  });
}
