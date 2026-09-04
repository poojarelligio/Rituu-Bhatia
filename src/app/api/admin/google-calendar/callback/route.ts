import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeAndStoreTokens } from "@/lib/googleCalendar";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const settingsUrl = new URL("/admin/settings", request.url);

  if (error) {
    settingsUrl.searchParams.set("calendar_error", error);
    return NextResponse.redirect(settingsUrl);
  }
  if (!code) {
    settingsUrl.searchParams.set("calendar_error", "missing_code");
    return NextResponse.redirect(settingsUrl);
  }

  try {
    await exchangeCodeAndStoreTokens(code);
    settingsUrl.searchParams.set("calendar_connected", "1");
  } catch (err) {
    console.error(err);
    settingsUrl.searchParams.set("calendar_error", "exchange_failed");
  }

  return NextResponse.redirect(settingsUrl);
}