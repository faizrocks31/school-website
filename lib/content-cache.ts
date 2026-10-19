/**
 * A tiny in-process cache for the handful of database rows that every public
 * page needs.
 *
 * Why this exists: the database is Neon Postgres, so every query is a real
 * network round-trip of roughly 350-400 ms. A single public page render was
 * reading `siteSettings` three times (once in `generateMetadata`, once in the
 * root layout, once in the `(site)` layout) and paying that latency three
 * times over, serially, before any HTML could be sent. Measured end to end,
 * that was about 1.1 s of a 1.3 s response.
 *
 * Two things are handled, and they solve different halves of the problem:
 *
 *   1. Concurrent duplicate loads share one promise (`inflight`). This is what
 *      collapses those three settings reads into a single query — they all want
 *      the same row and start at about the same moment.
 *   2. Recent results are reused for a short window (`TTL_MS`). This is what
 *      makes moving between pages feel instant rather than re-paying the
 *      round-trip on every navigation.
 *
 * The TTL is the only thing standing between the admin saving a change and
 * visitors seeing it, so it is deliberately short AND every admin write route
 * calls `invalidateContent()` to drop the cache immediately. The TTL is a
 * belt-and-braces bound for changes made outside the admin (edited straight in
 * the database, say), not the primary mechanism.
 *
 * Scope: this is per-process module state. It is correct for local development
 * and for a single long-lived server. On a serverless host each warm instance
 * keeps its own copy, so a write invalidates only the instance that served it
 * and other instances serve stale data until their TTL lapses — which is why
 * the TTL is short. Next's `unstable_cache` with tags would coordinate that
 * across instances, but it needs the incremental cache to be reachable at
 * build time and is a larger change than this problem warrants.
 */

/** How long a cached value stays fresh. See the note above before raising it. */
const TTL_MS = 30_000;

type Entry = { value: unknown; expiresAt: number };

const store = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

/**
 * Bumped by every invalidation. A load captures the current generation when it
 * starts and only writes its result to the cache if the generation is unchanged
 * when it finishes.
 *
 * Without this there is a race that would be very hard to diagnose in the wild:
 * a page render starts reading settings, an admin saves a change (clearing the
 * cache), and then the earlier read resolves and stores its PRE-write value —
 * which is now stale but freshly dated, so it survives the whole TTL. The
 * symptom would be "I saved it, refreshed, and it still shows the old value",
 * intermittently. The guard makes the stale result land nowhere.
 */
let generation = 0;

/**
 * Drops every cached value. Called by admin write routes after they commit, so
 * a save is visible on the next page load rather than after the TTL.
 *
 * Deliberately not selective: the site has a handful of keys, and a
 * wrong-but-precise invalidation (forgetting one model) would show stale
 * content to visitors, which is far worse than the cost of re-querying a few
 * rows on the next render.
 */
export function invalidateContent(): void {
  generation++;
  store.clear();
  inflight.clear();
}

/**
 * Returns the cached value for `key` when fresh, otherwise calls `load` and
 * caches the result.
 *
 * A rejection is never cached — the entry is removed and the next caller
 * retries. That matters because these loaders deliberately degrade to
 * placeholder content on failure, and a cached failure would pin placeholder
 * text on the page for the whole TTL.
 */
export function cachedContent<T>(key: string, load: () => Promise<T>, ttlMs: number = TTL_MS): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expiresAt > Date.now()) return Promise.resolve(hit.value as T);

  // Someone else is already loading this exact key — join their request instead
  // of issuing a second identical query.
  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const startedAt = generation;
  const promise = load()
    .then((value) => {
      // Only cache if nothing invalidated while this load was running — see the
      // generation comment above.
      if (startedAt === generation) {
        store.set(key, { value, expiresAt: Date.now() + ttlMs });
      }
      return value;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}
