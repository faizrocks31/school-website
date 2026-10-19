// Read-only: compares the stored HomeContent row against the schema/UI defaults
// so we can tell whether a value was typed by a human or seeded automatically.
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const h = await p.homeContent.findUnique({ where: { id: "home" } });
if (!h) { console.log("No HomeContent row."); } else {
  const schemaDefaults = {
    heroTitle: "Building Bright Futures Through Quality Education",
    heroSubtitle: "Discover a learning environment where knowledge, creativity, discipline, and character development come together to help every student grow.",
    welcomeTitle: "Welcome to Sunrise Public School",
    welcomeText: "We are committed to providing quality education that nurtures curiosity, confidence and character. Placeholder — replace with real school information.",
    ctaTitle: "Give Your Child a Strong Foundation for the Future",
    ctaSubtitle: "Admissions are open. Enquire today and our team will guide you through the next steps.",
  };
  for (const [k, def] of Object.entries(schemaDefaults)) {
    const v = h[k] ?? "";
    console.log(`${k.padEnd(15)} ${v === def ? "== SCHEMA DEFAULT (never edited)" : "*** DIFFERS -> hand-written"}`);
    console.log(`                stored: ${JSON.stringify(v)}`);
  }
  console.log("updatedAt        :", h.updatedAt.toISOString());
}
await p.$disconnect();
