/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ww: {
          bg:         '#F4F7FF',
          surface:    '#FFFFFF',
          card:       '#FFFFFF',
          'card-alt': '#F8FAFF',
          navy:       '#0A0F1E',
          'navy-2':   '#1B2340',
          muted:      '#6B7A9F',
          border:     '#E4EAFF',
          'border-2': '#CCD6F0',
        },
        pink: {
          DEFAULT: '#FF2D78',
          light:   '#FF6FA3',
          dim:     '#FF2D7820',
          glow:    '#FF2D7840',
        },
        blue: {
          DEFAULT: '#1652F0',
          light:   '#4A7DFF',
          dim:     '#1652F015',
          glow:    '#1652F030',
        },
        cyan:   { DEFAULT: '#00C2FF', dim: '#00C2FF15' },
        profit: { DEFAULT: '#00C087', dim: '#00C08715' },
        loss:   { DEFAULT: '#FF4747', dim: '#FF474715' },
        gold:   { DEFAULT: '#F5A623', dim: '#F5A62315' },
        purple: { DEFAULT: '#7C3AED', dim: '#7C3AED15' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card:       '0 1px 4px rgba(10,15,30,0.06), 0 4px 20px rgba(10,15,30,0.05)',
        'card-md':  '0 2px 8px rgba(10,15,30,0.08), 0 8px 32px rgba(10,15,30,0.08)',
        'card-lg':  '0 4px 16px rgba(10,15,30,0.10), 0 16px 48px rgba(10,15,30,0.10)',
        'pink-glow':'0 0 24px rgba(255,45,120,0.25), 0 4px 12px rgba(255,45,120,0.15)',
        'blue-glow':'0 0 24px rgba(22,82,240,0.20), 0 4px 12px rgba(22,82,240,0.12)',
        'inner':    'inset 0 1px 0 rgba(255,255,255,0.8)',
      },
      animation: {
        'pulse-dot':    'pulseDot 2s ease-in-out infinite',
        'ticker-scroll':'tickerScroll 45s linear infinite',
        'float':        'float 6s ease-in-out infinite',
        'shimmer':      'shimmer 1.8s infinite',
        'fade-in':      'fadeIn 0.4s ease-out',
      },
      keyframes: {
        pulseDot: {
          '0%,100%': { transform: 'scale(1)', opacity: '1' },
          '50%':     { transform: 'scale(1.4)', opacity: '0.6' },
        },
        tickerScroll: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
