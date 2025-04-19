/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#FF9800',
        'accent-blue': '#0288D1',
        'cta-pink': '#D81B60',
        'background-gray': '#F5F5F5',
        'text-dark': '#212121',
        'gray-950': '#0F172A',
        'gray-800': '#1E293B',
        'gray-600': '#4B5563',
        'gray-300': '#D1D5DB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
