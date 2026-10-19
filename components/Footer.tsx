import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettingsSafe, type SiteSettings } from "@/lib/settings";
import { LogoImage } from "@/components/LogoImage";
import { socialLinks, type SocialNetwork } from "@/lib/social";
import { googleMapsLocationUrl } from "@/lib/map";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/SocialIcons";

/** The mark and brand fill for each network. Classes are literal so Tailwind emits them. */
const BRANDS: Record<SocialNetwork, { Icon: (p: { className?: string }) => JSX.Element; bg: string }> = {
  facebook: { Icon: FacebookIcon, bg: "bg-[#1877F2]" },
  instagram: { Icon: InstagramIcon, bg: "bg-gradient-to-br from-[#FEDA75] via-[#D62976] to-[#4F5BD5]" },
  youtube: { Icon: YouTubeIcon, bg: "bg-[#FF0000]" },
};

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact Us" },
  { href: "/apply", label: "Apply for Admission" },
];

/**
 * The site footer.
 *
 * Accepts settings from the server layout when given them (the normal path, so
 * one DB read serves the whole shell). Falls back to reading them itself so the
 * component still works if it is ever rendered on its own.
 *
 * Layout: on a phone this is a compact three-row grid — brand, then Quick Links
 * and Contact side by side, then social and office hours — rather than one tall
 * column, which made the footer a long, undifferentiated scroll. From md up the
 * same four blocks fan out into the usual four columns, so there is one
 * structure and no duplicated markup.
 */
export async function Footer({ settings }: { settings?: SiteSettings } = {}) {
  const s: SiteSettings = settings ?? (await getSiteSettingsSafe());
  const contact = s.contact ?? siteConfig.contact;
  // Only networks the admin has actually filled in — an empty field means the
  // icon is omitted entirely, not rendered as a link to nowhere.
  const links = socialLinks(s.social ?? {});
  // Strip spaces and punctuation: a formatted number makes an invalid tel: URI.
  const telHref = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;
  // Opens the location saved in Site Settings — the exact pin from the map embed
  // when one is set, otherwise a search for the address. Useful on a phone,
  // where tapping it hands straight over to the Maps app for directions.
  const mapHref = googleMapsLocationUrl(contact.address, s.mapEmbedUrl);

  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-6 grid grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-4 md:gap-6">
        {/* 1. Brand — full width on a phone, first column from md up. */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <LogoImage
              src={s.logoUrl}
              alt={`${s.name} logo`}
              className="h-10 w-10 rounded-lg object-contain bg-white p-1 flex-shrink-0"
            />
            <p className="brand-name-sm text-lg sm:text-xl text-white">{s.name}</p>
          </div>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-md">{s.tagline}</p>
        </div>

        {/* 2. Quick Links. <nav> rather than a plain div so the footer links are
            a landmark; labelled, because the header already has one nav. */}
        <nav aria-label="Footer">
          <p className="font-semibold mb-2 text-sm">Quick Links</p>
          <ul className="space-y-1 text-xs text-slate-300">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                {/* py-1 widens the tap target on a phone without visibly
                    spacing the list out, which is what makes these fiddly to
                    hit at 12px. */}
                <Link href={l.href} className="inline-block py-1.5 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3. Contact — icons so the three lines are told apart at a glance. */}
        <div>
          <p className="font-semibold mb-2 text-sm">Contact</p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex gap-1.5">
              <MapPin size={13} className="mt-0.5 flex-shrink-0 text-slate-300" aria-hidden="true" />
              {/* Linked, but not underlined — the request was for plain text. It
                  still reads as a link on hover and on focus, and the sr-only
                  note below tells screen readers where it goes; the map pin
                  beside it also signals that this line is the location. */}
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="break-words hover:text-white focus-visible:text-white focus-visible:outline-none"
              >
                <span className="break-words">{contact.address}</span>
                <span className="sr-only"> — open in Google Maps</span>
              </a>
            </li>
            <li className="flex gap-1.5">
              <Phone size={13} className="mt-0.5 flex-shrink-0 text-slate-300" aria-hidden="true" />
              <a href={telHref} className="hover:text-white break-all py-0.5">{contact.phone}</a>
            </li>
            <li className="flex gap-1.5">
              <Mail size={13} className="mt-0.5 flex-shrink-0 text-slate-300" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="hover:text-white break-all py-0.5">{contact.email}</a>
            </li>
          </ul>
        </div>

        {/* 4. Social, then office hours — full width on a phone, so the icons
            are not squeezed into a half column. */}
        <div className="col-span-2 md:col-span-1">
          {links.length > 0 && (
            <>
              <p className="font-semibold mb-2 text-sm">Follow us</p>
              <ul className="flex items-center gap-2.5">
                {links.map((l) => {
                  const { Icon, bg } = BRANDS[l.network];
                  return (
                    <li key={l.network}>
                      <a
                        href={l.url}
                        target="_blank"
                        // noreferrer stops the destination reading this site as
                        // the referrer; noopener is implied by _blank but stated
                        // for older browsers.
                        rel="noopener noreferrer"
                        aria-label={`${s.name} on ${l.label}`}
                        title={l.label}
                        // 40px on a phone is a comfortable tap target; trimmed
                        // at md, where the pointer is precise. A WHITE focus
                        // ring, since matching each button's own fill would make
                        // keyboard focus invisible against it.
                        className={`flex h-10 w-10 md:h-8 md:w-8 items-center justify-center rounded-full text-white shadow-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary motion-reduce:transition-none ${bg}`}
                      >
                        <Icon className="h-5 w-5 md:h-4 md:w-4" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          <p className={`font-semibold mb-2 text-sm ${links.length > 0 ? "mt-4" : ""}`}>Office Hours</p>
          <p className="text-xs text-slate-300 leading-relaxed">{contact.hours}</p>
        </div>
      </div>
      {/* slate-400 on the navy primary measures 4.43:1 — just under the 4.5:1
          AA floor — so the copyright uses slate-300 (7.65:1) instead. */}
      <div className="border-t border-white/10 text-center text-xs text-slate-300 py-3 px-4">
        © {new Date().getFullYear()} {s.name}. All rights reserved.
      </div>
    </footer>
  );
}
