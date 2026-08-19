import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query(`
    SELECT b.*,
      COALESCE(s.title, c.title) AS item_title
    FROM bookings b
    LEFT JOIN services s ON b.item_type IN ('service','free_intro') AND b.item_id = s.id
    LEFT JOIN courses c ON b.item_type = 'course' AND b.item_id = c.id
    ORDER BY b.created_at DESC
  `);
  return NextResponse.json(rows);
}
