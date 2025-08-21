module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  darkMode: "class", // Enable dark mode using the 'class' strategy
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8))",
        "hero-gradient-dark":
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.9))",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: {
          DEFAULT: "#1E3A8A",
          light: "#3B82F6",
          dark: "#172554",
          darkMode: "#2A4EB5",
          customDark: "#1A1A2E",
        },
        secondary: {
          DEFAULT: "#F43F5E",
          light: "#FDA4AF",
          dark: "#BE185D",
          darkMode: "#FB7185",
        },
        accent: {
          cream: "#F8F4E9",
          creamDark: "#2D2D2D",
          charcoal: "#333333",
          charcoalDark: "#D1D5DB",
          teal: "#14B8A6",
          coral: "#F43F5E",
          green: "#10B981",
          red: "#FF444F",
        },
        white: "#ffffff",
        dark: "#000000",
        formClr: "#0d2042",
        formClrDark: "#1E3A8A",
      },
      screens: {
        xs: "400px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        mod: { max: "639px" },
        expcard: { max: "1066px" },
        minilg: { min: "899px" },
        maxlg: { max: "900px" },
        mid: { max: "767px" },
        Nlg: { max: "1023px" },
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        "montserrat-subrayada": ["Montserrat Subrayada", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "scale-up": {
          "0%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
        parallax: {
          "0%": { backgroundPosition: "center 0" },
          "100%": { backgroundPosition: "center 20%" },
        },
        "pulse-slow": {
          "0%": { opacity: 0.4 },
          "50%": { opacity: 0.6 },
          "100%": { opacity: 0.4 },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-up": "scale-up 0.2s ease-out",
        parallax: "parallax 2s ease-out",
        "pulse-slow": "pulse-slow 5s infinite", // Added pulse-slow animation
      },
      backgroundPosition: {
        "parallax-top": "center 0",
        "parallax-bottom": "center 20%",
      },
    },
  },
  variants: {
    extend: {
      transitionProperty: ["responsive", "hover", "focus"],
      translate: ["responsive", "hover", "focus"],
      backgroundPosition: ["responsive"],
    },
  },
  plugins: [require("flowbite/plugin")],
};
