import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { getSiteSettingsSafe } from "@/lib/settings";
import { getTheme, themeCssVars } from "@/lib/theme";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["500","600","700","800"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettingsSafe();
  return {
    title: { default: s.name, template: `%s | ${s.name}` },
    description: `${s.name} — ${s.tagline}`,
    openGraph: { title: s.name, description: s.tagline, type: "website", images: s.logoUrl ? [s.logoUrl] : undefined },
  };
}

/**
 * Root shell: the document, the fonts, and the active theme.
 *
 * The public Header/Footer deliberately do NOT live here — they are in the
 * `(site)` route group's layout so the admin panel is not wrapped in the public
 * navigation. Everything shared by both (html/body, font variables, the theme
 * CSS variables) belongs here, so admin pages still get the school's colours.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettingsSafe();

  // The active theme is resolved on the server and inlined, so the correct
  // colours are present in the first byte of HTML — no flash of the default
  // theme, and it works with JavaScript disabled.
  const vars = themeCssVars(getTheme(settings.themeId));

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <style id="brand-theme" dangerouslySetInnerHTML={{ __html: `:root{${vars}}` }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased font-sans">{children}</body>
    </html>
  );
}
