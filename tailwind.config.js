/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,css}'],
  darkMode: 'media', // matches the notebook's prefers-color-scheme + data-theme override in main.css
  theme: {
    extend: {},
  },
  plugins: [],
};
