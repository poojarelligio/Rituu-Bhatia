import { cookies } from "next/headers";
import { jwtVerify } from "jose";

/**
 * Accepts the request only if one of its cookies is a JWT signed with SESSION_SECRET (your admin session).
 * Student sessions use STUDENT_SESSION_SECRET, so they cannot pass.
 * If your project already has an admin check (e.g. getAdminSession), call that here instead.
 */
export async function isAdmin(): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  const key = new TextEncoder().encode(secret);
  const jar = await cookies();
  for (const c of jar.getAll()) {
    try {
      await jwtVerify(c.value, key);
      return true;
    } catch {
      /* not the admin cookie */
    }
  }
  return false;
}
