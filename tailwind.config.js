/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'help-red': '#ef4444',
        'help-green': '#22c55e',
        'help-grey': '#9ca3af',
      }
    },
  },
  plugins: [],
}
