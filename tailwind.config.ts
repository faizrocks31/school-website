import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#173B65",
        secondary: "#2563EB",
        accent: "#F4B942",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        "text-main": "#1E293B",
        "text-muted": "#64748B",
        success: "#16A34A",
        error: "#DC2626",
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
