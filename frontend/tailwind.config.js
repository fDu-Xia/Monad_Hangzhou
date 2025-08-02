/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        monad: {
          purple: '#8A7CFF',
          blue: '#45B7D1',
          dark: '#0A0A1A',
          darker: '#050510',
          card: '#111122',
          border: '#2A2A3A',
          text: {
            primary: '#FFFFFF',
            secondary: '#AAAACC',
            muted: '#6C6C8A'
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'ambient-gradient': 'linear-gradient(to right bottom, #0A0A1A, #1A1A3A)',
        'monad-gradient': 'linear-gradient(to right, #8A7CFF, #45B7D1)',
        'card-gradient': 'linear-gradient(to bottom, #1A1A3A, #111122)'
      },
      boxShadow: {
        'neon': '0 0 10px rgba(138, 124, 255, 0.5)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}