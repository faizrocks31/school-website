import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AchievementsPage(){
  const items = await prisma.achievementItem.findMany({ orderBy:{createdAt:"desc"}});
  const cats = [...new Set(items.map(i=>i.category))];
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <p className="text-sm text-text-muted"><Link href="/" className="hover:text-primary">Home</Link> › Achievements</p>
      <h1 className="text-3xl font-bold text-primary mt-2">Our Achievements</h1>
      <p className="text-text-muted mt-2">Verified accomplishments — managed from Admin → Achievements. No fabricated awards are shown.</p>
      {cats.length>0 && <div className="mt-3 flex flex-wrap gap-2">{cats.map(c=><span key={c} className="bg-slate-100 border rounded-full px-3 py-1 text-xs">{c}</span>)}</div>}
      {items.length===0 ? (
        <div className="mt-8 bg-white rounded-2xl border p-10 text-center text-text-muted">No achievements published yet. Add them from Admin → Achievements.</div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(it=>(
            <div key={it.id} className="bg-white rounded-2xl border overflow-hidden">
              {it.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.imageUrl} alt={it.title} className="w-full h-40 object-cover" />
              ) : null}
              <div className="p-5">
                <p className="text-xs bg-slate-100 border rounded-full inline-block px-2 py-0.5">{it.category}</p>
                <h3 className="font-semibold mt-2">{it.title}</h3>
                <p className="text-sm text-text-muted mt-1">{it.description}</p>
                {it.dateLabel ? <p className="text-xs text-text-muted mt-2">{it.dateLabel}</p> : null}
              </div>
            </div>
          ))}
        </div>
      )}
      <Link href="/enquiry" className="inline-block mt-8 bg-accent text-primary px-6 py-3 rounded-xl font-semibold">Enquire for Admission</Link>
    </div>
  );
}
