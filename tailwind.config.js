/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a1bafd',
          400: '#6d91fb',
          500: '#4666f7',
          600: '#3047eb',
          700: '#2635d8',
          800: '#242db0',
          900: '#222a8c',
          950: '#151854',
        },
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
}
