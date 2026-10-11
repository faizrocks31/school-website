"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact Us" },
  { href: "/enquiry", label: "Enquiry" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [siteName, setSiteName] = useState("Sunrise Public School");
  useEffect(()=>{ fetch("/api/site-settings").then(r=>r.json()).then(j=>{ if(j.schoolName) setSiteName(j.schoolName); }).catch(()=>{}); },[]);
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary text-lg">
          <span className="bg-primary text-white rounded-lg p-1.5"><GraduationCap size={20} /></span>
          <span>{siteName}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`px-3 py-2 rounded-lg text-sm font-medium ${pathname===l.href?"bg-primary text-white":"text-text-main hover:bg-slate-100"}`}>{l.label}</Link>
          ))}
          <Link href="/enquiry" className="ml-2 bg-accent text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-95">Apply for Admission</Link>
          <Link href="/admin" className="ml-1 text-xs text-text-muted hover:text-primary underline">Admin</Link>
        </nav>
        <button className="md:hidden p-2" aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      </div>
      {open && (
        <nav className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-1">
          {links.map(l=>(
            <Link key={l.href} href={l.href} onClick={()=>setOpen(false)} className={`px-3 py-2 rounded-lg text-sm font-medium ${pathname===l.href?"bg-primary text-white":"hover:bg-slate-100"}`}>{l.label}</Link>
          ))}
          <Link href="/admin" onClick={()=>setOpen(false)} className="px-3 py-2 text-sm text-text-muted">Admin Panel</Link>
        </nav>
      )}
    </header>
  );
}
