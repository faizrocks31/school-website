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

  // Read the current name first so we can tell whether this save is a rename.
  const before = await prisma.siteSettings.findUnique({
    where: { id: "default" },
    select: { schoolName: true },
  });

  const row = await prisma.siteSettings.upsert({
    where: { id:"default" },
    create: { id:"default", schoolName:d.schoolName, tagline:d.tagline, logoUrl:d.logoUrl||null, theme:d.theme, address:d.address, mapEmbedUrl:d.mapEmbedUrl||"", phone:d.phone, email:d.email, hours:d.hours, facebook:d.facebook||"", instagram:d.instagram||"", youtube:d.youtube||"" },
    update: { schoolName:d.schoolName, tagline:d.tagline, logoUrl:d.logoUrl||null, theme:d.theme, address:d.address, mapEmbedUrl:d.mapEmbedUrl||"", phone:d.phone, email:d.email, hours:d.hours, facebook:d.facebook||"", instagram:d.instagram||"", youtube:d.youtube||"" },
  });

  // A renamed school must not leave the old name behind in page content. Only
  // the auto-generated "Welcome to <name>" heading is rewritten, and only when
  // it still holds the previous name — a heading the admin wrote by hand is
  // left untouched.
  const oldName = before?.schoolName?.trim();
  if (oldName && oldName !== d.schoolName) {
    const home = await prisma.homeContent.findUnique({
      where: { id: "home" },
      select: { welcomeTitle: true },
    });
    if (home && home.welcomeTitle.includes(oldName)) {
      await prisma.homeContent.update({
        where: { id: "home" },
        data: { welcomeTitle: home.welcomeTitle.replaceAll(oldName, d.schoolName) },
      });
    }
  }

  return NextResponse.json(row);
}
