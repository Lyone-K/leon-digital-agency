import type { Config } from 'tailwindcss'

// Design language: "The Ledger" — a premium editorial identity built around the idea
// of a beautifully typeset annual report. Hairline gold rules, tabular mono figures
// right-aligned like account entries, restrained serif headlines. Distinct from the
// JT Malika "Field Journal" identity (Fraunces/IBM Plex Mono) — this uses Spectral/Inter/Space Mono.

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0E1B2B', // primary dark background
          light: '#16283D',
        },
        emerald: {
          DEFAULT: '#163C34', // secondary dark surface
          deep: '#0F2B26',
        },
        gold: {
          DEFAULT: '#C9A24C', // accent — CTAs, rules, highlights
          soft: 'rgba(201, 162, 76, 0.35)',
          hairline: 'rgba(201, 162, 76, 0.18)',
        },
        parchment: {
          DEFAULT: '#F6F3EC', // light section background
          dim: '#EDE8DB',
        },
        slate: {
          DEFAULT: '#384049', // body text on light
          soft: '#6B7280',
        },
        bone: '#EDEAE2', // body text on dark
      },
      fontFamily: {
        display: ['var(--font-spectral)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      letterSpacing: {
        eyebrow: '0.18em',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}

export default config
