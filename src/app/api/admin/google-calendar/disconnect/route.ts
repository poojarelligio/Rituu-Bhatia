import { NextResponse } from "next/server";
import { disconnectGoogleCalendar } from "@/lib/googleCalendar";

export async function POST() {
  await disconnectGoogleCalendar();
  return NextResponse.json({ success: true });
}