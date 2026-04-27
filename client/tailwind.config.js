/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          50: "#eefdf8",
          100: "#d8faee",
          300: "#7ce7c2",
          500: "#10b981",
          700: "#047857",
          900: "#053729",
        },
        slateglass: "rgba(15, 23, 42, 0.72)",
      },
      boxShadow: {
        soft: "0 24px 60px rgba(15, 23, 42, 0.14)",
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(circle at 15% 20%, rgba(16, 185, 129, 0.18), transparent 28%), radial-gradient(circle at 85% 15%, rgba(59, 130, 246, 0.18), transparent 25%), radial-gradient(circle at 50% 85%, rgba(245, 158, 11, 0.16), transparent 30%)",
        "mesh-dark":
          "radial-gradient(circle at 15% 20%, rgba(16, 185, 129, 0.28), transparent 30%), radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.18), transparent 25%), radial-gradient(circle at 50% 85%, rgba(245, 158, 11, 0.18), transparent 30%)",
      },
    },
  },
  plugins: [],
};

