import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { siteSettingsSchema } from "@/lib/validators/admin";
import { checkAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = checkAdmin(req);
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  return NextResponse.json(row ?? {});
}
export async function PUT(req: NextRequest) {
  const auth = checkAdmin(req);
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });
  const body = await req.json().catch(() => null);
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string,string> = {};
    for (const i of parsed.error.issues) { const k = String(i.path[0] ?? "form"); if (!errors[k]) errors[k]=i.message; }
    return NextResponse.json({ message:"Validation failed.", errors }, { status:422 });
  }
  const d = parsed.data;
  const row = await prisma.siteSettings.upsert({
    where: { id:"default" },
    create: { id:"default", schoolName:d.schoolName, tagline:d.tagline, address:d.address, phone:d.phone, email:d.email, hours:d.hours, facebook:d.facebook||"", instagram:d.instagram||"", youtube:d.youtube||"" },
    update: { schoolName:d.schoolName, tagline:d.tagline, address:d.address, phone:d.phone, email:d.email, hours:d.hours, facebook:d.facebook||"", instagram:d.instagram||"", youtube:d.youtube||"" },
  });
  return NextResponse.json(row);
}
