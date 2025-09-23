/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-brand-tan',
    'text-brand-brown',
  ],
  theme: {
    extend: {
      colors: {
        'brand-tan': '#F5F0E6',
        'brand-secondary-bg': '#EAE2D7',
        'brand-brown': '#5C4033',
        'brand-pink': '#D9C2BA',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'spin-slow': 'spin 10s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
};