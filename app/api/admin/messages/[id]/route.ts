import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdmin } from "@/lib/admin-auth";
const ALLOWED = new Set(["NEW","READ","REPLIED","CLOSED"]);
export async function PATCH(req: NextRequest, {params}:{params:{id:string}}){
  const auth=checkAdmin(req); if(!auth.ok) return NextResponse.json({message:auth.message},{status:auth.status});
  const body=await req.json().catch(()=>null);
  const status = String(body?.status ?? "").trim().toUpperCase();
  if(!ALLOWED.has(status)) return NextResponse.json({message:"Invalid status."},{status:422});
  const row=await prisma.contactMessage.update({ where:{id:params.id}, data:{ status }});
  return NextResponse.json(row);
}
export async function DELETE(req: NextRequest, {params}:{params:{id:string}}){
  const auth=checkAdmin(req); if(!auth.ok) return NextResponse.json({message:auth.message},{status:auth.status});
  await prisma.contactMessage.delete({ where:{id:params.id}});
  return NextResponse.json({message:"Deleted."});
}
