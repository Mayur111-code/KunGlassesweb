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
          background: 'var(--color-background)',
          surface: 'var(--color-surface)',
          border: 'var(--color-border)',
          text: {
            primary: 'var(--color-text-primary)',
            secondary: 'var(--color-text-secondary)',
          },
          accent: 'var(--color-accent)',
          sage: 'var(--color-accent-sage)',
          'dark-contrast': 'var(--color-dark-contrast)',
          navy: {
            50: '#f9f9f8',
            100: '#f1f1ef',
            200: '#e7e6e2',
            300: '#d9d5ce',
            400: '#c7c1b6',
            500: '#b8b0a2',
            600: '#a8a091',
            700: '#908a7c',
            800: '#787367',
            900: '#615e54',
            950: '#1f1f1f',
          },
          brand: {
            orange: '#b08d57',
            light: '#c5a26a',
            dark: '#9a7a4a',
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
