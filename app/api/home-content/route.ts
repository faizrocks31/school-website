import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET(){
  const [content, gallery] = await Promise.all([
    prisma.homeContent.findUnique({ where:{id:"home"}}),
    prisma.homeGalleryImage.findMany({ orderBy:[{sortOrder:"asc"},{createdAt:"asc"}]}),
  ]);
  return NextResponse.json({ content, gallery });
}
