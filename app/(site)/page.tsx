export const dynamic = "force-dynamic";

import Link from "next/link";
import { getSiteSettingsSafe, getHomeContent, getGalleryImages, getHeroSlides } from "@/lib/settings";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { ModernIcon } from "@/components/ui/ModernIcon";
import { Carousel } from "@/components/ui/Carousel";
import { imageSrc } from "@/lib/image-url";

export default async function HomePage() {
  // Each read is isolated so one missing table cannot blank the others — e.g.
  // deploying this code before the HeroSlide migration must not also hide the
  // gallery. allSettled gives every section its own independent fallback.
  // All three go through the content cache, so a repeat visit re-uses the rows
  // instead of paying three more round-trips to Neon.
  const [homeRes, galleryRes, slidesRes] = await Promise.allSettled([
    getHomeContent(),
    getGalleryImages(),
    getHeroSlides(),
  ]);

  const home = homeRes.status === "fulfilled" ? homeRes.value : null;
  const gallery = galleryRes.status === "fulfilled" ? galleryRes.value : [];
  const slides = slidesRes.status === "fulfilled" ? slidesRes.value : [];

  // Fallbacks derive the school name from settings, so they can never show a
  // different name than the header/footer when a field is left blank.
  const settings = await getSiteSettingsSafe();

  const heroTitle = home?.heroTitle ?? "Building Bright Futures Through Quality Education";
  const heroSubtitle = home?.heroSubtitle ?? "Discover a learning environment where knowledge, creativity, discipline, and character development come together to help every student grow.";
  const welcomeTitle = home?.welcomeTitle ?? `Welcome to ${settings.name}`;
  const welcomeText = home?.welcomeText ?? "We are committed to providing quality education that nurtures curiosity, confidence and character. Placeholder — replace with real school information via /admin/home.";
  const ctaTitle = home?.ctaTitle ?? "Give Your Child a Strong Foundation for the Future";
  const ctaSubtitle = home?.ctaSubtitle ?? "Admissions are open. Apply today and our team will guide you through the next steps.";

  return (
    <div>
      {slides.length > 0 ? (
        <section className="bg-primary">
          {/* One stable page heading for crawlers and screen readers; the visible
              headline per slide is an h2 so the page never has several h1s. */}
          <h1 className="sr-only">{heroTitle}</h1>
          <Carousel label="Featured school photos" autoPlayMs={6000} arrowClassName="bg-white/85 hover:bg-white text-slate-800">
            {slides.map((s) => (
              <div key={s.id} className="relative h-[320px] sm:h-[440px] lg:h-[520px] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc(s.imageUrl)}
                  alt={s.title || `${settings.name} campus`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
                <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white">
                  <div className="max-w-2xl">
                    {s.title ? <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight drop-shadow-sm">{s.title}</h2> : null}
                    {s.subtitle ? <p className="mt-4 text-white/90 text-sm sm:text-base max-w-xl">{s.subtitle}</p> : null}
                    <div className="mt-8 flex flex-wrap gap-3">
                      {s.ctaLabel && s.ctaHref ? (
                        /^https?:\/\//i.test(s.ctaHref) ? (
                          <a href={s.ctaHref} rel="noopener noreferrer" className="bg-accent text-primary px-6 py-3 rounded-xl font-semibold">{s.ctaLabel}</a>
                        ) : (
                          <Link href={s.ctaHref} className="bg-accent text-primary px-6 py-3 rounded-xl font-semibold">{s.ctaLabel}</Link>
                        )
                      ) : null}
                      <Link
                        href="/apply"
                        className={
                          s.ctaLabel && s.ctaHref
                            ? "bg-white/10 border border-white/20 px-6 py-3 rounded-xl font-semibold backdrop-blur"
                            : "bg-accent text-primary px-6 py-3 rounded-xl font-semibold"
                        }
                      >
                        Apply for Admission
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </section>
      ) : (
        <section className="bg-gradient-to-br from-primary to-secondary text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight max-w-3xl">{heroTitle}</h1>
                <p className="mt-4 text-white/90 max-w-2xl">{heroSubtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/apply" className="bg-accent text-primary px-6 py-3 rounded-xl font-semibold">Apply for Admission</Link>
                  <Link href="/about" className="bg-white/10 border border-white/20 px-6 py-3 rounded-xl font-semibold">Discover Our School</Link>
                </div>
              </div>
              {home?.heroImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageSrc(home.heroImageUrl)} alt="School" className="w-full h-64 sm:h-80 object-cover rounded-2xl border border-white/20" />
              ) : null}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-bold text-primary">{welcomeTitle}</h2>
            <p className="text-sm text-text-muted mt-3 leading-relaxed">{welcomeText}</p>
            <Link href="/about" className="inline-block mt-4 text-secondary font-semibold underline">Learn more about us →</Link>
          </div>
          {home?.welcomeImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc(home.welcomeImageUrl)} alt="Welcome" className="w-full h-64 object-cover rounded-2xl border" />
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-primary text-center">Why Choose Our School</h2>
        <p className="text-sm text-text-muted mt-2 text-center max-w-2xl mx-auto">What families can expect from us, every day.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "graduation", color: "blue", title: "Admissions", text: "A clear, guided admission process for every family." },
            { icon: "book", color: "purple", title: "Academic Programs", text: "A structured curriculum from Nursery through Class 12." },
            { icon: "usersRound", color: "green", title: "Experienced Teachers", text: "Dedicated staff who know every child by name." },
            { icon: "trophy", color: "orange", title: "Student Achievements", text: "Recognising real, verified accomplishments." },
            { icon: "school", color: "cyan", title: "School Facilities", text: "Classrooms and campus spaces built for learning." },
            { icon: "calendar", color: "pink", title: "Events & Activities", text: "Celebrations, competitions and co-curricular days." },
            { icon: "message", color: "yellow", title: "Parent Communication", text: "Stay in touch with teachers and the school office." },
            { icon: "clipboardList", color: "slate", title: "Online Enquiry", text: "Apply or ask a question without visiting the campus." },
          ].map((f) => (
            <FeatureCard
              key={f.title}
              icon={f.icon as Parameters<typeof FeatureCard>[0]["icon"]}
              color={f.color as Parameters<typeof FeatureCard>[0]["color"]}
              title={f.title}
              text={f.text}
            />
          ))}
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-primary">Gallery</h2>
          <p className="text-sm text-text-muted mt-1">Photos managed from Admin → Gallery.</p>
          <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Carousel
              label="School photo gallery"
              autoPlayMs={5000}
              dotsClassName="bottom-4"
              arrowClassName="bg-white/90 hover:bg-white text-slate-800"
            >
              {gallery.map((g) => (
                <div key={g.id} className="px-1.5">
                  <div className="relative overflow-hidden rounded-2xl border bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc(g.url)}
                      alt={g.alt || "School photo"}
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                    />
                    {g.alt ? (
                      <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-sm px-4 pt-10 pb-3">
                        {g.alt}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
          {/* Plain grid for visitors without JavaScript, who cannot scroll the
              carousel track. Hidden as soon as JS boots. */}
          <noscript>
            <div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {gallery.map((g) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={g.id} src={imageSrc(g.url)} alt={g.alt || "School photo"} className="w-full h-40 object-cover rounded-2xl border" />
              ))}
            </div>
          </noscript>
        </section>
      )}

      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold">{ctaTitle}</h2>
          {ctaSubtitle ? <p className="text-white/80 mt-2 text-sm max-w-2xl mx-auto">{ctaSubtitle}</p> : null}
          <Link href="/apply" className="inline-block mt-6 bg-accent text-primary px-8 py-3 rounded-xl font-semibold">Apply for Admission</Link>
        </div>
      </section>
    </div>
  );
}
