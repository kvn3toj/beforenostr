/* ===============================================================================
   🎨 TEMA MATERIAL-UI AMIGABLE - COOMUNITY SUPERAPP
   Tema unificado siguiendo las heurísticas UX/UI de Nielsen
   =============================================================================== */

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Paleta de colores amigable
const friendlyPalette = {
  // Colores primarios más suaves y confiables
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Azul principal más suave
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Verdes para balance Ayni
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Verde equilibrado principal
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Colores semánticos suaves
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Escala de grises natural
  grey: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

// Configuración base del tema
const baseThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      ...friendlyPalette.primary,
      main: friendlyPalette.primary[500],
    },
    secondary: {
      ...friendlyPalette.secondary,
      main: friendlyPalette.secondary[500],
    },
    success: {
      ...friendlyPalette.success,
      main: friendlyPalette.success[500],
    },
    warning: {
      ...friendlyPalette.warning,
      main: friendlyPalette.warning[500],
    },
    error: {
      ...friendlyPalette.error,
      main: friendlyPalette.error[500],
    },
    info: {
      ...friendlyPalette.info,
      main: friendlyPalette.info[500],
    },
    grey: friendlyPalette.grey,
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: friendlyPalette.grey[700], // Contraste 10.7:1
      secondary: friendlyPalette.grey[600], // Contraste 7.2:1
      disabled: friendlyPalette.grey[400], // Contraste 3.1:1
    },
    divider: friendlyPalette.grey[200],
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    // Jerarquía tipográfica clara
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: friendlyPalette.grey[800],
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: friendlyPalette.grey[800],
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: friendlyPalette.grey[700],
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: friendlyPalette.grey[700],
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: friendlyPalette.grey[700],
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: friendlyPalette.grey[700],
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: friendlyPalette.grey[600],
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: friendlyPalette.grey[600],
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: friendlyPalette.grey[600],
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: friendlyPalette.grey[600],
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      color: friendlyPalette.grey[500],
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      color: friendlyPalette.grey[500],
    },
  },

  spacing: 8, // 8px base spacing

  shape: {
    borderRadius: 12, // Bordes más redondeados y amigables
  },

  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)', // Sombras suaves
    '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
    '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
    '0 25px 50px rgba(0, 0, 0, 0.12), 0 12px 20px rgba(0, 0, 0, 0.08)',
  ],

  // Configuración de transiciones amigables
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
};

// Sobrescribir componentes específicos para mayor amigabilidad
const componentOverrides = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        scrollbarColor: `${friendlyPalette.grey[300]} ${friendlyPalette.grey[100]}`,
        '&::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: friendlyPalette.grey[300],
          borderRadius: 4,
          '&:hover': {
            backgroundColor: friendlyPalette.grey[400],
          },
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: friendlyPalette.grey[100],
        },
      },
    },
  },

  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none' as const,
        fontWeight: 600,
        borderRadius: 12,
        padding: '12px 24px',
        boxShadow:
          '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow:
            '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      contained: {
        background: `linear-gradient(135deg, ${friendlyPalette.primary[500]} 0%, ${friendlyPalette.secondary[500]} 100%)`,
        color: '#ffffff',
        '&:hover': {
          background: `linear-gradient(135deg, ${friendlyPalette.primary[600]} 0%, ${friendlyPalette.secondary[600]} 100%)`,
          filter: 'brightness(1.05)',
        },
      },
      outlined: {
        borderColor: friendlyPalette.primary[300],
        color: friendlyPalette.primary[600],
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: friendlyPalette.primary[50],
          borderColor: friendlyPalette.primary[400],
          color: friendlyPalette.primary[700],
        },
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        border: `1px solid ${friendlyPalette.grey[200]}`,
        boxShadow:
          '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow:
            '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        fontWeight: 500,
        border: `1px solid ${friendlyPalette.grey[200]}`,
      },
      filled: {
        backgroundColor: friendlyPalette.primary[100],
        color: friendlyPalette.primary[700],
        borderColor: friendlyPalette.primary[200],
      },
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 9999,
        height: 8,
        backgroundColor: friendlyPalette.grey[200],
      },
      bar: {
        borderRadius: 9999,
        background: `linear-gradient(90deg, ${friendlyPalette.primary[400]} 0%, ${friendlyPalette.secondary[400]} 100%)`,
      },
    },
  },

  MuiFab: {
    styleOverrides: {
      root: {
        background: `linear-gradient(135deg, ${friendlyPalette.primary[500]} 0%, ${friendlyPalette.secondary[500]} 100%)`,
        color: '#ffffff',
        boxShadow:
          '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: `linear-gradient(135deg, ${friendlyPalette.primary[600]} 0%, ${friendlyPalette.secondary[600]} 100%)`,
          transform: 'scale(1.05) translateY(-2px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          filter: 'brightness(1.1)',
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow:
          '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: friendlyPalette.grey[100],
          transform: 'scale(1.05)',
        },
      },
    },
  },
};

// Crear tema final
export const friendlyTheme = createTheme({
  ...baseThemeOptions,
  components: componentOverrides,
});

// Tema modo oscuro
export const friendlyThemeDark = createTheme({
  ...baseThemeOptions,
  palette: {
    ...baseThemeOptions.palette,
    mode: 'dark',
    background: {
      default: friendlyPalette.grey[900],
      paper: friendlyPalette.grey[800],
    },
    text: {
      primary: friendlyPalette.grey[100],
      secondary: friendlyPalette.grey[300],
      disabled: friendlyPalette.grey[500],
    },
    divider: friendlyPalette.grey[700],
    primary: {
      ...friendlyPalette.primary,
      main: friendlyPalette.primary[400], // Más brillante en modo oscuro
    },
    secondary: {
      ...friendlyPalette.secondary,
      main: friendlyPalette.secondary[400], // Más brillante en modo oscuro
    },
  },
  components: {
    ...componentOverrides,
    MuiCard: {
      styleOverrides: {
        root: {
          ...componentOverrides.MuiCard.styleOverrides?.root,
          backgroundColor: friendlyPalette.grey[800],
          border: `1px solid ${friendlyPalette.grey[700]}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          ...componentOverrides.MuiChip.styleOverrides?.root,
          border: `1px solid ${friendlyPalette.grey[600]}`,
        },
        filled: {
          backgroundColor: friendlyPalette.primary[900],
          color: friendlyPalette.primary[200],
          borderColor: friendlyPalette.primary[700],
        },
      },
    },
  },
});

export default friendlyTheme;
