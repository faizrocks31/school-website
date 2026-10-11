import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { aboutContentSchema } from "@/lib/validators/admin";
import { checkAdmin } from "@/lib/admin-auth";
export async function GET(req: NextRequest) {
  const auth = checkAdmin(req); if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });
  const row = await prisma.aboutContent.findUnique({ where:{id:"about"} });
  return NextResponse.json(row ?? {});
}
export async function PUT(req: NextRequest) {
  const auth = checkAdmin(req); if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });
  const body = await req.json().catch(()=>null);
  const parsed = aboutContentSchema.safeParse(body);
  if (!parsed.success){ const e:Record<string,string>={}; for(const i of parsed.error.issues){const k=String(i.path[0]??"form"); if(!e[k]) e[k]=i.message;} return NextResponse.json({message:"Validation failed.",errors:e},{status:422});}
  const d = parsed.data;
  const row = await prisma.aboutContent.upsert({
    where:{id:"about"},
    create:{ id:"about", introTitle:d.introTitle, introText:d.introText, historyText:d.historyText, mission:d.mission, vision:d.vision, principalName:d.principalName||"", principalTitle:d.principalTitle||"Principal", principalMessage:d.principalMessage||"", principalImageUrl:d.principalImageUrl||null, valuesJson: d.valuesJson || undefined },
    update:{ introTitle:d.introTitle, introText:d.introText, historyText:d.historyText, mission:d.mission, vision:d.vision, principalName:d.principalName||"", principalTitle:d.principalTitle||"Principal", principalMessage:d.principalMessage||"", principalImageUrl:d.principalImageUrl||null, ...(d.valuesJson?{valuesJson:d.valuesJson}:{}) },
  });
  return NextResponse.json(row);
}
