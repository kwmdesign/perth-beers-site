/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.njk", "./src/**/*.html"],
  theme: {
    extend: {
      colors: {
        roast: { DEFAULT: '#0D0D0D', light: '#1A1A1A', dim: '#2A2A2A' },
        sand:  { DEFAULT: '#F5F0E6', dim: '#E8DFC8' },
        rust:  { 500: '#E4223D', 600: '#C01C33' }
      },
      fontFamily: {
        display: ['"General Sans"', 'sans-serif'],
        text: ['"General Sans"', 'sans-serif'],
        body: ['Excon', 'sans-serif']
      }
    }
  },
  plugins: []
}
