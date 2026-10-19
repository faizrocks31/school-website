import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { heroSlideSchema } from "@/lib/validators/admin";
import { checkAdmin } from "@/lib/admin-auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = checkAdmin(req);
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });
  const body = await req.json().catch(() => null);

  // `isActive` is toggled on its own from the slide list, so accept it without
  // requiring the whole slide payload.
  if (body && typeof body === "object" && "isActive" in body && Object.keys(body).length === 1) {
    try {
      const row = await prisma.heroSlide.update({
        where: { id: params.id },
        data: { isActive: Boolean((body as { isActive: unknown }).isActive) },
      });
      return NextResponse.json(row);
    } catch {
      return NextResponse.json({ message: "Slide not found." }, { status: 404 });
    }
  }

  const p = heroSlideSchema.safeParse(body);
  if (!p.success) {
    const e: Record<string, string> = {};
    for (const i of p.error.issues) { const k = String(i.path[0] ?? "form"); if (!e[k]) e[k] = i.message; }
    return NextResponse.json({ message: "Validation failed.", errors: e }, { status: 422 });
  }
  const d = p.data;
  try {
    const row = await prisma.heroSlide.update({
      where: { id: params.id },
      data: {
        imageUrl: d.imageUrl,
        title: d.title || "",
        subtitle: d.subtitle || "",
        ctaLabel: d.ctaLabel || "",
        ctaHref: d.ctaHref || "",
      },
    });
    return NextResponse.json(row);
  } catch {
    return NextResponse.json({ message: "Slide not found." }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = checkAdmin(req);
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });
  try {
    await prisma.heroSlide.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Deleted." });
  } catch {
    return NextResponse.json({ message: "Slide not found." }, { status: 404 });
  }
}
