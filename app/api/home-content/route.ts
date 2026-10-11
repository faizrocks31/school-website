export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET(){
  try {
    const [content, gallery] = await Promise.all([
      prisma.homeContent.findUnique({ where:{id:"home"}}),
      prisma.homeGalleryImage.findMany({ orderBy:[{sortOrder:"asc"},{createdAt:"asc"}]}),
    ]);
    return NextResponse.json({ content, gallery });
  } catch { return NextResponse.json({ content: null, gallery: [] }); }
}
