import { createTheme, ThemeOptions } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#CDAB5A', // Dorado principal del Gamifier
      light: '#E4C373',
      dark: '#B8954A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#272727', // Gris oscuro para navegación
      light: '#3A3A3A',
      dark: '#1A1A1A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'light' ? '#F8F9FA' : '#121212',
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    },
    text: {
      primary: mode === 'light' ? '#2C2C2C' : '#FFFFFF',
      secondary: mode === 'light' ? '#6B7280' : '#B0B0B0',
    },
    divider: mode === 'light' ? '#E5E7EB' : '#374151',
    action: {
      hover:
        mode === 'light'
          ? 'rgba(205, 171, 90, 0.08)'
          : 'rgba(205, 171, 90, 0.12)',
      selected:
        mode === 'light'
          ? 'rgba(205, 171, 90, 0.12)'
          : 'rgba(205, 171, 90, 0.16)',
      disabled:
        mode === 'light' ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)',
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
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
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
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            mode === 'light'
              ? '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
              : '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow:
              mode === 'light'
                ? '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
                : '0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow:
            mode === 'light'
              ? '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
              : '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(205, 171, 90, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(205, 171, 90, 0.2)',
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getDesignTokens(mode));
};
