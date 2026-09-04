import { NextResponse } from "next/server";
import { buildGoogleAuthUrl } from "@/lib/googleCalendar";

export async function GET() {
  try {
    const url = buildGoogleAuthUrl();
    return NextResponse.redirect(url);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}