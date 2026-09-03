/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#04060f',
          900: '#070b1a',
          800: '#0b1226',
          700: '#111a36',
        },
        crystal: {
          300: '#c9b8ff',
          400: '#b49bff',
          500: '#9d7cff',
        },
        aurora: {
          300: '#a9d8ff',
          400: '#7fc0ff',
        },
        gold: {
          200: '#f3e4b8',
          300: '#e9d39a',
        },
      },
      fontFamily: {
        display: ['"Cinzel"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.42em',
        wide2: '0.28em',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
