import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  setStudentSessionCookie,
  signStudentSession,
} from "@/lib/studentAuth";

interface StudentRow {
  id: number;
  name: string;
  email: string;
  password_hash: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const rows = await query<StudentRow[]>(
      `SELECT id, name, email, password_hash
       FROM students
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    const student = rows[0];

    if (!student?.password_hash) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      student.password_hash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    const sessionToken = await signStudentSession({
      studentId: student.id,
      email: student.email,
      name: student.name,
    });

    await setStudentSessionCookie(sessionToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Student login failed:", error);

    return NextResponse.json(
      { error: "Could not sign in. Please try again." },
      { status: 500 }
    );
  }
}