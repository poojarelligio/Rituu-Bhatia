import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * client_name is only ever included when client_name_permitted = 1 — this
 * mirrors the earlier WordPress plugin's permission-aware REST field, done
 * here with a SQL CASE so a client's name is never sent to the browser
 * unless they explicitly agreed to it, regardless of what the frontend does with it.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get("service_id");

  let sql = `
    SELECT id, slug, summary, challenge, approach, outcome, testimonial_quote,
      video_url, image_url, related_service_id, story_date,
      CASE WHEN client_name_permitted = 1 THEN client_name ELSE NULL END AS client_name
    FROM success_stories
    WHERE status = 'published'
  `;
  const params: unknown[] = [];

  if (serviceId) {
    sql += " AND related_service_id = ?";
    params.push(serviceId);
  }

  sql += " ORDER BY story_date DESC, id DESC";

  const rows = await query(sql, params);
  return NextResponse.json(rows);
}
