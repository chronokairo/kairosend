import type { Config } from "tailwindcss";

/**
 * Tailwind tokens for the "Aureate Obsidian" design system.
 * Source of truth: aureate_obsidian/DESIGN.md (mirrors the tailwind.config
 * used inside the caixa_de_entrada_aureate / enviados_aureate / novo_e_mail_aureate
 * HTML mockups — do not diverge).
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-surface": "#e2e2e4",
        "surface-bright": "#37393b",
        "secondary-fixed-dim": "#c8c6c5",
        "on-tertiary-fixed-variant": "#474649",
        "on-secondary": "#313030",
        error: "#ffb4ab",
        "surface-tint": "#f6be39",
        "secondary-container": "#4a4949",
        "surface-container-lowest": "#0c0e10",
        "on-error-container": "#ffdad6",
        "primary-container": "#d4a017",
        "on-error": "#690005",
        "on-tertiary-fixed": "#1b1b1d",
        "on-secondary-fixed": "#1c1b1b",
        "on-primary-fixed-variant": "#5c4300",
        tertiary: "#c8c6c8",
        "surface-container-high": "#282a2c",
        "outline-variant": "#4f4634",
        "inverse-primary": "#795900",
        outline: "#9b8f7a",
        background: "#111415",
        "on-primary": "#402d00",
        "surface-container": "#1e2021",
        "on-primary-fixed": "#261a00",
        "primary-fixed-dim": "#f6be39",
        "primary-fixed": "#ffdfa0",
        "on-tertiary": "#303032",
        "error-container": "#93000a",
        "surface-variant": "#333537",
        "on-tertiary-container": "#3d3d3f",
        "tertiary-container": "#aaa8aa",
        "on-surface-variant": "#d3c5ae",
        "inverse-surface": "#e2e2e4",
        "surface-dim": "#111415",
        "tertiary-fixed": "#e4e2e4",
        "surface-container-highest": "#333537",
        "inverse-on-surface": "#2f3132",
        "surface-container-low": "#1a1c1d",
        "on-secondary-container": "#bab8b7",
        "on-primary-container": "#503a00",
        "on-secondary-fixed-variant": "#474646",
        surface: "#111415",
        "secondary-fixed": "#e5e2e1",
        primary: "#f6be39",
        "tertiary-fixed-dim": "#c8c6c8",
        secondary: "#c8c6c5",
        "on-background": "#e2e2e4",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        full: "9999px",
      },
      spacing: {
        "list-width": "380px",
        "stack-sm": "8px",
        "sidebar-width": "280px",
        "stack-md": "16px",
        "container-padding": "24px",
        unit: "4px",
        "stack-lg": "32px",
        gutter: "16px",
      },
      fontFamily: {
        display: ["var(--font-inter)", "Inter", "sans-serif"],
        "label-sm": ["var(--font-inter)", "Inter", "sans-serif"],
        "body-md": ["var(--font-inter)", "Inter", "sans-serif"],
        "headline-lg": ["var(--font-inter)", "Inter", "sans-serif"],
        "label-xs": ["var(--font-inter)", "Inter", "sans-serif"],
        "body-lg": ["var(--font-inter)", "Inter", "sans-serif"],
        "title-md": ["var(--font-inter)", "Inter", "sans-serif"],
        "headline-lg-mobile": ["var(--font-inter)", "Inter", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      fontSize: {
        display: ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "label-xs": ["11px", { lineHeight: "14px", fontWeight: "500" }],
        "body-lg": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "title-md": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
      },
      boxShadow: {
        // "soft glow" elevation — see DESIGN.md § Elevation & Depth
        glow: "0 8px 32px rgba(0,0,0,0.5)",
        gold: "0 8px 32px rgba(212,160,23,0.15)",
      },
      backgroundImage: {
        "atmosphere": "radial-gradient(60rem 60rem at 80% -10%, rgba(212,160,23,0.06), transparent 60%)",
      },
      transitionTimingFunction: {
        executive: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
