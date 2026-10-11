import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_token";

// Token from env — change in .env for production. Falls back for dev so setup doesn't block you.
export function getAdminToken(): string {
  return process.env.ADMIN_TOKEN || "admin123";
}

export function checkAdmin(req: NextRequest): { ok: true } | { ok: false; status: number; message: string } {
  const token = getAdminToken();
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  const header = req.headers.get("x-admin-token") || req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (cookie === token || header === token) return { ok: true };
  return { ok: false, status: 401, message: "Unauthorized. Please log in to the admin panel." };
}

export function isAdminCookiePresent(req: NextRequest): boolean {
  return req.cookies.get(ADMIN_COOKIE)?.value === getAdminToken();
}
