/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          mute: 'rgb(var(--ink-mute) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
        },
        paper: {
          DEFAULT: 'rgb(var(--paper) / <alpha-value>)',
          raised: 'rgb(var(--paper-raised) / <alpha-value>)',
          sunken: 'rgb(var(--paper-sunken) / <alpha-value>)',
        },
        rust: {
          DEFAULT: 'rgb(var(--rust) / <alpha-value>)',
          dark: 'rgb(var(--rust-dark) / <alpha-value>)',
          soft: 'rgb(var(--rust-soft) / <alpha-value>)',
          tint: 'rgb(var(--rust-tint) / <alpha-value>)',
          wash: 'rgb(var(--rust-wash) / <alpha-value>)',
        },
        beacon: {
          DEFAULT: 'rgb(var(--beacon) / <alpha-value>)',
          soft: 'rgb(var(--beacon-soft) / <alpha-value>)',
          deep: 'rgb(var(--beacon-deep) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'rgb(var(--sidebar) / <alpha-value>)',
          sel: 'rgb(var(--sidebar-sel) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--line) / <alpha-value>)',
          strong: 'rgb(var(--line-strong) / <alpha-value>)',
        },
        sentiment: {
          pos: 'rgb(var(--sent-pos) / <alpha-value>)',
          'pos-tint': 'rgb(var(--sent-pos-tint) / <alpha-value>)',
          neu: 'rgb(var(--sent-neu) / <alpha-value>)',
          'neu-tint': 'rgb(var(--sent-neu-tint) / <alpha-value>)',
          neg: 'rgb(var(--sent-neg) / <alpha-value>)',
          'neg-tint': 'rgb(var(--sent-neg-tint) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.25rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        display: ['2.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        title: ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        heading: ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,24,21,0.04), 0 2px 6px rgba(28,24,21,0.05)',
        raised: '0 2px 4px rgba(28,24,21,0.05), 0 12px 28px -8px rgba(28,24,21,0.12), inset 0 1px 0 rgba(255,255,255,0.55)',
        pop: '0 8px 20px -6px rgba(28,24,21,0.14), 0 24px 48px -12px rgba(28,24,21,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
        lift: '0 1px 2px rgba(28,24,21,0.05), 0 8px 20px -6px rgba(28,24,21,0.10), inset 0 1px 0 rgba(255,255,255,0.5)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        'ease-out': 'cubic-bezier(0.2, 0.7, 0.3, 1)',
      },
      letterSpacing: {
        caps: '0.13em',
      },
      maxWidth: {
        prose: '68ch',
        content: '1240px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s cubic-bezier(0.2,0.8,0.2,1) both',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
}
