import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";
import { getStaticServiceBySlug, getStaticServiceDurationMinutes } from "@/lib/staticServices";

const FREE_INTRO_MINUTES = 15;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("service") || "";
  const date = searchParams.get("date") || "";
  const type = searchParams.get("type") || "service";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Date must be in YYYY-MM-DD format." }, { status: 400 });
  }

  const service = getStaticServiceBySlug(slug);
  if (!service) {
    return NextResponse.json({ error: "Unknown service." }, { status: 404 });
  }

  const duration = type === "free_intro" ? FREE_INTRO_MINUTES : getStaticServiceDurationMinutes(slug);
  const slots = await getAvailableSlots(date, duration);

  return NextResponse.json({ date, service: slug, slots });
}