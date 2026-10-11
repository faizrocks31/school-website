import Link from "next/link";
import { AdminLogoutButton } from "./logout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-bold text-primary">Admin Panel</Link>
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <Link href="/admin" className="px-3 py-1.5 rounded-lg hover:bg-slate-100">Dashboard</Link>
              <Link href="/admin/site" className="px-3 py-1.5 rounded-lg hover:bg-slate-100">Site Settings</Link>
              <Link href="/admin/home" className="px-3 py-1.5 rounded-lg hover:bg-slate-100">Home</Link>
              <Link href="/admin/about" className="px-3 py-1.5 rounded-lg hover:bg-slate-100">About</Link>
              <Link href="/admin/achievements" className="px-3 py-1.5 rounded-lg hover:bg-slate-100">Achievements</Link>
              <Link href="/admin/gallery" className="px-3 py-1.5 rounded-lg hover:bg-slate-100">Gallery</Link>
              <Link href="/admin/enquiries" className="px-3 py-1.5 rounded-lg hover:bg-slate-100">Enquiries</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm text-text-muted hover:text-primary">View site</Link>
            <AdminLogoutButton />
          </div>
        </div>
        <div className="sm:hidden border-t px-4 py-2 flex flex-wrap gap-1 text-sm">
          <Link href="/admin" className="px-2 py-1 rounded-lg bg-slate-100">Dashboard</Link>
          <Link href="/admin/site" className="px-2 py-1 rounded-lg bg-slate-100">Site</Link>
          <Link href="/admin/home" className="px-2 py-1 rounded-lg bg-slate-100">Home</Link>
          <Link href="/admin/about" className="px-2 py-1 rounded-lg bg-slate-100">About</Link>
          <Link href="/admin/achievements" className="px-2 py-1 rounded-lg bg-slate-100">Achievements</Link>
          <Link href="/admin/gallery" className="px-2 py-1 rounded-lg bg-slate-100">Gallery</Link>
          <Link href="/admin/enquiries" className="px-2 py-1 rounded-lg bg-slate-100">Enquiries</Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
