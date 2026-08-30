/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        vault: {
          DEFAULT: '#0C0D10',
          elevated: '#141519',
          text: '#F2EFE8',
          muted: '#8A8780',
          rule: '#2A2A30',
          dot: '#3A3A42',
        },
        paper: '#F7F4EF',
        ink: '#1A1A1A',
        muted: '#6B6966',
        rule: '#CFCBC4',
        clinify: {
          DEFAULT: '#3B82F6',
          glow: '#00D4FF',
          dim: '#0A1628',
        },
        universityx: {
          DEFAULT: '#E07A5F',
          glow: '#F4A261',
          warm: '#FFF8F3',
        },
        treatmentpath: {
          DEFAULT: '#5C7A6B',
          glow: '#8FB996',
          calm: '#F2F6F4',
        },
        panel: {
          DEFAULT: '#0A0E14',
          border: 'rgba(120, 140, 180, 0.14)',
          label: '#8A96B0',
          text: '#DDE6F5',
        },
        placeholder: '#EBE6DE',
        rust: '#c45c4a',
      },
      maxWidth: {
        prose: '680px',
        wide: '1100px',
        canvas: '1800px',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      boxShadow: {
        evidence: '0 1px 2px rgba(20,20,19,0.04), 0 8px 28px rgba(20,20,19,0.07)',
        vault: '0 8px 40px rgba(0,0,0,0.45)',
        'glow-clinify': '0 0 80px rgba(59, 130, 246, 0.25)',
        'glow-universityx': '0 0 80px rgba(224, 122, 95, 0.2)',
        'glow-treatmentpath': '0 0 80px rgba(92, 122, 107, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
