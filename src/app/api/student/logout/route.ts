import { NextResponse } from "next/server";
import { clearStudentSessionCookie } from "@/lib/studentAuth";

export async function POST() {
  await clearStudentSessionCookie();
  return NextResponse.json({ success: true });
}