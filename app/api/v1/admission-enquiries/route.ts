export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { admissionEnquirySchema } from "@/lib/validators/admission";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { ENQUIRY_LIMITS } from "@/lib/site-config";

function genEnquiryNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `ENQ-${ymd}-${rnd}`;
}

function normalizePhone(v: string): string { return v.replace(/\D/g, ""); }

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`enquiry:${ip}`);
  if (!rl.ok) {
    return NextResponse.json({ message: "Too many requests. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = admissionEnquirySchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string,string> = {};
    for (const iss of parsed.error.issues) {
      const key = String(iss.path[0] ?? "form");
      if (!errors[key]) errors[key] = iss.message;
    }
    return NextResponse.json({ message: "Validation failed.", errors }, { status: 422 });
  }

  const { studentName, fatherName, studentAge, contactNumber, address, admissionClass, parentEmail } = parsed.data;
  const normalizedPhone = normalizePhone(contactNumber.trim());
  const normalizedEmail = parentEmail?.trim().toLowerCase() || null;
  const normalizedStudentName = studentName.trim().toLowerCase();

  // All DB work wrapped — so P2021 "table does not exist" (before migration) doesn't crash as 500.
  try {
    // 1) Exact duplicate guard: same studentName (case-insensitive) + same phone OR same email
    const duplicate = await prisma.admissionEnquiry.findFirst({
      where: {
        studentName: { equals: studentName.trim() },
        OR: [
          { contactNumber: normalizedPhone },
          ...(normalizedEmail ? [{ parentEmail: normalizedEmail } as const] : []),
        ],
      },
    });
    let isDuplicate = !!duplicate;
    if (!isDuplicate) {
      const rows = await prisma.$queryRaw<{ id: string }[]>`SELECT id FROM "AdmissionEnquiry" WHERE lower("studentName") = ${normalizedStudentName} AND ("contactNumber" = ${normalizedPhone} OR ("parentEmail" IS NOT NULL AND lower("parentEmail") = ${normalizedEmail})) LIMIT 1`;
      isDuplicate = rows.length > 0;
    }
    if (isDuplicate) {
      return NextResponse.json(
        { message: "An enquiry for this student with the same contact number or email already exists. Please contact the school if you need to update your enquiry." },
        { status: 409 }
      );
    }

    // 2) Per-contact configurable limit
    const phoneCount = await prisma.admissionEnquiry.count({ where: { contactNumber: normalizedPhone } });
    if (phoneCount >= ENQUIRY_LIMITS.maxPerPhone) {
      return NextResponse.json(
        { message: `You have reached the maximum limit of ${ENQUIRY_LIMITS.maxPerPhone} enquiries for this contact number. Please contact the school for further assistance.` },
        { status: 409 }
      );
    }
    if (normalizedEmail) {
      const emailCount = await prisma.admissionEnquiry.count({ where: { parentEmail: normalizedEmail } });
      if (emailCount >= ENQUIRY_LIMITS.maxPerEmail) {
        return NextResponse.json(
          { message: `You have reached the maximum limit of ${ENQUIRY_LIMITS.maxPerEmail} enquiries for this email address. Please contact the school for further assistance.` },
          { status: 409 }
        );
      }
    }

    // 3) Create with unique enquiry number retry
    for (let i=0;i<5;i++) {
      const enquiryNumber = genEnquiryNumber();
      try {
        const row = await prisma.admissionEnquiry.create({
          data: {
            enquiryNumber,
            studentName: studentName.trim(),
            fatherName: fatherName.trim(),
            studentAge,
            contactNumber: normalizedPhone,
            address: address.trim(),
            admissionClass,
            parentEmail: normalizedEmail,
            status: "NEW",
          },
        });
        return NextResponse.json({ message: "Enquiry submitted successfully.", enquiryNumber: row.enquiryNumber, id: row.id }, { status: 201 });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "";
        if (msg.includes("Unique constraint") || msg.includes("UNIQUE")) continue;
        console.error("admission-enquiry create failed:", msg.slice(0,500));
        return NextResponse.json({ message: "We could not submit your enquiry. Please try again." }, { status: 500 });
      }
    }
    return NextResponse.json({ message: "We could not submit your enquiry. Please try again." }, { status: 500 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    // P2021 = table does not exist — DB not migrated yet (common on first Vercel deploy)
    if (msg.includes("does not exist") || msg.includes("P2021") || msg.includes("P1001") || msg.includes("Can't reach database")) {
      console.error("admission-enquiry DB not ready:", msg.slice(0,500));
      return NextResponse.json({ message: "Service is being set up — please try again in a minute. If this persists, the database needs to be migrated (run: npx prisma db push)." }, { status: 503 });
    }
    console.error("admission-enquiry unexpected:", msg.slice(0,500));
    return NextResponse.json({ message: "We could not submit your enquiry. Please try again." }, { status: 500 });
  }
}
