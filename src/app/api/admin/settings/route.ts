import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const WRITABLE = [
  "whatsapp_community_link", "whatsapp_number", "telegram_link",
  "phone", "email", "address", "google_maps_embed_url", "newsletter_embed_html",
];

export async function GET() {
  const rows = await query<Record<string, unknown>[]>("SELECT * FROM site_settings WHERE id = 1");
  return NextResponse.json(rows[0] || {});
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const data: Record<string, unknown> = {};
  for (const field of WRITABLE) {
    if (field in body) data[field] = body[field];
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields provided." }, { status: 400 });
  }

  const setClause = Object.keys(data).map((c) => `\`${c}\` = ?`).join(", ");
  await query(`UPDATE site_settings SET ${setClause} WHERE id = 1`, Object.values(data));

  return NextResponse.json({ success: true });
}
