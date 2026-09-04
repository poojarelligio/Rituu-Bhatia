import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "@/lib/db";
import { hashToken } from "@/lib/studentPassword";
import {
  setStudentSessionCookie,
  signStudentSession,
} from "@/lib/studentAuth";

interface SetupTokenRow extends RowDataPacket {
  id: number;
  student_id: number;
  email: string;
  name: string;
}

export async function POST(request: NextRequest) {
  let connection;

  try {
    const body = (await request.json()) as {
      token?: string;
      password?: string;
    };

    const token = body.token?.trim();
    const password = body.password;

    if (!token || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Use a password with at least 8 characters." },
        { status: 400 }
      );
    }

    const tokenHash = hashToken(token);
    const passwordHash = await bcrypt.hash(password, 12);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query<SetupTokenRow[]>(
      `SELECT t.id, t.student_id, s.email, s.name
       FROM student_password_setup_tokens t
       JOIN students s ON s.id = t.student_id
       WHERE t.token_hash = ?
         AND t.used_at IS NULL
         AND t.expires_at > NOW()
       LIMIT 1
       FOR UPDATE`,
      [tokenHash]
    );

    const setupToken = rows[0];

    if (!setupToken) {
      await connection.rollback();
      return NextResponse.json(
        { error: "This password setup link is invalid or has expired." },
        { status: 400 }
      );
    }

    await connection.query<ResultSetHeader>(
      "UPDATE students SET password_hash = ?, password_set_at = NOW() WHERE id = ?",
      [passwordHash, setupToken.student_id]
    );

    await connection.query<ResultSetHeader>(
      "UPDATE student_password_setup_tokens SET used_at = NOW() WHERE id = ?",
      [setupToken.id]
    );

    await connection.commit();

    const sessionToken = await signStudentSession({
      studentId: setupToken.student_id,
      email: setupToken.email,
      name: setupToken.name,
    });

    await setStudentSessionCookie(sessionToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Student password setup failed:", error);

    if (connection) {
      await connection.rollback().catch(() => undefined);
    }

    return NextResponse.json(
      { error: "Could not set your password. Please try again." },
      { status: 500 }
    );
  } finally {
    connection?.release();
  }
}