/* ===============================================================================
   🍂 TEMA MATERIAL-UI OTOÑO VERDADERO - COOMUNITY SUPERAPP
   Colores cálidos, terrosos y acogedores del otoño
   =============================================================================== */

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Paleta de colores definitiva CoomÜnity
const coomunityPalette = {
  // Colores principales y de fondo
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
  },

  error: { // Terracota para alertas sutiles
    main: '#bc6c25',
    light: '#d08645',
    dark: '#a85a1a',
  },

  // Escala de grises cálida (manteniendo los tonos existentes si no se especifican nuevos)
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
  },

  // Nuevos colores semánticos basados en la paleta principal
  success: {
    main: '#606c38', // Verde Oliva para éxito
    light: '#606c38',
    dark: '#283618',
  },
  warning: {
    main: '#dda15e', // Ocre para advertencias
    light: '#e4b871',
    dark: '#c9964a',
  },
  info: {
    main: '#bc6c25', // Terracota para información
    light: '#d08645',
    dark: '#a85a1a',
  },
};

// Configuración base del tema CoomÜnity
const coomunityThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: coomunityPalette.primary.main,
      light: coomunityPalette.primary.light,
      dark: coomunityPalette.primary.dark,
      contrastText: coomunityPalette.primary.contrastText,
    },
    secondary: {
      main: coomunityPalette.secondary.main,
      light: coomunityPalette.secondary.light,
      dark: coomunityPalette.secondary.dark,
    },
    success: {
      main: coomunityPalette.success.main,
      light: coomunityPalette.success.light,
      dark: coomunityPalette.success.dark,
    },
    warning: {
      main: coomunityPalette.warning.main,
      light: coomunityPalette.warning.light,
      dark: coomunityPalette.warning.dark,
    },
    error: {
      main: coomunityPalette.error.main,
      light: coomunityPalette.error.light,
      dark: coomunityPalette.error.dark,
    },
    info: {
      main: coomunityPalette.info.main,
      light: coomunityPalette.info.light,
      dark: coomunityPalette.info.dark,
    },
    grey: coomunityPalette.grey, // Mantener grises existentes
    background: {
      default: '#fefae0', // Blanco Hueso - Fondo principal
      paper: '#ffffff',   // Blanco puro para cards, contrastando sobre el fondo
    },
    text: {
      primary: '#283618', // Verde Bosque Oscuro - Texto principal
      secondary: '#606c38', // Verde Oliva - Texto secundario
      disabled: coomunityPalette.grey[400],
    },
    divider: coomunityPalette.grey[200],
  },

  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',

    // Jerarquía tipográfica CoomÜnity (ajustada a la nueva paleta)
    h1: {
      fontSize: '2.75rem',
      fontWeight: 800,
      lineHeight: 1.1,
      color: coomunityPalette.primary.dark, // Verde Bosque Oscuro
      textShadow: '0 1px 2px rgba(40, 54, 24, 0.1)',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 800,
      lineHeight: 1.2,
      color: coomunityPalette.primary.dark, // Verde Bosque Oscuro
      textShadow: '0 1px 2px rgba(40, 54, 24, 0.1)',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: coomunityPalette.primary.dark,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      color: coomunityPalette.primary.dark,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: coomunityPalette.primary.dark,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: coomunityPalette.primary.dark,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.7,
      color: coomunityPalette.grey[700],
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.6,
      color: coomunityPalette.grey[700],
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: coomunityPalette.primary.main,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: coomunityPalette.primary.main,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: coomunityPalette.grey[600],
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      lineHeight: 1.4,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: coomunityPalette.secondary.main,
    },
  },

  spacing: 8, // 8px base spacing

  shape: {
    borderRadius: 16, // Bordes más redondeados y cálidos
  },

  shadows: [
    'none',
    '0 2px 4px rgba(40, 54, 24, 0.1), 0 1px 2px rgba(40, 54, 24, 0.06)', // Sombras cálidas
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

// Sobrescribir componentes específicos para tema CoomÜnity
const coomunityComponentOverrides = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        scrollbarColor: `${coomunityPalette.grey[300]} ${coomunityPalette.grey[100]}`,
        '&::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: coomunityPalette.primary.main,
          borderRadius: 6,
          '&:hover': {
            backgroundColor: coomunityPalette.primary.light,
          },
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: coomunityPalette.grey[100],
        },
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: {
        background: `linear-gradient(135deg, ${coomunityThemeOptions.palette.background.paper} 0%, ${coomunityPalette.grey[50]} 50%, ${coomunityPalette.grey[100]} 100%)`,
        color: coomunityThemeOptions.palette.text.primary,
        boxShadow:
          '0 1px 3px rgba(40, 54, 24, 0.05), 0 1px 2px rgba(40, 54, 24, 0.03)',
        borderBottom: `1px solid ${coomunityPalette.primary.light}`,
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
          '0 2px 4px rgba(40, 54, 24, 0.1), 0 1px 2px rgba(40, 54, 24, 0.06)',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow:
            '0 4px 8px rgba(40, 54, 24, 0.15), 0 2px 4px rgba(40, 54, 24, 0.08)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      },
      contained: {
        background: `linear-gradient(135deg, ${coomunityPalette.primary.main} 0%, ${coomunityPalette.secondary.main} 100%)`,
        color: coomunityPalette.primary.contrastText,
        '&:hover': {
          background: `linear-gradient(135deg, ${coomunityPalette.primary.dark} 0%, ${coomunityPalette.secondary.dark} 100%)`,
          filter: 'brightness(1.05)',
        },
      },
      outlined: {
        borderColor: coomunityPalette.primary.main,
        color: coomunityPalette.primary.dark,
        backgroundColor: 'transparent',
        borderWidth: '2px',
        '&:hover': {
          backgroundColor: coomunityPalette.primary.contrastText,
          borderColor: coomunityPalette.primary.light,
          color: coomunityPalette.primary.dark,
          borderWidth: '2px',
        },
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 24,
        border: `2px solid ${coomunityPalette.grey[200]}`,
        boxShadow:
          '0 2px 4px rgba(40, 54, 24, 0.1), 0 1px 2px rgba(40, 54, 24, 0.06)',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow:
            '0 8px 16px rgba(40, 54, 24, 0.15), 0 4px 8px rgba(40, 54, 24, 0.08)',
          borderColor: coomunityPalette.primary.main,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(135deg, ${coomunityPalette.primary.main} 0%, ${coomunityPalette.secondary.main} 50%, ${coomunityPalette.error.main} 100%)`,
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
        border: `1px solid ${coomunityPalette.grey[200]}`,
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      filled: {
        backgroundColor: coomunityPalette.primary.light,
        color: coomunityPalette.primary.dark,
        borderColor: coomunityPalette.primary.main,
        '&:hover': {
          backgroundColor: coomunityPalette.primary.main,
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
        backgroundColor: coomunityPalette.grey[200],
        boxShadow: 'inset 0 1px 2px rgba(40, 54, 24, 0.1)',
      },
      bar: {
        borderRadius: 9999,
        background: `linear-gradient(90deg, ${coomunityPalette.primary.main} 0%, ${coomunityPalette.secondary.main} 50%, ${coomunityPalette.error.main} 100%)`,
        transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },

  MuiFab: {
    styleOverrides: {
      root: {
        background: `linear-gradient(135deg, ${coomunityPalette.primary.main} 0%, ${coomunityPalette.secondary.main} 50%, ${coomunityPalette.error.main} 100%)`,
        color: coomunityPalette.primary.contrastText,
        boxShadow:
          '0 8px 16px rgba(40, 54, 24, 0.15), 0 4px 8px rgba(40, 54, 24, 0.08)',
        transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: `linear-gradient(135deg, ${coomunityPalette.primary.dark} 0%, ${coomunityPalette.secondary.dark} 50%, ${coomunityPalette.error.dark} 100%)`,
          transform: 'scale(1.08) translateY(-3px)',
          boxShadow:
            '0 12px 24px rgba(40, 54, 24, 0.2), 0 6px 12px rgba(40, 54, 24, 0.12)',
          filter: 'brightness(1.15) saturate(1.2)',
        },
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        backgroundColor: coomunityPalette.background.paper,
      },
      elevation1: {
        boxShadow:
          '0 2px 4px rgba(40, 54, 24, 0.1), 0 1px 2px rgba(40, 54, 24, 0.06)',
      },
      elevation4: {
        boxShadow:
          '0 8px 16px rgba(40, 54, 24, 0.15), 0 4px 8px rgba(40, 54, 24, 0.08)',
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: {
        transition: 'all 180ms cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 12,
        '&:hover': {
          backgroundColor: coomunityPalette.grey[100],
          transform: 'scale(1.08)',
          color: coomunityPalette.primary.dark,
        },
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: coomunityPalette.primary.dark,
        color: coomunityPalette.primary.contrastText,
        borderRadius: 8,
        fontSize: '0.75rem',
        fontWeight: 500,
        padding: '8px 12px',
        boxShadow:
          '0 4px 8px rgba(40, 54, 24, 0.12), 0 2px 4px rgba(40, 54, 24, 0.08)',
      },
      arrow: {
        color: coomunityPalette.primary.dark,
      },
    },
  },

  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '12px 16px',
        '&.MuiAlert-standardSuccess': {
          backgroundColor: coomunityPalette.success.light,
          color: coomunityPalette.success.dark,
          border: `1px solid ${coomunityPalette.success.main}`,
        },
        '&.MuiAlert-standardWarning': {
          backgroundColor: coomunityPalette.warning.light,
          color: coomunityPalette.warning.dark,
          border: `1px solid ${coomunityPalette.warning.main}`,
        },
        '&.MuiAlert-standardError': {
          backgroundColor: coomunityPalette.error.light,
          color: coomunityPalette.error.dark,
          border: `1px solid ${coomunityPalette.error.main}`,
        },
        '&.MuiAlert-standardInfo': {
          backgroundColor: coomunityPalette.info.light,
          color: coomunityPalette.info.dark,
          border: `1px solid ${coomunityPalette.info.main}`,
        },
      },
    },
  },
};

// Crear tema CoomÜnity final
export const autumnTheme = createTheme({
  ...coomunityThemeOptions,
  components: {
    ...coomunityComponentOverrides,
    // 🍂 OVERRIDE GLOBAL CRÍTICO: Solución DEFINITIVA para erradicar fondos oscuros
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-color: ${coomunityThemeOptions.palette.background.default} !important;
          color: ${coomunityThemeOptions.palette.text.primary} !important;
        }
        /* Override para cualquier estilo inline persistente */
        *[style*="background-color: rgb(41, 37, 36)"] {
          background-color: ${coomunityThemeOptions.palette.background.default} !important;
        }
        *[style*="background-color: #121212"] {
          background-color: ${coomunityThemeOptions.palette.background.default} !important;
        }
        *[style*="background-color: rgb(18, 18, 18)"] {
          background-color: ${coomunityThemeOptions.palette.background.default} !important;
        }
        *[style*="background-color: #1e1e1e"] {
          background-color: ${coomunityThemeOptions.palette.background.default} !important;
        }
        /* Forzar elementos principales */
        html {
          background-color: ${coomunityThemeOptions.palette.background.default} !important;
        }
        #root {
          background-color: ${coomunityThemeOptions.palette.background.default} !important;
          color: ${coomunityThemeOptions.palette.text.primary} !important;
        }
        /* Eliminar esquemas de color oscuro */
        [data-mui-color-scheme="dark"] {
          background-color: ${coomunityThemeOptions.palette.background.default} !important;
          color: ${coomunityThemeOptions.palette.text.primary} !important;
        }
        /* Forzar todos los contenedores MUI */
        .MuiContainer-root,
        .MuiPaper-root,
        .MuiCard-root,
        .MuiBox-root {
          background-color: transparent !important;
        }
        main.main-content-area {
          background-color: ${coomunityThemeOptions.palette.background.default} !important;
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

// Tema CoomÜnity modo oscuro (ajustado a la nueva paleta)
export const coomunityThemeDark = createTheme({
  ...coomunityThemeOptions,
  palette: {
    ...coomunityThemeOptions.palette,
    mode: 'dark',
    background: {
      default: coomunityPalette.grey[900],
      paper: coomunityPalette.grey[800],
    },
    text: {
      primary: coomunityPalette.grey[100],
      secondary: coomunityPalette.grey[300],
      disabled: coomunityPalette.grey[500],
    },
    divider: coomunityPalette.grey[700],
    primary: {
      ...coomunityPalette.primary,
      main: coomunityPalette.primary.light, // Más brillante en modo oscuro
    },
    secondary: {
      ...coomunityPalette.secondary,
      main: coomunityPalette.secondary.light, // Más brillante en modo oscuro
    },
    error: {
      ...coomunityPalette.error,
      main: coomunityPalette.error.light,
    }
  },
  components: {
    ...coomunityComponentOverrides,
    MuiCard: {
      styleOverrides: {
        root: (ownerState, theme) => ({
          borderRadius: 24,
          border: `2px solid ${theme.palette.grey[200]}`,
          boxShadow:
            '0 2px 4px rgba(40, 54, 24, 0.1), 0 1px 2px rgba(40, 54, 24, 0.06)',
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow:
              '0 8px 16px rgba(40, 54, 24, 0.15), 0 4px 8px rgba(40, 54, 24, 0.08)',
            borderColor: theme.palette.primary.main,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.error.main} 100%)`,
            opacity: 0.8,
          },
          backgroundColor: coomunityPalette.grey[800],
          border: `2px solid ${coomunityPalette.grey[700]}`,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: coomunityPalette.grey[800],
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          ...coomunityComponentOverrides.MuiChip.styleOverrides?.root,
          border: `1px solid ${coomunityPalette.grey[600]}`,
        },
        filled: {
          backgroundColor: coomunityPalette.primary.dark,
          color: coomunityPalette.primary.contrastText,
          borderColor: coomunityPalette.primary.main,
        },
      },
    },
  },
});

// Renombrar la exportación por defecto a coomunityTheme
export const coomunityTheme = createTheme(coomunityThemeOptions);

export default coomunityTheme;
