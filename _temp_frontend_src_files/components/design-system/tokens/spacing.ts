/**
 * Tokens de Espaciado - Gamifier Design System
 * 
 * Sistema de espaciado basado en múltiplos de 8px con variaciones responsivas
 */

// === ESPACIADO BASE ===
export const spacing = {
  base: 8,
  
  // Espaciado fijo (para uso con theme.spacing())
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  '2xl': 48, // 48px
  '3xl': 64, // 64px
  '4xl': 96, // 96px
} as const;

// === ESPACIADO RESPONSIVO ===
export const responsiveSpacing = {
  // Espaciado que se adapta automáticamente
  container: {
    xs: 1,  // 8px en mobile
    sm: 2,  // 16px en mobile grande  
    md: 3,  // 24px en tablet
    lg: 4,  // 32px en desktop
    xl: 5,  // 40px en desktop grande
  },
  
  section: {
    xs: 2,  // 16px en mobile
    sm: 3,  // 24px en mobile grande
    md: 4,  // 32px en tablet
    lg: 6,  // 48px en desktop
    xl: 8,  // 64px en desktop grande
  },
  
  card: {
    xs: 2,  // 16px en mobile
    sm: 2.5, // 20px en mobile grande
    md: 3,  // 24px en tablet
    lg: 3,  // 24px en desktop
    xl: 4,  // 32px en desktop grande
  },
  
  button: {
    xs: 1,  // 8px en mobile
    sm: 1.5, // 12px en mobile grande
    md: 2,  // 16px en tablet
    lg: 2,  // 16px en desktop
    xl: 2.5, // 20px en desktop grande
  },
} as const;

// === ESPACIADO FLUIDO CON CSS CLAMP ===
export const fluidSpacing = {
  // Espaciado que escala suavemente
  xs: 'clamp(0.25rem, 1vw, 0.5rem)',    // 4px - 8px
  sm: 'clamp(0.5rem, 1.5vw, 1rem)',     // 8px - 16px
  md: 'clamp(1rem, 2.5vw, 1.5rem)',     // 16px - 24px
  lg: 'clamp(1.5rem, 3vw, 2rem)',       // 24px - 32px
  xl: 'clamp(2rem, 4vw, 3rem)',         // 32px - 48px
  '2xl': 'clamp(3rem, 5vw, 4rem)',      // 48px - 64px
  '3xl': 'clamp(4rem, 6vw, 6rem)',      // 64px - 96px
} as const;

// === ESPACIADO PARA COMPONENTES ESPECÍFICOS ===
export const componentSpacing = {
  padding: {
    button: {
      small: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
      medium: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
      large: 'clamp(12px, 2.5vw, 16px) clamp(20px, 5vw, 32px)',
    },
    card: {
      xs: 'clamp(12px, 2.5vw, 16px)',
      sm: 'clamp(16px, 3vw, 20px)',
      md: 'clamp(20px, 3.5vw, 24px)',
      lg: 'clamp(24px, 4vw, 32px)',
    },
    input: {
      small: 'clamp(8px, 2vw, 12px)',
      medium: 'clamp(12px, 2.5vw, 16px)',
      large: 'clamp(16px, 3vw, 20px)',
    },
    container: {
      mobile: 'clamp(16px, 4vw, 24px)',
      desktop: 'clamp(24px, 5vw, 48px)',
    },
  },
  
  margin: {
    section: {
      xs: 'clamp(16px, 4vw, 24px)',
      sm: 'clamp(24px, 5vw, 32px)',
      md: 'clamp(32px, 6vw, 48px)',
      lg: 'clamp(48px, 8vw, 64px)',
    },
    element: {
      xs: 'clamp(8px, 2vw, 12px)',
      sm: 'clamp(12px, 3vw, 16px)',
      md: 'clamp(16px, 4vw, 24px)',
      lg: 'clamp(24px, 5vw, 32px)',
    },
  },
  
  gap: {
    grid: {
      xs: 'clamp(8px, 2vw, 12px)',
      sm: 'clamp(12px, 3vw, 16px)',
      md: 'clamp(16px, 4vw, 24px)',
      lg: 'clamp(24px, 5vw, 32px)',
    },
    flex: {
      xs: 'clamp(4px, 1vw, 8px)',
      sm: 'clamp(8px, 2vw, 12px)',
      md: 'clamp(12px, 3vw, 16px)',
      lg: 'clamp(16px, 4vw, 24px)',
    },
  },
} as const;

// === HELPER FUNCTIONS ===

/**
 * Convierte un valor de spacing base a rem
 */
export const getSpacing = (multiplier: number): string => {
  return `${(spacing.base * multiplier) / 16}rem`;
};

/**
 * Obtiene spacing responsivo basado en breakpoints
 */
export const getResponsiveSpacing = (
  category: keyof typeof responsiveSpacing,
  multiplier: number = 1
) => ({
  xs: spacing.base * responsiveSpacing[category].xs * multiplier,
  sm: spacing.base * responsiveSpacing[category].sm * multiplier,
  md: spacing.base * responsiveSpacing[category].md * multiplier,
  lg: spacing.base * responsiveSpacing[category].lg * multiplier,
  xl: spacing.base * responsiveSpacing[category].xl * multiplier,
});

/**
 * Crea spacing fluido personalizado
 */
export const createFluidSpacing = (
  minPx: number,
  maxPx: number,
  vwFactor: number = 2.5
): string => {
  const minRem = minPx / 16;
  const maxRem = maxPx / 16;
  return `clamp(${minRem}rem, ${vwFactor}vw, ${maxRem}rem)`;
};

/**
 * Obtiene padding responsivo para componentes
 */
export const getComponentPadding = (
  component: keyof typeof componentSpacing.padding,
  size?: string
) => {
  if (component === 'button' && size) {
    return componentSpacing.padding.button[size as keyof typeof componentSpacing.padding.button];
  }
  if (component === 'card' && size) {
    return componentSpacing.padding.card[size as keyof typeof componentSpacing.padding.card];
  }
  if (component === 'input' && size) {
    return componentSpacing.padding.input[size as keyof typeof componentSpacing.padding.input];
  }
  
  return componentSpacing.padding[component];
};

// === TIPOS TYPESCRIPT ===
export type SpacingTokens = typeof spacing;
export type ResponsiveSpacingTokens = typeof responsiveSpacing;
export type ComponentSpacingTokens = typeof componentSpacing;
export type FluidSpacingTokens = typeof fluidSpacing; 