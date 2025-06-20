/* ===============================================================================
   🍂 TEMA MATERIAL-UI OTOÑO VERDADERO - COOMUNITY SUPERAPP
   Colores cálidos, terrosos y acogedores del otoño
   =============================================================================== */

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Paleta de otoño verdadero
const autumnPalette = {
  // Naranjas otoñales principales
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Naranja otoñal principal
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Rojos profundos otoñales
  secondary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#dc2626', // Rojo otoñal equilibrado
    600: '#b91c1c',
    700: '#991b1b',
    800: '#7f1d1d',
    900: '#450a0a',
  },

  // Dorado otoñal
  tertiary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Dorado principal
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Colores semánticos otoñales
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#16a34a', // Verde oliva para éxito
    600: '#15803d',
    700: '#166534',
    800: '#14532d',
    900: '#052e16',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Dorado otoñal para advertencias
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
    500: '#dc2626', // Rojo otoñal para errores
    600: '#b91c1c',
    700: '#991b1b',
    800: '#7f1d1d',
    900: '#450a0a',
  },

  info: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#8b5a2b', // Marrón cálido para información
    600: '#92400e',
    700: '#78350f',
    800: '#451a03',
    900: '#292524',
  },

  // Escala de grises cálida
  grey: {
    50: '#fafaf9', // Blanco cálido
    100: '#f5f5f4', // Casi blanco cálido
    200: '#e7e5e4', // Gris muy claro cálido
    300: '#d6d3d1', // Gris claro cálido
    400: '#a8a29e', // Gris medio cálido
    500: '#78716c', // Gris medio
    600: '#57534e', // Gris oscuro cálido
    700: '#44403c', // Gris muy oscuro cálido
    800: '#292524', // Casi negro cálido
    900: '#1c1917', // Negro cálido
  },
};

// Configuración base del tema otoñal
const autumnThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      ...autumnPalette.primary,
      main: autumnPalette.primary[500],
      light: autumnPalette.primary[100],
      dark: autumnPalette.primary[700],
    },
    secondary: {
      ...autumnPalette.secondary,
      main: autumnPalette.secondary[500],
      light: autumnPalette.secondary[100],
      dark: autumnPalette.secondary[700],
    },
    success: {
      ...autumnPalette.success,
      main: autumnPalette.success[500],
    },
    warning: {
      ...autumnPalette.warning,
      main: autumnPalette.warning[500],
    },
    error: {
      ...autumnPalette.error,
      main: autumnPalette.error[500],
    },
    info: {
      ...autumnPalette.info,
      main: autumnPalette.info[500],
    },
    grey: autumnPalette.grey,
    background: {
      default: '#fffefb', // Blanco muy cálido
      paper: '#ffffff',
    },
    text: {
      primary: autumnPalette.grey[800], // Contraste 12:1
      secondary: autumnPalette.grey[600], // Contraste 7.5:1
      disabled: autumnPalette.grey[400], // Contraste 3.2:1
    },
    divider: autumnPalette.grey[200],
  },

  typography: {
    fontFamily:
      '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',

    // Jerarquía tipográfica otoñal
    h1: {
      fontSize: '2.75rem',
      fontWeight: 800,
      lineHeight: 1.1,
      color: autumnPalette.grey[800],
      textShadow: '0 1px 2px rgba(124, 45, 18, 0.1)',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 800,
      lineHeight: 1.2,
      color: autumnPalette.grey[800],
      textShadow: '0 1px 2px rgba(124, 45, 18, 0.1)',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: autumnPalette.grey[700],
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: autumnPalette.grey[700],
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: autumnPalette.grey[700],
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: autumnPalette.grey[700],
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.7,
      color: autumnPalette.grey[600],
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.6,
      color: autumnPalette.grey[600],
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: autumnPalette.grey[600],
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: autumnPalette.grey[600],
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: autumnPalette.grey[500],
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      lineHeight: 1.4,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: autumnPalette.grey[500],
    },
  },

  spacing: 8, // 8px base spacing

  shape: {
    borderRadius: 16, // Bordes más redondeados y cálidos
  },

  shadows: [
    'none',
    '0 2px 4px rgba(124, 45, 18, 0.1), 0 1px 2px rgba(124, 45, 18, 0.06)', // Sombras cálidas
    '0 2px 4px rgba(124, 45, 18, 0.1), 0 1px 2px rgba(124, 45, 18, 0.06)',
    '0 4px 8px rgba(124, 45, 18, 0.12), 0 2px 4px rgba(124, 45, 18, 0.08)',
    '0 4px 8px rgba(124, 45, 18, 0.12), 0 2px 4px rgba(124, 45, 18, 0.08)',
    '0 8px 16px rgba(124, 45, 18, 0.15), 0 4px 8px rgba(124, 45, 18, 0.08)',
    '0 8px 16px rgba(124, 45, 18, 0.15), 0 4px 8px rgba(124, 45, 18, 0.08)',
    '0 8px 16px rgba(124, 45, 18, 0.15), 0 4px 8px rgba(124, 45, 18, 0.08)',
    '0 12px 24px rgba(124, 45, 18, 0.18), 0 6px 12px rgba(124, 45, 18, 0.12)',
    '0 12px 24px rgba(124, 45, 18, 0.18), 0 6px 12px rgba(124, 45, 18, 0.12)',
    '0 12px 24px rgba(124, 45, 18, 0.18), 0 6px 12px rgba(124, 45, 18, 0.12)',
    '0 12px 24px rgba(124, 45, 18, 0.18), 0 6px 12px rgba(124, 45, 18, 0.12)',
    '0 12px 24px rgba(124, 45, 18, 0.18), 0 6px 12px rgba(124, 45, 18, 0.12)',
    '0 12px 24px rgba(124, 45, 18, 0.18), 0 6px 12px rgba(124, 45, 18, 0.12)',
    '0 12px 24px rgba(124, 45, 18, 0.18), 0 6px 12px rgba(124, 45, 18, 0.12)',
    '0 12px 24px rgba(124, 45, 18, 0.18), 0 6px 12px rgba(124, 45, 18, 0.12)',
    '0 12px 24px rgba(124, 45, 18, 0.18), 0 6px 12px rgba(124, 45, 18, 0.12)',
    '0 12px 24px rgba(124, 45, 18, 0.18), 0 6px 12px rgba(124, 45, 18, 0.12)',
    '0 12px 24px rgba(124, 45, 18, 0.18), 0 6px 12px rgba(124, 45, 18, 0.12)',
    '0 16px 32px rgba(124, 45, 18, 0.2), 0 8px 16px rgba(124, 45, 18, 0.15)',
    '0 16px 32px rgba(124, 45, 18, 0.2), 0 8px 16px rgba(124, 45, 18, 0.15)',
    '0 16px 32px rgba(124, 45, 18, 0.2), 0 8px 16px rgba(124, 45, 18, 0.15)',
    '0 16px 32px rgba(124, 45, 18, 0.2), 0 8px 16px rgba(124, 45, 18, 0.15)',
  ],

  // Configuración de transiciones cálidas
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
};

// Sobrescribir componentes específicos para tema otoñal
const autumnComponentOverrides = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        scrollbarColor: `${autumnPalette.grey[300]} ${autumnPalette.grey[100]}`,
        '&::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: autumnPalette.primary[300],
          borderRadius: 6,
          '&:hover': {
            backgroundColor: autumnPalette.primary[400],
          },
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: autumnPalette.grey[100],
        },
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: {
        background: `linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)`,
        color: autumnPalette.grey[800],
        boxShadow:
          '0 1px 3px rgba(124, 45, 18, 0.05), 0 1px 2px rgba(124, 45, 18, 0.03)',
        borderBottom: `1px solid ${autumnPalette.primary[200]}`,
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
          '0 2px 4px rgba(124, 45, 18, 0.1), 0 1px 2px rgba(124, 45, 18, 0.06)',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow:
            '0 4px 8px rgba(124, 45, 18, 0.15), 0 2px 4px rgba(124, 45, 18, 0.08)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      contained: {
        background: `linear-gradient(135deg, ${autumnPalette.primary[500]} 0%, ${autumnPalette.tertiary[500]} 100%)`,
        color: '#ffffff',
        '&:hover': {
          background: `linear-gradient(135deg, ${autumnPalette.primary[600]} 0%, ${autumnPalette.tertiary[600]} 100%)`,
          filter: 'brightness(1.05)',
        },
      },
      outlined: {
        borderColor: autumnPalette.primary[300],
        color: autumnPalette.primary[600],
        backgroundColor: 'transparent',
        borderWidth: '2px',
        '&:hover': {
          backgroundColor: autumnPalette.primary[50],
          borderColor: autumnPalette.primary[400],
          color: autumnPalette.primary[700],
          borderWidth: '2px',
        },
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 24,
        border: `2px solid ${autumnPalette.grey[200]}`,
        boxShadow:
          '0 2px 4px rgba(124, 45, 18, 0.1), 0 1px 2px rgba(124, 45, 18, 0.06)',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow:
            '0 8px 16px rgba(124, 45, 18, 0.15), 0 4px 8px rgba(124, 45, 18, 0.08)',
          borderColor: autumnPalette.primary[300],
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(135deg, ${autumnPalette.primary[500]} 0%, ${autumnPalette.tertiary[500]} 50%, ${autumnPalette.secondary[500]} 100%)`,
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
        border: `1px solid ${autumnPalette.grey[200]}`,
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      filled: {
        backgroundColor: autumnPalette.primary[100],
        color: autumnPalette.primary[800],
        borderColor: autumnPalette.primary[200],
        '&:hover': {
          backgroundColor: autumnPalette.primary[200],
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
        backgroundColor: autumnPalette.grey[200],
        boxShadow: 'inset 0 1px 2px rgba(124, 45, 18, 0.1)',
      },
      bar: {
        borderRadius: 9999,
        background: `linear-gradient(90deg, ${autumnPalette.primary[400]} 0%, ${autumnPalette.tertiary[400]} 50%, ${autumnPalette.secondary[400]} 100%)`,
        transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },

  MuiFab: {
    styleOverrides: {
      root: {
        background: `linear-gradient(135deg, ${autumnPalette.primary[500]} 0%, ${autumnPalette.tertiary[500]} 50%, ${autumnPalette.secondary[500]} 100%)`,
        color: '#ffffff',
        boxShadow:
          '0 8px 16px rgba(124, 45, 18, 0.15), 0 4px 8px rgba(124, 45, 18, 0.08)',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: `linear-gradient(135deg, ${autumnPalette.primary[600]} 0%, ${autumnPalette.tertiary[600]} 50%, ${autumnPalette.secondary[600]} 100%)`,
          transform: 'scale(1.08) translateY(-3px)',
          boxShadow:
            '0 12px 24px rgba(124, 45, 18, 0.2), 0 6px 12px rgba(124, 45, 18, 0.12)',
          filter: 'brightness(1.15) saturate(1.2)',
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backgroundColor: '#fffefb',
      },
      elevation1: {
        boxShadow:
          '0 2px 4px rgba(124, 45, 18, 0.1), 0 1px 2px rgba(124, 45, 18, 0.06)',
      },
      elevation4: {
        boxShadow:
          '0 8px 16px rgba(124, 45, 18, 0.15), 0 4px 8px rgba(124, 45, 18, 0.08)',
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: 'all 180ms cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 12,
        '&:hover': {
          backgroundColor: autumnPalette.primary[50],
          transform: 'scale(1.08)',
          color: autumnPalette.primary[600],
        },
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: autumnPalette.grey[800],
        color: '#ffffff',
        borderRadius: 8,
        fontSize: '0.75rem',
        fontWeight: 500,
        padding: '8px 12px',
        boxShadow:
          '0 4px 8px rgba(124, 45, 18, 0.12), 0 2px 4px rgba(124, 45, 18, 0.08)',
      },
      arrow: {
        color: autumnPalette.grey[800],
      },
    },
  },

  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '12px 16px',
        '&.MuiAlert-standardSuccess': {
          backgroundColor: autumnPalette.success[50],
          color: autumnPalette.success[800],
          border: `1px solid ${autumnPalette.success[200]}`,
        },
        '&.MuiAlert-standardWarning': {
          backgroundColor: autumnPalette.warning[50],
          color: autumnPalette.warning[800],
          border: `1px solid ${autumnPalette.warning[200]}`,
        },
        '&.MuiAlert-standardError': {
          backgroundColor: autumnPalette.error[50],
          color: autumnPalette.error[800],
          border: `1px solid ${autumnPalette.error[200]}`,
        },
        '&.MuiAlert-standardInfo': {
          backgroundColor: autumnPalette.info[50],
          color: autumnPalette.info[800],
          border: `1px solid ${autumnPalette.info[200]}`,
        },
      },
    },
  },
};

// Crear tema otoñal final
export const autumnTheme = createTheme({
  ...autumnThemeOptions,
  components: {
    ...autumnComponentOverrides,
    // 🍂 OVERRIDE GLOBAL CRÍTICO: Solución DEFINITIVA para erradicar fondos oscuros
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-color: #fffefb !important;
          color: #292524 !important;
        }
        /* Override para cualquier estilo inline persistente */
        *[style*="background-color: rgb(41, 37, 36)"] {
          background-color: #fffefb !important;
        }
        *[style*="background-color: #121212"] {
          background-color: #fffefb !important;
        }
        *[style*="background-color: rgb(18, 18, 18)"] {
          background-color: #fffefb !important;
        }
        *[style*="background-color: #1e1e1e"] {
          background-color: #fffefb !important;
        }
        /* Forzar elementos principales */
        html {
          background-color: #fffefb !important;
        }
        #root {
          background-color: #fffefb !important;
          color: #292524 !important;
        }
        /* Eliminar esquemas de color oscuro */
        [data-mui-color-scheme="dark"] {
          background-color: #fffefb !important;
          color: #292524 !important;
        }
        /* Forzar todos los contenedores MUI */
        .MuiContainer-root,
        .MuiPaper-root,
        .MuiCard-root,
        .MuiBox-root {
          background-color: transparent !important;
        }
        main.main-content-area {
          background-color: #fffefb !important;
        }
        /* Override específico para cualquier clase CSS generada con fondo oscuro */
        [class*="css-"][class*="MuiPaper-root"],
        [class*="css-"][class*="MuiContainer-root"],
        [class*="css-"][class*="MuiBox-root"] {
          background-color: transparent !important;
        }
      `,
    },
  },
});

// Tema otoñal modo oscuro
export const autumnThemeDark = createTheme({
  ...autumnThemeOptions,
  palette: {
    ...autumnThemeOptions.palette,
    mode: 'dark',
    background: {
      default: autumnPalette.grey[900],
      paper: autumnPalette.grey[800],
    },
    text: {
      primary: autumnPalette.grey[100],
      secondary: autumnPalette.grey[300],
      disabled: autumnPalette.grey[500],
    },
    divider: autumnPalette.grey[700],
    primary: {
      ...autumnPalette.primary,
      main: autumnPalette.primary[400], // Más brillante en modo oscuro
    },
    secondary: {
      ...autumnPalette.secondary,
      main: autumnPalette.secondary[400], // Más brillante en modo oscuro
    },
  },
  components: {
    ...autumnComponentOverrides,
    MuiCard: {
      styleOverrides: {
        root: {
          ...autumnComponentOverrides.MuiCard.styleOverrides?.root,
          backgroundColor: autumnPalette.grey[800],
          border: `2px solid ${autumnPalette.grey[700]}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: autumnPalette.grey[800],
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          ...autumnComponentOverrides.MuiChip.styleOverrides?.root,
          border: `1px solid ${autumnPalette.grey[600]}`,
        },
        filled: {
          backgroundColor: autumnPalette.primary[900],
          color: autumnPalette.primary[200],
          borderColor: autumnPalette.primary[700],
        },
      },
    },
  },
});

export default autumnTheme;
