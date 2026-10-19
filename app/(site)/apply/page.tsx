export const metadata = { title: "Apply for Admission" };
import Link from "next/link";
import { AdmissionEnquiryForm } from "@/components/AdmissionEnquiryForm";
import { getSiteSettingsSafe } from "@/lib/settings";
import { ModernIcon } from "@/components/ui/ModernIcon";

export const dynamic = "force-dynamic";

export default async function ApplyPage() {
  // Through the cached helper rather than querying directly: this page and the
  // site layout both need these fields, and reading them separately meant two
  // ~370 ms round-trips to Neon for the same row.
  const s = await getSiteSettingsSafe();
  const { address, phone, email, hours } = s.contact;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <p className="text-sm text-text-muted"><Link href="/" className="hover:text-primary">Home</Link> <span aria-hidden>›</span> Apply for Admission</p>
        <div className="mt-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary flex items-center gap-3">
            <ModernIcon name="graduation" color="blue" size="md" />
            Apply for Admission
          </h1>
          <p className="mt-2 text-text-muted max-w-2xl">Take the first step towards your child&apos;s bright future. Fill out the form below, and our school team will contact you.</p>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
          <AdmissionEnquiryForm />
          <aside className="space-y-6">
            <div className="bg-primary text-white rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <ModernIcon name="phone" color="blue" variant="solid" size="sm" />
                <h3 className="font-semibold text-lg">Contact Information</h3>
              </div>
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <ModernIcon name="mapPin" color="orange" variant="solid" size="sm" />
                  <p className="text-sm text-white/85 leading-relaxed pt-1.5">{address}</p>
                </div>

                {/* Phone and email are the details parents actually act on, so
                    they get display type and their own icon rather than sitting
                    in the same grey paragraph as the address. */}
                <div className="flex items-start gap-3">
                  <ModernIcon name="phone" color="green" variant="solid" size="sm" />
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="font-display text-lg font-bold tracking-tight text-white hover:text-accent transition-colors underline-offset-4 hover:underline pt-1"
                  >
                    {phone}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <ModernIcon name="mail" color="purple" variant="solid" size="sm" />
                  <a
                    href={`mailto:${email}`}
                    className="font-display text-base font-semibold tracking-tight text-white hover:text-accent transition-colors underline-offset-4 hover:underline break-all pt-1.5"
                  >
                    {email}
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <ModernIcon name="clock" color="cyan" variant="solid" size="sm" />
                  <p className="text-sm text-white/70 leading-relaxed pt-1.5">{hours}</p>
                </div>
              </div>
              <Link href="/contact" className="inline-block mt-5 bg-white text-primary px-4 py-2 rounded-xl text-sm font-semibold">Contact Us</Link>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <Link href="/contact" className="block" aria-label="Need help? Go to our Contact Us page">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/need-help.webp"
                  alt=""
                  width={1600}
                  height={800}
                  /* Locked to the image's own 2:1 ratio, so the band is always the
                     same height and object-cover never has anything to crop. */
                  className="w-full aspect-[2/1] object-cover"
                />
              </Link>
              <div className="p-6">
                <h4 className="font-semibold text-text-main">Need help?</h4>
                <p className="text-sm text-text-muted mt-1">Visit our <Link href="/contact" className="text-secondary underline">Contact Us</Link> page for directions and office hours.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
