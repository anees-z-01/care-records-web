/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f6f3ec",
        ink: "#1d2b28",
        muted: "#56625d",
        line: "#ddd5c6",
        pine: {
          50: "#eef4f1",
          100: "#d7e6df",
          500: "#3f8370",
          600: "#2f6b5a",
          700: "#25574a",
          800: "#1c443a",
        },
        clay: {
          50: "#fbf0ea",
          600: "#a4471f",
          700: "#8a3a18",
        },
      },
      fontFamily: {
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', "Palatino", "Georgia", "serif"],
        sans: ["system-ui", '"Segoe UI"', '"Helvetica Neue"', "Arial", "sans-serif"],
        mono: ["ui-monospace", '"SFMono-Regular"', "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
}
