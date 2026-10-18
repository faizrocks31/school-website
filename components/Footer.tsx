import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/settings";

export async function Footer() {
  let s: { name: string; tagline: string; logoUrl: string; contact: { address: string; phone: string; email: string; hours: string } } = {
    name: siteConfig.name,
    tagline: siteConfig.tagline,
    logoUrl: siteConfig.logoUrl,
    contact: siteConfig.contact,
  };
  try {
    const db = await getSiteSettings();
    if (db?.name) s = { name: db.name, tagline: db.tagline, logoUrl: db.logoUrl ?? "", contact: db.contact };
  } catch {
    // DB not migrated yet — fall back to defaults
  }

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            {s.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.logoUrl} alt={`${s.name} logo`} className="h-12 w-12 rounded-xl object-contain bg-white p-1 flex-shrink-0" />
            ) : null}
            <p className="brand-name-sm text-xl sm:text-2xl text-white">{s.name}</p>
          </div>
          <p className="text-sm text-slate-300 mt-2">{s.tagline}</p>
        </div>
        <div><p className="font-semibold mb-3">Quick Links</p><ul className="space-y-2 text-sm text-slate-300">
          <li><Link href="/" className="hover:text-white">Home</Link></li>
          <li><Link href="/about" className="hover:text-white">About Us</Link></li>
          <li><Link href="/achievements" className="hover:text-white">Achievements</Link></li>
          <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
          <li><Link href="/enquiry" className="hover:text-white">Admission Enquiry</Link></li>
        </ul></div>
        <div><p className="font-semibold mb-3">Contact</p><p className="text-sm text-slate-300">{s.contact.address}<br/><a href={`tel:${s.contact.phone}`} className="hover:text-white">{s.contact.phone}</a><br/><a href={`mailto:${s.contact.email}`} className="hover:text-white">{s.contact.email}</a></p></div>
        <div><p className="font-semibold mb-3">Office Hours</p><p className="text-sm text-slate-300">{s.contact.hours}</p></div>
      </div>
      <div className="border-t border-white/10 text-center text-sm text-slate-400 py-4">© {new Date().getFullYear()} {s.name}. All rights reserved.</div>
    </footer>
  );
}
