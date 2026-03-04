/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16a34a",
        secondary: "#15803d",
        accent: "#bbf7d0",
      },
    },
  },
  plugins: [],
}