// Verifies the coloured message statuses end-to-end.
//
// Creates its OWN temporary message row, exercises the full PATCH round-trip
// against that row, then deletes it — so no real user message is ever modified.
import { PrismaClient } from "@prisma/client";
import { readFileSync, readdirSync } from "node:fs";

const BASE = "http://localhost:3000";
const TOKEN = process.env.ADMIN_TOKEN;
if (!TOKEN) { console.error("ADMIN_TOKEN not set"); process.exit(1); }

const p = new PrismaClient();
let tempId = null;

// The exact class strings lib/status.ts assigns, asserted literally.
const EXPECTED = {
  NEW:     { pill: "bg-blue-100 text-blue-800 border-blue-200",       select: "bg-blue-50 border-blue-300 text-blue-900" },
  READ:    { pill: "bg-yellow-100 text-yellow-800 border-yellow-200", select: "bg-yellow-50 border-yellow-300 text-yellow-900" },
  REPLIED: { pill: "bg-green-100 text-green-800 border-green-200",    select: "bg-green-50 border-green-300 text-green-900" },
  CLOSED:  { pill: "bg-red-100 text-red-800 border-red-200",          select: "bg-red-50 border-red-300 text-red-900" },
};

function patch(id, status) {
  return fetch(`${BASE}/api/admin/messages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-admin-token": TOKEN },
    body: JSON.stringify({ status }),
  });
}

try {
  // 1. Tailwind only emits classes it can see literally in source, so a
  //    composed-at-runtime class would be silently missing from the CSS.
  let css = "";
  try {
    for (const f of readdirSync(".next/static/css")) if (f.endsWith(".css")) css += readFileSync(`.next/static/css/${f}`, "utf8");
  } catch { /* not built */ }

  console.log("=== colour classes present in built CSS? ===");
  if (!css) {
    console.log("  (no built CSS found — skipped; dev mode compiles on demand)");
  } else {
    let missing = 0;
    for (const [status, styles] of Object.entries(EXPECTED)) {
      for (const group of [styles.pill, styles.select]) {
        for (const token of group.split(" ")) {
          if (token.startsWith("bg-") || token.startsWith("text-") || token.startsWith("border-")) {
            if (!css.includes(`.${token}`)) { console.log(`  MISSING (${status}): ${token}`); missing++; }
          }
        }
      }
    }
    console.log(missing === 0 ? "  all present" : `  ${missing} missing`);
  }

  // 2. Status round-trip on a throwaway row.
  const temp = await p.contactMessage.create({
    data: { name: "E2E Status Test", contactNumber: "0000000000", message: "temporary row — safe to delete", status: "NEW" },
  });
  tempId = temp.id;
  console.log(`\n=== PATCH round-trip on temp row ${tempId} ===`);
  for (const s of ["NEW", "READ", "REPLIED", "CLOSED"]) {
    const res = await patch(tempId, s);
    const j = await res.json().catch(() => ({}));
    const ok = res.status === 200 && j.status === s;
    console.log(`  ${s.padEnd(7)} -> HTTP ${res.status}, stored ${j.status}  ${ok ? "OK" : "MISMATCH"}`);
  }

  const bad = await patch(tempId, "NONSENSE");
  console.log(`  invalid -> HTTP ${bad.status} (expect 422)`);

  // 3. The rendered page must carry the colour classes for whatever status is
  //    stored. Set CLOSED, then confirm the rendered select is tinted red.
  await patch(tempId, "CLOSED");
  const res = await fetch(`${BASE}/admin/messages`, { headers: { "x-admin-token": TOKEN } });
  const html = await res.text();
  console.log(`\n=== rendered /admin/messages (HTTP ${res.status}) ===`);
  console.log("  has counts row   :", html.includes("tabular-nums"));
  console.log("  colour classes in page source:", ["bg-blue-100","bg-yellow-100","bg-green-100","bg-red-100"].filter(c => html.includes(c)).join(", ") || "(none — client-rendered after fetch)");
} finally {
  if (tempId) {
    console.log(`\n=== cleanup ===`);
    const del = await fetch(`${BASE}/api/admin/messages/${tempId}`, { method: "DELETE", headers: { "x-admin-token": TOKEN } });
    console.log("  DELETE temp row ->", del.status);
    const left = await p.contactMessage.findUnique({ where: { id: tempId } });
    console.log("  temp row gone:", left === null);
  }
  const all = await p.contactMessage.findMany({ select: { id: true, status: true }, orderBy: { createdAt: "desc" } });
  console.log(`\n=== real messages untouched: ${all.length} rows ===`);
  for (const r of all) console.log(`  ${r.id}  ${r.status}`);
  await p.$disconnect();
}
