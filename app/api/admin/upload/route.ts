import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg","image/png","image/webp","image/gif"]);
const EXT: Record<string,string> = { "image/jpeg":".jpg","image/png":".png","image/webp":".webp","image/gif":".gif" };

export async function POST(req: NextRequest) {
  const auth = checkAdmin(req);
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ message: "Invalid form data." }, { status: 400 });
  const file = form.get("file") as File | null;
  if (!file || !(file instanceof File)) return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ message: "Only JPG, PNG, WebP, GIF allowed." }, { status: 422 });
  if (file.size > MAX_BYTES) return NextResponse.json({ message: "File too large — max 5 MB." }, { status: 422 });

  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${EXT[file.type] || ".jpg"}`;

  // Vercel Blob when configured (production has a read-only filesystem, so this is required there).
  // Falls back to public/uploads for local dev so no token is needed to work on the site.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${name}`, file, { access: "public", contentType: file.type, addRandomSuffix: false });
      return NextResponse.json({ url: blob.url }, { status: 201 });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("blob upload failed:", msg.slice(0, 300));
      return NextResponse.json({ message: "Image upload failed. Please try again." }, { status: 502 });
    }
  }

  // Local development fallback — writes to public/uploads.
  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, name), buf);
    return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("local upload failed:", msg.slice(0, 300));
    // Read-only filesystem = deployed without BLOB_READ_WRITE_TOKEN configured.
    if (msg.includes("EROFS") || msg.includes("read-only") || msg.includes("EACCES") || msg.includes("ENOENT")) {
      return NextResponse.json(
        { message: "Image storage is not configured on this deployment. Add a Vercel Blob store so uploads can be saved." },
        { status: 503 }
      );
    }
    return NextResponse.json({ message: "Image upload failed. Please try again." }, { status: 500 });
  }
}

export const runtime = "nodejs";
