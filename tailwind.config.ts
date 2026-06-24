import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rose-gold': '#B76E79',
        'rose-gold-light': '#C9848E',
        champagne: '#D4AF7F',
        'soft-pink': '#F8E8EE',
        blush: '#F2D5DC',
        'warm-white': '#FDF8F5',
        cream: '#FAF3EF',
        'luxury-black': '#1A1012',
        'dark-brown': '#2D1B1E',
        'text-primary': '#1A1012',
        'text-secondary': '#6B4C52',
        'text-muted': '#A08088',
        border: '#EDD8DE',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        dm: ['var(--font-dm)', 'DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #B76E79, #D4AF7F)',
        'gradient-pink': 'linear-gradient(135deg, #F8E8EE, #FDF8F5)',
        'gradient-dark': 'linear-gradient(135deg, #1A1012, #2D1B1E)',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(183,110,121,0.12)',
        card: '0 8px 40px rgba(183,110,121,0.16)',
        luxury: '0 20px 60px rgba(26,16,18,0.15)',
        gold: '0 8px 24px rgba(183,110,121,0.35)',
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'glow-pulse': 'glow-pulse 3s infinite',
        float: 'float 3s ease-in-out infinite',
        'load-bar': 'load-bar 2.8s cubic-bezier(.4,0,.2,1) forwards',
        'fade-up': 'fade-up 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
      },
      keyframes: {
        shimmer: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(200%)' } },
        'glow-pulse': { '0%,100%': { opacity: '0.25' }, '50%': { opacity: '0.5' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        'load-bar': { '0%': { width: '0%' }, '100%': { width: '100%' } },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'scale-in': { '0%': { opacity: '0', transform: 'scale(0.92)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        'slide-up': { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
export default config
