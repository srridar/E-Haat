/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-green)",
        secondary: "var(--secondary-orange)",
        accent: "var(--accent-yellow)",
        background: "var(--background-light)",
        dark: "var(--text-dark)",
        graytext: "var(--text-gray)",
      },
    },
  },
  plugins: [],
};
