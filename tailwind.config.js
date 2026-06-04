/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ecar: {
          blue: "#15803D",     // Verde esmeralda corporativo
          blueDark: "#14532D", // Verde pino oscuro para el sidebar
          red: "#EF4444",
          redLight: "#FEE2E2",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
