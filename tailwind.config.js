/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
        navy: '#1B2A4A',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["corporate"],
  },
}

