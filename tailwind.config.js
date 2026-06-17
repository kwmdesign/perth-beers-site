/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        roast: { DEFAULT: '#1B1A18', light: '#26221F', dim: '#332D27' },
        sand:  { DEFAULT: '#F7F3EC', dim: '#ECE4D3' },
        rust:  { 500: '#A8542E', 600: '#8B3F22' }
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
