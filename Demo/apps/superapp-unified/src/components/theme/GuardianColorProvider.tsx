import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// ===== 🎨 TIPOS DE TEMAS GUARDIAN =====
export type GuardianTheme = 'guardian' | 'autumn' | 'cosmic' | 'harmony';

// ===== 🌟 PALETAS DE COLORES GUARDIAN =====
const GUARDIAN_PALETTES = {
  guardian: {
    name: 'Guardian Elements',
    description: 'Los cinco elementos en armonía máxima',
    primary: '#f5a623', // Fuego - Dorado
    secondary: '#0891b2', // Agua - Azul
    accent: '#16a34a', // Tierra - Verde
    mystic: '#a855f7', // Aire - Violeta
    neutral: '#e8e7e3', // Éter - Cristal
    background: '#fffffe',
    surface: '#fdfdfb',
    text: {
      primary: '#000000',
      secondary: '#2d2d2d',
      muted: '#595959'
    }
  },
  autumn: {
    name: 'Autumn Warmth',
    description: 'Calidez otoñal con tonos terrosos',
    primary: '#f97316', // Naranja otoñal
    secondary: '#dc2626', // Rojo otoñal
    accent: '#f59e0b', // Dorado otoñal
    mystic: '#16a34a', // Verde bosque
    neutral: '#78716c', // Marrón tierra
    background: '#fffefb',
    surface: '#fafaf9',
    text: {
      primary: '#292524',
      secondary: '#57534e',
      muted: '#78716c'
    }
  },
  cosmic: {
    name: 'Cosmic Vision',
    description: 'Visión espacial y futurista',
    primary: '#6366f1', // Índigo cósmico
    secondary: '#8b5cf6', // Violeta espacial
    accent: '#06b6d4', // Cian estelar
    mystic: '#ec4899', // Rosa nebulosa
    neutral: '#64748b', // Gris espacial
    background: '#0f172a',
    surface: '#1e293b',
    text: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      muted: '#94a3b8'
    }
  },
  harmony: {
    name: 'Universal Harmony',
    description: 'Equilibrio universal entre todos los elementos',
    primary: '#10b981', // Verde armonía
    secondary: '#3b82f6', // Azul equilibrio
    accent: '#f59e0b', // Dorado sabiduría
    mystic: '#8b5cf6', // Violeta elevación
    neutral: '#6b7280', // Gris neutral
    background: '#ffffff',
    surface: '#f9fafb',
    text: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6b7280'
    }
  }
};

// ===== 🎯 INTERFAZ DEL CONTEXTO =====
interface GuardianColorContextType {
  currentTheme: GuardianTheme;
  palette: typeof GUARDIAN_PALETTES[GuardianTheme];
  switchTheme: (theme: GuardianTheme) => void;
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
  const isDark = themeName === 'cosmic';

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
  initialTheme?: GuardianTheme;
}

export const GuardianColorProvider: React.FC<GuardianColorProviderProps> = ({
  children,
  initialTheme = 'guardian'
}) => {
  const [currentTheme, setCurrentTheme] = useState<GuardianTheme>(initialTheme);

  // ===== 💾 PERSISTIR TEMA EN LOCALSTORAGE =====
  useEffect(() => {
    const savedTheme = localStorage.getItem('guardian-theme') as GuardianTheme;
    if (savedTheme && GUARDIAN_PALETTES[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('guardian-theme', currentTheme);

    // ===== 🎨 APLICAR VARIABLES CSS DINÁMICAMENTE =====
    const palette = GUARDIAN_PALETTES[currentTheme];
    const root = document.documentElement;

    root.style.setProperty('--guardian-primary', palette.primary);
    root.style.setProperty('--guardian-secondary', palette.secondary);
    root.style.setProperty('--guardian-accent', palette.accent);
    root.style.setProperty('--guardian-mystic', palette.mystic);
    root.style.setProperty('--guardian-neutral', palette.neutral);
    root.style.setProperty('--guardian-bg-primary', palette.background);
    root.style.setProperty('--guardian-bg-surface', palette.surface);
    root.style.setProperty('--guardian-text-primary', palette.text.primary);
    root.style.setProperty('--guardian-text-secondary', palette.text.secondary);
    root.style.setProperty('--guardian-text-muted', palette.text.muted);

    // ===== 🔄 GRADIENTES DINÁMICOS =====
    root.style.setProperty('--guardian-gradient-primary',
      `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent} 100%)`);
    root.style.setProperty('--guardian-gradient-secondary',
      `linear-gradient(135deg, ${palette.secondary} 0%, ${palette.mystic} 100%)`);
    root.style.setProperty('--guardian-gradient-unity',
      `linear-gradient(135deg, ${palette.primary} 0%, ${palette.secondary} 25%, ${palette.accent} 50%, ${palette.mystic} 75%, ${palette.neutral} 100%)`);

  }, [currentTheme]);

  const switchTheme = (theme: GuardianTheme) => {
    setCurrentTheme(theme);
  };

  const applyColorClass = (element: string): string => {
    return `guardian-${element}-${currentTheme}`;
  };

  const contextValue: GuardianColorContextType = {
    currentTheme,
    palette: GUARDIAN_PALETTES[currentTheme],
    switchTheme,
    getElementColor: (element) => getElementColor(element, GUARDIAN_PALETTES[currentTheme]),
    getConceptColor: (concept) => getConceptColor(concept, GUARDIAN_PALETTES[currentTheme]),
    applyColorClass
  };

  const theme = createGuardianTheme(currentTheme);

  return (
    <GuardianColorContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
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

// ===== 🎛️ COMPONENTE SELECTOR DE TEMA =====
export const GuardianThemeSelector: React.FC = () => {
  const { currentTheme, switchTheme } = useGuardianColors();

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      background: 'var(--guardian-bg-surface)',
      border: '2px solid var(--guardian-primary)',
      borderRadius: 16,
      padding: 16,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
    }}>
      <h4 style={{
        margin: '0 0 12px 0',
        color: 'var(--guardian-text-primary)',
        fontSize: '0.875rem',
        fontWeight: 600
      }}>
        🌟 Guardian Themes
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(GUARDIAN_PALETTES).map(([key, palette]) => (
          <button
            key={key}
            onClick={() => switchTheme(key as GuardianTheme)}
            style={{
              padding: '8px 12px',
              border: currentTheme === key ? '2px solid var(--guardian-primary)' : '1px solid var(--guardian-neutral)',
              borderRadius: 12,
              background: currentTheme === key ? 'var(--guardian-primary)' : 'transparent',
              color: currentTheme === key ? '#ffffff' : 'var(--guardian-text-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease',
              textAlign: 'left'
            }}
          >
            {palette.name}
          </button>
        ))}
      </div>
    </div>
  );
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
