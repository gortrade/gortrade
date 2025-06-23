import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#0C0C0F",
        foreground: "#F2F2F2",
        primary: {
          DEFAULT: "#00FF88",
          foreground: "#0C0C0F",
        },
        secondary: {
          DEFAULT: "#16161A",
          foreground: "#F2F2F2",
        },
        destructive: {
          DEFAULT: "#FF4D4D",
          foreground: "#F2F2F2",
        },
        muted: {
          DEFAULT: "#16161A",
          foreground: "#999999",
        },
        accent: {
          DEFAULT: "#00FF88",
          foreground: "#0C0C0F",
        },
        popover: {
          DEFAULT: "#16161A",
          foreground: "#F2F2F2",
        },
        card: {
          DEFAULT: "#16161A",
          foreground: "#F2F2F2",
        },
        // Custom GorTrade colors
        "gor-accent": "#00FF88",
        "gor-bg": "#0C0C0F",
        "gor-surface": "#16161A",
        "gor-text": "#F2F2F2",
        "gor-muted": "#999999",
        "gor-error": "#FF4D4D",
        "gor-teal": "#1DF5C3",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px #00FF88" },
          "50%": { boxShadow: "0 0 20px #00FF88, 0 0 30px #00FF88" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
