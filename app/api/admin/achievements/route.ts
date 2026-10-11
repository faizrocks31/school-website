import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { achievementSchema } from "@/lib/validators/admin";
import { checkAdmin } from "@/lib/admin-auth";
export async function GET(req: NextRequest){
  const auth=checkAdmin(req); if(!auth.ok) return NextResponse.json({message:auth.message},{status:auth.status});
  const rows = await prisma.achievementItem.findMany({ orderBy:{createdAt:"desc"} });
  return NextResponse.json(rows);
}
export async function POST(req: NextRequest){
  const auth=checkAdmin(req); if(!auth.ok) return NextResponse.json({message:auth.message},{status:auth.status});
  const body = await req.json().catch(()=>null);
  const p = achievementSchema.safeParse(body);
  if(!p.success){ const e:Record<string,string>={}; for(const i of p.error.issues){const k=String(i.path[0]??"form"); if(!e[k]) e[k]=i.message;} return NextResponse.json({message:"Validation failed.",errors:e},{status:422});}
  const d=p.data;
  const row = await prisma.achievementItem.create({ data:{ title:d.title, description:d.description, category:d.category, dateLabel:d.dateLabel||"", imageUrl:d.imageUrl||null }});
  return NextResponse.json(row,{status:201});
}
