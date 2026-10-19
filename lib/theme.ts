/**
 * Site-wide colour themes.
 *
 * A theme sets only the three brand colours; everything else in the UI is
 * neutral or derived from them. The values are written to CSS custom
 * properties on :root by the root layout, and tailwind.config.ts reads those
 * variables — so changing the stored theme restyles the whole site with no
 * rebuild and no redeploy.
 *
 * To add a theme, add an entry here; it shows up in Admin → Theme
 * automatically. Three contrast rules must hold, because these colours are
 * used with a fixed partner text colour (see scripts/check-theme-contrast.mjs,
 * which asserts all of them):
 *
 *   1. `primary`   — carries WHITE text (header, buttons). Keep it dark.
 *   2. `secondary` — ends the `from-primary to-secondary` gradients, which
 *                    also carry white text. Keep it dark too.
 *   3. `accent`    — carries `text-primary` (dark) text, so it must stay light
 *                    AND contrast with that theme's own primary.
 */

export interface Theme {
  id: string;
  label: string;
  /** Header, primary buttons, headings. Must be dark enough for white text. */
  primary: string;
  /** Links, focus rings, gradient end. Must also take white text. */
  secondary: string;
  /** Call-to-action fill. Must be light enough for dark text. */
  accent: string;
  note: string;
}

export const THEMES: readonly Theme[] = [
  // ── The original set ────────────────────────────────────────────────
  {
    id: "classic",
    label: "Classic Navy",
    primary: "#173B65",
    secondary: "#2563EB",
    accent: "#F4B942",
    note: "The original school colours.",
  },
  {
    id: "emerald",
    label: "Emerald",
    primary: "#065F46",
    secondary: "#047857",
    accent: "#FCD34D",
    note: "Green and gold — calm and academic.",
  },
  {
    id: "royal",
    label: "Royal Purple",
    primary: "#4C1D95",
    secondary: "#6D28D9",
    accent: "#F9A8D4",
    note: "Purple with a soft pink accent.",
  },
  {
    id: "crimson",
    label: "Crimson",
    primary: "#7F1D1D",
    secondary: "#B91C1C",
    accent: "#FDBA74",
    note: "Deep red — bold and traditional.",
  },
  {
    id: "teal",
    label: "Ocean Teal",
    primary: "#134E4A",
    secondary: "#0F766E",
    accent: "#FDBA74",
    note: "Teal with a warm sand accent.",
  },
  {
    id: "graphite",
    label: "Graphite",
    primary: "#1E293B",
    secondary: "#475569",
    accent: "#7DD3FC",
    note: "Neutral and understated.",
  },

  // ── Reds, maroons and warm earths ───────────────────────────────────
  {
    id: "maroon",
    label: "Maroon",
    primary: "#6B1220",
    secondary: "#9F1239",
    accent: "#F5C99B",
    note: "Deep maroon with a warm cream accent.",
  },
  {
    id: "burgundy",
    label: "Burgundy",
    primary: "#5B0E2D",
    secondary: "#881337",
    accent: "#F4C2C2",
    note: "Rich wine red — formal and stately.",
  },
  {
    id: "saffron",
    label: "Saffron",
    primary: "#7C2D12",
    secondary: "#92400E",
    accent: "#FDE68A",
    note: "Saffron and gold — festive and bright.",
  },
  {
    id: "copper",
    label: "Copper",
    primary: "#6C2710",
    secondary: "#92400E",
    accent: "#FED7AA",
    note: "Warm copper tones.",
  },
  {
    id: "terracotta",
    label: "Terracotta",
    primary: "#7F3B22",
    secondary: "#A8552F",
    accent: "#F7D9C4",
    note: "Earthy clay — grounded and friendly.",
  },

  // ── Pinks, plums and purples ────────────────────────────────────────
  {
    id: "rose",
    label: "Rose",
    primary: "#881337",
    secondary: "#BE123C",
    accent: "#FECDD3",
    note: "Deep rose with a blush accent.",
  },
  {
    id: "plum",
    label: "Plum",
    primary: "#581C87",
    secondary: "#7E22CE",
    accent: "#F5D0FE",
    note: "Plum with a lilac accent.",
  },
  {
    id: "magenta",
    label: "Magenta",
    primary: "#701A45",
    secondary: "#A21CAF",
    accent: "#F5D0FE",
    note: "Bold magenta — modern and lively.",
  },
  {
    id: "orchid",
    label: "Orchid",
    primary: "#6B2158",
    secondary: "#A21CAF",
    accent: "#FBCFE8",
    note: "Orchid pink and deep purple.",
  },

  // ── Blues and indigos ───────────────────────────────────────────────
  {
    id: "cobalt",
    label: "Cobalt",
    primary: "#1E3A8A",
    secondary: "#2563EB",
    accent: "#BFDBFE",
    note: "Bright academic blue.",
  },
  {
    id: "indigo",
    label: "Indigo",
    primary: "#312E81",
    secondary: "#4F46E5",
    accent: "#A5B4FC",
    note: "Deep indigo — focused and calm.",
  },
  {
    id: "sky",
    label: "Sky",
    primary: "#0C4A6E",
    secondary: "#0369A1",
    accent: "#BAE6FD",
    note: "Open sky blue with a pale accent.",
  },
  {
    id: "steel",
    label: "Steel Blue",
    primary: "#334155",
    secondary: "#475569",
    accent: "#CBD5E1",
    note: "Cool and professional.",
  },

  // ── Teals, greens and naturals ──────────────────────────────────────
  {
    id: "forest",
    label: "Forest",
    primary: "#14532D",
    secondary: "#166534",
    accent: "#BBF7D0",
    note: "Deep forest green.",
  },
  {
    id: "jade",
    label: "Jade",
    primary: "#064E3B",
    secondary: "#047857",
    accent: "#A7F3D0",
    note: "Jade green with a mint accent.",
  },
  {
    id: "turquoise",
    label: "Turquoise",
    primary: "#115E59",
    secondary: "#0F766E",
    accent: "#99F6E4",
    note: "Fresh turquoise — light and airy.",
  },
  {
    id: "olive",
    label: "Olive",
    primary: "#3F4A1E",
    secondary: "#3F6212",
    accent: "#D9F99D",
    note: "Olive and lime — natural and warm.",
  },

  // ── Neutrals ────────────────────────────────────────────────────────
  {
    id: "charcoal",
    label: "Charcoal",
    primary: "#1C1C1E",
    secondary: "#3F3F46",
    accent: "#D4D4D8",
    note: "Almost black — minimal and serious.",
  },
  {
    id: "espresso",
    label: "Espresso",
    primary: "#3B2A20",
    secondary: "#6B4A34",
    accent: "#E7D3C0",
    note: "Warm brown neutral.",
  },
] as const;

export const THEME_IDS: readonly string[] = THEMES.map((t) => t.id);

export const DEFAULT_THEME_ID = "classic";

/** Resolves a stored theme id, falling back to the default for unknown values. */
export function getTheme(id?: string | null): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

/** True when `id` names a real theme. */
export function isThemeId(id: string): boolean {
  return THEME_IDS.includes(id);
}

/**
 * "#173B65" -> "23 59 101" (space-separated RGB channels).
 * That form is what Tailwind needs for `rgb(var(--x) / <alpha-value>)`, so
 * opacity modifiers such as `bg-secondary/30` keep working.
 */
export function hexToRgbTriplet(hex: string): string {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    // Never emit a broken value — an invalid colour would blank the whole theme.
    h = "173B65";
  }
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** The :root custom properties for a theme, ready to inline into a <style>. */
export function themeCssVars(theme: Theme): string {
  return [
    `--brand-primary:${hexToRgbTriplet(theme.primary)}`,
    `--brand-secondary:${hexToRgbTriplet(theme.secondary)}`,
    `--brand-accent:${hexToRgbTriplet(theme.accent)}`,
  ].join(";");
}
