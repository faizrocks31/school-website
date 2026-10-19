import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminLogoutButton } from "./logout-button";

/**
 * Admin shell.
 *
 * Deliberately has no navigation menu: every admin section is reachable from
 * the dashboard's icon grid, and the single "Back to Dashboard" control below
 * gets you home from any page. Adding a nav list back here would duplicate that
 * grid and would need updating every time a section is added.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 py-2 min-h-14 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            {/* Back to the dashboard — the one way out of a section page. The
                label shortens on narrow screens so the header never overflows. */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-text-main hover:bg-slate-100 hover:border-slate-300 transition motion-reduce:transition-none"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline whitespace-nowrap">Back to Dashboard</span>
              <span className="sm:hidden whitespace-nowrap">Back</span>
            </Link>
            <span className="hidden lg:inline text-sm font-semibold text-primary truncate">Admin Panel</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/"
              aria-label="View site"
              title="View site"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold text-text-main hover:bg-slate-100 hover:border-slate-300 transition motion-reduce:transition-none"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline whitespace-nowrap">View site</span>
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
