/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F5F2EC',
          warm: '#EDE8DD',
          deep: '#E5DCC9',
        },
        ink: {
          DEFAULT: '#0A0A0A',
          900: '#171717',
          700: '#404040',
          500: '#737373',
          400: '#9A9A9A',
          300: '#D4D4D4',
          200: '#E5E5E5',
        },
        vermilion: {
          DEFAULT: '#D63A2F',
          dark: '#A82A22',
        },
        mustard: '#C9A227',
        moss: '#2E8B57',
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }],
      },
      letterSpacing: {
        'caps': '0.12em',
      },
      animation: {
        'rise-in': 'riseIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'rise-in-1': 'riseIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.06s both',
        'rise-in-2': 'riseIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both',
        'rise-in-3': 'riseIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both',
        'rise-in-4': 'riseIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both',
        'marquee': 'marquee 30s linear infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};
