/**
 * Utilidades de estilos de foco para accesibilidad WCAG
 * Proporciona estilos consistentes para indicadores de foco visual
 */

import { colors } from '../../components/design-system/tokens/colors';

/**
 * Genera estilos de foco base para componentes
 */
export const createFocusStyles = (customColor?: string) => ({
  '&:focus': {
    outline: 'none', // Removemos outline por defecto
  },
  '&:focus-visible': {
    outline: `3px solid ${customColor || colors.accessibility.focusRing}`,
    outlineOffset: '2px',
    boxShadow: `0 0 0 4px ${colors.accessibility.focusRingOpacity}`,
    borderRadius: '4px',
  },
});

/**
 * Estilos de foco para botones (mejorados para mayor visibilidad)
 */
export const buttonFocusStyles = {
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: `3px solid ${colors.accessibility.focusRing} !important`,
    outlineOffset: '2px !important',
    boxShadow: `0 0 0 1px ${colors.background.paper}, 0 0 0 5px ${colors.accessibility.focusRingOpacity} !important`,
    zIndex: 10,
    position: 'relative',
  },
};

/**
 * Estilos de foco para campos de texto (mejorados)
 */
export const inputFocusStyles = {
  '&:focus': {
    outline: 'none !important',
    borderColor: `${colors.accessibility.focusRing} !important`,
    boxShadow: `0 0 0 3px ${colors.accessibility.focusRingOpacity} !important`,
  },
  '&:focus-visible': {
    outline: `2px solid ${colors.accessibility.focusRing} !important`,
    outlineOffset: '1px !important',
  },
};

/**
 * Estilos de foco para elementos de navegación (mejorados)
 */
export const navigationFocusStyles = {
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: `3px solid ${colors.accessibility.focusRing} !important`,
    outlineOffset: '2px !important',
    backgroundColor: `${colors.accessibility.focusRingOpacity} !important`,
    borderRadius: '4px !important',
    zIndex: 10,
  },
};

/**
 * Estilos de foco para skip links
 */
export const skipLinkFocusStyles = {
  '&:focus': {
    position: 'absolute !important',
    top: '8px !important',
    left: '8px !important',
    zIndex: 9999,
    backgroundColor: colors.accessibility.skipLinkBackground,
    color: colors.accessibility.skipLink,
    padding: '12px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    outline: `3px solid ${colors.accessibility.focusRing}`,
    outlineOffset: '2px',
    transform: 'translateY(0) !important',
    clip: 'auto !important',
    width: 'auto !important',
    height: 'auto !important',
    overflow: 'visible !important',
    border: `2px solid ${colors.accessibility.focusRing}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  '&:focus-visible': {
    position: 'absolute !important',
    top: '8px !important',
    left: '8px !important',
    zIndex: 9999,
    backgroundColor: colors.accessibility.skipLinkBackground,
    color: colors.accessibility.skipLink,
    padding: '12px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
    outline: `3px solid ${colors.accessibility.focusRing}`,
    outlineOffset: '2px',
    transform: 'translateY(0) !important',
    clip: 'auto !important',
    width: 'auto !important',
    height: 'auto !important',
    overflow: 'visible !important',
    border: `2px solid ${colors.accessibility.focusRing}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
};

/**
 * Estilos para ocultar skip links cuando no están en foco
 */
export const hiddenSkipLinkStyles = {
  position: 'absolute',
  top: '-50px',
  left: '-10000px',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  zIndex: -1,
  transform: 'translateY(-100px)',
};

/**
 * Hook personalizado para manejar estilos de foco por tipo de componente
 */
export const getFocusStylesByType = (type: 'button' | 'input' | 'navigation' | 'skiplink' | 'default') => {
  switch (type) {
    case 'button':
      return buttonFocusStyles;
    case 'input':
      return inputFocusStyles;
    case 'navigation':
      return navigationFocusStyles;
    case 'skiplink':
      return skipLinkFocusStyles;
    default:
      return createFocusStyles();
  }
};

/**
 * Utilidad para crear indicadores de foco con alto contraste
 */
export const highContrastFocusStyles = {
  '&:focus-visible': {
    outline: `4px solid ${colors.accessibility.highContrast.text} !important`,
    outlineOffset: '2px !important',
    backgroundColor: `${colors.accessibility.highContrast.background} !important`,
    color: `${colors.accessibility.highContrast.text} !important`,
    boxShadow: `0 0 0 8px ${colors.accessibility.focusRingOpacity} !important`,
    zIndex: 999,
  },
};

/**
 * Estilos para focus trap (contenedores que capturan el foco)
 */
export const focusTrapContainerStyles = {
  '&:focus': {
    outline: 'none',
  },
  // Para elementos que no deberían recibir foco normalmente
  '&[tabindex="-1"]:focus': {
    outline: 'none',
  },
};

/**
 * Utilidad para verificar si un elemento puede recibir foco
 */
export const focusableSelectors = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/**
 * Configuración de estilos CSS globales para foco mejorados
 * Para usar en el tema principal de MUI
 */
export const globalFocusStyles = {
  // Reset de outline por defecto
  '*:focus': {
    outline: 'none',
  },
  // Aplicar estilos solo en navegación por teclado con más visibilidad
  '*:focus-visible': {
    outline: `3px solid ${colors.accessibility.focusRing} !important`,
    outlineOffset: '2px !important',
    borderRadius: '4px !important',
  },
  // Especial para elementos interactivos
  'button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible': {
    boxShadow: `0 0 0 4px ${colors.accessibility.focusRingOpacity} !important`,
    zIndex: 10,
  },
  // Mejorar skip links
  'a[href^="#"]:focus, a[href^="#"]:focus-visible': {
    position: 'absolute !important',
    top: '8px !important',
    left: '8px !important',
    zIndex: 9999,
    backgroundColor: `${colors.accessibility.skipLinkBackground} !important`,
    color: `${colors.accessibility.skipLink} !important`,
    padding: '12px 20px !important',
    borderRadius: '6px !important',
    textDecoration: 'none !important',
    fontWeight: 'bold !important',
    fontSize: '16px !important',
    outline: `3px solid ${colors.accessibility.focusRing} !important`,
    outlineOffset: '2px !important',
    transform: 'translateY(0) !important',
    clip: 'auto !important',
    width: 'auto !important',
    height: 'auto !important',
    overflow: 'visible !important',
  },
}; 