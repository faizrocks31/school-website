import Link from "next/link";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";

export default async function ContactPage(){
  const settings = await prisma.siteSettings.findUnique({ where:{id:"default"}});
  const address = settings?.address ?? siteConfig.contact.address;
  const phone = settings?.phone ?? siteConfig.contact.phone;
  const email = settings?.email ?? siteConfig.contact.email;
  const hours = settings?.hours ?? siteConfig.contact.hours;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <p className="text-sm text-text-muted"><Link href="/" className="hover:text-primary">Home</Link> › Contact Us</p>
      <h1 className="text-3xl font-bold text-primary mt-2">Contact Us</h1>
      <p className="text-sm text-text-muted mt-1">Contact info is managed from Admin → Site Settings.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl border p-6">
          <p className="text-sm text-text-muted">{address}</p>
          <p className="mt-3"><a href={`tel:${phone}`} className="text-secondary font-medium">{phone}</a></p>
          <p><a href={`mailto:${email}`} className="text-secondary font-medium">{email}</a></p>
          <p className="text-sm text-text-muted mt-2">{hours}</p>
        </div>
        <div className="bg-white rounded-2xl border p-6 text-center">
          <p className="font-semibold">Admission Enquiry</p>
          <p className="text-sm text-text-muted mt-1">Have questions about admission?</p>
          <Link href="/enquiry" className="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-xl text-sm font-semibold">Go to Admission Enquiry</Link>
        </div>
      </div>
    </div>
  );
}
