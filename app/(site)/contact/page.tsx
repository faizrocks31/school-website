export const dynamic = "force-dynamic";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Building2 } from "lucide-react";
import { ModernIcon } from "@/components/ui/ModernIcon";
import { getSiteSettingsSafe } from "@/lib/settings";
import { normalizeMapEmbed, googleMapsLocationUrl } from "@/lib/map";
import { ContactMessageForm } from "@/components/ContactMessageForm";

export const metadata = { title: "Contact Us" };

export default async function ContactPage(){
  // Through the cached helper rather than querying directly: this page and the
  // site layout both need these fields, and reading them separately meant two
  // ~370 ms round-trips to Neon for the same row.
  const s = await getSiteSettingsSafe();
  const schoolName = s.name;
  const { address, phone, email, hours } = s.contact;
  const mapEmbed = normalizeMapEmbed(s.mapEmbedUrl);

  return (
    <div>
      {/* Page banner */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-1">›</span> Contact Us
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold">Contact Us</h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            We would be glad to hear from you. Reach the {schoolName} campus or send us a message and our team will respond.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">Contact Information</h2>
          <p className="text-sm text-text-muted mt-2">Our campus and office details are listed below.</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* School / Campus */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <ModernIcon name="mapPin" color="orange" size="lg" />
            <h3 className="mt-4 font-bold text-primary">Campus</h3>
            <p className="mt-2 text-sm text-text-muted flex gap-2"><MapPin size={16} className="mt-0.5 flex-shrink-0 text-secondary" /><span>{schoolName}<br/>{address}</span></p>
          </div>

          {/* Phone + Email */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <ModernIcon name="phone" color="blue" size="lg" />
            <h3 className="mt-4 font-bold text-primary">Get in Touch</h3>
            <p className="mt-2 text-sm text-text-muted flex gap-2"><Phone size={16} className="mt-0.5 flex-shrink-0 text-secondary" /><a href={`tel:${phone}`} className="hover:text-primary">{phone}</a></p>
            <p className="mt-2 text-sm text-text-muted flex gap-2"><Mail size={16} className="mt-0.5 flex-shrink-0 text-secondary" /><a href={`mailto:${email}`} className="hover:text-primary break-all">{email}</a></p>
          </div>

          {/* Office hours */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <ModernIcon name="clock" color="cyan" size="lg" />
            <h3 className="mt-4 font-bold text-primary">Office Hours</h3>
            <p className="mt-2 text-sm text-text-muted flex gap-2"><Clock size={16} className="mt-0.5 flex-shrink-0 text-secondary" /><span>{hours}</span></p>
            <p className="mt-2 text-sm text-text-muted flex gap-2"><Building2 size={16} className="mt-0.5 flex-shrink-0 text-secondary" /><span>Administrative office</span></p>
          </div>
        </div>
      </section>

      {/* Location map — full width */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">Visit Our Campus</h2>
            <p className="text-sm text-text-muted mt-2">{schoolName} · {address}</p>
          </div>

          {mapEmbed ? (
            <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              <iframe
                src={mapEmbed}
                title={`${schoolName} location map`}
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="w-full h-[300px] sm:h-[400px] lg:h-[480px]"
              />
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm text-text-muted">No map added yet. Add one in Admin → Site Settings.</p>
            </div>
          )}

          <div className="mt-4 text-center">
            <a
              href={googleMapsLocationUrl(address, s.mapEmbedUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary"
            >
              <MapPin size={16} /> Get directions on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Leave a Message — below the map */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-2 items-stretch">
          <ContactMessageForm />

          <aside className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <Link href="/apply" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/apply-admission.webp"
                alt="Apply for admission — quality education, safe and friendly environment, experienced teachers and overall development"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            </Link>
            <div className="p-6 flex flex-col flex-1">
              <p className="text-sm text-text-muted">Looking for admission? Fill in the admission application form and our team will contact you.</p>
              <Link href="/apply" className="mt-5 lg:mt-auto inline-block text-center bg-accent text-primary px-6 py-3 rounded-xl text-sm font-semibold">Apply for Admission</Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
