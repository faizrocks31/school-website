// Read-only: scans every content table for an old school name so nothing
// stale survives anywhere a visitor can see.
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const needle = process.argv[2] ?? "Sunrise";
const re = new RegExp(needle, "i");

function scan(label, obj) {
  if (!obj) return;
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string" && re.test(v)) {
      console.log(`  ${label}.${k} = ${JSON.stringify(v)}`);
    }
  }
}

console.log(`Searching all content tables for /${needle}/i ...\n`);

const site = await p.siteSettings.findUnique({ where: { id: "default" } });
console.log("SiteSettings:"); scan("SiteSettings", site);

const home = await p.homeContent.findUnique({ where: { id: "home" } });
console.log("HomeContent:"); scan("HomeContent", home);

const about = await p.aboutContent.findUnique({ where: { id: "about" } });
console.log("AboutContent:"); scan("AboutContent", about);

const ach = await p.achievementItem.findMany();
console.log(`AchievementItem (${ach.length} rows):`);
ach.forEach((a) => scan(`ach[${a.id}]`, a));

const gal = await p.homeGalleryImage.findMany();
console.log(`HomeGalleryImage (${gal.length} rows):`);
gal.forEach((g) => scan(`gal[${g.id}]`, g));

console.log("\nDone. (read-only — nothing was modified)");
await p.$disconnect();
