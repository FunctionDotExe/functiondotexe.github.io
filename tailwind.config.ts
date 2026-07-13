import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0E0D0B",
        surface: "#161410",
        gold: "#C9A84C",
        "gold-dim": "#8A6E2F",
        cream: "#F2EBD9",
        muted: "#7A7060",
        rule: "#2A2520",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        body: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      spacing: {
        gutter: "clamp(1.25rem, 4vw, 4.5rem)",
        rail: "clamp(1.5rem, 7vw, 8rem)",
        section: "clamp(6rem, 13vw, 14rem)",
      },
      transitionTimingFunction: {
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-out": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      boxShadow: {
        hairline: "inset 0 0 0 1px rgba(21, 20, 18, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
