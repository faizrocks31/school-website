import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";
import { DEFAULT_THEME_ID, isThemeId } from "@/lib/theme";
import { cachedContent } from "@/lib/content-cache";

export type SiteSettings = {
  name: string;
  tagline: string;
  logoUrl: string;
  mapEmbedUrl: string;
  themeId: string;
  contact: { address: string; phone: string; email: string; hours: string };
  social: { facebook: string; instagram: string; youtube: string };
};

// DB-backed content with fallback to siteConfig defaults (so site works before admin saves).
//
// Routed through the content cache because this is the hottest read on the site:
// every public page render wants it three times over (metadata, root layout,
// `(site)` layout) and each uncached read is a ~370 ms round-trip to Neon. The
// cache collapses the three into one query and keeps the result briefly, so
// navigating between pages does not re-pay it every time.
export async function getSiteSettings(): Promise<SiteSettings> {
  return cachedContent("site-settings", loadSiteSettings);
}

async function loadSiteSettings(): Promise<SiteSettings> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (!row) return { ...siteConfig, themeId: DEFAULT_THEME_ID };
  return {
    name: row.schoolName, tagline: row.tagline, logoUrl: row.logoUrl ?? "", mapEmbedUrl: row.mapEmbedUrl ?? "",
    // Guard here as well as in validation: a theme id written by an older
    // build, or edited directly in the database, must not blank the site.
    themeId: isThemeId(row.theme) ? row.theme : DEFAULT_THEME_ID,
    contact: { address: row.address, phone: row.phone, email: row.email, hours: row.hours },
    social: { facebook: row.facebook, instagram: row.instagram, youtube: row.youtube },
  };
}

/**
 * Never throws. Returns siteConfig defaults when the database is unreachable
 * or not yet migrated.
 *
 * Server layouts/components use this so a DB hiccup degrades to placeholder
 * text instead of a 500 — and so every caller declares the SAME fallback,
 * rather than each keeping its own hardcoded school name that can drift out of
 * date (which is what caused the header to show a stale name).
 */
export async function getSiteSettingsSafe(): Promise<SiteSettings> {
  try {
    return await getSiteSettings();
  } catch {
    return { ...siteConfig, themeId: DEFAULT_THEME_ID };
  }
}
export async function getHomeContent() {
  return cachedContent("home-content", async () => {
    const row = await prisma.homeContent.findUnique({ where: { id: "home" } });
    if (!row) return null;
    return row;
  });
}
export async function getAboutContent() {
  return cachedContent("about-content", async () => {
    const row = await prisma.aboutContent.findUnique({ where: { id: "about" } });
    if (!row) return null;
    return row;
  });
}
/** Gallery images, in display order. */
export async function getGalleryImages() {
  return cachedContent("gallery", () =>
    prisma.homeGalleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] })
  );
}
/** Active hero slides, in display order. */
export async function getHeroSlides() {
  return cachedContent("hero-slides", () =>
    prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })
  );
}
/** Achievement entries, newest first. */
export async function getAchievements() {
  return cachedContent("achievements", () =>
    prisma.achievementItem.findMany({ orderBy: { createdAt: "desc" } })
  );
}
