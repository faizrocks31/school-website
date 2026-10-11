import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET(){
  const row = await prisma.aboutContent.findUnique({ where:{id:"about"}});
  return NextResponse.json(row ?? {});
}
