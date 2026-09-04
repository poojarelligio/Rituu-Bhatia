import { NextResponse } from "next/server";
import { getGoogleCalendarStatus } from "@/lib/googleCalendar";

export async function GET() {
  const status = await getGoogleCalendarStatus();
  return NextResponse.json(status);
}