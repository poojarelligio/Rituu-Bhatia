import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { rateLimitOrError } from "@/lib/rateLimit";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = rateLimitOrError(request);
  if (limited) return limited;

  const { id } = await params;
  const { name, email } = await request.json();

  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
  }

  const rows = await query<Record<string, unknown>[]>(
    "SELECT id, title, file_url FROM resources WHERE id = ? AND status = 'published' LIMIT 1",
    [id]
  );
  const resource = rows[0];
  if (!resource) {
    return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  }
  if (!resource.file_url) {
    return NextResponse.json({ error: "This resource has no file attached yet." }, { status: 500 });
  }

  await query(
    "INSERT INTO leads (name, email, message, source) VALUES (?, ?, ?, 'resource_download')",
    [name, email, `Downloaded resource: ${resource.title}`]
  );

  return NextResponse.json({ download_url: resource.file_url });
}
