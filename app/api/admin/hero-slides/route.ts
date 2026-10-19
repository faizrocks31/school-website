import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { heroSlideSchema } from "@/lib/validators/admin";
import { checkAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = checkAdmin(req);
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });
  const rows = await prisma.heroSlide.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const auth = checkAdmin(req);
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });
  const body = await req.json().catch(() => null);
  const p = heroSlideSchema.safeParse(body);
  if (!p.success) {
    const e: Record<string, string> = {};
    for (const i of p.error.issues) { const k = String(i.path[0] ?? "form"); if (!e[k]) e[k] = i.message; }
    return NextResponse.json({ message: "Validation failed.", errors: e }, { status: 422 });
  }
  const d = p.data;
  // Append to the end of the current order so a new slide never jumps to the front.
  const last = await prisma.heroSlide.findFirst({ orderBy: { sortOrder: "desc" }, select: { sortOrder: true } });
  const row = await prisma.heroSlide.create({
    data: {
      imageUrl: d.imageUrl,
      title: d.title || "",
      subtitle: d.subtitle || "",
      ctaLabel: d.ctaLabel || "",
      ctaHref: d.ctaHref || "",
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
  return NextResponse.json(row, { status: 201 });
}

/**
 * Reorder. Takes { order: string[] } of slide ids in their new sequence.
 * Ignores ids that no longer exist so a stale admin tab cannot error out.
 */
export async function PATCH(req: NextRequest) {
  const auth = checkAdmin(req);
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });
  const body = await req.json().catch(() => null);
  const order = Array.isArray(body?.order) ? (body.order as unknown[]).map(String) : null;
  if (!order) return NextResponse.json({ message: "Expected { order: string[] }." }, { status: 422 });

  const existing = await prisma.heroSlide.findMany({ select: { id: true } });
  const known = new Set(existing.map((r) => r.id));
  const ids = order.filter((id) => known.has(id));

  await prisma.$transaction(ids.map((id, i) => prisma.heroSlide.update({ where: { id }, data: { sortOrder: i } })));
  const rows = await prisma.heroSlide.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json(rows);
}
