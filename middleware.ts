import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  // Allow API login without cookie; protect page routes via cookie
  if (req.nextUrl.pathname.startsWith("/api/")) return NextResponse.next();
  const token = process.env.ADMIN_TOKEN || "admin123";
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookie === token) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = { matcher: ["/admin/:path*"] };
