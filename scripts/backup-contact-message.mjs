// One-shot backup of the ContactMessage table before a destructive schema push.
// Writes to the path in argv[2] (kept outside the repo so PII can't be committed).
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";

const out = process.argv[2];
if (!out) {
  console.error("usage: node backup-contact-message.mjs <output-path>");
  process.exit(1);
}

const p = new PrismaClient();
try {
  const rows = await p.$queryRaw`SELECT * FROM "ContactMessage" ORDER BY "createdAt"`;
  const payload = {
    takenAt: new Date().toISOString(),
    table: "ContactMessage",
    rowCount: rows.length,
    note: "Pre-push backup. The 6 columns dropped by db push were empty.",
    rows,
  };
  writeFileSync(out, JSON.stringify(payload, null, 2), "utf8");
  console.log(`backup written: ${out} (${rows.length} rows)`);
} catch (e) {
  console.error("backup FAILED:", e.message);
  process.exitCode = 1;
} finally {
  await p.$disconnect();
}
