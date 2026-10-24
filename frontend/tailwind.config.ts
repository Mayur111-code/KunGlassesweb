import type { Config } from 'tailwindcss';

/**
 * KUN design tokens.
 *
 * The palette is intentionally architectural: warm stone paper, charcoal ink,
 * a bronze accent used sparingly, and muted sage as a secondary note.
 * `navy` / `brand` remain as compatibility aliases for the admin CMS, which
 * still references those utility names.
 */
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
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
        },
        border: 'var(--color-border)',
        line: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        accent: 'var(--color-accent)',
        sage: {
          50: '#F4F6F3',
          100: '#E7EAE5',
          200: '#D2D8D0',
          300: '#B6BEB3',
          400: '#9AA39A',
          500: '#838D83',
          600: '#6B756B',
          700: '#545C54',
          DEFAULT: '#9AA39A',
        },
        bronze: {
          50: '#FBF7F0',
          100: '#F4EBDD',
          200: '#E7D6B9',
          300: '#D9BD8E',
          400: '#C5A26A',
          500: '#B08D57',
          600: '#96753F',
          700: '#795E33',
          800: '#5C4728',
          900: '#3F311C',
          DEFAULT: '#B08D57',
        },
        stone: {
          50: '#FBFAF8',
          100: '#F8F7F5',
          200: '#F3F1ED',
          300: '#E8E5E0',
          400: '#D9D4CC',
          500: '#C3BCB1',
          600: '#A69E92',
        },
        ink: {
          50: '#F6F6F4',
          100: '#EBEBE7',
          200: '#D9D9D3',
          300: '#B8B8B0',
          400: '#8E8E86',
          500: '#6B6B64',
          600: '#4C4C47',
          700: '#3A3A36',
          800: '#292926',
          900: '#1F1F1F',
          950: '#141413',
          DEFAULT: '#1F1F1F',
        },
        steel: {
          300: '#A7AFB9',
          400: '#88919D',
          500: '#687280',
          600: '#56606C',
          700: '#434C57',
          DEFAULT: '#687280',
        },
        /* Legacy aliases — used by the admin CMS. */
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
          dark: '#96753f',
        },
        'dark-contrast': 'var(--color-dark-contrast)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        content: '86rem',
        prose: '68ch',
      },
      spacing: {
        section: 'clamp(4.25rem, 8vw, 7.5rem)',
      },
      borderRadius: {
        xs: '2px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(31, 31, 31, 0.04), 0 18px 44px -28px rgba(31, 31, 31, 0.24)',
        lift: '0 2px 4px rgba(31, 31, 31, 0.04), 0 30px 60px -32px rgba(31, 31, 31, 0.34)',
        bronze: '0 18px 50px -26px rgba(176, 141, 87, 0.55)',
        card: '0 4px 24px -6px rgba(31, 31, 31, 0.10)',
        'card-hover': '0 18px 48px -12px rgba(31, 31, 31, 0.18)',
        glow: '0 0 0 1px rgba(176, 141, 87, 0.16), 0 12px 40px -16px rgba(176, 141, 87, 0.4)',
        'inner-glow': 'inset 0 1px 2px rgba(31, 31, 31, 0.06)',
      },
      transitionTimingFunction: {
        arch: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
        'marquee-slow': 'marquee 55s linear infinite',
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
