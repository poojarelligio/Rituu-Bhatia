import { NextRequest, NextResponse } from "next/server";

/**
 * A basic in-memory fixed-window rate limit, keyed by IP + route. This is
 * enough to blunt casual scripted abuse on a single-server deployment; it
 * is NOT distributed, so it resets if the process restarts and doesn't
 * share state across multiple server instances behind a load balancer. For
 * a multi-instance production deployment, replace the Map below with a
 * shared store (Redis, or your database) — every call site here goes
 * through this one function, so that swap only needs to happen here.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimitOrError(request: NextRequest): NextResponse | null {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();

  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  if (entry.count >= MAX_REQUESTS) {
    return NextResponse.json({ error: "Too many requests, please try again shortly." }, { status: 429 });
  }

  entry.count += 1;
  return null;
}
