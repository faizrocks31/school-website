import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboard(){
  const [enquiries, achievements, gallery] = await Promise.all([
    prisma.admissionEnquiry.count(),
    prisma.achievementItem.count(),
    prisma.homeGalleryImage.count(),
  ]);
  const cards = [
    { label:"Enquiries", value: enquiries, href:"/admin/enquiries" },
    { label:"Achievements", value: achievements, href:"/admin/achievements" },
    { label:"Gallery Images", value: gallery, href:"/admin/gallery" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
      <p className="text-sm text-text-muted mt-1">Manage website content and view admission enquiries.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map(c=>(
          <Link key={c.label} href={c.href} className="bg-white rounded-2xl border p-6 hover:shadow-sm">
            <p className="text-sm text-text-muted">{c.label}</p>
            <p className="text-3xl font-bold text-primary mt-1">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/admin/site" className="bg-primary text-white rounded-2xl p-5">
          <p className="font-semibold">Site Settings</p><p className="text-sm text-white/80 mt-1">School name, contact info, social links.</p>
        </Link>
        <Link href="/admin/home" className="bg-white border rounded-2xl p-5">
          <p className="font-semibold">Home Content</p><p className="text-sm text-text-muted mt-1">Hero, welcome, CTA text + images.</p>
        </Link>
        <Link href="/admin/about" className="bg-white border rounded-2xl p-5">
          <p className="font-semibold">About</p><p className="text-sm text-text-muted mt-1">Intro, history, mission, principal, values.</p>
        </Link>
        <Link href="/admin/gallery" className="bg-white border rounded-2xl p-5">
          <p className="font-semibold">Home Gallery</p><p className="text-sm text-text-muted mt-1">Upload and manage home page photos.</p>
        </Link>
      </div>
    </div>
  );
}
