"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoImage } from "@/components/LogoImage";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact Us" },
];

/**
 * The site header.
 *
 * Name, tagline and logo arrive as PROPS from the server layout, which reads
 * them from the database. They must not be fetched here: doing so meant the
 * server-rendered HTML always carried a hardcoded default name, so every page
 * load showed the wrong school name until JavaScript replaced it — and the
 * stale name was also what crawlers and no-JS visitors saw.
 *
 * The component stays a client component only for the mobile menu toggle and
 * the active-link highlight.
 */
export function Header({
  siteName,
  tagline,
  logoUrl,
}: {
  siteName: string;
  tagline?: string;
  logoUrl?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const logoFallback = (
    <span className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-2.5 sm:p-3.5 flex-shrink-0 shadow-md transition-transform group-hover:scale-105">
      <GraduationCapMark />
    </span>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-3 min-w-0 group">
          <LogoImage
            src={logoUrl ?? ""}
            alt={`${siteName} logo`}
            fallback={logoFallback}
            className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl object-contain bg-white border border-slate-200 p-1 flex-shrink-0 shadow-sm transition-transform group-hover:scale-105"
          />
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
          <Link href="/apply" className="ml-2 bg-accent text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-95">Apply for Admission</Link>
        </nav>
        <button className="md:hidden p-2 flex-shrink-0" aria-label="Toggle menu" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      </div>
      {open && (
        <nav className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-1">
          {links.map(l=>(
            <Link key={l.href} href={l.href} onClick={()=>setOpen(false)} className={`px-3 py-2 rounded-lg text-sm font-medium ${pathname===l.href?"bg-primary text-white":"hover:bg-slate-100"}`}>{l.label}</Link>
          ))}
          <Link href="/apply" onClick={()=>setOpen(false)} className="mt-1 bg-accent text-primary px-4 py-2 rounded-lg text-sm font-semibold text-center">Apply for Admission</Link>
        </nav>
      )}
    </header>
  );
}

/** Graduation-cap mark used when no logo is uploaded. Sized per breakpoint. */
function GraduationCapMark() {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="sm:hidden" aria-hidden="true">
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="hidden sm:block" aria-hidden="true">
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </svg>
    </>
  );
}
