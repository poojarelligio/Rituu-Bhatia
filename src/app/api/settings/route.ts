import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query<Record<string, unknown>[]>("SELECT * FROM site_settings WHERE id = 1");
  const settings = rows[0] || {};
  // id column isn't useful to the frontend.
  delete (settings as Record<string, unknown>).id;
  return NextResponse.json(settings);
}
