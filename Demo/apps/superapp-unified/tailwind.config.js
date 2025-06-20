/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // CoomÜnity Design System Colors - Enhanced
        coomunity: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#7c3aed', // Principal - menos saturado
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3c1361',
          DEFAULT: '#7c3aed',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d97706', // Más sutil y armonioso
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
          DEFAULT: '#d97706',
        },
        // Elementos naturales - Armonizados con filosofía CoomÜnity
        earth: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cfc7',
          400: '#d2bab0',
          500: '#92400e', // Más cálido
          600: '#7c2d12',
          700: '#6c2410',
          800: '#581c0c',
          900: '#451a03',
          DEFAULT: '#92400e',
        },
        water: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#0891b2', // Más profundo
          600: '#0e7490',
          700: '#155e75',
          800: '#164e63',
          900: '#083344',
          DEFAULT: '#0891b2',
        },
        fire: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626', // Menos agresivo
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
          DEFAULT: '#dc2626',
        },
        air: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#7c3aed', // Consistente con primary
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3c1361',
          DEFAULT: '#7c3aed',
        },
        // Colores semánticos mejorados
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          DEFAULT: '#10b981',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#ef4444',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#3b82f6',
        },
        tierra: {
          50: '#fef7ed',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#92400e', // Earth: stability, trust
          600: '#78350f',
          700: '#451a03',
          800: '#1c0701',
          900: '#0c0301',
        },
        agua: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#0891b2', // Water: flow, adaptability
          600: '#0e7490',
          700: '#155e75',
          800: '#164e63',
          900: '#083344',
        },
        fuego: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626', // Fire: passion, action
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
        },
        aire: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#7c3aed', // Air: vision, communication
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3c1361',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25' }],
        'sm': ['0.875rem', { lineHeight: '1.375' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.625' }],
        'xl': ['1.25rem', { lineHeight: '1.625' }],
        '2xl': ['1.5rem', { lineHeight: '1.25' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.25' }],
        '5xl': ['3rem', { lineHeight: '1.25' }],
        '6xl': ['3.75rem', { lineHeight: '1.25' }],
      },
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1.5': '0.375rem',  // 6px
        '2.5': '0.625rem',  // 10px
        '3.5': '0.875rem',  // 14px
        '18': '4.5rem',     // 72px
        '88': '22rem',      // 352px
        '128': '32rem',     // 512px
      },
      borderRadius: {
        'xs': '0.125rem',   // 2px
        'sm': '0.25rem',    // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        // Sombras CoomÜnity
        'coomunity': '0 4px 6px -1px rgb(124 58 237 / 0.1), 0 2px 4px -2px rgb(124 58 237 / 0.1)',
        'coomunity-lg': '0 10px 15px -3px rgb(124 58 237 / 0.1), 0 4px 6px -4px rgb(124 58 237 / 0.1)',
        'coomunity-glow': '0 0 20px rgb(124 58 237 / 0.15)',
        'gold': '0 4px 6px -1px rgb(217 119 6 / 0.1), 0 2px 4px -2px rgb(217 119 6 / 0.1)',
        'gold-glow': '0 0 20px rgb(217 119 6 / 0.15)',
        'coomunity-sm': '0 1px 2px 0 rgba(124, 58, 237, 0.05)',
        'coomunity-md': '0 4px 6px -1px rgba(124, 58, 237, 0.1), 0 2px 4px -1px rgba(124, 58, 237, 0.06)',
        'coomunity-xl': '0 20px 25px -5px rgba(124, 58, 237, 0.1), 0 10px 10px -5px rgba(124, 58, 237, 0.04)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Animaciones CoomÜnity - Mejoradas
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-left': 'slideLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-right': 'slideRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'scale-out': 'scaleOut 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-soft': 'bounceSoft 1s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'coomunityGlow 2s ease-in-out infinite',
        'gold-glow': 'goldGlow 2s ease-in-out infinite',
        'ayni-flow': 'ayniFlow 3s ease-in-out infinite',
        'meritos-count': 'meritosCount 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ondas-ripple': 'ondasRipple 1.5s ease-out infinite',
        'wiggle': 'wiggle 1s ease-in-out',
        'hover-lift': 'hoverLift 0.2s ease',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Keyframes CoomÜnity - Completos
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-8px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': {
            animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            transform: 'translate3d(0, 0, 0)',
          },
          '40%, 43%': {
            animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
            transform: 'translate3d(0, -15px, 0)',
          },
          '70%': {
            animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
            transform: 'translate3d(0, -7px, 0)',
          },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
        coomunityGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgb(124 58 237 / 0.1)' },
          '50%': { boxShadow: '0 0 30px rgb(124 58 237 / 0.2)' },
        },
        goldGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgb(217 119 6 / 0.1)' },
          '50%': { boxShadow: '0 0 30px rgb(217 119 6 / 0.2)' },
        },
        ayniFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        meritosCount: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        ondasRipple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        wiggle: {
          '0%, 7%': { transform: 'rotateZ(0)' },
          '15%': { transform: 'rotateZ(-15deg)' },
          '20%': { transform: 'rotateZ(10deg)' },
          '25%': { transform: 'rotateZ(-10deg)' },
          '30%': { transform: 'rotateZ(6deg)' },
          '35%': { transform: 'rotateZ(-4deg)' },
          '40%, 100%': { transform: 'rotateZ(0)' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgb(124 58 237)' },
          '50%': { boxShadow: '0 0 20px rgb(124 58 237), 0 0 30px rgb(216 180 254)' },
        },
      },
      transitionTimingFunction: {
        'coomunity': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'coomunity-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'coomunity-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '350': '350ms',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Plugin personalizado para utilidades CoomÜnity
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.coomunity-gradient': {
          background: `linear-gradient(135deg, ${theme('colors.coomunity.500')} 0%, ${theme('colors.coomunity.400')} 100%)`,
        },
        '.coomunity-gradient-gold': {
          background: `linear-gradient(135deg, ${theme('colors.gold.500')} 0%, ${theme('colors.gold.400')} 100%)`,
        },
        '.coomunity-gradient-elements': {
          background: `linear-gradient(135deg, ${theme('colors.earth.500')} 0%, ${theme('colors.water.500')} 25%, ${theme('colors.fire.500')} 50%, ${theme('colors.air.500')} 75%, ${theme('colors.coomunity.500')} 100%)`,
        },
        '.coomunity-text-gradient': {
          background: `linear-gradient(45deg, ${theme('colors.coomunity.500')} 30%, ${theme('colors.coomunity.400')} 90%)`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          'color': 'transparent',
        },
        '.coomunity-shadow-glow': {
          boxShadow: `0 0 20px ${theme('colors.coomunity.500')}15`,
        },
        '.coomunity-shadow-gold-glow': {
          boxShadow: `0 0 20px ${theme('colors.gold.500')}15`,
        },
        '.coomunity-hover-lift': {
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.lg'),
          },
        },
        '.coomunity-focus-ring': {
          '&:focus': {
            outline: `2px solid ${theme('colors.coomunity.500')}`,
            outlineOffset: '2px',
          },
        },
        '.coomunity-h1': {
          fontSize: theme('fontSize.5xl[0]'),
          lineHeight: theme('fontSize.5xl[1].lineHeight'),
          fontWeight: '700',
          color: theme('colors.coomunity.900'),
        },
        '.coomunity-h2': {
          fontSize: theme('fontSize.4xl[0]'),
          lineHeight: theme('fontSize.4xl[1].lineHeight'),
          fontWeight: '600',
          color: theme('colors.coomunity.900'),
        },
        '.coomunity-h3': {
          fontSize: theme('fontSize.3xl[0]'),
          lineHeight: theme('fontSize.3xl[1].lineHeight'),
          fontWeight: '600',
          color: theme('colors.coomunity.900'),
        },
        '.coomunity-h4': {
          fontSize: theme('fontSize.2xl[0]'),
          lineHeight: theme('fontSize.2xl[1].lineHeight'),
          fontWeight: '600',
          color: theme('colors.coomunity.900'),
        },
        '.coomunity-h5': {
          fontSize: theme('fontSize.xl[0]'),
          lineHeight: theme('fontSize.xl[1].lineHeight'),
          fontWeight: '600',
          color: theme('colors.coomunity.900'),
        },
        '.coomunity-h6': {
          fontSize: theme('fontSize.lg[0]'),
          lineHeight: theme('fontSize.lg[1].lineHeight'),
          fontWeight: '600',
          color: theme('colors.coomunity.900'),
        },
        '.coomunity-body': {
          fontSize: theme('fontSize.base[0]'),
          lineHeight: theme('fontSize.base[1].lineHeight'),
          color: theme('colors.gray.700'),
        },
        '.coomunity-body-sm': {
          fontSize: theme('fontSize.sm[0]'),
          lineHeight: theme('fontSize.sm[1].lineHeight'),
          color: theme('colors.gray.600'),
        },
        '.coomunity-caption': {
          fontSize: theme('fontSize.xs[0]'),
          lineHeight: theme('fontSize.xs[1].lineHeight'),
          color: theme('colors.gray.500'),
        },
        '.center': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '.center-vertical': {
          display: 'flex',
          alignItems: 'center',
        },
        '.center-horizontal': {
          display: 'flex',
          justifyContent: 'center',
        },
        '.space-between': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        '.bg-gradient-coomunity': {
          background: `linear-gradient(135deg, ${theme('colors.coomunity.500')}, ${theme('colors.coomunity.600')})`,
        },
        '.bg-gradient-gold': {
          background: `linear-gradient(135deg, ${theme('colors.gold.500')}, ${theme('colors.gold.600')})`,
        },
        '.bg-gradient-ayni': {
          background: `linear-gradient(135deg, ${theme('colors.coomunity.400')}, ${theme('colors.blue.400')})`,
        },
        '.interactive': {
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.coomunity-lg'),
          },
        },
        '.focus-coomunity': {
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${theme('colors.coomunity.300')}`,
          },
        },
      }
      addUtilities(newUtilities)
    },
  ],
}