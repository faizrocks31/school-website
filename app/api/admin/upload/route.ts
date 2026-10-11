import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg","image/png","image/webp","image/gif"]);

export async function POST(req: NextRequest) {
  const auth = checkAdmin(req);
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ message: "Invalid form data." }, { status: 400 });
  const file = form.get("file") as File | null;
  if (!file || !(file instanceof File)) return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ message: "Only JPG, PNG, WebP, GIF allowed." }, { status: 422 });
  if (file.size > MAX_BYTES) return NextResponse.json({ message: "File too large — max 5 MB." }, { status: 422 });

  const ext = { "image/jpeg":".jpg","image/png":".png","image/webp":".webp","image/gif":".gif" }[file.type] || ".jpg";
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buf);
  return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
}
