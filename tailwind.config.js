/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Manrope: ['"Manrope"'],
      }
      ,
      screens: {
        '3xl': '1600px',
        
      },
    },
  },
  plugins: [],
};
