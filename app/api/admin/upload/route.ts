import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg","image/png","image/webp","image/gif"]);
const EXT: Record<string,string> = { "image/jpeg":".jpg","image/png":".png","image/webp":".webp","image/gif":".gif" };

/**
 * Where the image goes depends on where this code is running, and the two
 * environments are deliberately different:
 *
 *   - Local development: the file is written to `public/uploads` on disk, so
 *     the image you upload while working is *your* image and never touches
 *     production storage.
 *   - On Vercel: the runtime filesystem is read-only, so a file cannot be saved
 *     to disk at all. The image goes to the Vercel Blob store instead.
 *
 * Either way the route answers with the same relative path — `/uploads/<name>` —
 * so the database stays environment-neutral and `/api/uploads/<name>` can
 * resolve it to whichever copy exists. Returning an absolute Blob URL here would
 * bake one environment's storage into a row that the other environment also
 * reads, which is exactly what we are avoiding.
 *
 * `VERCEL` is set by the platform on every Vercel build and runtime, so it is
 * the honest test for "am I deployed" — unlike the presence of a Blob token,
 * which only says a store is *available*.
 */
const ON_VERCEL = Boolean(process.env.VERCEL);

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

  // Deployed: Vercel Blob, because nothing else can persist a file there.
  if (ON_VERCEL) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { message: "Image storage is not configured on this deployment. Add a Vercel Blob store so uploads can be saved." },
        { status: 503 }
      );
    }
    try {
      const { put } = await import("@vercel/blob");
      await put(`uploads/${name}`, file, { access: "public", contentType: file.type, addRandomSuffix: false });
      return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("blob upload failed:", msg.slice(0, 300));
      return NextResponse.json({ message: "Image upload failed. Please try again." }, { status: 502 });
    }
  }

  // Local development: straight to public/uploads, served by `/api/uploads/…`.
  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, name), buf);
    return NextResponse.json({ url: `/uploads/${name}` }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("local upload failed:", msg.slice(0, 300));
    return NextResponse.json({ message: "Image upload failed. Please try again." }, { status: 500 });
  }
}

export const runtime = "nodejs";
