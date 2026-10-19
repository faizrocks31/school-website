// Read-only: dumps the current ContactMessage rows so we can tell whether an
// interrupted status round-trip left any row in a modified state.
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
const rows = await p.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
console.log("ContactMessage rows:", rows.length);
for (const r of rows) {
  console.log("---");
  console.log("  id     :", r.id);
  console.log("  name   :", JSON.stringify(r.name));
  console.log("  phone  :", JSON.stringify(r.contactNumber));
  console.log("  status :", r.status);
  console.log("  created:", r.createdAt.toISOString());
  console.log("  updated:", r.updatedAt.toISOString());
  console.log("  msg    :", JSON.stringify(r.message.slice(0, 70)));
}
await p.$disconnect();
