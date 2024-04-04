/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blueColor: "#00579b",
        basic: "#00579b",
        greyIsh: "#f1f8f9",
      },
    },
  },
  plugins: [],
};
