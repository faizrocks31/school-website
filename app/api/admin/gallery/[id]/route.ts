import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdmin } from "@/lib/admin-auth";
export async function DELETE(req: NextRequest, { params }:{ params:{id:string}}){
  const auth=checkAdmin(req); if(!auth.ok) return NextResponse.json({message:auth.message},{status:auth.status});
  await prisma.homeGalleryImage.delete({ where:{id:params.id}});
  return NextResponse.json({ message:"Deleted."});
}
export async function PUT(req: NextRequest, { params }:{ params:{id:string}}){
  const auth=checkAdmin(req); if(!auth.ok) return NextResponse.json({message:auth.message},{status:auth.status});
  const body = await req.json().catch(()=>null);
  const url = String(body?.url ?? "").trim();
  const alt = String(body?.alt ?? "").trim();
  if(!url) return NextResponse.json({message:"Image URL is required."},{status:422});
  const row = await prisma.homeGalleryImage.update({ where:{id:params.id}, data:{ url, alt }});
  return NextResponse.json(row);
}
