/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        blink: 'blink 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}

