// One-off repair: the auto-seeded HomeContent.welcomeTitle embeds the old
// school name. Rewrite it from the current SiteSettings name.
//
// Safety: prints and backs up the previous value before writing, and updates
// only that single column.
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";

const p = new PrismaClient();

const site = await p.siteSettings.findUnique({ where: { id: "default" } });
const home = await p.homeContent.findUnique({ where: { id: "home" } });

if (!site || !home) {
  console.log("Missing row — nothing to do.");
  await p.$disconnect();
  process.exit(0);
}

const before = home.welcomeTitle;
const after = `Welcome to ${site.schoolName}`;

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backup = `scripts/backup-welcome-title-${stamp}.json`;
writeFileSync(backup, JSON.stringify({ id: home.id, welcomeTitle: before }, null, 2));
console.log("Backed up to:", backup);

console.log("before:", JSON.stringify(before));
console.log("after :", JSON.stringify(after));

if (before === after) {
  console.log("Already correct — no write performed.");
  await p.$disconnect();
  process.exit(0);
}

await p.homeContent.update({ where: { id: "home" }, data: { welcomeTitle: after } });

const check = await p.homeContent.findUnique({ where: { id: "home" }, select: { welcomeTitle: true } });
console.log("verified:", JSON.stringify(check.welcomeTitle));

await p.$disconnect();
