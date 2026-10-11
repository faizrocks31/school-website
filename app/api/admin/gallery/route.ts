import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { galleryImageSchema } from "@/lib/validators/admin";
import { checkAdmin } from "@/lib/admin-auth";
export async function GET(req: NextRequest){
  const auth=checkAdmin(req); if(!auth.ok) return NextResponse.json({message:auth.message},{status:auth.status});
  const rows = await prisma.homeGalleryImage.findMany({ orderBy:[{sortOrder:"asc"},{createdAt:"asc"}]});
  return NextResponse.json(rows);
}
export async function POST(req: NextRequest){
  const auth=checkAdmin(req); if(!auth.ok) return NextResponse.json({message:auth.message},{status:auth.status});
  const body = await req.json().catch(()=>null);
  const p = galleryImageSchema.safeParse(body);
  if(!p.success){ const e:Record<string,string>={}; for(const i of p.error.issues){const k=String(i.path[0]??"form"); if(!e[k]) e[k]=i.message;} return NextResponse.json({message:"Validation failed.",errors:e},{status:422});}
  const count = await prisma.homeGalleryImage.count();
  const row = await prisma.homeGalleryImage.create({ data:{ url:p.data.url, alt:p.data.alt||"", sortOrder: count }});
  return NextResponse.json(row,{status:201});
}
