/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lakers: {
          purple: '#552583',
          purpleDark: '#3d1a63',
          gold: '#FDB927',
          goldDark: '#e8a61b',
        },
      },
    },
  },
  plugins: [],
};
