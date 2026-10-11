export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  let home: Awaited<ReturnType<typeof prisma.homeContent.findUnique>> = null;
  let gallery: Awaited<ReturnType<typeof prisma.homeGalleryImage.findMany>> = [];
  try {
    [home, gallery] = await Promise.all([
      prisma.homeContent.findUnique({ where: { id: "home" } }),
      prisma.homeGalleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    ]);
  } catch {
    // DB not yet migrated on first deploy — fall back to defaults
  }

  const heroTitle = home?.heroTitle ?? "Building Bright Futures Through Quality Education";
  const heroSubtitle = home?.heroSubtitle ?? "Discover a learning environment where knowledge, creativity, discipline, and character development come together to help every student grow.";
  const welcomeTitle = home?.welcomeTitle ?? "Welcome to Sunrise Public School";
  const welcomeText = home?.welcomeText ?? "We are committed to providing quality education that nurtures curiosity, confidence and character. Placeholder — replace with real school information via /admin/home.";
  const ctaTitle = home?.ctaTitle ?? "Give Your Child a Strong Foundation for the Future";
  const ctaSubtitle = home?.ctaSubtitle ?? "Admissions are open. Enquire today and our team will guide you through the next steps.";

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-secondary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight max-w-3xl">{heroTitle}</h1>
              <p className="mt-4 text-white/90 max-w-2xl">{heroSubtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/enquiry" className="bg-accent text-primary px-6 py-3 rounded-xl font-semibold">Enquire for Admission</Link>
                <Link href="/about" className="bg-white/10 border border-white/20 px-6 py-3 rounded-xl font-semibold">Discover Our School</Link>
              </div>
            </div>
            {home?.heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={home.heroImageUrl} alt="School" className="w-full h-64 sm:h-80 object-cover rounded-2xl border border-white/20" />
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-bold text-primary">{welcomeTitle}</h2>
            <p className="text-sm text-text-muted mt-3 leading-relaxed">{welcomeText}</p>
            <Link href="/about" className="inline-block mt-4 text-secondary font-semibold underline">Learn more about us →</Link>
          </div>
          {home?.welcomeImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={home.welcomeImageUrl} alt="Welcome" className="w-full h-64 object-cover rounded-2xl border" />
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid gap-6 md:grid-cols-4">
        {["Quality Education","Experienced Teachers","Student Development","Learning Environment"].map(t=>(
          <div key={t} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"><h3 className="font-semibold text-primary">{t}</h3><p className="text-sm text-text-muted mt-2">Placeholder — edit via Admin → Home.</p></div>
        ))}
      </section>

      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-bold text-primary">Gallery</h2>
          <p className="text-sm text-text-muted mt-1">Photos managed from Admin → Gallery.</p>
          <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {gallery.map(g=>(
              // eslint-disable-next-line @next/next/no-img-element
              <img key={g.id} src={g.url} alt={g.alt || "Gallery photo"} className="w-full h-40 object-cover rounded-2xl border" />
            ))}
          </div>
        </section>
      )}

      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold">{ctaTitle}</h2>
          {ctaSubtitle ? <p className="text-white/80 mt-2 text-sm max-w-2xl mx-auto">{ctaSubtitle}</p> : null}
          <Link href="/enquiry" className="inline-block mt-6 bg-accent text-primary px-8 py-3 rounded-xl font-semibold">Submit Admission Enquiry</Link>
        </div>
      </section>
    </div>
  );
}
