import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminGuard";
import { adminCancel, adminResend, adminSetStatus, adminSync } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { id?: number; action?: string; value?: string } | null;
  const id = Number(body?.id);
  if (!id || !body?.action) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  try {
    if (body.action === "sync") return NextResponse.json({ ok: true, ...(await adminSync(id)) });
    if (body.action === "email") return NextResponse.json({ ok: true, ...(await adminResend(id)) });
    if (body.action === "status") return NextResponse.json({ ok: true, ...(await adminSetStatus(id, String(body.value))) });
    if (body.action === "cancel") return NextResponse.json({ ok: true, ...(await adminCancel(id)) });
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[admin/appointments]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
