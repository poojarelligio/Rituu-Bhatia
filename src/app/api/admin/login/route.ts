import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { signSession, setSessionCookie } from "@/lib/auth";

interface AdminRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const rows = await query<AdminRow[]>("SELECT * FROM admin_users WHERE email = ? LIMIT 1", [email]);
  const admin = rows[0];
  // Compare against a fixed dummy hash when no user is found, so the
  // response time doesn't leak whether the email exists (a basic
  // timing-attack mitigation for the login endpoint).
  const hashToCompare = admin?.password_hash || "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva";
  const valid = await bcrypt.compare(password, hashToCompare);

  if (!admin || !valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await signSession({ adminId: admin.id, email: admin.email, name: admin.name });
  await setSessionCookie(token);

  return NextResponse.json({ name: admin.name, email: admin.email });
}
