import { createTheme, ThemeOptions } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      main: '#CDAB5A',
    },
    secondary: {
      main: '#272727',
    },
    background: {
      default: mode === 'light' ? '#F4F4F4' : '#121212',
      paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
    },
    text: {
      primary: mode === 'light' ? '#3A3A3A' : '#FFFFFF',
      secondary: mode === 'light' ? '#6E6E6E' : '#B0B0B0',
    },
    info: {
      main: mode === 'light' ? '#EBF8FF' : '#0A1929',
    },
    success: {
      main: mode === 'light' ? '#D1FAE5' : '#0A2E1A',
    },
    error: {
      main: mode === 'light' ? '#FEE2E2' : '#2E0A0A',
    },
    warning: {
      main: mode === 'light' ? '#FEF3C7' : '#2E2A0A',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: 12,
          backgroundColor: ownerState && ownerState.meritLevel === 'high' ? theme.palette.warning.light : 'inherit',
        }),
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme(getDesignTokens(mode));
}; 