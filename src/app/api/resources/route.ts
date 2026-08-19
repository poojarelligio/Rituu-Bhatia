import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query<Record<string, unknown>[]>(
    `SELECT id, slug, title, excerpt, resource_type, image_url, gated,
      CASE WHEN gated = 0 THEN file_url ELSE NULL END AS download_url
    FROM resources
    WHERE status = 'published'
    ORDER BY id DESC`
  );
  return NextResponse.json(rows);
}
