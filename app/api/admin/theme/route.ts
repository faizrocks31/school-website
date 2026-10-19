import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkAdmin } from "@/lib/admin-auth";
import { THEMES, isThemeId, DEFAULT_THEME_ID } from "@/lib/theme";
import { siteConfig } from "@/lib/site-config";

/** Available themes plus the one currently saved. */
export async function GET(req: NextRequest) {
  const auth = checkAdmin(req);
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" }, select: { theme: true } });
  const current = isThemeId(row?.theme ?? "") ? row!.theme : DEFAULT_THEME_ID;
  return NextResponse.json({ current, themes: THEMES });
}

/**
 * Sets the site theme.
 *
 * Deliberately narrow: it touches only the `theme` column, so it can never
 * overwrite the school name, contact details or social links that the Site
 * Settings screen manages.
 */
export async function PATCH(req: NextRequest) {
  const auth = checkAdmin(req);
  if (!auth.ok) return NextResponse.json({ message: auth.message }, { status: auth.status });

  const body = await req.json().catch(() => null);
  const theme = String(body?.theme ?? "").trim();
  if (!isThemeId(theme)) {
    return NextResponse.json(
      { message: "Unknown theme.", allowed: THEMES.map((t) => t.id) },
      { status: 422 }
    );
  }

  try {
    // If no settings row exists yet, seed it from the generic placeholders
    // rather than letting the schema defaults create a row carrying a
    // hardcoded school name the admin never chose.
    const row = await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        theme,
        schoolName: siteConfig.name,
        tagline: siteConfig.tagline,
        address: siteConfig.contact.address,
        phone: siteConfig.contact.phone,
        email: siteConfig.contact.email,
        hours: siteConfig.contact.hours,
      },
      update: { theme },
    });
    return NextResponse.json({ theme: row.theme });
  } catch (e) {
    console.error("theme update failed:", e);
    return NextResponse.json({ message: "Could not save the theme. Please try again." }, { status: 500 });
  }
}
