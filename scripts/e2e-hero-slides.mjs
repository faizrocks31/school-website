// End-to-end check of the hero-slideshow feature against the running dev server.
//
// Creates real slides through the admin API, verifies they render in the
// homepage carousel, then deletes them again in a finally block so no test data
// is left behind. The admin token is read from the environment and never printed.
import { PrismaClient } from "@prisma/client";

const BASE = "http://localhost:3000";
const TOKEN = process.env.ADMIN_TOKEN;
if (!TOKEN) { console.error("ADMIN_TOKEN not set"); process.exit(1); }

const H = { "Content-Type": "application/json", "x-admin-token": TOKEN };
const created = [];
const p = new PrismaClient();

async function api(method, path, body) {
  const res = await fetch(BASE + path, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
}

try {
  // Reuse a real image already in the gallery so the slides point at something real.
  const gallery = await p.homeGalleryImage.findMany({ take: 2, orderBy: { sortOrder: "asc" } });
  if (!gallery.length) { console.log("No gallery images available to reuse — aborting."); process.exit(0); }
  const imgA = gallery[0].url;
  const imgB = gallery[1]?.url ?? gallery[0].url;
  console.log("Using images:", imgA, "|", imgB);

  console.log("\n--- auth is enforced ---");
  const noAuth = await fetch(BASE + "/api/admin/hero-slides", { method: "GET" });
  console.log("GET without token ->", noAuth.status, "(expect 401)");

  console.log("\n--- validation ---");
  const badLink = await api("POST", "/api/admin/hero-slides", { imageUrl: imgA, ctaLabel: "Bad", ctaHref: "javascript:alert(1)" });
  console.log("javascript: link ->", badLink.status, "(expect 422)", JSON.stringify(badLink.json?.errors ?? badLink.json));
  const noImg = await api("POST", "/api/admin/hero-slides", { title: "No image" });
  console.log("missing image  ->", noImg.status, "(expect 422)");

  console.log("\n--- create two slides ---");
  const one = await api("POST", "/api/admin/hero-slides", {
    imageUrl: imgA, title: "E2E Slide One", subtitle: "First test slide", ctaLabel: "Apply Now", ctaHref: "/apply",
  });
  if (one.status === 201) created.push(one.json.id);
  console.log("slide 1 ->", one.status, "sortOrder =", one.json?.sortOrder);

  const two = await api("POST", "/api/admin/hero-slides", {
    imageUrl: imgB, title: "E2E Slide Two", subtitle: "Second test slide", ctaLabel: "Visit Site", ctaHref: "https://example.com",
  });
  if (two.status === 201) created.push(two.json.id);
  console.log("slide 2 ->", two.status, "sortOrder =", two.json?.sortOrder);

  console.log("\n--- homepage now renders the carousel ---");
  let html = await (await fetch(BASE + "/")).text();
  console.log('carousel region :', (html.match(/aria-roledescription="carousel"/g) || []).length, "(expect 2: hero + gallery)");
  console.log('"E2E Slide One"  :', html.includes("E2E Slide One"));
  console.log('"E2E Slide Two"  :', html.includes("E2E Slide Two"));
  console.log('external link   :', /<a[^>]+href="https:\/\/example\.com"[^>]*rel="noopener noreferrer"/.test(html));
  console.log('internal link   :', /<a[^>]+href="\/apply"[^>]*>Apply Now</.test(html));
  console.log("static hero gone:", !html.includes("Discover Our School"), "(expect true while slides exist)");

  console.log("\n--- deactivate slide 1 -> it leaves the site ---");
  const off = await api("PUT", `/api/admin/hero-slides/${created[0]}`, { isActive: false });
  console.log("toggle ->", off.status, "isActive =", off.json?.isActive);
  html = await (await fetch(BASE + "/")).text();
  console.log('"E2E Slide One" present:', html.includes("E2E Slide One"), "(expect false)");
  console.log('"E2E Slide Two" present:', html.includes("E2E Slide Two"), "(expect true)");

  console.log("\n--- reorder ---");
  const reordered = await api("PATCH", "/api/admin/hero-slides", { order: [...created].reverse() });
  console.log("PATCH ->", reordered.status, "new order =", reordered.json?.map((r) => r.id).join(","));
  console.log("expected   =", [...created].reverse().join(","));
} finally {
  console.log("\n--- cleanup ---");
  for (const id of created) {
    const res = await api("DELETE", `/api/admin/hero-slides/${id}`);
    console.log("deleted", id, "->", res.status);
  }
  const left = await p.heroSlide.count();
  console.log("HeroSlide rows remaining:", left, "(expect 0)");
  await p.$disconnect();
}
