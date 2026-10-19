import { PrismaClient } from "@prisma/client";
import { invalidateContent } from "@/lib/content-cache";

const g = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const client = new PrismaClient();

  // Any write drops the content cache, so a save in the admin panel is visible
  // on the very next page load instead of after the cache's TTL.
  //
  // This lives here rather than as a call in each admin route on purpose: there
  // are fourteen separate write sites across ten route files, and a single
  // missed one would leave stale content on the public site — a bug that is
  // invisible in testing and only shows up as "I saved it and nothing changed".
  // Hooking the client means every write is covered, including any route added
  // later.
  //
  // Reads are deliberately excluded; clearing on a read would defeat the cache
  // entirely. Writes are rare (admin only), so over-invalidating costs a couple
  // of re-queries and nothing more.
  client.$use(async (params, next) => {
    // finally, not a plain await: a write that fails part-way can still have
    // changed something (a multi-row update, or a failure after commit), and
    // clearing the cache on a failure is only ever a wasted re-query. Skipping
    // it could leave a half-applied change invisible.
    try {
      return await next(params);
    } finally {
      if (WRITE_ACTIONS.has(params.action)) invalidateContent();
    }
  });

  return client;
}

const WRITE_ACTIONS = new Set([
  "create",
  "createMany",
  "update",
  "updateMany",
  "upsert",
  "delete",
  "deleteMany",
  "executeRaw",
]);

// Reused across hot reloads in development so edits do not open a new pool on
// every recompile (which would leak connections to Neon).
export const prisma = g.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
