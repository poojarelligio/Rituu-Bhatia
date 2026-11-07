import { NextResponse } from "next/server";
import { z } from "zod";
import { createBooking, SlotTakenError } from "@/lib/booking";
import { SERVICE_IDS } from "@/lib/bookingConfig";

export const dynamic = "force-dynamic";

const schema = z.object({
  service: z.string().refine((v) => SERVICE_IDS.includes(v), "Choose a service"),
  mode: z.enum(["online", "studio"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(190),
  phone: z.string().trim().min(7).max(30),
  message: z.string().trim().max(1000).optional(),
  website: z.string().optional(), // honeypot
});

// Tiny in-memory rate limit (per server instance). Use Redis/Upstash if you scale out.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });

  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // bot: pretend success

  try {
    const result = await createBooking(data);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof SlotTakenError)
      return NextResponse.json({ error: "Sorry, that time was just taken. Please pick another." }, { status: 409 });
    console.error("[appointments]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
