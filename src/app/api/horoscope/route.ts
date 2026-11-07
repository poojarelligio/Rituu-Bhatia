import { NextRequest, NextResponse } from "next/server";
import { rateLimitOrError } from "@/lib/rateLimit";

const VALID_SIGNS = new Set([
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
]);

/**
 * Shape of FreeAstroAPI's /api/v2/horoscope/daily/sign response — confirmed
 * against their live docs (freeastroapi.com/docs/western/daily-sign), not
 * guessed. Only the fields we actually use are typed below; the real
 * response has more (scores.love/career/money/health, astro.highlights,
 * content.do/dont, etc.) — worth revisiting if you want a richer display later.
 */
interface FreeAstroApiResponse {
  data: {
    sign: string;
    date: string; // YYYY-MM-DD
    scores: { overall: number };
    lucky: {
      color: { key: string; label: string };
      number: number;
      time_window: string;
    };
    content: {
      text: string;
    };
  };
}

interface HoroscopeOut {
  date: string;
  sign: string;
  horoscope: string;
}

/**
 * GET /api/horoscope?sign=aries
 *
 * Proxies FreeAstroAPI's daily-sign endpoint server-side so the API key
 * never reaches the browser. Cached for 24 hours per sign — the free tier
 * is capped at 80 requests/day, and this content only changes once a day
 * regardless, so a short cache would waste quota for no benefit.
 */
export async function GET(request: NextRequest) {
  const limited = rateLimitOrError(request);
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const sign = (searchParams.get("sign") || "").toLowerCase();

  if (!VALID_SIGNS.has(sign)) {
    return NextResponse.json({ error: "Invalid or missing zodiac sign." }, { status: 400 });
  }

  const apiKey = process.env.FREE_ASTRO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Horoscope API is not configured. Set FREE_ASTRO_API_KEY in .env.local." },
      { status: 500 }
    );
  }

  try {
    const url = new URL("https://api.freeastroapi.com/api/v2/horoscope/daily/sign");
    url.searchParams.set("sign", sign);
    url.searchParams.set("date", "today");

    const response = await fetch(url.toString(), {
      headers: { "x-api-key": apiKey },
      next: { revalidate: 86400 }, // 24 hours — see rate-limit note above
    });

    if (!response.ok) {
      const status = response.status === 429 ? 429 : 502;
      return NextResponse.json(
        { error: "Could not fetch horoscope right now. Please try again shortly." },
        { status }
      );
    }

    const raw = (await response.json()) as FreeAstroApiResponse;

    const out: HoroscopeOut = {
      date: raw.data.date,
      sign: raw.data.sign,
      horoscope: raw.data.content.text,
    };

    return NextResponse.json(out);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not fetch horoscope right now. Please try again shortly." },
      { status: 502 }
    );
  }
}