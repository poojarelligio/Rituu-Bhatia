import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getStaticServiceBySlug } from "@/lib/staticServices";

interface BookingRow {
  id: number;
  item_type: "service" | "free_intro" | "course";
  item_id: number;
  service_slug: string | null;
  course_title: string | null;
  [key: string]: unknown;
}

export async function GET() {
  const rows = await query<BookingRow[]>(`
    SELECT b.*, c.title AS course_title
    FROM bookings b
    LEFT JOIN courses c ON b.item_type = 'course' AND b.item_id = c.id
    ORDER BY b.created_at DESC
  `);

  const withTitles = rows.map((row) => ({
    ...row,
    item_title:
      row.item_type === "course"
        ? row.course_title
        : row.service_slug
          ? getStaticServiceBySlug(row.service_slug)?.title || row.service_slug
          : null,
  }));

  return NextResponse.json(withTitles);
}