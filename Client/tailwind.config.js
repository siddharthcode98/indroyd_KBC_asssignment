/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "KBC-Background-Image": "url('./src/assets/kbc_image.jpg')",
      },
      colors: {
        "kbc-color1": "#381F57",
        "kbc-color2": "#2B153E",
      },
    },
  },
  plugins: [],
};
