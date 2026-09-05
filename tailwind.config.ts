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
        background: "#08090D",
        surface: {
          DEFAULT: "#0E121D",
          hover: "#141A29",
          card: "rgba(18, 23, 37, 0.65)",
          elevated: "#182033",
        },
        primary: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1D4ED8",
        },
        slate: {
          950: "#08090D",
        }
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        glow: "0 0 24px -4px rgba(37, 99, 235, 0.35)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 3s infinite ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
