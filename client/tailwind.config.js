/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.1)",
        background: "#0b0f19",
        foreground: "#f8fafc",
        card: {
          DEFAULT: "#131a2c",
          foreground: "#f8fafc"
        },
        primary: {
          DEFAULT: "#10b981", // Emerald
          hover: "#059669",
          foreground: "#ffffff"
        },
        secondary: {
          DEFAULT: "#3b82f6", // Indigo/Blue
          hover: "#2563eb",
          foreground: "#ffffff"
        },
        accent: {
          DEFAULT: "#f59e0b", // Amber/Gold warning
          foreground: "#000000"
        },
        muted: {
          DEFAULT: "#1e293b",
          foreground: "#94a3b8"
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff"
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem"
      }
    },
  },
  plugins: [],
}
