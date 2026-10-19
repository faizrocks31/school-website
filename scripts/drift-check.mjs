// Read-only diagnostic. Counts only - never selects PII values.
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  const rows = await p.$queryRaw`
    SELECT
      count(*)::int                                                            AS total,
      count(*) FILTER (WHERE name IS NULL OR name = '')::int                   AS name_null_or_empty,
      count(*) FILTER (WHERE "firstName"   IS NOT NULL)::int                   AS has_first_name,
      count(*) FILTER (WHERE "lastName"    IS NOT NULL)::int                   AS has_last_name,
      count(*) FILTER (WHERE email         IS NOT NULL)::int                   AS has_email,
      count(*) FILTER (WHERE subject       IS NOT NULL)::int                   AS has_subject,
      count(*) FILTER (WHERE "childName"   IS NOT NULL)::int                   AS has_child_name,
      count(*) FILTER (WHERE grade         IS NOT NULL)::int                   AS has_grade
    FROM "ContactMessage"`;
  console.log("ContactMessage:", JSON.stringify(rows[0], null, 2));

  const enq = await p.$queryRaw`
    SELECT count(*)::int AS total,
           count(*) FILTER (WHERE "contactNumber" IS NULL)::int AS missing_contact
    FROM "AdmissionEnquiry"`;
  console.log("AdmissionEnquiry:", JSON.stringify(enq[0], null, 2));

  // Does the target index/constraint exist?
  const idx = await p.$queryRaw`
    SELECT indexname FROM pg_indexes
    WHERE tablename = 'ContactMessage' ORDER BY indexname`;
  console.log("ContactMessage indexes:", JSON.stringify(idx));
}

main()
  .catch((e) => { console.error("ERROR:", e.message); process.exitCode = 1; })
  .finally(() => p.$disconnect());
