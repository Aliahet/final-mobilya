import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAFAF8',
        beige: '#F5F0E8',
        stone: '#E8E4DC',
        pebble: '#D4CFC6',
        charcoal: '#1C1C1A',
        brown: '#6B5B45',
        gold: '#C4A45A',
        'gold-light': '#D4B870',
        olive: '#4A4A35',
        'olive-light': '#6B6B50',
        sand: '#B8A990',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        display: ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.75rem, 3vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'product': '0 4px 24px -4px rgba(28,28,26,0.08)',
        'product-hover': '0 16px 48px -8px rgba(28,28,26,0.14)',
        'card': '0 2px 12px -2px rgba(28,28,26,0.06)',
        'menu': '0 8px 32px -4px rgba(28,28,26,0.12)',
        'modal': '0 24px 80px -16px rgba(28,28,26,0.2)',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'shimmer': 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      },
      backgroundSize: {
        'shimmer': '200% 100%',
      },
      aspectRatio: {
        'product': '3 / 4',
        'hero': '16 / 7',
        'square': '1 / 1',
      },
    },
  },
  plugins: [],
};

export default config;
