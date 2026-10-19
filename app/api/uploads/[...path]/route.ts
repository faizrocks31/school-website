import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

/**
 * Serves an uploaded image for whatever environment is answering.
 *
 * Every `/uploads/<name>` reference in the database is rewritten to
 * `/api/uploads/<name>` by `imageSrc()`, and this route is what makes that path
 * portable across the two environments, which store the same image differently:
 *
 *   - local development: the file is on disk in `public/uploads`
 *   - production: an image uploaded through the admin panel is in Vercel Blob,
 *     because the runtime filesystem there is read-only
 *
 * Which one to use is decided by `VERCEL` rather than by trying both, and that
 * is deliberate. On Vercel, `public/` is served from the CDN and is NOT reliably
 * part of the function's own file bundle, so a `readFile` there would fail even
 * though the file is perfectly reachable over HTTP. Reading the disk locally and
 * asking Blob in production keeps each branch on the mechanism that actually
 * works in that environment.
 *
 * The fallback matters in production: an image committed to the repo but never
 * uploaded to Blob is not in the store, so a missing Blob object hands off to the
 * static copy at `/uploads/<name>` rather than 404ing. That is what lets the
 * older images keep working straight from a GitHub deploy.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const ON_VERCEL = Boolean(process.env.VERCEL);

export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  const segments = params.path ?? [];
  const name = segments.join("/");

  // Only ever a bare filename. Uploaded names are generated as
  // `<timestamp>-<hex>.<ext>`, so anything else is a probe rather than a real
  // request — and rejecting it here keeps the filesystem read below from being
  // pointed outside `public/uploads`.
  if (segments.length !== 1 || !/^[A-Za-z0-9._-]+$/.test(name) || name.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (ON_VERCEL) {
    // Uploaded on the live site → the Blob store is the only place it can be.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { head } = await import("@vercel/blob");
        const blob = await head(`uploads/${name}`);
        if (blob?.url) {
          return NextResponse.redirect(blob.url, {
            status: 307,
            // Short: a Blob object is immutable, but if this image is later
            // re-uploaded under the same name the redirect should not outlive
            // the old target by long.
            headers: { "Cache-Control": "public, max-age=3600" },
          });
        }
      } catch {
        // Not in the store — fall through to the committed copy below.
      }
    }
    // Committed to the repo. Served by the CDN; this route only points at it.
    return NextResponse.redirect(new URL(`/uploads/${name}`, _req.url), {
      status: 307,
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  }

  // Local development: read the file straight off disk. There is no Blob
  // round-trip here on purpose — what you upload locally is served locally.
  try {
    const file = await readFile(path.join(process.cwd(), "public", "uploads", name));
    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream",
        // Generated filenames are unique and never reused, so this is safe.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
