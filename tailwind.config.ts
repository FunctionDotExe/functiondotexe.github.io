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
        seal: "rgb(23 21 17 / <alpha-value>)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "EB Garamond", "Georgia", "serif"],
        serif: ["EB Garamond", "Georgia", "serif"],
        script: ["Great Vibes", "cursive"],
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
      animation: {
        "ink-spread": "ink-spread 1.2s ease-luxury forwards",
        "paper-unroll": "paper-unroll 2s ease-luxury forwards",
        "archival-reveal": "archival-reveal 1.8s ease-luxury forwards",
        "grain-drift": "grain-drift 8s linear infinite",
        "vignette-pulse": "vignette-pulse 6s ease-in-out infinite",
        "ink-bleed": "ink-bleed 2s ease-luxury infinite",
        "handwritten-underline": "handwritten-underline 1.5s ease-luxury forwards",
        "float-pages": "float-pages 4s ease-in-out infinite",
        "seal-glow": "seal-glow 3s ease-in-out infinite",
        "scroll-depth": "scroll-depth 0.8s ease-luxury forwards",
      },
      boxShadow: {
        hairline: "inset 0 0 0 1px rgba(21, 20, 18, 0.1)",
        paper: "0 2rem 5rem rgba(55, 42, 25, 0.18)",
        "paper-deep": "0 3rem 7rem rgba(55, 42, 25, 0.24)",
        "paper-light": "0 1rem 2rem rgba(55, 42, 25, 0.12)",
        "ink-soft": "0 0.5rem 1rem rgba(81, 73, 61, 0.16)",
        seal: "0 0.8rem 1.6rem rgba(54, 19, 10, 0.25), inset 0 0 0 0.28rem rgba(93, 5, 8, 0.2)",
      },
      backdropBlur: {
        subtle: "2px",
        soft: "4px",
        warm: "6px",
      },
      backgroundImage: {
        "grain-subtle": "url('data:image/svg+xml,%3Csvg viewBox=%270 0 220 220%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27paper%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.62%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3CfeColorMatrix type=%27saturate%27 values=%270%27/%3E%3C/filter%3E%3Crect width=%27220%27 height=%27220%27 filter=%27url(%23paper)%27 opacity=%27.28%27/%3E%3C/svg%3E')",
        "paper-texture": "url('data:image/svg+xml,%3Csvg viewBox=%270 0 300 300%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27linen%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.8%27 numOctaves=%273%27 result=%27noise%27/%3E%3C/filter%3E%3Crect width=%27300%27 height=%27300%27 fill=%27%23f5f0e6%27 filter=%27url(%23linen)%27/%3E%3C/svg%3E')",
        "vignette-radial": "radial-gradient(ellipse at center, transparent 52%, rgba(64, 45, 25, 0.2) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
