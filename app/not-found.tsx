import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteSettingsSafe } from "@/lib/settings";

/**
 * Global 404.
 *
 * This renders outside the `(site)` route group, so it does not inherit the
 * public header and footer automatically — it renders them itself, because a
 * visitor who mistypes a public URL should still land on something that looks
 * like the school's site and can navigate away. Admin paths have their own
 * not-found, so the panel never shows public chrome.
 */
export default async function NotFound() {
  const settings = await getSiteSettingsSafe();
  return (
    <>
      <Header siteName={settings.name} tagline={settings.tagline} logoUrl={settings.logoUrl} />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-primary">Page not found</h1>
          <p className="text-text-muted mt-2">The page you’re looking for doesn’t exist.</p>
          <Link href="/" className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-xl">Go to Home</Link>
        </div>
      </main>
      <Footer settings={settings} />
    </>
  );
}
