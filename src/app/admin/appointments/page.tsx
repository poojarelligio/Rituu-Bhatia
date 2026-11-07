import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { pool } from "@/lib/bookingDb";
import AppointmentActions from "@/components/site/AppointmentActions";

export const dynamic = "force-dynamic";

type Filter = "pending" | "upcoming" | "past" | "cancelled" | "all";

const ist = (d: Date | string) =>
  new Date(d).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const where: Record<Filter, string> = {
  pending: "status='pending'",
  upcoming: "status='confirmed' AND start_at >= UTC_TIMESTAMP()",
  past: "status IN ('confirmed','completed') AND start_at < UTC_TIMESTAMP()",
  cancelled: "status='cancelled'",
  all: "1=1",
};

/**
 * Admin list of appointments (read-only).
 * Sits under /admin, so it is protected by whatever auth your admin layout already uses.
 * If your admin pages call an auth helper themselves, copy that call to the top of this component.
 */
export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const filter: Filter = (["pending", "upcoming", "past", "cancelled", "all"] as const).includes(view as Filter) ? (view as Filter) : "pending";
  const order = filter === "upcoming" || filter === "pending" ? "ASC" : "DESC";

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, reference, service, mode, name, email, phone, message, start_at, status, meet_link, email_sent, google_event_id
       FROM appointments WHERE ${where[filter]} ORDER BY start_at ${order} LIMIT 300`,
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <div className="flex gap-2">
          {(["pending", "upcoming", "past", "cancelled", "all"] as const).map((f) => (
            <Link
              key={f}
              href={`/admin/appointments?view=${f}`}
              className={`rounded-full border px-4 py-1.5 text-sm capitalize ${
                filter === f ? "border-transparent bg-black text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">When (IST)</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="whitespace-nowrap px-4 py-3 font-medium">
                  {ist(r.start_at)}
                  <div className="text-xs font-normal text-gray-400">{r.reference}</div>
                </td>
                <td className="px-4 py-3">
                  {r.name}
                  {r.message && <div className="mt-1 max-w-xs text-xs text-gray-500">{r.message}</div>}
                </td>
                <td className="px-4 py-3">{r.service}</td>
                <td className="px-4 py-3">
                  {r.mode === "online" ? (
                    r.meet_link ? (
                      <a href={r.meet_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Online · Meet
                      </a>
                    ) : (
                      "Online"
                    )
                  ) : (
                    "Studio"
                  )}
                </td>
                <td className="px-4 py-3">
                  <a href={`tel:${r.phone}`} className="block">{r.phone}</a>
                  <a href={`mailto:${r.email}`} className="block text-blue-600">{r.email}</a>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      r.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : r.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : r.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                  {!r.google_event_id && (r.status === "confirmed" || r.status === "completed") && <div className="mt-1 text-xs text-amber-600">Not on calendar</div>}
                  {!r.email_sent && <div className="mt-1 text-xs text-amber-600">Email not sent</div>}
                </td>
                <td className="px-4 py-3">
                  <AppointmentActions
                    id={r.id}
                    status={r.status}
                    mode={r.mode}
                    meetLink={r.meet_link}
                    hasEvent={!!r.google_event_id}
                    phone={r.phone}
                    name={r.name}
                    when={ist(r.start_at)}
                  />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  No appointments here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
