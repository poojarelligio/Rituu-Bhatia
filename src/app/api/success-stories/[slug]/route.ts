import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const rows = await query<Record<string, unknown>[]>(
    `SELECT id, slug, summary, challenge, approach, outcome, full_story, testimonial_quote,
      video_url, image_url, related_service_id, story_date,
      CASE WHEN client_name_permitted = 1 THEN client_name ELSE NULL END AS client_name
    FROM success_stories
    WHERE slug = ? AND status = 'published' LIMIT 1`,
    [slug]
  );

  if (!rows.length) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json(rows[0]);
}
