/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0A0A0F",
        surface: "#101018",
        elevated: "#16161F",
        brand: {
          DEFAULT: "#7C5CFF",
          400: "#9B85FF",
          600: "#6242E0",
        },
        cyanx: "#22D3EE",
        contrib: {
          0: "#161b22",
          1: "#0e4429",
          2: "#006d32",
          3: "#26a641",
          4: "#39d353",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(124,92,255,0.18), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(124,92,255,0.45)",
        glass: "0 8px 32px rgba(0,0,0,0.45)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
