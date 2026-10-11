import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET(){
  const row = await prisma.siteSettings.findUnique({ where:{id:"default"}});
  return NextResponse.json(row ?? {});
}
