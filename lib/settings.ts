import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";

// DB-backed content with fallback to siteConfig defaults (so site works before admin saves).
export async function getSiteSettings() {
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (!row) return siteConfig;
  return {
    name: row.schoolName, tagline: row.tagline, logoUrl: row.logoUrl ?? "",
    contact: { address: row.address, phone: row.phone, email: row.email, hours: row.hours },
    social: { facebook: row.facebook, instagram: row.instagram, youtube: row.youtube },
  };
}
export async function getHomeContent() {
  const row = await prisma.homeContent.findUnique({ where: { id: "home" } });
  if (!row) return null;
  return row;
}
export async function getAboutContent() {
  const row = await prisma.aboutContent.findUnique({ where: { id: "about" } });
  if (!row) return null;
  return row;
}
