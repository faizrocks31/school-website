// Verifies the rename-propagation logic from app/api/admin/site-settings/route.ts.
//
// The whole thing runs inside a transaction that ALWAYS rolls back (we throw a
// sentinel at the end), so the real SiteSettings / HomeContent rows are never
// modified. This exercises the same Prisma operations the route performs,
// against the real schema and real data.
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

const ROLLBACK = "ROLLBACK_SENTINEL";

async function propagate(oldName, newName, tx) {
  // Mirrors the route: only rewrite when the stored title still holds the old name.
  if (oldName && oldName !== newName) {
    const home = await tx.homeContent.findUnique({
      where: { id: "home" },
      select: { welcomeTitle: true },
    });
    if (home && home.welcomeTitle.includes(oldName)) {
      await tx.homeContent.update({
        where: { id: "home" },
        data: { welcomeTitle: home.welcomeTitle.replaceAll(oldName, newName) },
      });
    }
  }
}

const site = await p.siteSettings.findUnique({ where: { id: "default" } });
const real = await p.homeContent.findUnique({ where: { id: "home" } });
console.log("Real current name        :", JSON.stringify(site.schoolName));
console.log("Real stored welcomeTitle :", JSON.stringify(real.welcomeTitle));
console.log();

try {
  await p.$transaction(async (tx) => {
    // Case 1: a genuine rename must rewrite the auto-generated heading.
    await tx.homeContent.update({ where: { id: "home" }, data: { welcomeTitle: `Welcome to ${site.schoolName}` } });
    await propagate(site.schoolName, "Test Rename School", tx);
    const afterRename = await tx.homeContent.findUnique({ where: { id: "home" }, select: { welcomeTitle: true } });
    console.log("Case 1 rename     ->", JSON.stringify(afterRename.welcomeTitle));

    // Case 2: a hand-written heading that does NOT contain the old name must be left alone.
    await tx.homeContent.update({ where: { id: "home" }, data: { welcomeTitle: "A Message From Our Principal" } });
    await propagate(site.schoolName, "Another Name", tx);
    const afterCustom = await tx.homeContent.findUnique({ where: { id: "home" }, select: { welcomeTitle: true } });
    console.log("Case 2 custom kept->", JSON.stringify(afterCustom.welcomeTitle));

    // Case 3: name unchanged must be a no-op.
    await tx.homeContent.update({ where: { id: "home" }, data: { welcomeTitle: "Welcome to Same Name" } });
    await propagate("Same Name", "Same Name", tx);
    const afterSame = await tx.homeContent.findUnique({ where: { id: "home" }, select: { welcomeTitle: true } });
    console.log("Case 3 no-op      ->", JSON.stringify(afterSame.welcomeTitle));

    throw new Error(ROLLBACK);
  }, { timeout: 60000, maxWait: 30000 });
} catch (e) {
  if (e.message !== ROLLBACK) throw e;
  console.log("\n(transaction rolled back — no real data touched)");
}

const after = await p.homeContent.findUnique({ where: { id: "home" }, select: { welcomeTitle: true } });
console.log("Real welcomeTitle after test:", JSON.stringify(after.welcomeTitle));
console.log(after.welcomeTitle === real.welcomeTitle ? "UNCHANGED — confirmed no side effects" : "!!! CHANGED — investigate");

await p.$disconnect();
