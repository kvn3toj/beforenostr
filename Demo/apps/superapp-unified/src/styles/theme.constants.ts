// Constantes para el sistema de temas CoomÜnity

// Elementos disponibles
export const ELEMENTS = {
  FUEGO: 'fuego',
  AGUA: 'agua',
  TIERRA: 'tierra',
  AIRE: 'aire',
} as const;

export type ElementType = typeof ELEMENTS[keyof typeof ELEMENTS];

// Modos de tema
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type ThemeMode = typeof THEME_MODES[keyof typeof THEME_MODES];

// Variantes de componentes
export const COMPONENT_VARIANTS = {
  ELEVATED: 'elevated',
  GLASS: 'glass',
  OUTLINED: 'outlined',
} as const;

export type ComponentVariant = typeof COMPONENT_VARIANTS[keyof typeof COMPONENT_VARIANTS];

// Configuraciones de accesibilidad
export const ACCESSIBILITY_SETTINGS = {
  HIGH_CONTRAST: 'high-contrast',
  REDUCED_MOTION: 'reduced-motion',
  LARGE_FONT: 'large-font',
  LARGE_SPACING: 'large-spacing',
} as const;

export type AccessibilitySetting = typeof ACCESSIBILITY_SETTINGS[keyof typeof ACCESSIBILITY_SETTINGS];

// Configuraciones de almacenamiento local
export const STORAGE_KEYS = {
  THEME_MODE: 'theme-mode',
  THEME_ELEMENT: 'theme-element',
  HIGH_CONTRAST: 'theme-contrast',
  REDUCED_MOTION: 'theme-reduced-motion',
  FONT_SIZE: 'theme-font-size',
  SPACING: 'theme-spacing',
  BORDER_RADIUS: 'theme-border-radius',
  EFFECTS_INTENSITY: 'theme-effects-intensity',
} as const;

// Valores por defecto
export const DEFAULT_VALUES = {
  THEME_MODE: THEME_MODES.LIGHT as ThemeMode,
  THEME_ELEMENT: ELEMENTS.TIERRA as ElementType,
  HIGH_CONTRAST: false,
  REDUCED_MOTION: false,
  FONT_SIZE: 1,
  SPACING: 1,
  BORDER_RADIUS: 1,
  EFFECTS_INTENSITY: 1,
} as const;

// Rangos de valores
export const VALUE_RANGES = {
  FONT_SIZE: {
    MIN: 0.8,
    MAX: 1.5,
    STEP: 0.1,
  },
  SPACING: {
    MIN: 0.8,
    MAX: 1.5,
    STEP: 0.1,
  },
  BORDER_RADIUS: {
    MIN: 0,
    MAX: 2,
    STEP: 0.1,
  },
  EFFECTS_INTENSITY: {
    MIN: 0,
    MAX: 1,
    STEP: 0.1,
  },
} as const;

// Configuraciones de transiciones
export const TRANSITIONS = {
  DURATION: {
    SHORTEST: 180,
    SHORTER: 250,
    SHORT: 300,
    STANDARD: 350,
    COMPLEX: 450,
    ENTERING_SCREEN: 280,
    LEAVING_SCREEN: 220,
  },
  EASING: {
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_OUT: 'cubic-bezier(0.0, 0, 0.2, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    SHARP: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
} as const;

// Configuraciones de sombras
export const SHADOWS = {
  LIGHT: {
    COLOR: 'rgba(40, 54, 24, 0.1)',
    OFFSET: '0 2px 4px',
  },
  MEDIUM: {
    COLOR: 'rgba(40, 54, 24, 0.15)',
    OFFSET: '0 4px 8px',
  },
  HEAVY: {
    COLOR: 'rgba(40, 54, 24, 0.2)',
    OFFSET: '0 8px 16px',
  },
} as const;

// Configuraciones de bordes
export const BORDERS = {
  THIN: '1px',
  MEDIUM: '2px',
  THICK: '4px',
} as const;

// Configuraciones de opacidad
export const OPACITY = {
  TRANSPARENT: 0,
  LIGHTEST: 0.1,
  LIGHT: 0.3,
  MEDIUM: 0.5,
  HIGH: 0.7,
  HIGHEST: 0.9,
  SOLID: 1,
} as const;

// Configuraciones de z-index
export const Z_INDEX = {
  MODAL: 1300,
  SNACKBAR: 1400,
  TOOLTIP: 1500,
} as const;

// Configuraciones de breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
} as const;

// Configuraciones de espaciado
export const SPACING = {
  UNIT: 8,
  MULTIPLIER: {
    XXS: 0.25, // 2px
    XS: 0.5,   // 4px
    SM: 1,     // 8px
    MD: 2,     // 16px
    LG: 3,     // 24px
    XL: 4,     // 32px
    XXL: 5,    // 40px
  },
} as const;

// Configuraciones de tipografía
export const TYPOGRAPHY = {
  FONT_FAMILY: {
    PRIMARY: '"Poppins", "Helvetica", "Arial", sans-serif',
    SECONDARY: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  FONT_SIZE: {
    XS: '0.75rem',    // 12px
    SM: '0.875rem',   // 14px
    MD: '1rem',       // 16px
    LG: '1.125rem',   // 18px
    XL: '1.25rem',    // 20px
    XXL: '1.5rem',    // 24px
  },
  FONT_WEIGHT: {
    LIGHT: 300,
    REGULAR: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
    EXTRABOLD: 800,
  },
  LINE_HEIGHT: {
    TIGHT: 1.1,
    SNUG: 1.2,
    NORMAL: 1.5,
    RELAXED: 1.7,
    LOOSE: 2,
  },
} as const;

// Configuraciones de bordes redondeados
export const BORDER_RADIUS = {
  NONE: '0',
  SM: '4px',
  MD: '8px',
  LG: '12px',
  XL: '16px',
  XXL: '24px',
  FULL: '9999px',
} as const;

// Configuraciones de animaciones
export const ANIMATIONS = {
  DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
  },
  TIMING: {
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_OUT: 'cubic-bezier(0.0, 0, 0.2, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    SHARP: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
} as const;

// Configuraciones de elementos
export const ELEMENT_CONFIG = {
  [ELEMENTS.FUEGO]: {
    GRADIENT: 'linear-gradient(135deg, #bc6c25 0%, #d08645 100%)',
    SHADOW: 'rgba(188, 108, 37, 0.2)',
    GLOW: 'rgba(208, 134, 69, 0.3)',
  },
  [ELEMENTS.AGUA]: {
    GRADIENT: 'linear-gradient(135deg, #005CA9 0%, #1E88E5 100%)',
    SHADOW: 'rgba(0, 92, 169, 0.2)',
    GLOW: 'rgba(30, 136, 229, 0.3)',
  },
  [ELEMENTS.TIERRA]: {
    GRADIENT: 'linear-gradient(135deg, #606c38 0%, #283618 100%)',
    SHADOW: 'rgba(96, 108, 56, 0.2)',
    GLOW: 'rgba(40, 54, 24, 0.3)',
  },
  [ELEMENTS.AIRE]: {
    GRADIENT: 'linear-gradient(135deg, #dda15e 0%, #e4b871 100%)',
    SHADOW: 'rgba(221, 161, 94, 0.2)',
    GLOW: 'rgba(228, 184, 113, 0.3)',
  },
} as const;