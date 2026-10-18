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
  const [tagline, setTagline] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  useEffect(()=>{
    fetch("/api/site-settings").then(r=>r.json()).then(j=>{
      if(j.schoolName) setSiteName(j.schoolName);
      if(j.tagline) setTagline(j.tagline);
      if(j.logoUrl) setLogoUrl(j.logoUrl);
    }).catch(()=>{});
  },[]);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-3 min-w-0 group">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={`${siteName} logo`} className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl object-contain bg-white border border-slate-200 p-1 flex-shrink-0 shadow-sm transition-transform group-hover:scale-105" />
          ) : (
            <span className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-2.5 sm:p-3.5 flex-shrink-0 shadow-md transition-transform group-hover:scale-105">
              <GraduationCap size={28} className="sm:hidden" />
              <GraduationCap size={34} className="hidden sm:block" />
            </span>
          )}
          <span className="min-w-0">
            <span className="brand-name block text-2xl sm:text-4xl lg:text-[2.6rem] leading-[1.08]">{siteName}</span>
            {tagline ? (
              <span className="hidden sm:block text-xs lg:text-sm text-text-muted font-medium tracking-wide mt-1">{tagline}</span>
            ) : null}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`px-3 py-2 rounded-lg text-sm font-medium ${pathname===l.href?"bg-primary text-white":"text-text-main hover:bg-slate-100"}`}>{l.label}</Link>
          ))}
          <Link href="/enquiry" className="ml-2 bg-accent text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-95">Apply for Admission</Link>
          <Link href="/admin" className="ml-1 text-xs text-text-muted hover:text-primary underline">Admin</Link>
        </nav>
        <button className="md:hidden p-2 flex-shrink-0" aria-label="Toggle menu" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
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
