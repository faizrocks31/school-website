import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/lib/settings";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["500","600","700","800"] });

export async function generateMetadata(): Promise<Metadata> {
  let name = "Sunrise Public School";
  let tagline = "Building Bright Futures Through Quality Education.";
  let logoUrl: string | undefined;
  try {
    const s = await getSiteSettings();
    if (s?.name) name = s.name;
    if (s?.tagline) tagline = s.tagline;
    logoUrl = s?.logoUrl || undefined;
  } catch {
    // DB not migrated yet — fall back to defaults
  }
  return {
    title: { default: name, template: `%s | ${name}` },
    description: `${name} — ${tagline}`,
    openGraph: { title: name, description: tagline, type: "website", images: logoUrl ? [logoUrl] : undefined },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
