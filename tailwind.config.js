/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#fdfcfb',
          100: '#f9f6f1',
          200: '#f3ede3',
          300: '#ebe0d0',
          400: '#dfc9af',
          500: '#d4b396',
          600: '#c19a77',
          700: '#a67d5e',
          800: '#8a6749',
          900: '#6f533a',
        },
        wood: {
          50: '#faf7f4',
          100: '#f2ebe3',
          200: '#e5d5c5',
          300: '#d4b9a0',
          400: '#c09a79',
          500: '#a97e5c',
          600: '#8b6747',
          700: '#6f5138',
          800: '#5a432f',
          900: '#4a3727',
        },
        charcoal: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#7a7a7a',
          500: '#5a5a5a',
          600: '#4a4a4a',
          700: '#3b3b3b',
          800: '#2d2d2d',
          900: '#1a1a1a',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
