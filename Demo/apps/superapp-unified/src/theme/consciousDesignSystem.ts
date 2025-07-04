// 🎨 Sistema de Diseño Consciente CoomÜnity
// Basado en principios de belleza, accesibilidad y consciencia

export const consciousDesignSystem = {
  // 🌈 Paleta de Colores Consciente
  colors: {
    // Colores Primarios - Inspirados en la naturaleza y la consciencia
    primary: {
      main: '#2563EB',        // Azul del cielo consciente
      light: '#60A5FA',       // Azul claro como el amanecer
      dark: '#1E40AF',        // Azul profundo como el océano
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#059669',        // Verde de la Madre Tierra
      light: '#34D399',       // Verde tierno de la vida nueva
      dark: '#047857',        // Verde profundo del bosque ancestral
      contrastText: '#FFFFFF',
    },
    accent: {
      main: '#7C3AED',        // Púrpura de la transformación
      light: '#A78BFA',       // Púrpura suave de la intuición
      dark: '#5B21B6',        // Púrpura profundo de la sabiduría
      contrastText: '#FFFFFF',
    },

    // Colores de Estado - Alineados con el Reciprocidad
    success: {
      main: '#10B981',        // Verde del crecimiento consciente
      light: '#6EE7B7',       // Verde claro de la abundancia
      dark: '#059669',        // Verde profundo de la estabilidad
    },
    warning: {
      main: '#F59E0B',        // Dorado de la sabiduría
      light: '#FCD34D',       // Dorado claro del discernimiento
      dark: '#D97706',        // Dorado profundo de la experiencia
    },
    error: {
      main: '#EF4444',        // Rojo de la atención consciente
      light: '#F87171',       // Rojo suave del aprendizaje
      dark: '#DC2626',        // Rojo profundo de la transformación
    },

    // Neutros Conscientes - Para equilibrio y armonía
    grey: {
      50: '#F8FAFC',          // Blanco casi puro - claridad mental
      100: '#F1F5F9',         // Blanco suave - paz interior
      200: '#E2E8F0',         // Gris muy claro - serenidad
      300: '#CBD5E1',         // Gris claro - equilibrio
      400: '#94A3B8',         // Gris medio - neutralidad
      500: '#64748B',         // Gris - estabilidad
      600: '#475569',         // Gris oscuro - grounding
      700: '#334155',         // Gris muy oscuro - profundidad
      800: '#1E293B',         // Casi negro - misterio
      900: '#0F172A',         // Negro consciente - vacío fértil
    },

    // Colores Especiales CoomÜnity
    reciprocidad: {
      main: '#8B5CF6',        // Violeta del intercambio sagrado
      light: '#A78BFA',       // Violeta claro de la reciprocidad
      dark: '#7C3AED',        // Violeta profundo del equilibrio
    },
    bienComun: {
      main: '#059669',        // Verde del bien común
      light: '#10B981',       // Verde claro de la prosperidad compartida
      dark: '#047857',        // Verde profundo de la solidaridad
    },
    consciousness: {
      seed: '#6B7280',        // Gris de la semilla
      growing: '#3B82F6',     // Azul del crecimiento
      flourishing: '#10B981', // Verde del florecimiento
      transcendent: '#F59E0B', // Dorado de la trascendencia
    },
  },

  // 📝 Tipografía Consciente
  typography: {
    fontFamily: {
      primary: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      secondary: '"Poppins", "Inter", sans-serif',
      consciousness: '"Rubik", "Inter", sans-serif', // Para elementos especiales
    },

    // Escala tipográfica armónica (basada en proporción áurea)
    fontSize: {
      xs: '0.75rem',     // 12px - Detalles menores
      sm: '0.875rem',    // 14px - Texto secundario
      base: '1rem',      // 16px - Texto base
      lg: '1.125rem',    // 18px - Texto destacado
      xl: '1.25rem',     // 20px - Subtítulos pequeños
      '2xl': '1.5rem',   // 24px - Subtítulos
      '3xl': '1.875rem', // 30px - Títulos grandes
      '4xl': '2.25rem',  // 36px - Títulos heroicos
      '5xl': '3rem',     // 48px - Display
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      consciousness: 500, // Peso especial para elementos conscientes
    },

    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      consciousness: 1.618, // Proporción áurea para textos especiales
    },
  },

  // 📏 Espaciado Consciente (Sistema de 8px + Fibonacci)
  spacing: {
    // Espaciado base en sistema de 8px
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px

    // Espaciado consciente (basado en Fibonacci)
    fibonacci: {
      1: '0.125rem',   // 2px
      2: '0.25rem',    // 4px
      3: '0.5rem',     // 8px
      5: '0.875rem',   // 14px
      8: '1.375rem',   // 22px
      13: '2.125rem',  // 34px
      21: '3.375rem',  // 54px
      34: '5.375rem',  // 86px
    },
  },

  // 🎨 Componentes Conscientes
  components: {
    // Cards con consciencia
    card: {
      borderRadius: '0.75rem',        // 12px - Suavidad natural
      shadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        soft: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        consciousness: '0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05)',
        extraLarge: '0 10px 15px -3px rgba(139, 92, 246, 0.2), 0 4px 6px -2px rgba(139, 92, 246, 0.1)',
      },
      padding: {
        small: '1rem',     // 16px
        medium: '1.5rem',  // 24px
        large: '2rem',     // 32px
      },
    },

    // Buttons conscientes
    button: {
      borderRadius: '0.5rem',  // 8px
      padding: {
        small: '0.5rem 0.75rem',     // 8px 12px
        medium: '0.75rem 1rem',      // 12px 16px
        large: '1rem 1.5rem',        // 16px 24px
      },
      minHeight: {
        small: '2rem',    // 32px
        medium: '2.75rem', // 44px - Touch target
        large: '3rem',    // 48px
      },
    },

    // Touch targets para accesibilidad
    touchTarget: {
      minimum: '2.75rem', // 44px - WCAG AA
      recommended: '3rem', // 48px - Optimal
    },
  },

  // 🎭 Estados de Consciencia Visual
  consciousnessStates: {
    seed: {
      color: '#6B7280',
      background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
      glow: '0 0 0 rgba(107, 114, 128, 0)',
      opacity: 0.8,
    },
    growing: {
      color: '#3B82F6',
      background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
      glow: '0 0 20px rgba(59, 130, 246, 0.15)',
      opacity: 0.9,
    },
    flourishing: {
      color: '#10B981',
      background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
      glow: '0 0 30px rgba(16, 185, 129, 0.2)',
      opacity: 0.95,
    },
    transcendent: {
      color: '#F59E0B',
      background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
      glow: '0 0 40px rgba(245, 158, 11, 0.25)',
      opacity: 1,
    },
  },

  // 🌊 Transiciones y Animaciones Conscientes
  transitions: {
    // Duraciones basadas en ritmos naturales
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    consciousness: '618ms', // Golden ratio

    // Easing curves naturales
    easing: {
      natural: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      consciousness: 'cubic-bezier(0.618, 0.0, 0.382, 1)', // Golden ratio
      gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // 📱 Breakpoints Responsivos
  breakpoints: {
    xs: '320px',   // Móviles pequeños
    sm: '640px',   // Móviles grandes
    md: '768px',   // Tablets
    lg: '1024px',  // Laptops
    xl: '1280px',  // Desktops
    '2xl': '1536px', // Pantallas grandes
  },

  // ♿ Accesibilidad Consciente
  accessibility: {
    // Contrastes WCAG AA/AAA
    contrast: {
      aa: 4.5,      // Mínimo WCAG AA
      aaa: 7,       // Óptimo WCAG AAA
    },

    // Focus states visibles
    focus: {
      outline: '2px solid',
      outlineColor: '#2563EB',
      outlineOffset: '2px',
      borderRadius: '0.375rem',
    },

    // Estados de hover suaves
    hover: {
      opacity: 0.8,
      transform: 'translateY(-1px)',
      transformSmall: 'translateY(-2px)',
      transformExtra: 'translateY(-4px) scale(1.02)',
      transition: 'all 150ms ease',
    },
  },
};

// 🎨 Funciones utilitarias para el sistema consciente
export const getConsciousnessStyle = (level: keyof typeof consciousDesignSystem.consciousnessStates) => {
  return consciousDesignSystem.consciousnessStates[level];
};

export const getConsciousSpacing = (value: keyof typeof consciousDesignSystem.spacing) => {
  return consciousDesignSystem.spacing[value];
};

export const getConsciousColor = (path: string): string | undefined => {
  // Función para acceder a colores nested como "primary.main"
  return path.split('.').reduce((obj: any, key) => obj?.[key], consciousDesignSystem.colors as any);
};

// 📱 Mixins responsive
export const responsive = {
  mobile: `@media (max-width: ${consciousDesignSystem.breakpoints.sm})`,
  tablet: `@media (min-width: ${consciousDesignSystem.breakpoints.md})`,
  desktop: `@media (min-width: ${consciousDesignSystem.breakpoints.lg})`,
  widescreen: `@media (min-width: ${consciousDesignSystem.breakpoints.xl})`,
};

export default consciousDesignSystem;
