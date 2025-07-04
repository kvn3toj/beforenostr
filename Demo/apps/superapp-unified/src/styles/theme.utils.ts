import { alpha } from '@mui/material/styles';
import { CoomunityTheme } from './theme.types';

// Función para obtener el color de contraste basado en el tema actual
export const getContrastColor = (theme: CoomunityTheme, color: string) => {
  return theme.palette.getContrastText(color);
};

// Función para aplicar transparencia a un color
export const withAlpha = (color: string, opacity: number) => {
  return alpha(color, opacity);
};

// Función para obtener el color de fondo basado en el modo del tema
export const getBackgroundColor = (theme: CoomunityTheme) => {
  return theme.palette.mode === 'dark'
    ? theme.palette.grey[900]
    : theme.palette.background.default;
};

// Función para obtener el color de texto basado en el modo del tema
export const getTextColor = (theme: CoomunityTheme) => {
  return theme.palette.mode === 'dark'
    ? theme.palette.grey[100]
    : theme.palette.text.primary;
};

// Función para obtener el color de borde basado en el modo del tema
export const getBorderColor = (theme: CoomunityTheme) => {
  return theme.palette.mode === 'dark'
    ? theme.palette.grey[700]
    : theme.palette.grey[200];
};

// Función para obtener el color de hover basado en el modo del tema
export const getHoverColor = (theme: CoomunityTheme) => {
  return theme.palette.mode === 'dark'
    ? theme.palette.grey[800]
    : theme.palette.grey[100];
};

// Función para obtener el color de fondo de tarjeta basado en el modo del tema
export const getCardBackgroundColor = (theme: CoomunityTheme) => {
  return theme.palette.mode === 'dark'
    ? theme.palette.grey[800]
    : theme.palette.background.paper;
};

// Función para obtener el color de sombra basado en el modo del tema
export const getShadowColor = (theme: CoomunityTheme) => {
  return theme.palette.mode === 'dark'
    ? 'rgba(0, 0, 0, 0.2)'
    : 'rgba(40, 54, 24, 0.1)';
};

// Función para obtener el color de gradiente basado en el modo del tema
export const getGradientColor = (theme: CoomunityTheme) => {
  const colors = theme.palette.mode === 'dark'
    ? {
        start: theme.palette.primary.light,
        middle: theme.palette.secondary.light,
        end: theme.palette.error.light,
      }
    : {
        start: theme.palette.primary.main,
        middle: theme.palette.secondary.main,
        end: theme.palette.error.main,
      };

  return `linear-gradient(135deg, ${colors.start} 0%, ${colors.middle} 50%, ${colors.end} 100%)`;
};

// Función para obtener el color de acento basado en el elemento
export const getElementColor = (theme: CoomunityTheme, element: 'fuego' | 'agua' | 'tierra' | 'aire') => {
  switch (element) {
    case 'fuego':
      return theme.palette.error.main;
    case 'agua':
      return theme.palette.info.main;
    case 'tierra':
      return theme.palette.success.main;
    case 'aire':
      return theme.palette.warning.main;
    default:
      return theme.palette.primary.main;
  }
};

// Función para obtener el gradiente de elemento
export const getElementGradient = (theme: CoomunityTheme, element: 'fuego' | 'agua' | 'tierra' | 'aire') => {
  const baseColor = getElementColor(theme, element);
  const lightColor = theme.palette.mode === 'dark'
    ? alpha(baseColor, 0.2)
    : alpha(baseColor, 0.1);

  return `linear-gradient(135deg, ${baseColor} 0%, ${lightColor} 100%)`;
};

// Función para obtener estilos de glassmorphism
export const getGlassmorphismStyles = (theme: CoomunityTheme, intensity: number = 0.1) => {
  return {
    backgroundColor: alpha(theme.palette.background.paper, intensity),
    backdropFilter: 'blur(8px)',
    border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
    boxShadow: `0 4px 30px ${alpha(theme.palette.common.black, 0.1)}`,
  };
};

// Función para obtener estilos de elevación
export const getElevationStyles = (theme: CoomunityTheme, elevation: number = 1) => {
  return {
    boxShadow: theme.shadows[elevation],
    backgroundColor: getCardBackgroundColor(theme),
    border: `1px solid ${getBorderColor(theme)}`,
  };
};

// Función para obtener estilos de transición
export const getTransitionStyles = (properties: string[] = ['all']) => {
  return {
    transition: properties
      .map(prop => `${prop} 250ms cubic-bezier(0.4, 0, 0.2, 1)`)
      .join(', '),
  };
};

// Función para obtener estilos de hover
export const getHoverStyles = (theme: CoomunityTheme) => {
  return {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 16px ${getShadowColor(theme)}`,
    },
  };
};

// Función para obtener estilos de active
export const getActiveStyles = () => {
  return {
    '&:active': {
      transform: 'translateY(0)',
    },
  };
};

// Función para obtener estilos de disabled
export const getDisabledStyles = (theme: CoomunityTheme) => {
  return {
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      color: theme.palette.text.disabled,
      backgroundColor: theme.palette.action.disabledBackground,
    },
  };
};

// Función para obtener estilos de focus
export const getFocusStyles = (theme: CoomunityTheme) => {
  return {
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
  };
};
