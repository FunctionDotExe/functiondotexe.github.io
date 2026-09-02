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
        bg: "#171139",
        surface: "#24184f",
        violet: "#5547b5",
        blue: "#347fc8",
        cyan: "#54cce7",
        peach: "#f4aaa8",
        sun: "#ffe2a7",
        coral: "#ff6679",
        cream: "#fff4db",
      },
      fontFamily: {
        display: ["Avenir Next", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
        body: ["Avenir Next", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
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
