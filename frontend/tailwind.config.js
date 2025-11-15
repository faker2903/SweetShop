/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: '#4F46E5', // Indigo - friendly premium primary
        accent: '#F59E0B', // Amber - warm accent
        neutral: {
          50: '#FAFAFA', // Light neutral
          100: '#F4F4F5',
          200: '#E4E4E7', // Medium neutral
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46', // Dark neutral
          800: '#27272A',
          900: '#18181B',
        },
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        'h2': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        'h3': ['1.5rem', { lineHeight: '2rem' }], // 24px
        'body': ['1rem', { lineHeight: '1.5rem' }], // 16px
        'small': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
      },
      boxShadow: {
        'neumorphism': '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff',
        'neumorphism-hover': '12px 12px 24px #d1d5db, -12px -12px 24px #ffffff',
      },
    },
  },
  plugins: [],
};
