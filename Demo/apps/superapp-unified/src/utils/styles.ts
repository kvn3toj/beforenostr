/**
 * Utilidades de estilo para la SuperApp CoomÜnity
 * ===============================================================================
 * Este archivo proporciona funciones y constantes para aplicar estilos consistentes
 * en toda la aplicación, siguiendo el sistema de diseño unificado.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ELEMENT_COLORS, CONCEPT_COLORS } from '../theme/colors';

/**
 * Utilidad para combinar nombres de clase de manera eficiente
 * Combina clsx (para condicionales) con tailwind-merge (para resolver conflictos)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Colores de los elementos filosóficos para fácil acceso
 */
export const elementColors = {
  fuego: {
    primary: ELEMENT_COLORS.fuego.primary,
    light: ELEMENT_COLORS.fuego.light,
    dark: ELEMENT_COLORS.fuego.dark,
  },
  agua: {
    primary: ELEMENT_COLORS.agua.primary,
    light: ELEMENT_COLORS.agua.light,
    dark: ELEMENT_COLORS.agua.dark,
  },
  tierra: {
    primary: ELEMENT_COLORS.tierra.primary,
    light: ELEMENT_COLORS.tierra.light,
    dark: ELEMENT_COLORS.tierra.dark,
  },
  aire: {
    primary: ELEMENT_COLORS.aire.primary,
    light: ELEMENT_COLORS.aire.light,
    dark: ELEMENT_COLORS.aire.dark,
  },
  eter: {
    primary: ELEMENT_COLORS.eter.primary,
    light: ELEMENT_COLORS.eter.light,
    dark: ELEMENT_COLORS.eter.dark,
  },
};

/**
 * Colores de conceptos filosóficos para fácil acceso
 */
export const conceptColors = {
  reciprocidad: CONCEPT_COLORS.reciprocidad,
  meritos: CONCEPT_COLORS.meritos,
  ondas: CONCEPT_COLORS.ondas,
  lukas: CONCEPT_COLORS.lukas,
  bienComun: CONCEPT_COLORS.bienComun,
};

/**
 * Obtiene las clases CSS para un botón según su variante y tamaño
 */
export function getButtonClasses(
  variant: keyof typeof buttonVariants.variant = 'primary',
  size: keyof typeof buttonVariants.size = 'md',
  className?: string
): string {
  return cn(
    buttonVariants.base,
    buttonVariants.size[size],
    buttonVariants.variant[variant],
    className
  );
}

/**
 * Obtiene las clases CSS para una tarjeta según su variante y padding
 */
export function getCardClasses(
  variant: keyof typeof cardVariants.variant = 'elevated',
  padding: keyof typeof cardVariants.padding = 'md',
  interactive: boolean = false,
  className?: string
): string {
  return cn(
    cardVariants.base,
    cardVariants.variant[variant],
    cardVariants.padding[padding],
    interactive ? cardVariants.interactive.true : cardVariants.interactive.false,
    className
  );
}

/**
 * Genera un color con opacidad para superposiciones
 */
export function withOpacity(color: string, opacity: number): string {
  // Validar que el color esté en formato hexadecimal
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    return color; // Devolver el color original si no es hexadecimal
  }

  // Convertir color hex a RGB
  let r = 0, g = 0, b = 0;
  if (color.length === 4) {
    // #RGB format
    r = parseInt(color[1] + color[1], 16);
    g = parseInt(color[2] + color[2], 16);
    b = parseInt(color[3] + color[3], 16);
  } else {
    // #RRGGBB format
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  }

  // Devolver color en formato rgba
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Genera un degradado basado en un color base
 */
export function generateGradient(baseColor: string, direction: 'to-r' | 'to-b' | 'to-br' = 'to-r'): string {
  // Validar que el color esté en formato hexadecimal
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(baseColor)) {
    return `linear-gradient(${direction === 'to-r' ? '90deg' : direction === 'to-b' ? '180deg' : '135deg'}, ${baseColor}, ${baseColor})`;
  }

  // Convertir color hex a RGB
  let r = 0, g = 0, b = 0;
  if (baseColor.length === 4) {
    // #RGB format
    r = parseInt(baseColor[1] + baseColor[1], 16);
    g = parseInt(baseColor[2] + baseColor[2], 16);
    b = parseInt(baseColor[3] + baseColor[3], 16);
  } else {
    // #RRGGBB format
    r = parseInt(baseColor.slice(1, 3), 16);
    g = parseInt(baseColor.slice(3, 5), 16);
    b = parseInt(baseColor.slice(5, 7), 16);
  }

  // Crear una versión más oscura del color (para el final del gradiente)
  const darkenFactor = 0.2;
  const r2 = Math.max(0, Math.floor(r * (1 - darkenFactor)));
  const g2 = Math.max(0, Math.floor(g * (1 - darkenFactor)));
  const b2 = Math.max(0, Math.floor(b * (1 - darkenFactor)));

  // Convertir de nuevo a hex
  const darkColor = `#${r2.toString(16).padStart(2, '0')}${g2.toString(16).padStart(2, '0')}${b2.toString(16).padStart(2, '0')}`;

  // Devolver el gradiente
  const directionMap = {
    'to-r': '90deg',
    'to-b': '180deg',
    'to-br': '135deg'
  };

  return `linear-gradient(${directionMap[direction]}, ${baseColor}, ${darkColor})`;
}

/**
 * Obtiene el color de un elemento específico
 */
export function getElementColor(
  element: keyof typeof elementColors,
  type: keyof typeof elementColors.tierra = 'primary'
): string {
  return elementColors[element][type];
}

// ===== PREDEFINED COMPONENT VARIANTS =====

/**
 * Button variants following CoomÜnity design system
 */
export const buttonVariants = {
  variant: {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-sm',
    outline: 'border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
    ghost: 'bg-transparent hover:bg-accent hover:text-accent-foreground',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm',
    error: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    gold: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white hover:from-amber-500 hover:to-yellow-600 shadow-sm',
  },
  size: {
    xs: 'h-7 px-2 text-xs rounded',
    sm: 'h-8 px-3 text-sm rounded-md',
    md: 'h-10 px-4 text-sm rounded-md',
    lg: 'h-12 px-6 text-base rounded-lg',
    xl: 'h-14 px-8 text-lg rounded-lg',
  },
  base: 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
};

/**
 * Card variants following CoomÜnity design system
 */
export const cardVariants = {
  variant: {
    elevated: 'bg-white shadow-md dark:bg-gray-800',
    outlined: 'bg-white border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700',
    ghost: 'bg-gray-50 dark:bg-gray-900',
    coomunity: 'bg-white border-l-4 border-l-primary shadow-sm dark:bg-gray-800',
    gold: 'bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 shadow-sm dark:from-amber-900/30 dark:to-amber-800/30 dark:border-amber-700/50',
  },
  padding: {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
    xl: 'p-9',
  },
  interactive: {
    true: 'transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
    false: '',
  },
  base: 'rounded-xl overflow-hidden',
};

/**
 * Badge variants following CoomÜnity design system
 */
export const badgeVariants = {
  variant: {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-coomunity-100 text-coomunity-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    info: 'bg-info-100 text-info-800',
    gold: 'bg-gold-100 text-gold-800',
    earth: 'bg-earth-100 text-earth-800',
    water: 'bg-water-100 text-water-800',
    fire: 'bg-fire-100 text-fire-800',
    air: 'bg-air-100 text-air-800',
  },
  size: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  },
  base: 'inline-flex items-center font-medium rounded-full',
};

/**
 * Input variants following CoomÜnity design system
 */
export const inputVariants = {
  variant: {
    default: 'border-gray-300 focus:border-coomunity-500 focus:ring-coomunity-500',
    error: 'border-error-300 focus:border-error-500 focus:ring-error-500',
    success: 'border-success-300 focus:border-success-500 focus:ring-success-500',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  },
  base: 'block w-full rounded-lg border bg-white shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
};

// ===== ANIMATION UTILITIES =====

/**
 * Animation class helpers for consistent micro-interactions
 */
export const animations = {
  // Entrance animations
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  scaleIn: 'animate-scale-in',

  // Exit animations
  fadeOut: 'animate-fade-out',
  scaleOut: 'animate-scale-out',

  // Continuous animations
  pulse: 'animate-pulse-slow',
  glow: 'animate-glow',
  goldGlow: 'animate-gold-glow',
  reciprocidadFlow: 'animate-reciprocidad-flow',

  // Interactive animations
  bounce: 'animate-bounce-soft',
  wiggle: 'animate-wiggle',

  // CoomÜnity specific
  meritosCount: 'animate-meritos-count',
  ondasRipple: 'animate-ondas-ripple',

  // Hover effects
  hoverLift: 'coomunity-hover-lift',
  hoverScale: 'hover:scale-105 transition-transform duration-200',
  hoverGlow: 'hover:shadow-coomunity-glow transition-shadow duration-200',
  hoverGoldGlow: 'hover:shadow-gold-glow transition-shadow duration-200',
};

// ===== LAYOUT UTILITIES =====

/**
 * Container utilities for consistent spacing and max-widths
 */
export const containers = {
  sm: 'max-w-screen-sm mx-auto px-4',
  md: 'max-w-screen-md mx-auto px-4',
  lg: 'max-w-screen-lg mx-auto px-4',
  xl: 'max-w-screen-xl mx-auto px-4',
  '2xl': 'max-w-screen-2xl mx-auto px-4',
  full: 'w-full px-4',
  coomunity: 'max-w-6xl mx-auto px-4', // CoomÜnity standard container
};

/**
 * Spacing utilities following the design system
 */
export const spacing = {
  section: 'py-16 md:py-24', // Standard section spacing
  component: 'py-8 md:py-12', // Component spacing
  element: 'py-4 md:py-6', // Element spacing
  tight: 'py-2 md:py-3', // Tight spacing
};

// ===== GRADIENT UTILITIES =====

/**
 * Gradient utilities for CoomÜnity branding
 */
export const gradients = {
  coomunity: 'coomunity-gradient',
  gold: 'coomunity-gradient-gold',
  elements: 'coomunity-gradient-elements',
  textCoomunity: 'coomunity-text-gradient',

  // Custom gradients
  sunset: 'bg-gradient-to-r from-fire-400 via-warning-400 to-gold-400',
  ocean: 'bg-gradient-to-r from-water-400 via-info-400 to-coomunity-400',
  earth: 'bg-gradient-to-r from-earth-400 via-warning-600 to-earth-600',
  sky: 'bg-gradient-to-r from-air-400 via-coomunity-400 to-info-400',
};

// ===== FOCUS UTILITIES =====

/**
 * Focus utilities for accessibility
 */
export const focus = {
  ring: 'coomunity-focus-ring',
  visible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coomunity-500 focus-visible:ring-offset-2',
  within: 'focus-within:ring-2 focus-within:ring-coomunity-500 focus-within:ring-offset-2',
};

// ===== RESPONSIVE UTILITIES =====

/**
 * Responsive utilities for consistent breakpoints
 */
export const responsive = {
  hide: {
    mobile: 'hidden md:block',
    desktop: 'block md:hidden',
    tablet: 'hidden md:block lg:hidden',
  },
  show: {
    mobile: 'block md:hidden',
    desktop: 'hidden md:block',
    tablet: 'hidden md:block lg:hidden',
  },
};

// ===== HELPER FUNCTIONS =====

/**
 * Generate badge classes with variants
 */
export function getBadgeClasses(
  variant: keyof typeof badgeVariants.variant = 'default',
  size: keyof typeof badgeVariants.size = 'md',
  className?: string
) {
  return cn(
    badgeVariants.base,
    badgeVariants.variant[variant],
    badgeVariants.size[size],
    className
  );
}

/**
 * Generate input classes with variants
 */
export function getInputClasses(
  variant: keyof typeof inputVariants.variant = 'default',
  size: keyof typeof inputVariants.size = 'md',
  className?: string
) {
  return cn(
    inputVariants.base,
    inputVariants.variant[variant],
    inputVariants.size[size],
    className
  );
}

// ===== COOMUNITY SPECIFIC UTILITIES =====

/**
 * CoomÜnity philosophy-aligned color utilities
 */
export const coomunityColors = {
  // Reciprocidad (Reciprocity) - Balanced colors
  reciprocidad: {
    primary: 'text-coomunity-600 bg-coomunity-50',
    secondary: 'text-coomunity-500 bg-coomunity-25',
    accent: 'text-coomunity-700 bg-coomunity-100',
  },

  // Bien Común (Common Good) - Community colors
  bienComun: {
    primary: 'text-success-600 bg-success-50',
    secondary: 'text-success-500 bg-success-25',
    accent: 'text-success-700 bg-success-100',
  },

  // Mëritos - Achievement colors
  meritos: {
    primary: 'text-gold-600 bg-gold-50',
    secondary: 'text-gold-500 bg-gold-25',
    accent: 'text-gold-700 bg-gold-100',
  },

  // Öndas - Energy colors
  ondas: {
    primary: 'text-info-600 bg-info-50',
    secondary: 'text-info-500 bg-info-25',
    accent: 'text-info-700 bg-info-100',
  },
};

/**
 * Element-based styling (Tierra, Agua, Fuego, Aire)
 */
export const elements = {
  tierra: {
    bg: 'bg-earth-500',
    text: 'text-earth-600',
    border: 'border-earth-300',
    gradient: 'bg-gradient-to-br from-earth-400 to-earth-600',
    chip: 'bg-earth-100 text-earth-800 border-earth-200',
  },
  agua: {
    bg: 'bg-water-500',
    text: 'text-water-600',
    border: 'border-water-300',
    gradient: 'bg-gradient-to-br from-water-400 to-water-600',
    chip: 'bg-water-100 text-water-800 border-water-200',
  },
  fuego: {
    bg: 'bg-fire-500',
    text: 'text-fire-600',
    border: 'border-fire-300',
    gradient: 'bg-gradient-to-br from-fire-400 to-fire-600',
    chip: 'bg-fire-100 text-fire-800 border-fire-200',
  },
  aire: {
    bg: 'bg-air-500',
    text: 'text-air-600',
    border: 'border-air-300',
    gradient: 'bg-gradient-to-br from-air-400 to-air-600',
    chip: 'bg-air-100 text-air-800 border-air-200',
  },
};

export default {
  cn,
  buttonVariants,
  cardVariants,
  badgeVariants,
  inputVariants,
  animations,
  containers,
  spacing,
  gradients,
  focus,
  responsive,
  getButtonClasses,
  getCardClasses,
  getBadgeClasses,
  getInputClasses,
  coomunityColors,
  elements,
  elementColors,
  getElementColor,
};
