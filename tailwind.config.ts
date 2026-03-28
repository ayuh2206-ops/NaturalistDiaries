import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
        serif: ['Playfair Display', 'serif'],
        sans: ['Satoshi', 'sans-serif'],
        mono: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
