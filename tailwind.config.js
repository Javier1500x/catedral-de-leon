/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          950: '#0c0a09',
        },
        azure: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        cathedral: {
          dark:    '#090d16',
          deeper:  '#0f172a',
          stone:   '#1e293b',
          warm:    '#334155',
          accent:  '#2563eb',
          'accent-light': '#60a5fa',
          'accent-pale':  '#dbeafe',
          parchment: '#f8fafc',
          cream:   '#ffffff',
        }
      },
      fontFamily: {
        serif:  ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans:   ['Inter', 'system-ui', 'sans-serif'],
        latin:  ['IM Fell English', 'serif'],
      },
      animation: {
        'spin-slow':    'spin 20s linear infinite',
        'fade-up':      'fadeUp 1s ease forwards',
        'accent-shimmer': 'accentShimmer 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        accentShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
