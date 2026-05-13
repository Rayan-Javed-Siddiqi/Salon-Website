import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-error": "#690005",
        "inverse-primary": "#5f5e5e",
        "surface-dim": "#131411",
        "tertiary-container": "#2c1400",
        "background": "#131411",
        "surface-container-lowest": "#0e0e0c",
        "primary-container": "#1a1a1a",
        "secondary-container": "#931301",
        "tertiary-fixed-dim": "#ffb77b",
        "on-tertiary-fixed-variant": "#6d3a00",
        "on-secondary-container": "#ff9f8d",
        "surface-container": "#1f201d",
        "on-secondary-fixed-variant": "#8f1000",
        "surface": "#131411",
        "surface-tint": "#c8c6c5",
        "surface-variant": "#343532",
        "surface-bright": "#393936",
        "on-primary-container": "#848282",
        "primary-fixed": "#e5e2e1",
        "error": "#ffb4ab",
        "outline": "#8e9192",
        "surface-container-high": "#2a2a27",
        "secondary": "#ffb4a6",
        "on-primary": "#313030",
        "on-tertiary": "#4d2700",
        "tertiary-fixed": "#ffdcc2",
        "on-surface": "#e4e2dd",
        "primary-fixed-dim": "#c8c6c5",
        "secondary-fixed": "#ffdad3",
        "primary": "#c8c6c5",
        "on-primary-fixed-variant": "#474746",
        "on-secondary": "#660800",
        "on-surface-variant": "#c4c7c7",
        "outline-variant": "#444748",
        "tertiary": "#ffb77b",
        "surface-container-low": "#1b1c19",
        "on-error-container": "#ffdad6",
        "on-tertiary-container": "#b87333",
        "on-secondary-fixed": "#3f0300",
        "on-background": "#e4e2dd",
        "inverse-on-surface": "#30312e",
        "on-primary-fixed": "#1c1b1b",
        "inverse-surface": "#e4e2dd",
        "error-container": "#93000a",
        "on-tertiary-fixed": "#2e1500",
        "surface-container-highest": "#343532",
        "secondary-fixed-dim": "#ffb4a6"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-mobile": "24px",
        "unit": "8px",
        "margin-desktop": "80px",
        "section-gap": "120px",
        "gutter": "32px"
      },
      fontFamily: {
        "label-caps": ["var(--font-hanken)"],
        "utility": ["var(--font-hanken)"],
        "display-lg": ["var(--font-abril)"],
        "body-lg": ["var(--font-hanken)"],
        "headline-lg-mobile": ["var(--font-abril)"],
        "headline-md": ["var(--font-abril)"],
        "headline-lg": ["var(--font-abril)"],
        "body-md": ["var(--font-hanken)"]
      },
      fontSize: {
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "700" }],
        "utility": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "display-lg": ["84px", { lineHeight: "90px", letterSpacing: "-0.02em", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-lg-mobile": ["36px", { lineHeight: "42px", fontWeight: "400" }],
        "headline-md": ["32px", { lineHeight: "40px", fontWeight: "400" }],
        "headline-lg": ["48px", { lineHeight: "56px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }]
      }
    },
  },
  plugins: [],
};
export default config;
