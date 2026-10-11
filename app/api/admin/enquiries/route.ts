import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdmin } from "@/lib/admin-auth";
export async function GET(req: NextRequest){
  const auth=checkAdmin(req); if(!auth.ok) return NextResponse.json({message:auth.message},{status:auth.status});
  const rows = await prisma.admissionEnquiry.findMany({ orderBy:{createdAt:"desc"}, take: 200 });
  return NextResponse.json(rows);
}
