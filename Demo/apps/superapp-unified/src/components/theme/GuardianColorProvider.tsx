import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// ===== 🎨 TIPOS DE TEMAS GUARDIAN =====
export type GuardianTheme = 'monochrome'; // Forzar un único tema

// ===== 🌟 PALETAS DE COLORES GUARDIAN =====
const GUARDIAN_PALETTES = {
  monochrome: {
    name: 'Pure Monochrome',
    description: 'Elegancia atemporal en escala de grises',
    primary: '#000000', // Negro puro
    secondary: '#555555', // Gris oscuro
    accent: '#888888', // Gris medio
    mystic: '#bbbbbb', // Gris claro
    neutral: '#eeeeee', // Gris muy claro
    background: '#ffffff',
    surface: '#fafafa',
    text: {
      primary: '#000000',
      secondary: '#333333',
      muted: '#777777'
    }
  }
};

// ===== 🎯 INTERFAZ DEL CONTEXTO =====
interface GuardianColorContextType {
  currentTheme: GuardianTheme;
  palette: typeof GUARDIAN_PALETTES[GuardianTheme];
  switchTheme: () => void;
  getElementColor: (element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter') => string;
  getConceptColor: (concept: 'ayni' | 'meritos' | 'ondas' | 'lukas' | 'bien-comun') => string;
  applyColorClass: (element: string) => string;
}

// ===== 🔮 CREACIÓN DEL CONTEXTO =====
const GuardianColorContext = createContext<GuardianColorContextType | undefined>(undefined);

// ===== 🌈 MAPEO DE ELEMENTOS A COLORES =====
const getElementColor = (element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter', palette: any): string => {
  const mapping = {
    fuego: palette.primary,
    agua: palette.secondary,
    tierra: palette.accent,
    aire: palette.mystic,
    eter: palette.neutral
  };
  return mapping[element] || palette.primary;
};

// ===== 🤝 MAPEO DE CONCEPTOS COOMUNITY =====
const getConceptColor = (concept: 'ayni' | 'meritos' | 'ondas' | 'lukas' | 'bien-comun', palette: any): string => {
  const mapping = {
    ayni: palette.accent, // Tierra - Equilibrio
    meritos: palette.primary, // Fuego - Logro
    ondas: palette.mystic, // Aire - Energía
    lukas: palette.secondary, // Agua - Flujo
    'bien-comun': palette.neutral // Éter - Unidad
  };
  return mapping[concept] || palette.primary;
};

// ===== 🎨 CREACIÓN DEL TEMA MATERIAL-UI GUARDIAN =====
const createGuardianTheme = (themeName: GuardianTheme): Theme => {
  const palette = GUARDIAN_PALETTES[themeName];
  const isDark = false; // El modo monocromático es claro por defecto

  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: palette.primary,
        light: isDark ? palette.primary : '#fef7e1',
        dark: isDark ? '#4338ca' : '#c17d15',
        contrastText: isDark ? '#ffffff' : '#ffffff'
      },
      secondary: {
        main: palette.secondary,
        light: isDark ? palette.secondary : '#e0f2fe',
        dark: isDark ? '#7c3aed' : '#155e75',
        contrastText: '#ffffff'
      },
      background: {
        default: palette.background,
        paper: palette.surface
      },
      text: {
        primary: palette.text.primary,
        secondary: palette.text.secondary,
        disabled: palette.text.muted
      },
      success: {
        main: palette.accent,
        light: isDark ? '#86efac' : '#dcfce7',
        dark: isDark ? '#059669' : '#166534'
      },
      warning: {
        main: '#f59e0b',
        light: '#fef3c7',
        dark: '#d97706'
      },
      error: {
        main: '#ef4444',
        light: '#fee2e2',
        dark: '#dc2626'
      },
      info: {
        main: palette.mystic,
        light: isDark ? '#e9d5ff' : '#f3e8ff',
        dark: isDark ? '#7c3aed' : '#6b21a8'
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 800,
        lineHeight: 1.2,
        color: palette.text.primary
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.3,
        color: palette.text.primary
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 700,
        lineHeight: 1.3,
        color: palette.text.primary
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: palette.text.primary
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: palette.text.primary
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.5,
        color: palette.text.primary
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        color: palette.text.secondary,
        fontWeight: 500
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        color: palette.text.secondary,
        fontWeight: 500
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.4,
        color: palette.text.muted,
        fontWeight: 500
      }
    },
    shape: {
      borderRadius: 16
    },
    shadows: [
      'none',
      '0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
      '0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
      '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
      '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
      '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
      '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
      '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
      '0 12px 32px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
      '0 12px 32px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
      '0 12px 32px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
      '0 12px 32px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
      '0 12px 32px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
      '0 12px 32px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
      '0 12px 32px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
      '0 12px 32px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
      '0 16px 48px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.12)',
      '0 16px 48px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.12)',
      '0 16px 48px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.12)',
      '0 16px 48px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.12)',
      '0 16px 48px rgba(0, 0, 0, 0.2), 0 6px 12px rgba(0, 0, 0, 0.12)',
      '0 20px 60px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.15)',
      '0 20px 60px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.15)',
      '0 20px 60px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.15)',
      '0 24px 72px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.18)'
    ],
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `2px solid rgba(245, 166, 35, 0.15)`,
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.02)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)'
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 600,
            textTransform: 'none',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px) scale(1.05)'
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            fontWeight: 600,
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px) scale(1.05)'
            }
          }
        }
      }
    }
  });
};

// ===== 🔧 PROVIDER COMPONENT =====
interface GuardianColorProviderProps {
  children: ReactNode;
}

export const GuardianColorProvider: React.FC<GuardianColorProviderProps> = ({
  children,
}) => {
  // Forzar el tema monocromático
  const [currentTheme, setCurrentTheme] = useState<GuardianTheme>('monochrome');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'monochrome');
    // Aplicar variables CSS para el tema monocromático
    const palette = GUARDIAN_PALETTES.monochrome;
    const root = document.documentElement;
    root.style.setProperty('--guardian-bg-primary', palette.background);
    root.style.setProperty('--guardian-bg-surface', palette.surface);
    root.style.setProperty('--guardian-text-primary', palette.text.primary);
    root.style.setProperty('--guardian-text-secondary', palette.text.secondary);
    root.style.setProperty('--guardian-primary', palette.primary);
    root.style.setProperty('--guardian-secondary', palette.secondary);
    root.style.setProperty('--guardian-accent', palette.accent);
    // ...y así sucesivamente para todas las variables que uses.
    // Esto es un reinicio completo.
    root.style.setProperty('--guardian-gradient-cosmic', 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)');


  }, []);


  const switchTheme = () => {
    // La función de cambio de tema se deshabilita para forzar el monocromático.
    console.log("El cambio de tema está deshabilitado en el modo de reinicio monocromático.");
  };

  const muiTheme = createGuardianTheme('monochrome');

  const value = {
    currentTheme: 'monochrome' as GuardianTheme,
    palette: GUARDIAN_PALETTES.monochrome,
    switchTheme,
    getElementColor: (element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter') => getElementColor(element, GUARDIAN_PALETTES.monochrome),
    getConceptColor: (concept: 'ayni' | 'meritos' | 'ondas' | 'lukas' | 'bien-comun') => getConceptColor(concept, GUARDIAN_PALETTES.monochrome),
    applyColorClass: (element: string): string => `guardian-${element}-monochrome`,
  };


  return (
    <GuardianColorContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </GuardianColorContext.Provider>
  );
};

// ===== 🪝 HOOK PERSONALIZADO =====
export const useGuardianColors = (): GuardianColorContextType => {
  const context = useContext(GuardianColorContext);
  if (!context) {
    throw new Error('useGuardianColors must be used within a GuardianColorProvider');
  }
  return context;
};

// ===== 🎛️ COMPONENTE SELECTOR DE TEMA MEJORADO =====
export const GuardianThemeSelector: React.FC = () => {
  // El selector de temas se deshabilita y se oculta.
  return null;
};

// ===== 🎨 HOOK PARA CLASES DE UTILIDAD =====
export const useGuardianClasses = () => {
  const { currentTheme, palette } = useGuardianColors();

  return {
    textPrimary: 'guardian-text-primary',
    textSecondary: 'guardian-text-secondary',
    textMuted: 'guardian-text-muted',
    bgPrimary: 'guardian-bg-primary',
    bgCard: 'guardian-bg-card',
    bgSoft: 'guardian-bg-soft',
    border: 'guardian-border',
    borderAccent: 'guardian-border-accent',
    shadow: 'guardian-shadow',
    shadowHover: 'guardian-shadow-hover',
    transition: 'guardian-transition',
    glow: 'guardian-glow',
    float: 'guardian-float',
    gradientText: 'guardian-gradient-text',
    // Elementos
    ayni: 'guardian-text-ayni',
    meritos: 'guardian-text-meritos',
    ondas: 'guardian-text-ondas',
    lukas: 'guardian-text-lukas',
    // Chips por elemento
    chipAyni: 'chip-ayni',
    chipMeritos: 'chip-meritos',
    chipOndas: 'chip-ondas',
    chipLukas: 'chip-lukas'
  };
};

export default GuardianColorProvider;
