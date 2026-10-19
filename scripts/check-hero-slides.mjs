// Read-only: confirms the HeroSlide table exists and is queryable after the push.
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const rows = await p.heroSlide.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
console.log("HeroSlide table is queryable. Row count:", rows.length);
if (rows.length) console.table(rows.map((r) => ({ id: r.id, title: r.title, isActive: r.isActive, sortOrder: r.sortOrder })));
await p.$disconnect();
