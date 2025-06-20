// ===== COOMUNITY SUPERAPP - STYLE UTILITIES =====

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 * Uses clsx for conditional classes and tailwind-merge for conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ===== PREDEFINED COMPONENT VARIANTS =====

/**
 * Button variants following CoomÜnity design system
 */
export const buttonVariants = {
  variant: {
    primary: 'bg-coomunity-500 text-white hover:bg-coomunity-600 focus:ring-2 focus:ring-coomunity-500 focus:ring-offset-2',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    outline: 'border border-coomunity-500 text-coomunity-500 hover:bg-coomunity-50 focus:ring-2 focus:ring-coomunity-500 focus:ring-offset-2',
    ghost: 'text-coomunity-500 hover:bg-coomunity-50 focus:ring-2 focus:ring-coomunity-500 focus:ring-offset-2',
    success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-2 focus:ring-success-500 focus:ring-offset-2',
    warning: 'bg-warning-500 text-white hover:bg-warning-600 focus:ring-2 focus:ring-warning-500 focus:ring-offset-2',
    error: 'bg-error-500 text-white hover:bg-error-600 focus:ring-2 focus:ring-error-500 focus:ring-offset-2',
    gold: 'bg-gold-500 text-white hover:bg-gold-600 focus:ring-2 focus:ring-gold-500 focus:ring-offset-2',
  },
  size: {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  },
  base: 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
};

/**
 * Card variants following CoomÜnity design system
 */
export const cardVariants = {
  variant: {
    elevated: 'bg-white shadow-md border border-gray-100',
    outlined: 'bg-white border border-gray-200',
    ghost: 'bg-gray-50 border border-transparent',
    coomunity: 'bg-gradient-to-br from-coomunity-50 to-coomunity-100 border border-coomunity-200',
    gold: 'bg-gradient-to-br from-gold-50 to-gold-100 border border-gold-200',
  },
  padding: {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  },
  interactive: {
    true: 'hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-200',
    false: '',
  },
  base: 'rounded-lg transition-all duration-200',
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
  ayniFlow: 'animate-ayni-flow',
  
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
 * Generate button classes with variants
 */
export function getButtonClasses(
  variant: keyof typeof buttonVariants.variant = 'primary',
  size: keyof typeof buttonVariants.size = 'md',
  className?: string
) {
  return cn(
    buttonVariants.base,
    buttonVariants.variant[variant],
    buttonVariants.size[size],
    className
  );
}

/**
 * Generate card classes with variants
 */
export function getCardClasses(
  variant: keyof typeof cardVariants.variant = 'elevated',
  padding: keyof typeof cardVariants.padding = 'md',
  interactive: boolean = false,
  className?: string
) {
  return cn(
    cardVariants.base,
    cardVariants.variant[variant],
    cardVariants.padding[padding],
    interactive ? cardVariants.interactive.true : cardVariants.interactive.false,
    className
  );
}

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
  // Ayni (Reciprocity) - Balanced colors
  ayni: {
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

/**
 * Element-based color system aligned with CoomÜnity philosophy
 * Each element represents different aspects of growth and contribution
 */
export const elementColors = {
  tierra: {
    // Earth: Stability, trust, foundation
    primary: '#92400e', // Warm brown
    secondary: '#d97706', // Amber
    light: '#fef3c7', // Light amber
    text: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    chip: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  agua: {
    // Water: Flow, adaptability, clarity
    primary: '#0891b2', // Deep cyan
    secondary: '#06b6d4', // Cyan
    light: '#cffafe', // Light cyan
    text: 'text-cyan-800',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    chip: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  fuego: {
    // Fire: Passion, action, transformation
    primary: '#dc2626', // Red
    secondary: '#f97316', // Orange
    light: '#fed7d7', // Light red
    text: 'text-red-800',
    bg: 'bg-red-50',
    border: 'border-red-200',
    chip: 'bg-red-100 text-red-800 border-red-200',
  },
  aire: {
    // Air: Vision, communication, ideas
    primary: '#7c3aed', // Purple (consistent with CoomÜnity primary)
    secondary: '#8b5cf6', // Violet
    light: '#f3e8ff', // Light purple
    text: 'text-purple-800',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    chip: 'bg-purple-100 text-purple-800 border-purple-200',
  },
};

/**
 * Get element-based color classes
 * @param element - The element type (tierra, agua, fuego, aire)
 * @param type - The type of color class needed
 * @returns The appropriate Tailwind CSS class
 */
export function getElementColor(
  element: keyof typeof elementColors,
  type: keyof typeof elementColors.tierra
): string {
  return elementColors[element]?.[type] || elementColors.aire[type];
}

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