/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Keep dark mode setting if it exists
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}", // Updated to include necessary file types
    "./public/index.html",
  ],
  theme: {
    container: { // Keep container settings if they exist
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Colors defined using CSS Variables from :root
        'primary-blue': 'var(--primary-blue)',
        'neutral-light': 'var(--neutral-light)',
        'neutral-medium': 'var(--neutral-medium)',
        'neutral-dark': 'var(--neutral-dark)',
        'neutral-border': 'var(--neutral-border)',
        'accent-green': 'var(--accent-green)',
        'accent-teal': 'var(--accent-teal)',
        'error-red': 'var(--error-red)',

        // Keep existing HSL theme colors for compatibility (e.g., with shadcn/ui)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Keep other specific colors if needed
        'primary-orange': '#FF9800',
        'accent-blue': '#0288D1', // Note: Different from --primary-blue
        'cta-pink': '#D81B60',
        'background-gray': '#F5F5F5',
        'text-dark': '#212121',
        'gray-950': '#0F172A',
        'gray-800': '#1E293B',
        'gray-600': '#4B5563',
        'gray-300': '#D1D5DB',
        'cobalt-blue': '#0047AB', // Note: Different from --primary-blue
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Keep existing font setup
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: { // Keep existing border radius setup
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: { // Keep existing keyframes
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: { // Keep existing animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Keep existing plugins
}
