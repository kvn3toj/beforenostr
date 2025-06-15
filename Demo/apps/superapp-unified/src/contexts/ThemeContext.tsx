import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ThemeProvider as MuiThemeProvider, 
  createTheme, 
  Theme,
  alpha,
  PaletteMode 
} from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// 🎨 Design Tokens CoomÜnity
const designTokens = {
  colors: {
    coomunity: {
      primary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#7c3aed', // Principal
        600: '#6d28d9',
        700: '#5b21b6',
        800: '#4c1d95',
        900: '#3c1361',
      },
      secondary: {
        50: '#fef7ee',
        100: '#fdedd3',
        200: '#fbd9a5',
        300: '#f8c06d',
        400: '#f59e0b', // Dorado principal
        500: '#d97706',
        600: '#b45309',
        700: '#92400e',
        800: '#78350f',
        900: '#451a03',
      },
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
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
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
  },
  shadows: {
    soft: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
    strong: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
  },
};

// 🌙 Theme Mode Type
type ThemeMode = 'light' | 'dark' | 'auto';

// 🎯 Theme Context Interface
interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  theme: Theme;
}

// 🎨 Create CoomÜnity Theme
const createCoomunityTheme = (mode: PaletteMode): Theme => {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: designTokens.colors.coomunity.primary[500],
        light: designTokens.colors.coomunity.primary[300],
        dark: designTokens.colors.coomunity.primary[700],
        contrastText: '#ffffff',
        50: designTokens.colors.coomunity.primary[50],
        100: designTokens.colors.coomunity.primary[100],
        200: designTokens.colors.coomunity.primary[200],
        300: designTokens.colors.coomunity.primary[300],
        400: designTokens.colors.coomunity.primary[400],
        500: designTokens.colors.coomunity.primary[500],
        600: designTokens.colors.coomunity.primary[600],
        700: designTokens.colors.coomunity.primary[700],
        800: designTokens.colors.coomunity.primary[800],
        900: designTokens.colors.coomunity.primary[900],
      } as any,
      secondary: {
        main: designTokens.colors.coomunity.secondary[500],
        light: designTokens.colors.coomunity.secondary[300],
        dark: designTokens.colors.coomunity.secondary[700],
        contrastText: '#ffffff',
        50: designTokens.colors.coomunity.secondary[50],
        100: designTokens.colors.coomunity.secondary[100],
        200: designTokens.colors.coomunity.secondary[200],
        300: designTokens.colors.coomunity.secondary[300],
        400: designTokens.colors.coomunity.secondary[400],
        500: designTokens.colors.coomunity.secondary[500],
        600: designTokens.colors.coomunity.secondary[600],
        700: designTokens.colors.coomunity.secondary[700],
        800: designTokens.colors.coomunity.secondary[800],
        900: designTokens.colors.coomunity.secondary[900],
      } as any,
      success: {
        main: designTokens.colors.coomunity.success[500],
        light: designTokens.colors.coomunity.success[300],
        dark: designTokens.colors.coomunity.success[700],
        contrastText: '#ffffff',
        50: designTokens.colors.coomunity.success[50],
        100: designTokens.colors.coomunity.success[100],
        200: designTokens.colors.coomunity.success[200],
        300: designTokens.colors.coomunity.success[300],
        400: designTokens.colors.coomunity.success[400],
        500: designTokens.colors.coomunity.success[500],
        600: designTokens.colors.coomunity.success[600],
        700: designTokens.colors.coomunity.success[700],
        800: designTokens.colors.coomunity.success[800],
        900: designTokens.colors.coomunity.success[900],
      } as any,
      error: {
        main: designTokens.colors.coomunity.error[500],
        light: designTokens.colors.coomunity.error[300],
        dark: designTokens.colors.coomunity.error[700],
        contrastText: '#ffffff',
        50: designTokens.colors.coomunity.error[50],
        100: designTokens.colors.coomunity.error[100],
        200: designTokens.colors.coomunity.error[200],
        300: designTokens.colors.coomunity.error[300],
        400: designTokens.colors.coomunity.error[400],
        500: designTokens.colors.coomunity.error[500],
        600: designTokens.colors.coomunity.error[600],
        700: designTokens.colors.coomunity.error[700],
        800: designTokens.colors.coomunity.error[800],
        900: designTokens.colors.coomunity.error[900],
      } as any,
      warning: {
        main: designTokens.colors.coomunity.warning[500],
        light: designTokens.colors.coomunity.warning[300],
        dark: designTokens.colors.coomunity.warning[700],
        contrastText: '#ffffff',
        50: designTokens.colors.coomunity.warning[50],
        100: designTokens.colors.coomunity.warning[100],
        200: designTokens.colors.coomunity.warning[200],
        300: designTokens.colors.coomunity.warning[300],
        400: designTokens.colors.coomunity.warning[400],
        500: designTokens.colors.coomunity.warning[500],
        600: designTokens.colors.coomunity.warning[600],
        700: designTokens.colors.coomunity.warning[700],
        800: designTokens.colors.coomunity.warning[800],
        900: designTokens.colors.coomunity.warning[900],
      } as any,
      info: {
        main: designTokens.colors.coomunity.info[500],
        light: designTokens.colors.coomunity.info[300],
        dark: designTokens.colors.coomunity.info[700],
        contrastText: '#ffffff',
        50: designTokens.colors.coomunity.info[50],
        100: designTokens.colors.coomunity.info[100],
        200: designTokens.colors.coomunity.info[200],
        300: designTokens.colors.coomunity.info[300],
        400: designTokens.colors.coomunity.info[400],
        500: designTokens.colors.coomunity.info[500],
        600: designTokens.colors.coomunity.info[600],
        700: designTokens.colors.coomunity.info[700],
        800: designTokens.colors.coomunity.info[800],
        900: designTokens.colors.coomunity.info[900],
      } as any,
      background: {
        default: isDark ? designTokens.colors.gray[900] : '#ffffff',
        paper: isDark ? designTokens.colors.gray[800] : '#ffffff',
      },
      text: {
        primary: isDark ? designTokens.colors.gray[100] : designTokens.colors.gray[900],
        secondary: isDark ? designTokens.colors.gray[300] : designTokens.colors.gray[600],
      },
      divider: isDark ? designTokens.colors.gray[700] : designTokens.colors.gray[200],
      grey: designTokens.colors.gray,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.4,
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.3,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: designTokens.borderRadius.md,
    },
    shadows: [
      'none',
      designTokens.shadows.soft,
      designTokens.shadows.medium,
      designTokens.shadows.strong,
      designTokens.shadows.xl,
      // Extend with more shadows as needed
      ...Array(20).fill(designTokens.shadows.xl),
    ] as any,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            // CSS Custom Properties for Tailwind integration
            '--coomunity-primary-50': designTokens.colors.coomunity.primary[50],
            '--coomunity-primary-100': designTokens.colors.coomunity.primary[100],
            '--coomunity-primary-200': designTokens.colors.coomunity.primary[200],
            '--coomunity-primary-300': designTokens.colors.coomunity.primary[300],
            '--coomunity-primary-400': designTokens.colors.coomunity.primary[400],
            '--coomunity-primary-500': designTokens.colors.coomunity.primary[500],
            '--coomunity-primary-600': designTokens.colors.coomunity.primary[600],
            '--coomunity-primary-700': designTokens.colors.coomunity.primary[700],
            '--coomunity-primary-800': designTokens.colors.coomunity.primary[800],
            '--coomunity-primary-900': designTokens.colors.coomunity.primary[900],
            '--coomunity-secondary-50': designTokens.colors.coomunity.secondary[50],
            '--coomunity-secondary-100': designTokens.colors.coomunity.secondary[100],
            '--coomunity-secondary-200': designTokens.colors.coomunity.secondary[200],
            '--coomunity-secondary-300': designTokens.colors.coomunity.secondary[300],
            '--coomunity-secondary-400': designTokens.colors.coomunity.secondary[400],
            '--coomunity-secondary-500': designTokens.colors.coomunity.secondary[500],
            '--coomunity-secondary-600': designTokens.colors.coomunity.secondary[600],
            '--coomunity-secondary-700': designTokens.colors.coomunity.secondary[700],
            '--coomunity-secondary-800': designTokens.colors.coomunity.secondary[800],
            '--coomunity-secondary-900': designTokens.colors.coomunity.secondary[900],
            '--shadow-coomunity-soft': designTokens.shadows.soft,
            '--shadow-coomunity-medium': designTokens.shadows.medium,
            '--shadow-coomunity-strong': designTokens.shadows.strong,
            '--shadow-coomunity-xl': designTokens.shadows.xl,
          },
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
          '*': {
            scrollbarWidth: 'thin',
            scrollbarColor: `${alpha(designTokens.colors.coomunity.primary[500], 0.3)} transparent`,
          },
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(designTokens.colors.coomunity.primary[500], 0.3),
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: alpha(designTokens.colors.coomunity.primary[500], 0.5),
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.md,
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            boxShadow: designTokens.shadows.soft,
            '&:hover': {
              boxShadow: designTokens.shadows.medium,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.lg,
            boxShadow: designTokens.shadows.soft,
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: designTokens.shadows.medium,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.md,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: designTokens.borderRadius.md,
            },
          },
        },
      },
    },
  });
};

// 🎯 Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 🎨 Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isDark, setIsDark] = useState(false);

  // 🌙 Detect system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('coomunity-theme-mode') as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // 🎯 Update dark mode state
  useEffect(() => {
    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setIsDark(mode === 'dark');
    }
  }, [mode]);

  // 💾 Save theme preference
  useEffect(() => {
    localStorage.setItem('coomunity-theme-mode', mode);
  }, [mode]);

  // 🔄 Toggle theme
  const toggleTheme = () => {
    setMode(current => current === 'light' ? 'dark' : 'light');
  };

  // 🎨 Set theme mode
  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  // 🎨 Create theme instance
  const theme = createCoomunityTheme(isDark ? 'dark' : 'light');

  const contextValue: ThemeContextType = {
    mode,
    isDark,
    toggleTheme,
    setThemeMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// 🎯 Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 🎨 Export design tokens for external use
export { designTokens }; 