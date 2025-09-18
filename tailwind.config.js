/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./static/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'kerala-green': '#2D5016',
        'kerala-gold': '#D4AF37',
        'kerala-blue': '#1E3A8A',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
