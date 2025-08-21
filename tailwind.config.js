// tailwind.config.js

module.exports = {
  // ...your other config
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 10s linear infinite', // Slower spin animation
      },
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};