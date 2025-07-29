import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          burgundy: "rgb(var(--color-primary-burgundy))",
          charcoal: "rgb(var(--color-primary-charcoal))",
        },
        secondary: {
          "warm-gray": "rgb(var(--color-secondary-warm-gray))",
          "light-warm-gray": "rgb(var(--color-secondary-light-warm-gray))",
          "cream-white": "rgb(var(--color-secondary-cream-white))",
        },
        accent: {
          "trust-blue": "rgb(var(--color-accent-trust-blue))",
          "success-green": "rgb(var(--color-accent-success-green))",
          "alert-gold": "rgb(var(--color-accent-alert-gold))",
        },
        functional: {
          "error-red": "rgb(var(--color-functional-error-red))",
          "info-blue": "rgb(var(--color-functional-info-blue))",
          "warning-orange": "rgb(var(--color-functional-warning-orange))",
          "disabled-gray": "rgb(var(--color-functional-disabled-gray))",
        },
        background: {
          white: "rgb(var(--color-background-white))",
          light: "rgb(var(--color-background-light))",
          dark: "rgb(var(--color-background-dark))",
        },
        text: {
          primary: "rgb(var(--color-text-primary))",
          secondary: "rgb(var(--color-text-secondary))",
          inverse: "rgb(var(--color-text-inverse))",
        },
        // Dark mode variants
        dark: {
          burgundy: "rgb(var(--color-primary-burgundy))",
          surface: "rgb(var(--color-primary-charcoal))",
          background: "rgb(var(--color-background-dark))",
        },
      },
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        playfair: ["var(--font-playfair)", "Playfair Display", "serif"],
        skolar: ["Skolar Latin", "Merriweather", "serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["Skolar Latin", "Merriweather", "serif"],
      },
      fontSize: {
        // Typography scale matching style guide
        "h1": ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "h2": ["2rem", { lineHeight: "1.3", fontWeight: "600" }],
        "h3": ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        "h4": ["1.25rem", { lineHeight: "1.4", fontWeight: "500" }],
        "body": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "button": ["1rem", { lineHeight: "1", fontWeight: "500" }],
        "label": ["0.875rem", { lineHeight: "1.2", fontWeight: "500" }],
      },
      borderRadius: {
        button: "6px",
        card: "8px",
        input: "6px",
      },
      spacing: {
        button: "52px", // Button height
        input: "48px", // Input height
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 4px 16px rgba(0, 0, 0, 0.15)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
