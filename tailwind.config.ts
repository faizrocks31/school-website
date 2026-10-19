import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Brand colours (themeable) ───────────────────────────────────────
        // These read CSS custom properties set by the root layout from the
        // theme stored in SiteSettings, so Admin → Theme restyles the whole
        // site without a rebuild. The channel form ("23 59 101") is required
        // for Tailwind's opacity syntax, e.g. bg-secondary/30.
        // Defaults live in app/globals.css for the no-JS/first-paint case.
        primary: "rgb(var(--brand-primary) / <alpha-value>)",
        secondary: "rgb(var(--brand-secondary) / <alpha-value>)",
        accent: "rgb(var(--brand-accent) / <alpha-value>)",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        "text-main": "#1E293B",
        "text-muted": "#64748B",
        success: "#16A34A",
        error: "#DC2626",

        // ── Icon system tokens ──────────────────────────────────────────────
        // `ink`  = the strong accent colour (icon stroke, solid fills)
        // `tint` = the matching soft pastel wash (container background)
        // Consumed by components/ui/ModernIcon.tsx. Add a colour here and to
        // ModernIcon's lookup maps together, so classes stay statically
        // analysable by Tailwind's JIT.
        ink: {
          blue: "#1D4ED8",
          purple: "#6D28D9",
          green: "#15803D",
          orange: "#C2410C",
          pink: "#BE185D",
          red: "#DC2626",
          cyan: "#0E7490",
          yellow: "#CA8A04",
          slate: "#475569",
        },
        tint: {
          blue: "#DBEAFE",
          purple: "#EDE9FE",
          green: "#DCFCE7",
          orange: "#FFEDD5",
          pink: "#FCE7F3",
          red: "#FEE2E2",
          cyan: "#CFFAFE",
          yellow: "#FEF9C3",
          slate: "#F1F5F9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Outfit", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
    },
  },
  plugins: [],
};
export default config;
