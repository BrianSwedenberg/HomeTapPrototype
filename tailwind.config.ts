import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:        '#6B3FA0',
        'primary-dark': '#4E2D7A',
        'primary-light':'#EDE7F6',
        teal:           '#00B3A4',
        'teal-light':   '#E0F7F5',
        'text-primary':   '#1A1A2E',
        'text-secondary': '#5C5C7A',
        'text-disabled':  '#AAAAAA',
        border:           '#D0D0E0',
        'border-light':   '#EEECF6',
        'bg-page':        '#F7F6FC',
        'bg-card':        '#FFFFFF',
        'bg-selected':    '#EDE7F6',
        error:            '#C62828',
        'error-bg':       '#FFEBEE',
        success:          '#2E7D32',
        'success-bg':     '#E8F5E9',
        warning:          '#E65100',
        rating:           '#F4B400',
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm:   '6px',
        md:   '10px',
        lg:   '16px',
        xl:   '24px',
        full: '9999px',
      },
      boxShadow: {
        card:  '0 4px 24px rgba(107,63,160,0.08)',
        focus: '0 0 0 3px rgba(107,63,160,0.20)',
      },
    },
  },
  plugins: [],
};

export default config;
