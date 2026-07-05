import type { Config } from 'tailwindcss'

// Brand colours are driven by CSS variables (see styles/globals.css + lib/theme.ts)
// so the admin Theme page can recolour the whole site live. Using rgb(var(...))
// lets Tailwind opacity modifiers like bg-primary/10 still work.
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:  'rgb(var(--primary-rgb) / <alpha-value>)',
        'primary-dark':  'var(--primary-dark)',
        'primary-light': 'rgba(var(--primary-rgb), 0.12)',
        secondary: 'rgb(var(--secondary-rgb) / <alpha-value>)',
        bg:    'var(--bg)',
        'bg-2': 'var(--bg-2)',
        'bg-3': 'var(--bg-3)',
        'bg-4': 'var(--bg-4)',
        text:  'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',
        border: 'var(--border)',
        'border-2': 'var(--border-2)',
      },
      fontFamily: {
        display: ['var(--font-logo)',    'RoadRadio',     'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)',   'Inter',         'system-ui', 'sans-serif'],
        mono:    ['ui-monospace',        'Fira Code',     'monospace'],
      },
      boxShadow: {
        'brand-glow': '0 10px 30px -10px rgba(var(--primary-rgb),0.4)',
        'brand-lg':   '0 20px 60px -15px rgba(var(--primary-rgb),0.35)',
        'soft':       '0 2px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.2)',
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        'brand-gradient-wide': 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 50%, var(--secondary) 100%)',
      },
    },
  },
  plugins: [],
}
export default config
