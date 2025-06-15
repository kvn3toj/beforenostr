/**
 * Gamifier Design System
 * 
 * Sistema de diseño centralizado que incluye:
 * - Tokens de diseño (colores, espaciado, tipografía)
 * - Componentes atómicos (Button, TextField)
 * - Componentes moleculares (Card)
 * 
 * Uso:
 * import { Button, TextField, Card, colors, spacing } from '@/components/design-system';
 */

// === TOKENS DE DISEÑO ===
export { colors, type ColorTokens } from './tokens/colors';
export { spacing, componentSpacing, getSpacing, type SpacingTokens, type ComponentSpacingTokens } from './tokens/spacing';
export { typography, textStyles, type TypographyTokens, type TextStyleTokens } from './tokens/typography';

// === COMPONENTES ATÓMICOS ===
export { Button, type ButtonProps } from './atoms/Button';
export { IconButton } from './atoms/IconButton';
export { TextField, type TextFieldProps } from './atoms/TextField';

// === COMPONENTES MOLECULARES ===
export { Card, type CardProps } from './molecules/Card';

// === UTILIDADES ===

/**
 * Helper para aplicar estilos de texto consistentes
 */
export const applyTextStyle = (styleName: keyof typeof textStyles) => textStyles[styleName];

/**
 * Helper para obtener colores con opacidad
 */
export const getColorWithOpacity = (color: string, opacity: number) => {
  if (color.startsWith('rgba')) return color;
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return `rgba(${color}, ${opacity})`;
};

/**
 * Helper para crear sombras consistentes
 */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.03)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
} as const;

export type ShadowTokens = typeof shadows; 