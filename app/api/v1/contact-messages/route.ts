export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { contactMessageSchema } from "@/lib/validators/contact";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { MOBILE_REGEX, toNationalNumber } from "@/lib/phone";
import { MESSAGE_LIMITS } from "@/lib/site-config";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`contact:${ip}`);
  if (!rl.ok) {
    return NextResponse.json({ message: "Too many requests. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactMessageSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string,string> = {};
    for (const iss of parsed.error.issues) {
      const key = String(iss.path[0] ?? "form");
      if (!errors[key]) errors[key] = iss.message;
    }
    return NextResponse.json({ message: "Validation failed.", errors }, { status: 422 });
  }

  const d = parsed.data;
  // Defense in depth: re-validate the mobile number server-side, never trusting
  // the client or the transport, before anything reaches the database.
  const mobile = toNationalNumber(d.contactNumber);
  if (!MOBILE_REGEX.test(mobile)) {
    return NextResponse.json(
      { message: "Validation failed.", errors: { contactNumber: "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9." } },
      { status: 422 }
    );
  }
  try {
    // Enforce the per-number limit inside a single atomic INSERT ... SELECT, so the
    // count and the insert are one round trip. This avoids holding a pooled
    // connection across an interactive transaction (which times out under load on
    // the pooled Neon endpoint). Two truly simultaneous submissions from the same
    // number could in theory both pass the count — the worst case is one extra
    // message, which is far better than an error for the family filling the form.
    const id = randomUUID();
    const inserted = await prisma.$queryRaw<{ id: string }[]>`
      INSERT INTO "ContactMessage" (id, name, "contactNumber", message, status, "createdAt", "updatedAt")
      SELECT ${id}, ${d.name.trim()}, ${mobile}, ${d.message.trim()}, 'NEW', LOCALTIMESTAMP, LOCALTIMESTAMP
      WHERE (SELECT count(*) FROM "ContactMessage" WHERE "contactNumber" = ${mobile}) < ${MESSAGE_LIMITS.maxPerPhone}
      RETURNING id
    `;

    if (inserted.length === 0) {
      return NextResponse.json(
        { message: `You have already sent the maximum of ${MESSAGE_LIMITS.maxPerPhone} messages from this mobile number. Please contact the school directly for anything further.` },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: "Message sent successfully.", id }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("does not exist") || msg.includes("P2021") || msg.includes("P1001")) {
      console.error("contact-message DB not ready:", msg.slice(0,500));
      return NextResponse.json({ message: "Service is being set up — please try again in a minute." }, { status: 503 });
    }
    console.error("contact-message create failed:", msg.slice(0,500));
    return NextResponse.json({ message: "We could not send your message. Please try again." }, { status: 500 });
  }
}
