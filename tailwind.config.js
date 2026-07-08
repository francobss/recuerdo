/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#FFFBFD",
          100: "#F8F8F8",
          200: "#F7D6E6",
          300: "#F4AFC8",
          400: "#EC8FB4",
        },
        ink: "#1F1F1F",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Poppins'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(244, 175, 200, 0.35)",
        card: "0 8px 30px -12px rgba(31, 31, 31, 0.12)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out both",
        floaty: "floaty 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
