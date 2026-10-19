import { notFound } from "next/navigation";

/**
 * Catch-all for unknown admin paths.
 *
 * Next serves the ROOT not-found for any unmatched URL, and a nested
 * `not-found.tsx` is only used when a page calls `notFound()` — so without this
 * route a mistyped admin URL would render the PUBLIC 404, complete with the
 * site's header and footer. Matching every unmatched /admin segment here and
 * calling `notFound()` routes it to `app/admin/not-found.tsx` instead, which
 * keeps the panel's own shell.
 */
export default function AdminCatchAll() {
  notFound();
}
