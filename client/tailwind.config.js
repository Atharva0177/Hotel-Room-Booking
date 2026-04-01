/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        auburn: '#1a1410',
        gold: '#c9a96e',
        ivory: '#f5f0e8',
        burgundy: '#6b2737',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Jost', 'sans-serif'],
        accent: ['Cinzel', 'serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(201, 169, 110, 0.8), 0 8px 24px rgba(201, 169, 110, 0.2)',
      },
    },
  },
  plugins: [],
};
