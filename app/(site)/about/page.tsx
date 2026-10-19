export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAboutContent } from "@/lib/settings";
import { ModernIcon } from "@/components/ui/ModernIcon";
import { imageSrc } from "@/lib/image-url";

export default async function AboutPage(){
  let about: Awaited<ReturnType<typeof getAboutContent>> = null;
  try { about = await getAboutContent(); } catch {}

  const introTitle = about?.introTitle ?? "About Our School";
  const introText = about?.introText ?? "Learn about our school's history, mission, vision and values. Placeholder content — replace with real school information via Admin → About.";
  const historyText = about?.historyText ?? "Our school was founded with a vision to provide holistic education. Placeholder — add real history via Admin.";
  const mission = about?.mission ?? "Nurture curious, confident and compassionate learners.";
  const vision = about?.vision ?? "Be a trusted centre of holistic education.";
  let values: string[] = ["Discipline","Integrity","Respect","Creativity","Responsibility","Lifelong Learning"];
  try { const v = JSON.parse(about?.valuesJson ?? "[]"); if (Array.isArray(v) && v.length) values = v; } catch {}

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <p className="text-sm text-text-muted"><Link href="/" className="hover:text-primary">Home</Link> › About Us</p>
      <h1 className="text-3xl font-bold text-primary mt-2">{introTitle}</h1>
      <p className="text-text-muted mt-2 max-w-3xl">{introText}</p>

      <div className="mt-6 bg-white rounded-2xl border p-6">
        <div className="flex items-center gap-3">
          <ModernIcon name="book" color="cyan" size="sm" />
          <h2 className="font-semibold">Our History</h2>
        </div>
        <p className="text-sm text-text-muted mt-3 leading-relaxed">{historyText}</p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl border p-6">
          <ModernIcon name="target" color="blue" size="lg" />
          <h3 className="font-semibold mt-4">Our Mission</h3>
          <p className="text-sm text-text-muted mt-2">{mission}</p>
        </div>
        <div className="bg-white rounded-2xl border p-6">
          <ModernIcon name="eye" color="purple" size="lg" />
          <h3 className="font-semibold mt-4">Our Vision</h3>
          <p className="text-sm text-text-muted mt-2">{vision}</p>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border p-6">
        <div className="flex items-center gap-3">
          <ModernIcon name="heart" color="pink" size="sm" />
          <h2 className="font-semibold">Core Values</h2>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {values.map(v=> <span key={v} className="bg-slate-100 border rounded-full px-3 py-1 text-sm">{v}</span>)}
        </div>
      </div>

      {about?.principalName ? (
        <div className="mt-6 bg-white rounded-2xl border p-6 flex gap-4">
          {about.principalImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageSrc(about.principalImageUrl)} alt={about.principalName} className="w-24 h-24 rounded-xl object-cover border flex-shrink-0" />
          ) : null}
          <div>
            <p className="font-semibold">{about.principalName}</p>
            <p className="text-sm text-text-muted">{about.principalTitle}</p>
            {about.principalMessage ? <p className="text-sm text-text-muted mt-2 leading-relaxed">{about.principalMessage}</p> : null}
          </div>
        </div>
      ) : null}

      <Link href="/apply" className="inline-block mt-8 bg-accent text-primary px-6 py-3 rounded-xl font-semibold">Apply for Admission</Link>
    </div>
  );
}
