// Read-only: prints the stored school name and welcome title so we can tell
// "stale code" apart from "content the user typed into the admin panel".
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const s = await p.siteSettings.findUnique({ where: { id: "default" } });
const h = await p.homeContent.findUnique({ where: { id: "home" } });
console.log("SiteSettings.schoolName  :", JSON.stringify(s?.schoolName));
console.log("HomeContent.welcomeTitle :", JSON.stringify(h?.welcomeTitle));
console.log("HomeContent.heroTitle    :", JSON.stringify(h?.heroTitle));
await p.$disconnect();
