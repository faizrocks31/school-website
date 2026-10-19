// Post-push verification: confirm the 6 dead columns are gone and no data was lost.
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

try {
  const cols = await p.$queryRaw`
    SELECT column_name, is_nullable, data_type
    FROM information_schema.columns
    WHERE table_name = 'ContactMessage'
    ORDER BY ordinal_position`;
  console.log("ContactMessage columns now:");
  for (const c of cols) console.log(`  ${c.column_name.padEnd(18)} ${c.data_type.padEnd(28)} nullable=${c.is_nullable}`);

  const stillThere = cols.filter(c =>
    ["firstName","lastName","email","subject","childName","grade"].includes(c.column_name));
  console.log(`\ndead columns remaining: ${stillThere.length} (${stillThere.map(c=>c.column_name).join(", ") || "none"})`);

  const [{ total }] = await p.$queryRaw`SELECT count(*)::int AS total FROM "ContactMessage"`;
  console.log(`ContactMessage rows preserved: ${total}`);

  const idx = await p.$queryRaw`
    SELECT indexname FROM pg_indexes WHERE tablename='ContactMessage' ORDER BY indexname`;
  console.log("indexes:", idx.map(i=>i.indexname).join(", "));

  const [{ total: enq }] = await p.$queryRaw`SELECT count(*)::int AS total FROM "AdmissionEnquiry"`;
  console.log(`AdmissionEnquiry rows untouched: ${enq}`);
} catch (e) {
  console.error("ERROR:", e.message);
  process.exitCode = 1;
} finally {
  await p.$disconnect();
}
