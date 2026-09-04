import { NextRequest, NextResponse } from "next/server";
import { rateLimitOrError } from "@/lib/rateLimit";

const VALID_SIGNS = new Set([
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
]);

interface ApiNinjasHoroscopeResponse {
  date: string;
  sign: string;
  horoscope: string;
}

/**
 * GET /api/horoscope?sign=aries
 *
 * This route exists purely so the API Ninjas key stays server-side — the
 * browser only ever talks to our own /api/horoscope, never to api-ninjas.com
 * directly, so the key can't be read out of client-side network requests.
 *
 * Responses are cached for an hour (`next: { revalidate }` below) since the
 * horoscope text for a given sign doesn't change within a day, and this
 * keeps API Ninjas usage well within a free-tier quota even with real traffic.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimitOrError(request);
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const sign = (searchParams.get("sign") || "").toLowerCase();

  if (!VALID_SIGNS.has(sign)) {
    return NextResponse.json(
      { error: "Invalid or missing zodiac sign." },
      { status: 400 }
    );
  }

  const apiKey = process.env.API_NINJAS_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Horoscope API is not configured. Set API_NINJAS_KEY in .env.local." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/horoscope?zodiac=${sign}`,
      {
        headers: { "X-Api-Key": apiKey },
        next: { revalidate: 3600 }, // cache for 1 hour per sign
      }
    );

    if (!response.ok) {
      const status = response.status === 429 ? 429 : 502;
      return NextResponse.json(
        { error: "Could not fetch horoscope right now. Please try again shortly." },
        { status }
      );
    }

    const data = (await response.json()) as ApiNinjasHoroscopeResponse;
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not fetch horoscope right now. Please try again shortly." },
      { status: 502 }
    );
  }
}