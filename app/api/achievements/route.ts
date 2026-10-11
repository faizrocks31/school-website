export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET(){
  try {
    const rows = await prisma.achievementItem.findMany({ orderBy:{createdAt:"desc"}});
    return NextResponse.json(rows);
  } catch { return NextResponse.json([]); }
}
