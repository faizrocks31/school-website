import Link from "next/link";

/**
 * Admin 404.
 *
 * Any unmatched path under /admin lands here instead of the public 404, so a
 * mistyped admin URL stays inside the panel (its own shell, no public header or
 * footer) and offers a way back rather than a dead end in site chrome.
 */
export default function AdminNotFound() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
      <h1 className="text-2xl font-bold text-primary">Page not found</h1>
      <p className="text-sm text-text-muted mt-2">That admin page doesn’t exist.</p>
      <Link
        href="/admin"
        className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
