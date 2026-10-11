import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
export function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-4">
        <div><p className="font-bold text-lg">{siteConfig.name}</p><p className="text-sm text-slate-300 mt-2">{siteConfig.tagline}</p></div>
        <div><p className="font-semibold mb-3">Quick Links</p><ul className="space-y-2 text-sm text-slate-300">
          <li><Link href="/" className="hover:text-white">Home</Link></li>
          <li><Link href="/about" className="hover:text-white">About Us</Link></li>
          <li><Link href="/achievements" className="hover:text-white">Achievements</Link></li>
          <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
          <li><Link href="/enquiry" className="hover:text-white">Admission Enquiry</Link></li>
        </ul></div>
        <div><p className="font-semibold mb-3">Contact</p><p className="text-sm text-slate-300">{siteConfig.contact.address}<br/><a href={`tel:${siteConfig.contact.phone}`} className="hover:text-white">{siteConfig.contact.phone}</a><br/><a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">{siteConfig.contact.email}</a></p></div>
        <div><p className="font-semibold mb-3">Office Hours</p><p className="text-sm text-slate-300">{siteConfig.contact.hours}</p></div>
      </div>
      <div className="border-t border-white/10 text-center text-sm text-slate-400 py-4">© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</div>
    </footer>
  );
}
