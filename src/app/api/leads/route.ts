import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { rateLimitOrError } from "@/lib/rateLimit";

interface LeadBody {
  name: string;
  email: string;
  phone?: string;
  service_id?: number;
  message?: string;
  source?: string;
  website?: string; // honeypot
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export async function POST(request: NextRequest) {
  const limited = rateLimitOrError(request);
  if (limited) return limited;

  const body = (await request.json()) as LeadBody;

  if (!body.name || !/^\S+@\S+\.\S+$/.test(body.email || "")) {
    return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
  }

  // Honeypot: a hidden 'website' field real users never fill. Silently
  // accept-and-drop rather than telling a bot which check it tripped.
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const) {
    if (body[key]) utm[key] = body[key] as string;
  }

  await query(
    `INSERT INTO leads (name, email, phone, service_id, message, source, utm, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW')`,
    [
      body.name,
      body.email,
      body.phone || null,
      body.service_id || null,
      body.message || "",
      body.source || "contact_form",
      JSON.stringify(utm),
    ]
  );

  return NextResponse.json({ success: true });
}
