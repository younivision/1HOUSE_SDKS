/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins-Regular'],
        'sans-medium': ['Poppins-Medium'],
        'sans-semibold': ['Poppins-SemiBold'],
        display: ['InterDisplay-SemiBold'],
      },
    },
  },
  plugins: [],
};

