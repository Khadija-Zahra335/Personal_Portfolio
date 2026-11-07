/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // The reference uses exactly two surfaces and four text tints.
        dark: "var(--dark)",
        light: "var(--light)",
        "on-dark": "var(--on-dark)",
        "on-dark-muted": "var(--on-dark-muted)",
        "on-dark-dim": "var(--on-dark-dim)",
        "on-light": "var(--on-light)",
        "on-light-muted": "var(--on-light-muted)",
      },
      fontFamily: {
        sans: ["var(--font-mona)", "system-ui", "sans-serif"],
        urdu: ["var(--font-urdu)", "serif"],
      },
      transitionTimingFunction: {
        ref: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
