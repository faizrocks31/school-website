// Targeted cleanup: delete exactly one ContactMessage row by id.
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const id = process.argv[2];
if (!id) {
  console.error("usage: node delete-message.mjs <id>");
  process.exit(1);
}

try {
  const before = await p.contactMessage.count();
  const deleted = await p.contactMessage.delete({ where: { id } });
  const after = await p.contactMessage.count();
  console.log(`deleted id=${deleted.id} (name="${deleted.name}")`);
  console.log(`ContactMessage rows: ${before} -> ${after}`);
} catch (e) {
  console.error("delete failed:", e.message);
  process.exitCode = 1;
} finally {
  await p.$disconnect();
}
