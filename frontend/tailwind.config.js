/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js"
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#121212",
        darkPrimary: "#1E1E1E",
        darkSecondary: "#272727",
        darkAccent: "#3B82F6", 
      },
      fontFamily: {
        whitrabt: ["Whitrabt", "sans-serif"],
      },
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
}

