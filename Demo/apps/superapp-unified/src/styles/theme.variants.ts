import { CoomunityThemeOptions } from './theme.types';
import { alpha } from '@mui/material/styles';

// Definir los colores base para cada elemento
const elementColors = {
  fuego: {
    main: '#bc6c25', // Terracota
    light: '#d08645',
    dark: '#a85a1a',
    contrastText: '#ffffff',
  },
  agua: {
    main: '#005CA9', // Azul Coomunity
    light: '#2196F3', // Azul más claro para highlights
    dark: '#142C46', // Azul oscuro Coomunity
    contrastText: '#ffffff',
  },
  tierra: {
    main: '#606c38', // Verde oliva
    light: '#606c38',
    dark: '#283618',
    contrastText: '#ffffff',
  },
  aire: {
    main: '#dda15e', // Ocre
    light: '#e4b871',
    dark: '#c9964a',
    contrastText: '#ffffff',
  },
};

const categoryColors = {
  CHARLAS_INSPIRADORAS: '#9c27b0',
  LIFEHACKS_SABIDURIA: '#ff9800',
  DOCUMENTALES_CONSCIENTES: '#2196f3',
  SABIDURIA_TRANSFORMADORA: '#4caf50',
  SERIES_TEMATICAS: '#f44336',
  DEFAULT: '#ff6b35',
};

const difficultyColors = {
  BEGINNER: '#4caf50',
  INTERMEDIATE: '#ff9800',
  ADVANCED: '#f44336',
  EXPERT: '#9c27b0',
};

// Función para crear una variante de tema basada en un elemento
export const createElementTheme = (element: keyof typeof elementColors): Partial<CoomunityThemeOptions> => {
  const colors = elementColors[element];
  const gradient = element === 'agua'
    ? `linear-gradient(135deg, ${colors.dark} 0%, ${colors.main} 100%)`
    : `linear-gradient(135deg, ${colors.main} 0%, ${colors.light} 100%)`;

  return {
    palette: {
      primary: colors,
      secondary: {
        main: elementColors.aire.main,
        light: elementColors.aire.light,
        dark: elementColors.aire.dark,
        contrastText: elementColors.aire.contrastText,
      },
      background: {
        default: alpha(colors.main, 0.05),
        paper: '#ffffff',
      },
      text: {
        primary: colors.dark,
        secondary: colors.main,
        disabled: alpha(colors.dark, 0.38),
      },
      category: categoryColors,
      difficulty: difficultyColors,
      common: {
        black: '#000',
        white: '#fff',
        gold: '#ffd700',
        lightGrey: '#f8f9fa',
        darkGrey: '#e0e0e0',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            background: gradient,
            color: colors.contrastText,
            '&:hover': {
              background: gradient,
              filter: 'brightness(1.1)',
            },
          },
          outlined: {
            borderColor: colors.main,
            color: colors.dark,
            '&:hover': {
              borderColor: colors.light,
              backgroundColor: alpha(colors.light, 0.1),
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            '&::before': {
              background: gradient,
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          bar: {
            background: gradient,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            background: gradient,
            '&:hover': {
              background: gradient,
              filter: 'brightness(1.1)',
            },
          },
        },
      },
    },
  };
};

// Crear las variantes de tema para cada elemento
export const fuegoTheme = createElementTheme('fuego');
export const aguaTheme = createElementTheme('agua');
export const tierraTheme = createElementTheme('tierra');
export const aireTheme = createElementTheme('aire');

// Función para obtener la variante de tema basada en el elemento
export const getElementTheme = (element: keyof typeof elementColors) => {
  switch (element) {
    case 'fuego':
      return fuegoTheme;
    case 'agua':
      return aguaTheme;
    case 'tierra':
      return tierraTheme;
    case 'aire':
      return aireTheme;
    default:
      return tierraTheme; // Tema por defecto
  }
};

// Función para obtener el color de acento basado en el elemento
export const getElementAccentColor = (element: keyof typeof elementColors) => {
  return elementColors[element].main;
};

// Función para obtener el gradiente basado en el elemento
export const getElementGradient = (element: keyof typeof elementColors) => {
  const colors = elementColors[element];
  if (element === 'agua') {
    return `linear-gradient(135deg, ${colors.dark} 0%, ${colors.main} 100%)`;
  }
  return `linear-gradient(135deg, ${colors.main} 0%, ${colors.light} 100%)`;
};

// Función para obtener el color de fondo basado en el elemento
export const getElementBackgroundColor = (element: keyof typeof elementColors) => {
  return alpha(elementColors[element].main, 0.05);
};

// Función para obtener el color de texto basado en el elemento
export const getElementTextColor = (element: keyof typeof elementColors) => {
  return elementColors[element].dark;
};

// Función para obtener el color de borde basado en el elemento
export const getElementBorderColor = (element: keyof typeof elementColors) => {
  return elementColors[element].main;
};

// Función para obtener el color de hover basado en el elemento
export const getElementHoverColor = (element: keyof typeof elementColors) => {
  return alpha(elementColors[element].light, 0.1);
};

// Función para obtener el color de sombra basado en el elemento
export const getElementShadowColor = (element: keyof typeof elementColors) => {
  return alpha(elementColors[element].dark, 0.2);
};

// Función para obtener el color de contraste basado en el elemento
export const getElementContrastColor = (element: keyof typeof elementColors) => {
  return elementColors[element].contrastText;
};

// Función para obtener el color de foco basado en el elemento
export const getElementFocusColor = (element: keyof typeof elementColors) => {
  return alpha(elementColors[element].main, 0.2);
};

// Función para obtener el color de deshabilitado basado en el elemento
export const getElementDisabledColor = (element: keyof typeof elementColors) => {
  return alpha(elementColors[element].main, 0.3);
};

// Función para obtener el color de error basado en el elemento
export const getElementErrorColor = (element: keyof typeof elementColors) => {
  return elementColors.fuego.main;
};

// Función para obtener el color de éxito basado en el elemento
export const getElementSuccessColor = (element: keyof typeof elementColors) => {
  return elementColors.tierra.main;
};

// Función para obtener el color de advertencia basado en el elemento
export const getElementWarningColor = (element: keyof typeof elementColors) => {
  return elementColors.aire.main;
};

// Función para obtener el color de información basado en el elemento
export const getElementInfoColor = (element: keyof typeof elementColors) => {
  return elementColors.agua.main;
};
