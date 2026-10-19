import { z } from "zod";
import { normalizeMapEmbed } from "@/lib/map";
import { THEME_IDS } from "@/lib/theme";

export const siteSettingsSchema = z.object({
  schoolName: z.string().trim().min(2).max(120),
  tagline: z.string().trim().max(200),
  logoUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  // Constrained to the known theme ids so an unknown value can never reach the
  // database and blank out the site's colours.
  theme: z.enum(THEME_IDS as [string, ...string[]]).optional(),
  address: z.string().trim().min(5).max(500),
  // Accepts a Google Maps embed URL or a full <iframe> snippet; stored normalized to a URL.
  mapEmbedUrl: z.string().trim().max(5000).optional().or(z.literal("")).transform(v => normalizeMapEmbed(v ?? "")),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(254),
  hours: z.string().trim().max(200),
  facebook: z.string().trim().max(500).optional().or(z.literal("")),
  instagram: z.string().trim().max(500).optional().or(z.literal("")),
  youtube: z.string().trim().max(500).optional().or(z.literal("")),
});
export const homeContentSchema = z.object({
  heroTitle: z.string().trim().min(5).max(200),
  heroSubtitle: z.string().trim().min(10).max(500),
  welcomeTitle: z.string().trim().min(5).max(200),
  welcomeText: z.string().trim().min(10).max(3000),
  ctaTitle: z.string().trim().min(5).max(200),
  ctaSubtitle: z.string().trim().max(500),
  heroImageUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  welcomeImageUrl: z.string().trim().max(1000).optional().or(z.literal("")),
});
export const aboutContentSchema = z.object({
  introTitle: z.string().trim().min(3).max(200),
  introText: z.string().trim().min(10).max(3000),
  historyText: z.string().trim().min(10).max(5000),
  mission: z.string().trim().min(5).max(1000),
  vision: z.string().trim().min(5).max(1000),
  principalName: z.string().trim().max(120).optional().or(z.literal("")),
  principalTitle: z.string().trim().max(120).optional().or(z.literal("")),
  principalMessage: z.string().trim().max(3000).optional().or(z.literal("")),
  principalImageUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  valuesJson: z.string().max(5000).optional(),
});
export const achievementSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(3000),
  category: z.string().trim().min(2).max(80),
  dateLabel: z.string().trim().max(80).optional().or(z.literal("")),
  imageUrl: z.string().trim().max(1000).optional().or(z.literal("")),
});
export const galleryImageSchema = z.object({
  url: z.string().trim().min(1).max(1000),
  alt: z.string().trim().max(200).optional().or(z.literal("")),
});
export const heroSlideSchema = z.object({
  imageUrl: z.string().trim().min(1).max(1000),
  title: z.string().trim().max(200).optional().or(z.literal("")),
  subtitle: z.string().trim().max(500).optional().or(z.literal("")),
  ctaLabel: z.string().trim().max(60).optional().or(z.literal("")),
  // Internal paths ("/apply") and absolute URLs are both allowed; anything else
  // is rejected so a slide can never link to a javascript: URL.
  ctaHref: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), {
      message: "Use a site path like /apply, or a full https:// link.",
    })
    .optional()
    .or(z.literal("")),
});
