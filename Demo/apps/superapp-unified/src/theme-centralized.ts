/**
 * 🎨 TEMA CENTRALIZADO - COOMUNITY SUPERAPP
 * ===============================================================================
 * Este archivo integra el sistema centralizado de colores con Material UI
 * Cambiar la paleta en color-system.ts se refleja automáticamente aquí
 * ===============================================================================
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { getMaterialUIThemeColors, activePalette } from './design-system/color-system';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => {
  const colors = getMaterialUIThemeColors(mode);
  
  return {
    palette: {
      mode,
      ...colors,
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
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.primary.main} 100%)`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
              backgroundColor: colors.action.hover,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${colors.divider}`,
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
              : '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light'
                ? '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
                : '0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          },
          filled: {
            backgroundColor: colors.action.selected,
            '&:hover': {
              backgroundColor: colors.action.hover,
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 9999,
            height: 8,
            backgroundColor: colors.action.hover,
          },
          bar: {
            borderRadius: 9999,
            background: `linear-gradient(90deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.05) translateY(-2px)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: colors.background.paper,
          },
          elevation1: {
            boxShadow: mode === 'light'
              ? '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
              : '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: colors.action.hover,
              transform: 'scale(1.05)',
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '2px 8px',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&.Mui-selected': {
              backgroundColor: colors.action.selected,
              '&:hover': {
                backgroundColor: colors.action.hover,
              },
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: colors.text.primary,
            color: colors.background.paper,
            borderRadius: 6,
            fontSize: '0.75rem',
            fontWeight: 500,
            padding: '8px 12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
          },
          arrow: {
            color: colors.text.primary,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            border: `1px solid ${colors.divider}`,
          },
          standardSuccess: {
            backgroundColor: colors.success.light,
            color: colors.success.dark,
            border: `1px solid ${colors.success.main}`,
          },
          standardError: {
            backgroundColor: colors.error.light,
            color: colors.error.dark,
            border: `1px solid ${colors.error.main}`,
          },
          standardWarning: {
            backgroundColor: colors.warning.light,
            color: colors.warning.dark,
            border: `1px solid ${colors.warning.main}`,
          },
          standardInfo: {
            backgroundColor: colors.info.light,
            color: colors.info.dark,
            border: `1px solid ${colors.info.main}`,
          },
        },
      },
    },
  };
};

export const createCentralizedTheme = (mode: 'light' | 'dark' = 'light') => {
  console.log(`🎨 Creating theme with ${activePalette.name} palette in ${mode} mode`);
  return createTheme(getDesignTokens(mode));
};

// Exportar tema por defecto
export const centralizedTheme = createCentralizedTheme('light');
export const centralizedThemeDark = createCentralizedTheme('dark');

/**
 * 🎯 CÓMO USAR ESTE TEMA:
 * ======================
 * 
 * 1. Importar en ThemeContext.tsx:
 *    import { createCentralizedTheme } from '../theme-centralized';
 * 
 * 2. Reemplazar createAppTheme por createCentralizedTheme:
 *    const theme = createCentralizedTheme(mode);
 * 
 * 3. ¡Automáticamente usará la paleta activa de color-system.ts!
 * 
 * Para cambiar toda la paleta:
 * - Editar ACTIVE_PALETTE en design-system/color-system.ts
 * - Automáticamente se aplica en toda la app
 */