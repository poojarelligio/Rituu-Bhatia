import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query(`
    SELECT l.*, s.title AS service_title
    FROM leads l
    LEFT JOIN services s ON l.service_id = s.id
    ORDER BY l.created_at DESC
  `);
  return NextResponse.json(rows);
}
