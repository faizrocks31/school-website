import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = String(body?.password ?? body?.token ?? "");
  if (password !== getAdminToken()) {
    return NextResponse.json({ message: "Invalid password." }, { status: 401 });
  }
  const res = NextResponse.json({ message: "Logged in." });
  res.cookies.set(ADMIN_COOKIE, getAdminToken(), {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12, // 12h
  });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ message: "Logged out." });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
