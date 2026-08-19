import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "rituu_admin_session";

/**
 * Runs before every request to /admin/* and /api/admin/*. Middleware runs
 * on the Edge runtime, which can't use the mysql2 driver or Node's crypto
 * module the way lib/auth.ts does for full session reads — so this does a
 * lightweight signature check with jose (Edge-compatible) just to gate
 * access; route handlers still call getAdminSession() themselves for the
 * actual session data.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update these two lines in middleware.ts:
const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";
  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return denyAccess(request, isAdminApi);
  }

  try {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey) {
    throw new Error("SESSION_SECRET is missing from environment variables.");
  }
  const secret = new TextEncoder().encode(secretKey);
  await jwtVerify(token, secret);
  return NextResponse.next();
} catch (err) {
  console.error("JWT Verification failed in middleware:", err);
  return denyAccess(request, isAdminApi);
}
}

function denyAccess(request: NextRequest, isApi: boolean) {
  if (isApi) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);   // <-- CHANGE THIS
  loginUrl.searchParams.set("next", request.nextUrl.pathname);

  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(COOKIE_NAME);
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};


