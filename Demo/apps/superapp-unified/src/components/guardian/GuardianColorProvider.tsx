import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// 🌟 GUARDIAN COLOR SYSTEM - ADVANCED PROVIDER
// Permite invocar "agentes guardianes" para mejorar toda la paleta visual

export type GuardianTheme = 'guardian' | 'autumn' | 'cosmic' | 'harmony';

// 🌈 DEFINICIÓN COMPLETA DE SISTEMAS DE COLOR
export interface GuardianColorSystem {
  // Colores principales de los cinco elementos
  primary: string;          // Fuego - Dorado cálido principal
  secondary: string;        // Agua - Azul confiable
  accent: string;           // Tierra - Verde equilibrado
  mystic: string;           // Aire - Violeta inspirador
  ether: string;            // Éter - Ámbar cósmico

  // Textos con contraste WCAG AAA
  textPrimary: string;      // 21:1 contraste máximo
  textHeading: string;      // 15:1 contraste títulos
  textBody: string;         // 12:1 contraste cuerpo
  textSecondary: string;    // 8:1 contraste secundario
  textMuted: string;        // 7:1 contraste sutil

  // Fondos armónicos
  bgPrimary: string;        // Fondo principal
  bgSecondary: string;      // Fondo secundario
  bgSurface: string;        // Superficies elevadas

  // Gradientes dinámicos
  gradientPrimary: string;  // Gradiente principal
  gradientSecondary: string; // Gradiente secundario
  gradientCosmic: string;   // Gradiente cósmico
  gradientAyni: string;     // Gradiente Ayni especial
}

// 🎨 PALETAS TEMÁTICAS GUARDIAN
const guardianThemes: Record<GuardianTheme, GuardianColorSystem> = {
  guardian: {
    // Paleta Guardian Original - Dorado místico
    primary: '#f5a623',          // Fuego dorado cálido
    secondary: '#0891b2',        // Agua azul confiable
    accent: '#16a34a',           // Tierra verde equilibrado
    mystic: '#a855f7',           // Aire violeta inspirador
    ether: '#f59e0b',            // Éter ámbar cósmico

    textPrimary: '#000000',      // Negro puro - 21:1 contraste
    textHeading: '#1a1a1a',      // Gris muy oscuro - 15:1
    textBody: '#2d2d2d',         // Gris oscuro - 12:1
    textSecondary: '#4a4a4a',    // Gris medio - 8:1
    textMuted: '#595959',        // Gris sutil - 7:1

    bgPrimary: '#fffefb',        // Blanco cálido
    bgSecondary: '#faf9f6',      // Blanco secundario
    bgSurface: '#f8fafc',        // Blanco superficie

    gradientPrimary: 'linear-gradient(135deg, #f5a623 0%, #16a34a 100%)',
    gradientSecondary: 'linear-gradient(135deg, #0891b2 0%, #a855f7 100%)',
    gradientCosmic: 'linear-gradient(135deg, #f5a623 0%, #a855f7 50%, #0891b2 100%)',
    gradientAyni: 'linear-gradient(135deg, #16a34a 0%, #0891b2 100%)',
  },

  autumn: {
    // Paleta Otoñal - Colores cálidos y terrosos
    primary: '#f97316',          // Naranja otoñal
    secondary: '#dc2626',        // Rojo tierra
    accent: '#16a34a',           // Verde bosque
    mystic: '#7c2d12',           // Marrón místico
    ether: '#f59e0b',            // Ámbar dorado

    textPrimary: '#0f172a',      // Slate 900
    textHeading: '#1e293b',      // Slate 800
    textBody: '#334155',         // Slate 700
    textSecondary: '#475569',    // Slate 600
    textMuted: '#64748b',        // Slate 500

    bgPrimary: '#fffbf0',        // Crema cálido
    bgSecondary: '#fef7e1',      // Dorado muy claro
    bgSurface: '#fdfdfd',        // Blanco sutil

    gradientPrimary: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
    gradientSecondary: 'linear-gradient(135deg, #16a34a 0%, #7c2d12 100%)',
    gradientCosmic: 'linear-gradient(135deg, #f97316 0%, #16a34a 50%, #dc2626 100%)',
    gradientAyni: 'linear-gradient(135deg, #16a34a 0%, #f59e0b 100%)',
  },

  cosmic: {
    // Paleta Cósmica - Para modo nocturno/espacial
    primary: '#6366f1',          // Indigo cósmico
    secondary: '#a855f7',        // Violeta místico
    accent: '#06b6d4',           // Cyan estelar
    mystic: '#ec4899',           // Rosa nebulosa
    ether: '#8b5cf6',            // Violeta etéreo

    textPrimary: '#f8fafc',      // Blanco estelar
    textHeading: '#e2e8f0',      // Gris muy claro
    textBody: '#cbd5e1',         // Gris claro
    textSecondary: '#94a3b8',    // Gris medio
    textMuted: '#64748b',        // Gris sutil

    bgPrimary: '#0f172a',        // Slate 900 oscuro
    bgSecondary: '#1e293b',      // Slate 800
    bgSurface: '#334155',        // Slate 700

    gradientPrimary: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    gradientSecondary: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)',
    gradientCosmic: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
    gradientAyni: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
  },

  harmony: {
    // Paleta Armónica - Verdes y azules suaves
    primary: '#22c55e',          // Verde vivaz
    secondary: '#3b82f6',        // Azul serenidad
    accent: '#06b6d4',           // Cyan flujo
    mystic: '#8b5cf6',           // Violeta armonía
    ether: '#f59e0b',            // Ámbar equilibrio

    textPrimary: '#0f172a',      // Slate 900
    textHeading: '#1e293b',      // Slate 800
    textBody: '#334155',         // Slate 700
    textSecondary: '#475569',    // Slate 600
    textMuted: '#64748b',        // Slate 500

    bgPrimary: '#f0fdf4',        // Verde muy claro
    bgSecondary: '#eff6ff',      // Azul muy claro
    bgSurface: '#f8fafc',        // Blanco superficie

    gradientPrimary: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
    gradientSecondary: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
    gradientCosmic: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 50%, #8b5cf6 100%)',
    gradientAyni: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
  },
};

// 🌟 CONTEXTO GUARDIAN
interface GuardianColorContextType {
  currentTheme: GuardianTheme;
  colorSystem: GuardianColorSystem;
  switchTheme: (theme: GuardianTheme) => void;
  applyColorClass: (element: string) => string;
  getElementColor: (element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter') => string;
  getGradient: (type: 'primary' | 'secondary' | 'cosmic' | 'ayni') => string;
}

const GuardianColorContext = createContext<GuardianColorContextType | undefined>(undefined);

// 🎯 HOOK PARA USAR EL SISTEMA GUARDIAN
export const useGuardianColors = (): GuardianColorContextType => {
  const context = useContext(GuardianColorContext);
  if (!context) {
    throw new Error('useGuardianColors debe usarse dentro de GuardianColorProvider');
  }
  return context;
};

// 🎨 FUNCIÓN PARA CREAR TEMA MATERIAL-UI DINÁMICO
const createGuardianTheme = (currentTheme: GuardianTheme): Theme => {
  const colors = guardianThemes[currentTheme];
  const isDark = currentTheme === 'cosmic';

  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: colors.primary,
        light: colors.primary + '40', // Añadir transparencia
        dark: colors.primary + 'CC',  // Versión más oscura
        contrastText: isDark ? colors.textPrimary : '#ffffff',
      },
      secondary: {
        main: colors.secondary,
        light: colors.secondary + '40',
        dark: colors.secondary + 'CC',
        contrastText: isDark ? colors.textPrimary : '#ffffff',
      },
      background: {
        default: colors.bgPrimary,
        paper: colors.bgSurface,
      },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
        disabled: colors.textMuted,
      },
      success: {
        main: colors.accent,
        light: colors.accent + '40',
        dark: colors.accent + 'CC',
        contrastText: '#ffffff',
      },
      warning: {
        main: colors.ether,
        light: colors.ether + '40',
        dark: colors.ether + 'CC',
        contrastText: '#ffffff',
      },
      info: {
        main: colors.mystic,
        light: colors.mystic + '40',
        dark: colors.mystic + 'CC',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ef4444',
        light: '#fecaca',
        dark: '#dc2626',
        contrastText: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '3rem',
        fontWeight: 800,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        background: colors.gradientPrimary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        color: colors.textHeading,
      },
      h3: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
        color: colors.textHeading,
      },
      h4: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.3,
        color: colors.textHeading,
      },
      h5: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: colors.textHeading,
      },
      h6: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
        color: colors.textHeading,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        color: colors.textBody,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        color: colors.textSecondary,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: colors.bgSurface,
            border: `2px solid transparent`,
            borderRadius: '24px',
            boxShadow: `0 4px 12px ${colors.primary}15`,
            transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: colors.gradientPrimary,
              opacity: 0.8,
            },
            '&:hover': {
              transform: 'translateY(-4px) scale(1.02)',
              boxShadow: `0 12px 32px ${colors.primary}25`,
              borderColor: `${colors.primary}40`,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          },
          contained: {
            background: colors.gradientPrimary,
            color: '#ffffff',
            fontWeight: 700,
            '&:hover': {
              background: colors.gradientSecondary,
              transform: 'translateY(-2px) scale(1.05)',
              boxShadow: `0 8px 24px ${colors.primary}30`,
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: '12px',
            borderRadius: '9999px',
            backgroundColor: `${colors.primary}20`,
          },
          bar: {
            borderRadius: '9999px',
            background: colors.gradientPrimary,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px) scale(1.05)',
            },
          },
          filled: {
            backgroundColor: `${colors.primary}20`,
            color: colors.textHeading,
            '&:hover': {
              backgroundColor: `${colors.primary}30`,
            },
          },
        },
      },
    },
  });
};

// 🌟 PROVEEDOR PRINCIPAL GUARDIAN
interface GuardianColorProviderProps {
  children: ReactNode;
  defaultTheme?: GuardianTheme;
}

export const GuardianColorProvider: React.FC<GuardianColorProviderProps> = ({
  children,
  defaultTheme = 'guardian',
}) => {
  const [currentTheme, setCurrentTheme] = useState<GuardianTheme>(defaultTheme);
  const [colorSystem, setColorSystem] = useState<GuardianColorSystem>(guardianThemes[defaultTheme]);

  // 🎨 APLICAR COLORES A VARIABLES CSS
  const applyColors = () => {
    const colors = guardianThemes[currentTheme];
    const root = document.documentElement;

    // Aplicar colores principales
    root.style.setProperty('--guardian-primary', colors.primary);
    root.style.setProperty('--guardian-secondary', colors.secondary);
    root.style.setProperty('--guardian-accent', colors.accent);
    root.style.setProperty('--guardian-mystic', colors.mystic);
    root.style.setProperty('--guardian-ether', colors.ether);

    // Aplicar textos
    root.style.setProperty('--guardian-text-primary', colors.textPrimary);
    root.style.setProperty('--guardian-text-heading', colors.textHeading);
    root.style.setProperty('--guardian-text-body', colors.textBody);
    root.style.setProperty('--guardian-text-secondary', colors.textSecondary);
    root.style.setProperty('--guardian-text-muted', colors.textMuted);

    // Aplicar fondos
    root.style.setProperty('--guardian-bg-primary', colors.bgPrimary);
    root.style.setProperty('--guardian-bg-secondary', colors.bgSecondary);
    root.style.setProperty('--guardian-bg-surface', colors.bgSurface);

    // Aplicar gradientes
    root.style.setProperty('--guardian-gradient-primary', colors.gradientPrimary);
    root.style.setProperty('--guardian-gradient-secondary', colors.gradientSecondary);
    root.style.setProperty('--guardian-gradient-cosmic', colors.gradientCosmic);
    root.style.setProperty('--guardian-gradient-ayni', colors.gradientAyni);

    // Elementos específicos para filosofía de cinco elementos
    root.style.setProperty('--element-fuego', colors.primary);
    root.style.setProperty('--element-agua', colors.secondary);
    root.style.setProperty('--element-tierra', colors.accent);
    root.style.setProperty('--element-aire', colors.mystic);
    root.style.setProperty('--element-eter', colors.ether);

    // Añadir clase CSS al HTML para activar Guardian
    document.documentElement.classList.add('guardian-system-active');
    document.body.classList.add('guardian-enhanced');

    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.classList.add('guardian-enhanced');
    }
  };

  const switchTheme = (theme: GuardianTheme) => {
    setCurrentTheme(theme);
    setColorSystem(guardianThemes[theme]);
    localStorage.setItem('guardian-theme', theme);
  };

  const applyColorClass = (element: string): string => {
    return `guardian-${element}-${currentTheme}`;
  };

  const getElementColor = (element: 'fuego' | 'agua' | 'tierra' | 'aire' | 'eter'): string => {
    switch (element) {
      case 'fuego': return colorSystem.primary;
      case 'agua': return colorSystem.secondary;
      case 'tierra': return colorSystem.accent;
      case 'aire': return colorSystem.mystic;
      case 'eter': return colorSystem.ether;
      default: return colorSystem.primary;
    }
  };

  const getGradient = (type: 'primary' | 'secondary' | 'cosmic' | 'ayni'): string => {
    switch (type) {
      case 'primary': return colorSystem.gradientPrimary;
      case 'secondary': return colorSystem.gradientSecondary;
      case 'cosmic': return colorSystem.gradientCosmic;
      case 'ayni': return colorSystem.gradientAyni;
      default: return colorSystem.gradientPrimary;
    }
  };

  useEffect(() => {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('guardian-theme') as GuardianTheme;
    if (savedTheme && guardianThemes[savedTheme]) {
      setCurrentTheme(savedTheme);
      setColorSystem(guardianThemes[savedTheme]);
    }
  }, []);

  useEffect(() => {
    applyColors();
  }, [currentTheme, colorSystem]);

  // Crear tema Material-UI dinámico
  const muiTheme = createGuardianTheme(currentTheme);

  const contextValue: GuardianColorContextType = {
    currentTheme,
    colorSystem,
    switchTheme,
    applyColorClass,
    getElementColor,
    getGradient,
  };

  return (
    <GuardianColorContext.Provider value={contextValue}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </GuardianColorContext.Provider>
  );
};

// 🎨 COMPONENTE SELECTOR DE TEMA (Para testing/admin)
export const GuardianThemeSelector: React.FC = () => {
  const { currentTheme, switchTheme } = useGuardianColors();

  const themeOptions = [
    { value: 'guardian' as const, label: '🌟 Guardian Místico', description: 'Dorado elegante original' },
    { value: 'autumn' as const, label: '🍂 Otoño Cálido', description: 'Colores terrosos y acogedores' },
    { value: 'cosmic' as const, label: '🌌 Cósmico Nocturno', description: 'Espacial y futurista' },
    { value: 'harmony' as const, label: '🌿 Armonía Natural', description: 'Verdes y azules serenos' },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '16px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(12px)',
      minWidth: '250px',
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#333' }}>
        🎨 Guardian Themes
      </h4>
      {themeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => switchTheme(option.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px 12px',
            margin: '4px 0',
            border: currentTheme === option.value ? '2px solid #f5a623' : '1px solid #ddd',
            borderRadius: '8px',
            background: currentTheme === option.value ? '#f5a623' : '#fff',
            color: currentTheme === option.value ? '#fff' : '#333',
            cursor: 'pointer',
            fontSize: '12px',
            textAlign: 'left',
            transition: 'all 200ms ease',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{option.label}</div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>{option.description}</div>
        </button>
      ))}
    </div>
  );
};

// 🔧 HOOK UTILITARIO PARA CLASES CSS
export const useGuardianClasses = () => {
  const { applyColorClass } = useGuardianColors();

  return {
    card: `guardian-card ${applyColorClass('card')}`,
    button: `guardian-button ${applyColorClass('button')}`,
    text: `guardian-text ${applyColorClass('text')}`,
    gradient: `guardian-gradient ${applyColorClass('gradient')}`,
    element: (element: string) => `guardian-${element} ${applyColorClass(element)}`,
  };
};
