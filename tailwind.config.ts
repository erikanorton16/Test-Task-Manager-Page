import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        linen: "#faf7f1",
        parchment: "#f3ede1",
        ink: "#1f2a37",
        slate: {
          850: "#1c2531",
        },
        navy: {
          50: "#eef1f5",
          100: "#dde3ec",
          200: "#b7c3d6",
          300: "#8fa1bd",
          400: "#5f7398",
          500: "#3d5372",
          600: "#2c3f58",
          700: "#233348",
          800: "#1a2635",
          900: "#121a25",
        },
        gold: {
          50: "#fbf6ea",
          100: "#f3e6c2",
          200: "#e8d29a",
          300: "#dcbd72",
          400: "#cea94e",
          500: "#b8903a",
          600: "#93712c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(18, 26, 37, 0.04), 0 8px 24px -8px rgba(18, 26, 37, 0.12)",
        lift: "0 12px 32px -12px rgba(18, 26, 37, 0.22)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
