/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brandPink: "#FFC9D8",
      },
    },
  },
  corePlugins: {
    backgroundOpacity: true,
  },
  plugins: [],
};
