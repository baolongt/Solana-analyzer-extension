/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/flowbite-react/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        body: ['DM Sans ', 'sans-serif'],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
