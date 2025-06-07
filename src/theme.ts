import { createTheme, ThemeOptions } from '@mui/material/styles';
import { globalFocusStyles } from './utils/accessibility/focus-styles';

// === BREAKPOINTS CUSTOMIZADOS PARA GAMIFIER ===
// Definidos según dispositivos objetivo y resoluciones comunes
const customBreakpoints = {
  values: {
    xs: 0,     // Mobile pequeño (iPhone SE, etc.)
    sm: 600,   // Mobile estándar (iPhone 12, 13, etc.)
    md: 900,   // Tablet (iPad, etc.)
    lg: 1200,  // Desktop pequeño
    xl: 1536,  // Desktop grande
    xxl: 1920, // Desktop ultra-wide
  },
};

// === TOKENS RESPONSIVOS ===
const responsiveTokens = {
  spacing: {
    // Espaciado que se adapta a breakpoints
    container: {
      xs: 1, // 8px en mobile
      sm: 2, // 16px en mobile grande
      md: 3, // 24px en tablet
      lg: 4, // 32px en desktop
      xl: 5, // 40px en desktop grande
    },
    section: {
      xs: 2, // 16px en mobile
      sm: 3, // 24px en mobile grande
      md: 4, // 32px en tablet
      lg: 6, // 48px en desktop
      xl: 8, // 64px en desktop grande
    },
  },
  typography: {
    // Escalas de tipografía responsiva
    scale: {
      xs: 0.875, // 87.5% en mobile
      sm: 0.9,   // 90% en mobile grande
      md: 1,     // 100% en tablet
      lg: 1.1,   // 110% en desktop
      xl: 1.2,   // 120% en desktop grande
    },
  },
};

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  breakpoints: customBreakpoints,
  palette: {
    mode,
    primary: {
      main: '#CEA93A', // Dorado del logo CoomÜnity
      light: '#E4C373',
      dark: '#B8954A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#272727', // Negro/gris oscuro para header y menú
      light: '#3A3A3A',
      dark: '#1A1A1A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'light' ? '#F8F9FA' : '#121212', // Gris claro minimalista
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    },
    text: {
      primary: mode === 'light' ? '#2C2C2C' : '#FFFFFF',
      secondary: mode === 'light' ? '#6B7280' : '#B0B0B0',
    },
    divider: mode === 'light' ? '#E5E7EB' : '#374151',
    action: {
      hover: mode === 'light' ? 'rgba(206, 169, 58, 0.08)' : 'rgba(206, 169, 58, 0.12)',
      selected: mode === 'light' ? 'rgba(206, 169, 58, 0.12)' : 'rgba(206, 169, 58, 0.16)',
      disabled: mode === 'light' ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)',
    },
    info: {
      main: mode === 'light' ? '#3B82F6' : '#60A5FA',
      light: mode === 'light' ? '#DBEAFE' : '#1E3A8A',
      dark: mode === 'light' ? '#1D4ED8' : '#1E40AF',
    },
    success: {
      main: mode === 'light' ? '#10B981' : '#34D399',
      light: mode === 'light' ? '#D1FAE5' : '#064E3B',
      dark: mode === 'light' ? '#059669' : '#047857',
    },
    error: {
      main: mode === 'light' ? '#EF4444' : '#F87171',
      light: mode === 'light' ? '#FEE2E2' : '#7F1D1D',
      dark: mode === 'light' ? '#DC2626' : '#B91C1C',
    },
    warning: {
      main: mode === 'light' ? '#F59E0B' : '#FBBF24',
      light: mode === 'light' ? '#FEF3C7' : '#78350F',
      dark: mode === 'light' ? '#D97706' : '#92400E',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Helvetica", "Arial", sans-serif',
    // Tipografía responsiva usando clamp() para fluid typography
    h1: {
      fontSize: 'clamp(2rem, 4vw, 2.5rem)', // Responsive entre 32px y 40px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: 'clamp(1.75rem, 3.5vw, 2rem)', // Responsive entre 28px y 32px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: 'clamp(1.5rem, 3vw, 1.75rem)', // Responsive entre 24px y 28px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', // Responsive entre 20px y 24px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 'clamp(1.125rem, 2vw, 1.25rem)', // Responsive entre 18px y 20px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', // Responsive entre 16px y 18px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', // Responsive entre 14px y 16px
      lineHeight: 1.6,
    },
    body2: {
      fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)', // Responsive entre 12px y 14px
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)', // Responsive
    },
    caption: {
      fontSize: 'clamp(0.625rem, 1vw, 0.75rem)', // Responsive entre 10px y 12px
      lineHeight: 1.4,
    },
    overline: {
      fontSize: 'clamp(0.625rem, 1vw, 0.75rem)', // Responsive
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08333em',
    },
  },
  shape: {
    borderRadius: 12, // Bordes más redondeados para el diseño minimalista
  },
  spacing: 8,
  components: {
    // === COMPONENTES RESPONSIVOS ===
    MuiContainer: {
      styleOverrides: {
        root: {
          // Padding responsivo para contenedores
          paddingLeft: 'clamp(16px, 4vw, 24px)',
          paddingRight: 'clamp(16px, 4vw, 24px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          // Padding responsivo para botones
          padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
          minHeight: 'clamp(36px, 8vw, 44px)', // Altura mínima responsiva
          '&:hover': {
            boxShadow: '0 4px 12px rgba(206, 169, 58, 0.25)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 16px rgba(206, 169, 58, 0.35)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)'
            : '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
          border: mode === 'light' ? '1px solid #F3F4F6' : 'none',
          transition: 'all 0.2s ease-in-out',
          // Padding responsivo para cards
          '& .MuiCardContent-root': {
            padding: 'clamp(16px, 3vw, 24px)',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: mode === 'light'
              ? '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)'
              : '0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: mode === 'light'
            ? '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)'
            : '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // Input fields responsivos
          '& .MuiOutlinedInput-root': {
            minHeight: 'clamp(40px, 8vw, 48px)', // Altura mínima responsiva
            '& input': {
              padding: 'clamp(12px, 2.5vw, 16px)', // Padding responsivo
            },
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          // Toolbar responsivo
          minHeight: 'clamp(56px, 12vw, 64px) !important',
          paddingLeft: 'clamp(16px, 4vw, 24px)',
          paddingRight: 'clamp(16px, 4vw, 24px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // AppBar con altura responsiva
          '& .MuiToolbar-root': {
            minHeight: 'clamp(56px, 12vw, 64px)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          // Drawer responsivo
          width: 'clamp(240px, 50vw, 280px)', // Ancho responsivo en mobile
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 12px',
          color: '#FFFFFF',
          // Padding responsivo para items de navegación
          paddingTop: 'clamp(8px, 2vw, 12px)',
          paddingBottom: 'clamp(8px, 2vw, 12px)',
          '&.Mui-selected': {
            backgroundColor: 'rgba(206, 169, 58, 0.2)',
            color: '#CEA93A',
            '&:hover': {
              backgroundColor: 'rgba(206, 169, 58, 0.3)',
            },
            '& .MuiListItemIcon-root': {
              color: '#CEA93A',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          minWidth: 'clamp(32px, 8vw, 40px)', // Ancho responsivo para iconos
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#FFFFFF',
          fontWeight: 500,
          fontSize: 'clamp(0.875rem, 2vw, 1rem)', // Texto responsivo
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        overline: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)', // Responsive
          fontWeight: 600,
          letterSpacing: '0.1em',
          marginBottom: 'clamp(6px, 1.5vw, 8px)', // Margin responsivo
          marginTop: 'clamp(12px, 3vw, 16px)', // Margin responsivo
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.12)',
          margin: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)', // Margin responsivo
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  const theme = createTheme(getDesignTokens(mode));
  
  // Añadir estilos globales de accesibilidad
  const themeWithGlobalStyles = {
    ...theme,
    components: {
      ...theme.components,
      MuiCssBaseline: {
        styleOverrides: {
          ...globalFocusStyles,
          // Asegurar que el body tenga estilos base
          body: {
            scrollBehavior: 'smooth',
          },
          // Mejorar visibilidad de elementos focusables
          'button, a, input, select, textarea, [tabindex]': {
            '&:focus-visible': {
              outline: `3px solid #005FCC !important`,
              outlineOffset: '2px !important',
              borderRadius: '4px !important',
              zIndex: 10,
            },
          },
        },
      },
    },
  };

  return createTheme(themeWithGlobalStyles);
};

// === UTILIDADES RESPONSIVAS PARA USO EN COMPONENTES ===
export const responsiveUtils = {
  // Breakpoints para uso directo
  breakpoints: customBreakpoints.values,
  
  // Tokens responsivos
  tokens: responsiveTokens,
  
  // Helper para crear valores responsivos
  responsive: {
    spacing: (base: number) => ({
      xs: base * responsiveTokens.spacing.container.xs,
      sm: base * responsiveTokens.spacing.container.sm,
      md: base * responsiveTokens.spacing.container.md,
      lg: base * responsiveTokens.spacing.container.lg,
      xl: base * responsiveTokens.spacing.container.xl,
    }),
    
    fontSize: (base: string) => `clamp(0.875em, 2vw, ${base})`,
    
    containerWidth: (mobile: string, desktop: string) => 
      `clamp(${mobile}, 50vw, ${desktop})`,
      
    // Padding fluido
    fluidPadding: (min: string, max: string) => 
      `clamp(${min}, 4vw, ${max})`,
      
    // Margin fluido  
    fluidMargin: (min: string, max: string) => 
      `clamp(${min}, 3vw, ${max})`,
  },
  
  // Media queries para uso en componentes
  mediaQueries: {
    mobile: `@media (max-width: ${customBreakpoints.values.sm}px)`,
    tablet: `@media (min-width: ${customBreakpoints.values.sm}px) and (max-width: ${customBreakpoints.values.lg}px)`,
    desktop: `@media (min-width: ${customBreakpoints.values.lg}px)`,
    largeDesktop: `@media (min-width: ${customBreakpoints.values.xl}px)`,
  }
};

// === DISPOSITIVOS OBJETIVO PARA "PIXEL PERFECT" ===
export const targetDevices = {
  // Dispositivos móviles principales
  mobile: {
    'iPhone_SE': { width: 375, height: 667, ratio: 2 },
    'iPhone_12': { width: 390, height: 844, ratio: 3 },
    'iPhone_14_Pro': { width: 393, height: 852, ratio: 3 },
    'Samsung_Galaxy_S21': { width: 384, height: 854, ratio: 3 },
  },
  
  // Tablets principales
  tablet: {
    'iPad': { width: 768, height: 1024, ratio: 2 },
    'iPad_Pro_11': { width: 834, height: 1194, ratio: 2 },
    'Samsung_Galaxy_Tab': { width: 800, height: 1280, ratio: 2 },
  },
  
  // Desktop principales
  desktop: {
    'MacBook_Air': { width: 1280, height: 832 },
    'MacBook_Pro_14': { width: 1512, height: 982 },
    'Full_HD': { width: 1920, height: 1080 },
    'QHD': { width: 2560, height: 1440 },
  }
}; 