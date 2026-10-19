export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { ModernIcon, type ModernIconName, type ModernIconColor } from "@/components/ui/ModernIcon";
import { ICONS } from "@/lib/icon-map";

/**
 * Admin dashboard.
 *
 * Every admin section lives here as one consistent icon tile. This is the only
 * navigation the admin has — the shell header carries just a back button — so a
 * new section must be added to SECTIONS below to stay reachable.
 */
type Section = {
  label: string;
  href: string;
  description: string;
  /** Supplied by spreading an ICONS entry, which provides { name, color }. */
  name: ModernIconName;
  color: ModernIconColor;
  /** Optional live count shown as a badge. */
  stat?: number;
};

export default async function AdminDashboard() {
  let applications = 0, messages = 0, achievements = 0, gallery = 0, slides = 0;
  try {
    [applications, messages, achievements, gallery, slides] = await Promise.all([
      prisma.admissionEnquiry.count(),
      prisma.contactMessage.count(),
      prisma.achievementItem.count(),
      prisma.homeGalleryImage.count(),
      prisma.heroSlide.count(),
    ]);
  } catch {
    // DB not yet migrated — show 0 until `prisma db push` is run
  }

  // Content the office works through daily — shown first, with a live count.
  const inbox: Section[] = [
    { label: "Applications", href: "/admin/applications", description: "Admission applications and their status.", ...ICONS.applications, stat: applications },
    { label: "Messages", href: "/admin/messages", description: "Messages from the Contact Us form.", ...ICONS.messages, stat: messages },
  ];

  // Site content and settings.
  const content: Section[] = [
    { label: "Site Settings", href: "/admin/site", description: "School name, logo, contact info, map and social links.", ...ICONS.siteSettings },
    { label: "Theme", href: "/admin/theme", description: "Colour scheme for the whole website.", ...ICONS.adminTheme },
    { label: "Home Content", href: "/admin/home", description: "Hero, welcome and call-to-action text.", ...ICONS.homeContent },
    { label: "Slideshow", href: "/admin/hero-slides", description: "Rotating banner images on the home page.", ...ICONS.slideshow, stat: slides },
    { label: "About", href: "/admin/about", description: "Intro, history, mission, principal and values.", ...ICONS.aboutContent },
    { label: "Achievements", href: "/admin/achievements", description: "Student achievements shown on the site.", ...ICONS.adminAchievements, stat: achievements },
    { label: "Gallery", href: "/admin/gallery", description: "Photos shown in the home page gallery.", ...ICONS.gallery, stat: gallery },
  ];

  function Tile({ s }: { s: Section }) {
    return (
      <Link
        href={s.href}
        className="group bg-white rounded-2xl border border-slate-200 p-5 flex items-start gap-4 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition motion-reduce:transform-none motion-reduce:transition-none"
      >
        <ModernIcon name={s.name} color={s.color} size="md" interactive />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-text-main">{s.label}</span>
            {typeof s.stat === "number" ? (
              <span className="inline-block rounded-full bg-slate-100 text-text-muted text-xs font-semibold px-2 py-0.5 tabular-nums">
                {s.stat}
              </span>
            ) : null}
          </span>
          <span className="block text-sm text-text-muted mt-1">{s.description}</span>
        </span>
      </Link>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
      <p className="text-sm text-text-muted mt-1">Manage website content and view admission applications.</p>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-main uppercase tracking-wide">Enquiries</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {inbox.map((s) => <Tile key={s.href} s={s} />)}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-text-main uppercase tracking-wide">Website Content</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.map((s) => <Tile key={s.href} s={s} />)}
        </div>
      </section>
    </div>
  );
}
