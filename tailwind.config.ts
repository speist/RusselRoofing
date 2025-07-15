import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Primary Colors
        primary: {
          burgundy: '#8B1538',
          charcoal: '#2D2D2D',
        },
        // Secondary Colors
        secondary: {
          'warm-gray': '#6B6B6B',
          'light-warm-gray': '#F5F3F0',
          'cream-white': '#FAFAF8',
        },
        // Accent Colors
        accent: {
          'trust-blue': '#1E5F8E',
          'success-green': '#2D7A3E',
          'alert-gold': '#D4A017',
        },
        // Functional Colors
        functional: {
          'error-red': '#D32F2F',
          'info-blue': '#0288D1',
          'warning-orange': '#F57C00',
          'disabled-gray': '#BDBDBD',
        },
        // Background Colors
        background: {
          white: '#FFFFFF',
          light: '#FBFBF9',
          dark: '#1A1A1A',
        },
        // Dark Mode Variants
        dark: {
          background: '#1A1A1A',
          surface: '#2D2D2D',
          burgundy: '#A03050',
          'text-primary': '#F5F5F5',
          'text-secondary': '#B0B0B0',
          border: 'rgba(255,255,255,0.1)',
        },
        // Override default Tailwind colors for shadcn/ui compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        inter: ['Inter', 'var(--font-inter)'],
        playfair: ['Playfair Display', 'var(--font-playfair)'],
      },
      fontSize: {
        // Heading sizes
        'h1': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1-mobile': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '44px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h2-mobile': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3-mobile': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4': ['24px', { lineHeight: '32px', letterSpacing: '0', fontWeight: '500' }],
        'h4-mobile': ['20px', { lineHeight: '28px', letterSpacing: '0', fontWeight: '500' }],
        // Body text sizes
        'body-large': ['18px', { lineHeight: '28px', letterSpacing: '0' }],
        'body': ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        'body-small': ['14px', { lineHeight: '20px', letterSpacing: '0.01em' }],
        // Special text
        'lead': ['20px', { lineHeight: '32px', letterSpacing: '0' }],
        'button': ['16px', { lineHeight: '24px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label': ['12px', { lineHeight: '16px', letterSpacing: '0.03em', fontWeight: '500' }],
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '17': '68px',
        '18': '72px',
        '19': '76px',
        '21': '84px',
        '22': '88px',
        '23': '92px',
        '25': '100px',
        '26': '104px',
        '27': '108px',
        '28': '112px',
        '29': '116px',
        '30': '120px',
      },
      borderRadius: {
        'button': '6px',
        'card': '8px',
        'input': '6px',
        'image': '8px',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'card': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.15)',
        'button': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'input-focus': '0 0 0 3px rgba(139, 21, 56, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionDuration: {
        'micro': '150ms',
        'standard': '250ms',
        'emphasis': '350ms',
        'smooth': '500ms',
      },
      transitionTimingFunction: {
        'ease-out-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;