/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        app: 'var(--bg-app)',
        'surface-0': 'var(--surface-0)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        'accent-violet': {
          400: 'var(--accent-violet-400)',
          500: 'var(--accent-violet-500)',
          600: 'var(--accent-violet-600)',
          light: 'var(--accent-violet-light)',
        },
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'glass-border': 'var(--glass-border)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        sora: ['Sora', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'button-glow': 'var(--shadow-button-glow)',
        'orb-glow': 'var(--shadow-orb-glow)',
        'card-glass': 'var(--shadow-card)',
      },
    },
  },
  plugins: [],
};
