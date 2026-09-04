import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "rituu_student_session";
const SESSION_DURATION = "7d";

function getSecretKey() {
  const secret = process.env.STUDENT_SESSION_SECRET;
  if (!secret) {
    throw new Error("STUDENT_SESSION_SECRET is not set in .env.local.");
  }
  return new TextEncoder().encode(secret);
}

export type StudentSession = {
  studentId: number;
  email: string;
  name: string;
};

export async function signStudentSession(session: StudentSession) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifyStudentSessionToken(
  token: string
): Promise<StudentSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as StudentSession;
  } catch {
    return null;
  }
}

export async function getStudentSession(): Promise<StudentSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token ? verifyStudentSessionToken(token) : null;
}

export async function setStudentSessionCookie(token: string) {
  const store = await cookies();

  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearStudentSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}