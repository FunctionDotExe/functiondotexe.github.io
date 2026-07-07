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
        paper: "rgb(238 229 209 / <alpha-value>)",
        "paper-deep": "rgb(213 197 169 / <alpha-value>)",
        "paper-warm": "rgb(246 238 219 / <alpha-value>)",
        ink: "rgb(23 21 17 / <alpha-value>)",
        "ink-soft": "rgb(87 80 68 / <alpha-value>)",
        charcoal: "rgb(5 8 10 / <alpha-value>)",
        forest: "rgb(17 23 18 / <alpha-value>)",
        "forest-deep": "rgb(7 11 8 / <alpha-value>)",
        gold: "rgb(185 150 84 / <alpha-value>)",
        "gold-light": "rgb(217 193 132 / <alpha-value>)",
        oxblood: "rgb(139 42 34 / <alpha-value>)",
        teal: "rgb(112 168 162 / <alpha-value>)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "EB Garamond", "Georgia", "serif"],
        serif: ["EB Garamond", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      spacing: {
        gutter: "clamp(1.15rem, 4.2vw, 5.5rem)",
        rail: "clamp(1.5rem, 7vw, 8rem)",
        section: "clamp(5.5rem, 10vw, 11rem)",
      },
      fontSize: {
        xs: "0.68rem",
        sm: "0.76rem",
        base: "1.06rem",
        lg: "1.24rem",
        xl: "1.48rem",
        "2xl": "1.78rem",
        "3xl": "2.14rem",
        "4xl": "3.6rem",
        "5xl": "clamp(3.6rem, 8.4vw, 9.2rem)",
      },
      transitionTimingFunction: {
        "ease-luxury": "cubic-bezier(0.19, 1, 0.22, 1)",
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-out": "cubic-bezier(0.87, 0, 0.13, 1)",
        "ease-subtle": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "aurora-a": {
          "0%, 100%": { transform: "translate3d(-6%, -4%, 0) scale(1)" },
          "50%": { transform: "translate3d(7%, 6%, 0) scale(1.12)" },
        },
        "aurora-b": {
          "0%, 100%": { transform: "translate3d(5%, 3%, 0) scale(1.08)" },
          "50%": { transform: "translate3d(-6%, -5%, 0) scale(1)" },
        },
        "border-spin": {
          from: { transform: "translate(-50%, -50%) rotate(0deg)" },
          to: { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "aurora-a": "aurora-a 16s ease-in-out infinite",
        "aurora-b": "aurora-b 19s ease-in-out infinite",
        "border-spin": "border-spin 9s linear infinite",
        marquee: "marquee 32s linear infinite",
      },
      backdropBlur: {
        subtle: "2px",
        soft: "4px",
        warm: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
