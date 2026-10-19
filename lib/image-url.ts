/**
 * Turns a stored image reference into a URL the browser can load.
 *
 * The database always stores a *relative* path for uploaded images
 * (`/uploads/<name>`) and never an environment-specific absolute URL. That
 * matters because local development and production share one Neon database, so
 * whichever environment writes a row is not necessarily the one that reads it.
 * A relative path stays meaningful in both places; this function decides what it
 * points at:
 *
 *   - local dev  → `/api/uploads/<name>`, which serves the file out of
 *                  `public/uploads` on disk
 *   - production → `/api/uploads/<name>`, which redirects to the Vercel Blob
 *                  object of that name and falls back to the copy committed in
 *                  the repo
 *
 * The two environments therefore resolve the same stored value to their own
 * copy of the image, which is the whole point: an image uploaded locally is a
 * file on disk, an image uploaded on the live site is a Blob object, and neither
 * needs to know about the other.
 *
 * Anything that is not an `/uploads/` path — an external pasted URL, an image
 * under `/brand/`, a data URI — is returned untouched, so this is safe to call
 * on every image reference. It is a pure string function with no environment
 * lookup, so it works identically in server and client components.
 */
const UPLOAD_PREFIX = "/uploads/";
const PROXY_PREFIX = "/api/uploads/";

export function imageSrc(value: string | null | undefined): string {
  if (!value) return "";
  if (!value.startsWith(UPLOAD_PREFIX)) return value;
  return PROXY_PREFIX + value.slice(UPLOAD_PREFIX.length);
}
