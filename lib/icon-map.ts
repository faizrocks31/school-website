import type { ModernIconName, ModernIconColor } from "@/components/ui/ModernIcon";

/**
 * Semantic icon+colour assignments, so a given concept looks identical
 * everywhere it appears. Pages reference the *meaning* ("admissions"),
 * not a colour, which keeps the palette consistent as the site grows.
 *
 *   const { name, color } = ICONS.admissions;
 *   <ModernIcon {...ICONS.admissions} size="lg" />
 */
export const ICONS: Record<string, { name: ModernIconName; color: ModernIconColor }> = {
  // ── Homepage feature cards ──────────────────────────────────────────
  admissions: { name: "graduation", color: "blue" },
  programs: { name: "book", color: "purple" },
  teachers: { name: "usersRound", color: "green" },
  achievements: { name: "trophy", color: "orange" },
  facilities: { name: "school", color: "cyan" },
  events: { name: "calendar", color: "pink" },
  parents: { name: "message", color: "yellow" },
  enquiry: { name: "clipboardList", color: "slate" },

  // ── Apply for Admission page ────────────────────────────────────────
  form: { name: "fileText", color: "blue" },
  dates: { name: "calendar", color: "orange" },
  checklist: { name: "clipboardCheck", color: "green" },
  requirements: { name: "circleCheck", color: "green" },

  // ── Contact page ────────────────────────────────────────────────────
  phone: { name: "phone", color: "blue" },
  email: { name: "mail", color: "purple" },
  location: { name: "mapPin", color: "orange" },
  hours: { name: "clock", color: "cyan" },
  message: { name: "message", color: "green" },
  office: { name: "building", color: "slate" },

  // ── About page ──────────────────────────────────────────────────────
  mission: { name: "target", color: "blue" },
  vision: { name: "eye", color: "purple" },
  values: { name: "heart", color: "pink" },
  history: { name: "book", color: "cyan" },
  principal: { name: "userRound", color: "green" },

  // ── Admin dashboard ─────────────────────────────────────────────────
  dashboard: { name: "dashboard", color: "blue" },
  applications: { name: "clipboardList", color: "blue" },
  messages: { name: "message", color: "purple" },
  gallery: { name: "image", color: "pink" },
  slideshow: { name: "star", color: "yellow" },
  siteSettings: { name: "settings", color: "slate" },
  homeContent: { name: "home", color: "cyan" },
  aboutContent: { name: "info", color: "green" },
  adminAchievements: { name: "trophy", color: "orange" },
  adminTheme: { name: "sparkles", color: "purple" },

  // ── Form / status feedback ──────────────────────────────────────────
  success: { name: "circleCheck", color: "green" },
  privacy: { name: "shield", color: "green" },
  consent: { name: "shield", color: "blue" },
  send: { name: "send", color: "blue" },
};
