export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET(){
  try {
    const row = await prisma.siteSettings.findUnique({ where:{id:"default"}});
    return NextResponse.json(row ?? {});
  } catch { return NextResponse.json({}); }
}
