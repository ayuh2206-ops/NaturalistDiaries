/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nat-black': '#050706',
        'nat-forest': '#1A2F25',
        'nat-paper': '#E3D5CA',
        'nat-sage': '#88998C',
        'nat-biolum': '#D4F4DD',
        'nat-amber': '#C9A227',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-satoshi)', 'sans-serif'],
        mono: ['var(--font-cinzel)', 'serif'],
      },
    },
  },
  plugins: [],
}
