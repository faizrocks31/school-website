// Asserts every theme in lib/theme.ts satisfies the three contrast rules the
// UI depends on. Run after editing THEMES:  node scripts/check-theme-contrast.mjs
//
// The rules come from how the colours are actually used, not from taste:
//   primary   carries WHITE text (header, buttons, gradients)
//   secondary ends a from-primary to-secondary gradient that also carries white
//   accent    carries text-primary (dark) text
//
// The real module is imported (Node strips the TypeScript types), so this
// checks the shipped palette rather than a copy of it that could drift.
import { THEMES } from "../lib/theme.ts";
import { DEFAULT_THEME_ID } from "../lib/theme.ts";

function luminance(hex) {
  const h = hex.replace(/^#/, "");
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// 4.5 is WCAG AA for normal text. These colours sit behind real body copy and
// button labels, so AA is the right bar — not the 3.0 large-text one.
const MIN = 4.5;
let fail = 0;

console.log(`checked ${THEMES.length} themes against a ${MIN}:1 minimum\n`);
console.log(
  "theme".padEnd(14),
  "white/primary".padEnd(15),
  "white/secondary".padEnd(17),
  "primary/accent"
);

for (const t of THEMES) {
  const onPrimary = contrast(t.primary, "#FFFFFF");
  const onSecondary = contrast(t.secondary, "#FFFFFF");
  const onAccent = contrast(t.accent, t.primary);
  const ok = onPrimary >= MIN && onSecondary >= MIN && onAccent >= MIN;
  if (!ok) fail++;
  const f = (n) => n.toFixed(2).padStart(5) + (n >= MIN ? " " : "!");
  console.log(
    t.id.padEnd(14),
    f(onPrimary).padEnd(15),
    f(onSecondary).padEnd(17),
    f(onAccent),
    ok ? "" : "  <-- FAILS"
  );
}

// Ids must be unique, or getTheme() would silently shadow one.
const ids = THEMES.map((t) => t.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) { console.log(`\nDUPLICATE ids: ${dupes.join(", ")}`); fail++; }

// Every colour must be a 6-digit hex or the CSS variable would be invalid.
for (const t of THEMES) {
  for (const k of ["primary", "secondary", "accent"]) {
    if (!/^#[0-9a-fA-F]{6}$/.test(t[k])) {
      console.log(`\nBAD ${k} on ${t.id}: ${t[k]}`);
      fail++;
    }
  }
}

if (!ids.includes(DEFAULT_THEME_ID)) {
  console.log(`\nDEFAULT_THEME_ID "${DEFAULT_THEME_ID}" is not in THEMES`);
  fail++;
}

console.log(fail === 0 ? "\nALL PASS" : `\n${fail} problem(s)`);
process.exit(fail === 0 ? 0 : 1);
