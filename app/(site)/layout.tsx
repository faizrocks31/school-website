import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteSettingsSafe } from "@/lib/settings";

/**
 * Public site shell — the header and footer that wrap every visitor-facing page.
 *
 * This lives in the `(site)` route group rather than the root layout so the
 * admin panel does NOT inherit the public nav: editors would otherwise see
 * "Home / About Us / Achievements / Contact Us / Apply for Admission" above the
 * admin shell, which duplicates the dashboard's icon grid and offers links out
 * of the panel mid-task. Route groups do not appear in URLs, so every public
 * path is unchanged by living in here.
 *
 * The settings read happens once and is passed down, so a school-name change in
 * Site Settings appears in the header and footer together with no stale copies.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettingsSafe();
  return (
    <>
      <Header siteName={settings.name} tagline={settings.tagline} logoUrl={settings.logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
