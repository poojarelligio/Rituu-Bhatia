import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const VALID_STATUSES = ["NEW", "CONTACTED", "INTERESTED", "BOOKED", "COMPLETED", "LOST"];

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await request.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await query("UPDATE leads SET status = ? WHERE id = ?", [status, id]);
  return NextResponse.json({ success: true });
}
