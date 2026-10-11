export const metadata = { title: "Admission Enquiry" };
import Link from "next/link";
import { AdmissionEnquiryForm } from "@/components/AdmissionEnquiryForm";
import { siteConfig } from "@/lib/site-config";
export default function EnquiryPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <p className="text-sm text-text-muted"><Link href="/" className="hover:text-primary">Home</Link> <span aria-hidden>›</span> Admission Enquiry</p>
        <div className="mt-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">Student Admission Enquiry</h1>
          <p className="mt-2 text-text-muted max-w-2xl">Take the first step towards your child&apos;s bright future. Fill out the form below, and our school team will contact you.</p>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.7fr_0.9fr]">
          <AdmissionEnquiryForm />
          <aside className="space-y-6">
            <div className="bg-primary text-white rounded-2xl p-6">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="mt-3 space-y-2 text-sm text-white/90">
                <p>{siteConfig.contact.address}</p>
                <p><a href={`tel:${siteConfig.contact.phone}`} className="underline">{siteConfig.contact.phone}</a></p>
                <p><a href={`mailto:${siteConfig.contact.email}`} className="underline">{siteConfig.contact.email}</a></p>
                <p className="text-white/70">{siteConfig.contact.hours}</p>
              </div>
              <Link href="/contact" className="inline-block mt-4 bg-white text-primary px-4 py-2 rounded-xl text-sm font-semibold">Contact Us</Link>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h4 className="font-semibold text-text-main">Need help?</h4>
              <p className="text-sm text-text-muted mt-1">Visit our <Link href="/contact" className="text-secondary underline">Contact Us</Link> page for directions and office hours.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
