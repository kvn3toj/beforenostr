/* ===============================================================================
   🍂 TEMA MATERIAL-UI OTOÑO VERDADERO - COOMUNITY SUPERAPP
   Colores cálidos, terrosos y acogedores del otoño
   =============================================================================== */

import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { CoomunityPaletteOptions, CoomunityThemeOptions } from './theme.types';
import {
  accessibilityStyles,
  getHighContrastStyles,
  getReducedMotionStyles,
  getLargeFontStyles,
  getLargeSpacingStyles,
} from './theme.accessibility';

// Definir los colores base de CoomÜnity
const coomunityColors = {
  primary: {
    main: '#606c38', // Verde Oliva - Acento Primario
    light: '#606c38', // Usar mismo tono para hover o estados
    dark: '#283618',  // Verde Bosque Oscuro - Texto principal
    contrastText: '#fefae0', // Fondo Claro
  },
  secondary: {
    main: '#dda15e', // Ocre - Acento Secundario
    light: '#e4b871',
    dark: '#c9964a',
    contrastText: '#ffffff',
  },
  error: {
    main: '#bc6c25', // Terracota para alertas sutiles
    light: '#d08645',
    dark: '#a85a1a',
    contrastText: '#ffffff',
  },
  success: {
    main: '#606c38', // Verde Oliva para éxito
    light: '#606c38',
    dark: '#283618',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#dda15e', // Ocre para advertencias
    light: '#e4b871',
    dark: '#c9964a',
    contrastText: '#ffffff',
  },
  info: {
    main: '#bc6c25', // Terracota para información
    light: '#d08645',
    dark: '#a85a1a',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    A100: '#f5f5f4',
    A200: '#e7e5e4',
    A400: '#a8a29e',
    A700: '#44403c',
  },
  common: {
    black: '#000000',
    white: '#ffffff',
  },
  text: {
    primary: '#283618', // Verde Bosque Oscuro - Texto principal
    secondary: '#606c38', // Verde Oliva - Texto secundario
    disabled: '#a8a29e', // Gris medio para texto deshabilitado
  },
  background: {
    default: '#fefae0', // Blanco Hueso - Fondo principal
    paper: '#ffffff', // Blanco puro para cards
  },
} as CoomunityPaletteOptions;

// Configuración base del tema CoomÜnity
const coomunityThemeOptions: CoomunityThemeOptions = {
  palette: {
    mode: 'light',
    ...coomunityColors,
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.75rem',
      fontWeight: 800,
      lineHeight: 1.1,
      color: coomunityColors.text.primary,
      textShadow: '0 1px 2px rgba(40, 54, 24, 0.1)',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 800,
      lineHeight: 1.2,
      color: coomunityColors.text.primary,
      textShadow: '0 1px 2px rgba(40, 54, 24, 0.1)',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: coomunityColors.text.primary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: coomunityColors.text.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: coomunityColors.text.primary,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: coomunityColors.text.primary,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.7,
      color: coomunityColors.grey[700],
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.6,
      color: coomunityColors.grey[700],
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: coomunityColors.primary.main,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: coomunityColors.primary.main,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: coomunityColors.grey[600],
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      lineHeight: 1.4,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: coomunityColors.secondary.main,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(40, 54, 24, 0.1), 0 1px 2px rgba(40, 54, 24, 0.06)',
    '0 2px 4px rgba(40, 54, 24, 0.1), 0 1px 2px rgba(40, 54, 24, 0.06)',
    '0 4px 8px rgba(40, 54, 24, 0.12), 0 2px 4px rgba(40, 54, 24, 0.08)',
    '0 4px 8px rgba(40, 54, 24, 0.12), 0 2px 4px rgba(40, 54, 24, 0.08)',
    '0 8px 16px rgba(40, 54, 24, 0.15), 0 4px 8px rgba(40, 54, 24, 0.08)',
    '0 8px 16px rgba(40, 54, 24, 0.15), 0 4px 8px rgba(40, 54, 24, 0.08)',
    '0 8px 16px rgba(40, 54, 24, 0.15), 0 4px 8px rgba(40, 54, 24, 0.08)',
    '0 12px 24px rgba(40, 54, 24, 0.18), 0 6px 12px rgba(40, 54, 24, 0.12)',
    '0 12px 24px rgba(40, 54, 24, 0.18), 0 6px 12px rgba(40, 54, 24, 0.12)',
    '0 12px 24px rgba(40, 54, 24, 0.18), 0 6px 12px rgba(40, 54, 24, 0.12)',
    '0 12px 24px rgba(40, 54, 24, 0.18), 0 6px 12px rgba(40, 54, 24, 0.12)',
    '0 12px 24px rgba(40, 54, 24, 0.18), 0 6px 12px rgba(40, 54, 24, 0.12)',
    '0 12px 24px rgba(40, 54, 24, 0.18), 0 6px 12px rgba(40, 54, 24, 0.12)',
    '0 12px 24px rgba(40, 54, 24, 0.18), 0 6px 12px rgba(40, 54, 24, 0.12)',
    '0 12px 24px rgba(40, 54, 24, 0.18), 0 6px 12px rgba(40, 54, 24, 0.12)',
    '0 12px 24px rgba(40, 54, 24, 0.18), 0 6px 12px rgba(40, 54, 24, 0.12)',
    '0 12px 24px rgba(40, 54, 24, 0.18), 0 6px 12px rgba(40, 54, 24, 0.12)',
    '0 16px 32px rgba(40, 54, 24, 0.2), 0 8px 16px rgba(40, 54, 24, 0.15)',
    '0 16px 32px rgba(40, 54, 24, 0.2), 0 8px 16px rgba(40, 54, 24, 0.15)',
    '0 16px 32px rgba(40, 54, 24, 0.2), 0 8px 16px rgba(40, 54, 24, 0.15)',
    '0 16px 32px rgba(40, 54, 24, 0.2), 0 8px 16px rgba(40, 54, 24, 0.15)',
    '0 16px 32px rgba(40, 54, 24, 0.2), 0 8px 16px rgba(40, 54, 24, 0.15)',
    '0 16px 32px rgba(40, 54, 24, 0.2), 0 8px 16px rgba(40, 54, 24, 0.15)',
    '0 16px 32px rgba(40, 54, 24, 0.2), 0 8px 16px rgba(40, 54, 24, 0.15)',
  ],
  transitions: {
    duration: {
      shortest: 180,
      shorter: 250,
      short: 300,
      standard: 350,
      complex: 450,
      enteringScreen: 280,
      leavingScreen: 220,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: coomunityColors.background.default,
          color: coomunityColors.text.primary,
          scrollbarWidth: 'thin',
          scrollbarColor: `${coomunityColors.grey[300]} ${coomunityColors.grey[100]}`,
          '&::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: coomunityColors.primary.main,
            borderRadius: 6,
            '&:hover': {
              backgroundColor: coomunityColors.primary.light,
            },
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: coomunityColors.grey[100],
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '12px 24px',
          boxShadow: '0 2px 4px rgba(40, 54, 24, 0.1), 0 1px 2px rgba(40, 54, 24, 0.06)',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(40, 54, 24, 0.15), 0 2px 4px rgba(40, 54, 24, 0.08)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${coomunityColors.primary.main} 0%, ${coomunityColors.secondary.main} 100%)`,
          color: coomunityColors.primary.contrastText,
          '&:hover': {
            background: `linear-gradient(135deg, ${coomunityColors.primary.dark} 0%, ${coomunityColors.secondary.dark} 100%)`,
            filter: 'brightness(1.05)',
          },
        },
        outlined: {
          borderColor: coomunityColors.primary.main,
          color: coomunityColors.primary.dark,
          backgroundColor: 'transparent',
          borderWidth: '2px',
          '&:hover': {
            backgroundColor: coomunityColors.background.default,
            borderColor: coomunityColors.primary.light,
            color: coomunityColors.primary.dark,
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: `2px solid ${coomunityColors.grey[200]}`,
          boxShadow: '0 2px 4px rgba(40, 54, 24, 0.1), 0 1px 2px rgba(40, 54, 24, 0.06)',
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: coomunityColors.background.paper,
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 16px rgba(40, 54, 24, 0.15), 0 4px 8px rgba(40, 54, 24, 0.08)',
            borderColor: coomunityColors.primary.main,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(135deg, ${coomunityColors.primary.main} 0%, ${coomunityColors.secondary.main} 50%, ${coomunityColors.error.main} 100%)`,
            opacity: 0.8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          fontWeight: 600,
          border: `1px solid ${coomunityColors.grey[200]}`,
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        filled: {
          backgroundColor: coomunityColors.primary.light,
          color: coomunityColors.primary.dark,
          borderColor: coomunityColors.primary.main,
          '&:hover': {
            backgroundColor: coomunityColors.primary.main,
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          height: 10,
          backgroundColor: coomunityColors.grey[200],
          boxShadow: 'inset 0 1px 2px rgba(40, 54, 24, 0.1)',
        },
        bar: {
          borderRadius: 9999,
          background: `linear-gradient(90deg, ${coomunityColors.primary.main} 0%, ${coomunityColors.secondary.main} 50%, ${coomunityColors.error.main} 100%)`,
          transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${coomunityColors.primary.main} 0%, ${coomunityColors.secondary.main} 50%, ${coomunityColors.error.main} 100%)`,
          color: coomunityColors.primary.contrastText,
          boxShadow: '0 8px 16px rgba(40, 54, 24, 0.15), 0 4px 8px rgba(40, 54, 24, 0.08)',
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: `linear-gradient(135deg, ${coomunityColors.primary.dark} 0%, ${coomunityColors.secondary.dark} 50%, ${coomunityColors.error.dark} 100%)`,
            transform: 'scale(1.08) translateY(-3px)',
            boxShadow: '0 12px 24px rgba(40, 54, 24, 0.2), 0 6px 12px rgba(40, 54, 24, 0.12)',
            filter: 'brightness(1.15) saturate(1.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: coomunityColors.background.paper,
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(40, 54, 24, 0.1), 0 1px 2px rgba(40, 54, 24, 0.06)',
        },
        elevation4: {
          boxShadow: '0 8px 16px rgba(40, 54, 24, 0.15), 0 4px 8px rgba(40, 54, 24, 0.08)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 180ms cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 12,
          '&:hover': {
            backgroundColor: coomunityColors.grey[100],
            transform: 'scale(1.08)',
            color: coomunityColors.primary.dark,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: coomunityColors.primary.dark,
          color: coomunityColors.primary.contrastText,
          borderRadius: 8,
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '8px 12px',
          boxShadow: '0 4px 8px rgba(40, 54, 24, 0.12), 0 2px 4px rgba(40, 54, 24, 0.08)',
        },
        arrow: {
          color: coomunityColors.primary.dark,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 16px',
          '&.MuiAlert-standardSuccess': {
            backgroundColor: coomunityColors.success.light,
            color: coomunityColors.success.dark,
            border: `1px solid ${coomunityColors.success.main}`,
          },
          '&.MuiAlert-standardWarning': {
            backgroundColor: coomunityColors.warning.light,
            color: coomunityColors.warning.dark,
            border: `1px solid ${coomunityColors.warning.main}`,
          },
          '&.MuiAlert-standardError': {
            backgroundColor: coomunityColors.error.light,
            color: coomunityColors.error.dark,
            border: `1px solid ${coomunityColors.error.main}`,
          },
          '&.MuiAlert-standardInfo': {
            backgroundColor: coomunityColors.info.light,
            color: coomunityColors.info.dark,
            border: `1px solid ${coomunityColors.info.main}`,
          },
        },
      },
    },
  },
};

// Crear tema CoomÜnity final
export const coomunityTheme = createTheme({
  ...coomunityThemeOptions,
  ...accessibilityStyles(coomunityThemeOptions as any),
});

// Tema CoomÜnity modo oscuro
export const coomunityThemeDark = createTheme({
  ...coomunityThemeOptions,
  palette: {
    ...coomunityColors,
    mode: 'dark',
    background: {
      default: coomunityColors.grey[900],
      paper: coomunityColors.grey[800],
    },
    text: {
      primary: coomunityColors.grey[100],
      secondary: coomunityColors.grey[300],
      disabled: coomunityColors.grey[500],
    },
    primary: {
      ...coomunityColors.primary,
      main: coomunityColors.primary.light,
    },
    secondary: {
      ...coomunityColors.secondary,
      main: coomunityColors.secondary.light,
    },
  },
  components: {
    ...coomunityThemeOptions.components,
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: coomunityColors.grey[800],
          borderColor: coomunityColors.grey[700],
          '&:hover': {
            borderColor: coomunityColors.primary.light,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: coomunityColors.grey[800],
        },
      },
    },
  },
  ...accessibilityStyles(coomunityThemeOptions as any),
});

export default coomunityTheme;
