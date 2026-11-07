import { NextResponse } from "next/server";
import { getSlots } from "@/lib/booking";
import { isDateString } from "@/lib/bookingConfig";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") || "";
  if (!isDateString(date)) return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  try {
    return NextResponse.json({ slots: await getSlots(date) });
  } catch (err) {
    console.error("[slots]", err);
    return NextResponse.json({ error: "Could not load availability" }, { status: 500 });
  }
}
