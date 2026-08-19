import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";
import { query } from "@/lib/db";

const FREE_INTRO_MINUTES = 15;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = Number(searchParams.get("service_id"));
  const date = searchParams.get("date") || "";
  const type = searchParams.get("type") || "service";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Date must be in YYYY-MM-DD format." }, { status: 400 });
  }

  const rows = await query<{ id: number }[]>(
    "SELECT id FROM services WHERE id = ? AND status = 'published'",
    [serviceId]
  );
  if (!rows.length) {
    return NextResponse.json({ error: "Unknown service." }, { status: 404 });
  }

  const durationOverride = type === "free_intro" ? FREE_INTRO_MINUTES : undefined;
  const slots = await getAvailableSlots(date, serviceId, durationOverride);

  return NextResponse.json({ date, service_id: serviceId, slots });
}
