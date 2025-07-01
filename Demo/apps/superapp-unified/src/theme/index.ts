/**
 * Sistema de Temas Unificado para SuperApp CoomÜnity
 *
 * Este archivo centraliza todas las exportaciones relacionadas con el sistema de temas,
 * proporcionando una interfaz limpia y unificada para toda la aplicación.
 */

// Import the GuardianColorProvider and its hook
import {
  GuardianColorProvider,
  GuardianColorProviderProps,
  useGuardianColors,
  GuardianColorContextType
} from '../components/theme/GuardianColorProvider';

// Import colors and utilities
import { THEME_PALETTES, ELEMENT_COLORS, MODULE_COLORS, SEMANTIC_COLORS, CONCEPT_COLORS } from './colors';
import { cn, getButtonClasses, getCardClasses, withOpacity, generateGradient } from './utils';

// Export everything
export {
  GuardianColorProvider,
  useGuardianColors,
  THEME_PALETTES,
  ELEMENT_COLORS,
  MODULE_COLORS,
  SEMANTIC_COLORS,
  CONCEPT_COLORS,
  cn,
  getButtonClasses,
  getCardClasses,
  withOpacity,
  generateGradient
};

// Export useGuardianColors as useTheme for backward compatibility
export { useGuardianColors as useTheme } from '../components/theme/GuardianColorProvider';

// Re-export useTheme from MUI for components that need direct access to MUI theme
export { useTheme as useMuiTheme } from '@mui/material/styles';

// Export types
export type { GuardianColorProviderProps, GuardianColorContextType };

// Exportar el sistema de colores unificado
export {
  BRAND_COLORS,
  GRADIENTS,
  UNIFIED_COLORS
} from './colors';

// Constantes de temas
export const THEMES = {
  MINIMALIST: 'minimalist',
  MONOCHROME: 'monochrome'
};

// Exportar utilidades de estilo
export { elementColors } from '../utils/styles';

// Exportar constantes de accesibilidad
export const ACCESSIBILITY = {
  HIGH_CONTRAST: 'high-contrast',
  REDUCED_MOTION: 'reduced-motion',
  LARGE_TEXT: 'large-text',
  INCREASED_SPACING: 'increased-spacing'
};
