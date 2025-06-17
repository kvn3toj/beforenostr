/**
 * 🎨 THEME HELPERS - COOMUNITY SUPERAPP
 * Helpers para convertir variables CSS a valores compatibles con Material-UI
 */

// Mapa de variables CSS a valores hexadecimales
export const cssVariables = {
  // Primary colors
  '--primary-50': '#eff6ff',
  '--primary-100': '#dbeafe',
  '--primary-500': '#6366f1',
  '--primary-600': '#4f46e5',
  '--primary-700': '#4338ca',
  '--primary-900': '#312e81',

  // Secondary colors
  '--secondary-50': '#faf5ff',
  '--secondary-100': '#f3e8ff',
  '--secondary-500': '#8b5cf6',
  '--secondary-600': '#7c3aed',
  '--secondary-700': '#6d28d9',
  '--secondary-900': '#581c87',

  // Success colors
  '--success-50': '#ecfdf5',
  '--success-100': '#d1fae5',
  '--success-500': '#10b981',
  '--success-600': '#059669',
  '--success-700': '#047857',
  '--success-900': '#064e3b',

  // Warning colors
  '--warning-50': '#fffbeb',
  '--warning-100': '#fef3c7',
  '--warning-500': '#f59e0b',
  '--warning-600': '#d97706',
  '--warning-700': '#b45309',
  '--warning-900': '#78350f',

  // Error colors
  '--error-50': '#fef2f2',
  '--error-100': '#fecaca',
  '--error-200': '#fca5a5',
  '--error-500': '#ef4444',
  '--error-600': '#dc2626',
  '--error-700': '#b91c1c',
  '--error-900': '#7f1d1d',

  // Gray colors
  '--gray-50': '#f9fafb',
  '--gray-100': '#f3f4f6',
  '--gray-200': '#e5e7eb',
  '--gray-300': '#d1d5db',
  '--gray-400': '#9ca3af',
  '--gray-500': '#6b7280',
  '--gray-600': '#4b5563',
  '--gray-700': '#374151',
  '--gray-800': '#1f2937',
  '--gray-900': '#111827',
} as const;

/**
 * Convierte una variable CSS a su valor hexadecimal
 * @param variable Variable CSS (ej: '--error-500')
 * @returns Valor hexadecimal o la variable original si no se encuentra
 */
export const getCSSVariable = (variable: string): string => {
  return cssVariables[variable as keyof typeof cssVariables] || variable;
};

/**
 * Convierte una cadena con variables CSS a valores reales
 * @param value Cadena que puede contener var(--variable)
 * @returns Cadena con valores convertidos
 */
export const convertCSSVariables = (value: string): string => {
  return value.replace(/var\((--[^)]+)\)/g, (match, variable) => {
    return getCSSVariable(variable);
  });
};

/**
 * Helper específico para colores de error
 */
export const errorColors = {
  50: cssVariables['--error-50'],
  100: cssVariables['--error-100'],
  200: cssVariables['--error-200'],
  500: cssVariables['--error-500'],
  600: cssVariables['--error-600'],
  700: cssVariables['--error-700'],
  900: cssVariables['--error-900'],
};

/**
 * Helper específico para colores primarios
 */
export const primaryColors = {
  50: cssVariables['--primary-50'],
  100: cssVariables['--primary-100'],
  500: cssVariables['--primary-500'],
  600: cssVariables['--primary-600'],
  700: cssVariables['--primary-700'],
  900: cssVariables['--primary-900'],
};

/**
 * Helper específico para colores secundarios
 */
export const secondaryColors = {
  50: cssVariables['--secondary-50'],
  100: cssVariables['--secondary-100'],
  500: cssVariables['--secondary-500'],
  600: cssVariables['--secondary-600'],
  700: cssVariables['--secondary-700'],
  900: cssVariables['--secondary-900'],
};

/**
 * Helper específico para colores de éxito
 */
export const successColors = {
  50: cssVariables['--success-50'],
  100: cssVariables['--success-100'],
  500: cssVariables['--success-500'],
  600: cssVariables['--success-600'],
  700: cssVariables['--success-700'],
  900: cssVariables['--success-900'],
};

/**
 * Helper específico para colores de advertencia
 */
export const warningColors = {
  50: cssVariables['--warning-50'],
  100: cssVariables['--warning-100'],
  500: cssVariables['--warning-500'],
  600: cssVariables['--warning-600'],
  700: cssVariables['--warning-700'],
  900: cssVariables['--warning-900'],
};

/**
 * Helper específico para colores grises
 */
export const grayColors = {
  50: cssVariables['--gray-50'],
  100: cssVariables['--gray-100'],
  200: cssVariables['--gray-200'],
  300: cssVariables['--gray-300'],
  400: cssVariables['--gray-400'],
  500: cssVariables['--gray-500'],
  600: cssVariables['--gray-600'],
  700: cssVariables['--gray-700'],
  800: cssVariables['--gray-800'],
  900: cssVariables['--gray-900'],
};

/**
 * 🎨 SISTEMA DE COLORES ESPECÍFICOS DE COOMUNITY
 */

/**
 * Colores de los 4 elementos - Centralizados y consistentes
 */
export const elementColors = {
  fuego: {
    primary: '#dc2626',    // Error-600 - Rojo fuego
    secondary: '#ef4444',  // Error-500 - Rojo más suave
    emoji: '🔥',
    name: 'Fuego'
  },
  agua: {
    primary: '#0ea5e9',    // Sky-500 - Azul agua
    secondary: '#38bdf8',  // Sky-400 - Azul más claro
    emoji: '💧',
    name: 'Agua'
  },
  tierra: {
    primary: '#8b5a2b',    // Brown-600 - Marrón tierra
    secondary: '#a16207',  // Yellow-700 - Dorado tierra
    emoji: '🌱',
    name: 'Tierra'
  },
  aire: {
    primary: '#6b7280',    // Gray-500 - Gris aire
    secondary: '#9ca3af',  // Gray-400 - Gris más claro
    emoji: '💨',
    name: 'Aire'
  }
} as const;

/**
 * Colores de los módulos principales - Centralizados y consistentes
 */
export const moduleColors = {
  uplay: {
    primary: primaryColors[500],     // '#6366f1' - Índigo
    secondary: secondaryColors[500], // '#8b5cf6' - Violeta
    gradient: `linear-gradient(135deg, ${primaryColors[500]} 0%, ${secondaryColors[500]} 100%)`,
    element: 'fuego'
  },
  marketplace: {
    primary: successColors[500],     // '#10b981' - Verde
    secondary: successColors[600],   // '#059669' - Verde más oscuro
    gradient: `linear-gradient(135deg, ${successColors[500]} 0%, ${successColors[600]} 100%)`,
    element: 'tierra'
  },
  social: {
    primary: secondaryColors[500],   // '#8b5cf6' - Violeta
    secondary: secondaryColors[600], // '#7c3aed' - Violeta más oscuro
    gradient: `linear-gradient(135deg, ${secondaryColors[500]} 0%, ${secondaryColors[600]} 100%)`,
    element: 'agua'
  },
  ustats: {
    primary: warningColors[500],     // '#f59e0b' - Amarillo
    secondary: warningColors[600],   // '#d97706' - Amarillo más oscuro
    gradient: `linear-gradient(135deg, ${warningColors[500]} 0%, ${warningColors[600]} 100%)`,
    element: 'aire'
  }
} as const;

/**
 * Helper para obtener colores de elemento
 */
export const getElementColor = (element: keyof typeof elementColors) => {
  return elementColors[element];
};

/**
 * Helper para obtener colores de módulo
 */
export const getModuleColor = (module: keyof typeof moduleColors) => {
  return moduleColors[module];
};

/**
 * Helper para generar gradientes consistentes
 */
export const createGradient = (color1: string, color2: string, direction = '135deg') => {
  return `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;
}; 