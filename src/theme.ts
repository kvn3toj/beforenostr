import { createTheme, ThemeOptions } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
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
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    overline: {
      fontSize: '0.75rem',
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          padding: '10px 24px',
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
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: mode === 'light' ? '#E5E7EB' : '#374151',
            },
            '&:hover fieldset': {
              borderColor: mode === 'light' ? '#CEA93A' : '#CEA93A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#CEA93A',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#272727', // Negro del header
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderBottom: 'none',
          borderRadius: 0, // Eliminar bordes redondeados
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#272727', // Negro del menú lateral
          borderRight: 'none',
          boxShadow: '4px 0 16px rgba(0, 0, 0, 0.1)',
          borderRadius: 0, // Eliminar bordes redondeados
          overflow: 'hidden', // Prevenir esquinas blancas
        },
        paperAnchorLeft: {
          top: '64px !important', // Forzar posición debajo del header
          height: 'calc(100vh - 64px) !important', // Altura completa menos header
        },
        root: {
          '& .MuiDrawer-paper': {
            top: '64px !important',
            height: 'calc(100vh - 64px) !important',
            marginTop: '0 !important',
            paddingTop: '0 !important',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 12px',
          color: '#FFFFFF',
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
          minWidth: '40px',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#FFFFFF',
          fontWeight: 500,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        overline: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          marginBottom: '8px',
          marginTop: '16px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.12)',
          margin: '8px 16px',
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getDesignTokens(mode));
}; 