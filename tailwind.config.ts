import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:  '#766cff',
        'primary-dark':  '#5a50e0',
        'primary-light': 'rgba(118,108,255,0.12)',
        bg:    '#08080f',
        'bg-2': '#0d0d1b',
        'bg-3': '#121220',
        'bg-4': '#17172a',
      },
      fontFamily: {
        display: ['var(--font-manrope)', 'Manrope',      'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)',   'Inter',         'system-ui', 'sans-serif'],
        mono:    ['ui-monospace',        'Fira Code',     'monospace'],
      },
      boxShadow: {
        'brand-glow': '0 10px 30px -10px rgba(118,108,255,0.4)',
        'brand-lg':   '0 20px 60px -15px rgba(118,108,255,0.35)',
        'soft':       '0 2px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #766cff 0%, #9b8fff 100%)',
        'brand-gradient-wide': 'linear-gradient(135deg, #5a50e0 0%, #766cff 50%, #a99fff 100%)',
      },
    },
  },
  plugins: [],
}
export default config
