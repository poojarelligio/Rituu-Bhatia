import crypto from "crypto";
import { query } from "@/lib/db";

const TOKEN_LIFETIME_HOURS = 24;

export async function createPasswordSetupToken(studentId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  // Only one active setup link per student.
  await query(
    "DELETE FROM student_password_setup_tokens WHERE student_id = ? AND used_at IS NULL",
    [studentId]
  );

  await query(
    `INSERT INTO student_password_setup_tokens
      (student_id, token_hash, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ${TOKEN_LIFETIME_HOURS} HOUR))`,
    [studentId, tokenHash]
  );

  return token;
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}