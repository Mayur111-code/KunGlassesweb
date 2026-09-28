import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f3f6fb',
          100: '#e3eaf5',
          200: '#c6d4ea',
          300: '#9ab3d9',
          400: '#6789c3',
          500: '#4569ac',
          600: '#345390',
          700: '#2c4374',
          800: '#24355a',
          900: '#17233c',
          950: '#0e1627',
        },
        brand: {
          orange: '#F07818',
          light: '#ff9240',
          dark: '#d9630e',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -6px rgba(14, 22, 39, 0.12)',
        'card-hover': '0 12px 40px -8px rgba(14, 22, 39, 0.22)',
        glow: '0 0 0 1px rgba(240, 120, 24, 0.12), 0 8px 32px -8px rgba(240, 120, 24, 0.4)',
        'inner-glow': 'inset 0 1px 2px rgba(14, 22, 39, 0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'marquee-slow': 'marquee 45s linear infinite',
        'reveal-line': 'revealLine 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        revealLine: {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
