import { type Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',         // твой globals.css и компоненты
    './src/components/**/*.{ts,tsx}',  // если есть компоненты
    './src/pages/**/*.{ts,tsx}',       // если ты используешь /pages
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        primary: 'oklch(var(--primary) / <alpha-value>)',
        'primary-foreground': 'oklch(var(--primary-foreground) / <alpha-value>)',
        secondary: 'oklch(var(--secondary) / <alpha-value>)',
        'secondary-foreground': 'oklch(var(--secondary-foreground) / <alpha-value>)',
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        text: 'oklch(var(--text) / <alpha-value>)',
        bggradient: 'oklch(var(--bggradient) / <alpha-value>)',
        navbar: 'oklch(var(--navbar) / <alpha-value>)',
      },backgroundImage: {
        // ✅ если хочешь использовать готовый градиент
        'hero-radial': 'radial-gradient(at 50% 75%, oklch(1 0 0) 0%, oklch(var(--bggradient)) 50%, oklch(0.145 0 0) 90%)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
