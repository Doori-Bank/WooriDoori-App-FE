/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        ongleip: ["OngleipRyudung", "sans-serif"],
        nanosanskr: ["nanosanskr", "sans-serif"],
      },
    },
  },
  plugins: [],
};
