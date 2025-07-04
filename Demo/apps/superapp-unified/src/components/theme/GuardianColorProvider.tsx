import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Importar sistema de colores unificado
import { THEME_PALETTES, ELEMENT_COLORS, CONCEPT_COLORS } from '../../theme/colors';

// ===== 🎨 TIPOS DE TEMAS GUARDIAN =====
export type GuardianTheme = 'minimalist' | 'monochrome'; // Tipos de temas disponibles

// Asegurarse de que siempre haya un tema por defecto
const DEFAULT_THEME: GuardianTheme = 'minimalist';

// ===== 🎯 INTERFAZ DEL CONTEXTO =====
interface GuardianColorContextType {
  currentTheme: GuardianTheme;
  palette: typeof THEME_PALETTES[GuardianTheme];
  switchTheme: (theme: GuardianTheme) => void;
  getElementColor: (element: keyof typeof ELEMENT_COLORS) => string;
  getConceptColor: (concept: 'reciprocidad' | 'meritos' | 'ondas' | 'lukas' | 'bien-comun') => string;
  applyColorClass: (element: string) => string;
}

// ===== 🔮 CREACIÓN DEL CONTEXTO =====
const GuardianColorContext = createContext<GuardianColorContextType | undefined>(undefined);

// ===== 🌈 MAPEO DE ELEMENTOS A COLORES =====
const getElementColor = (element: keyof typeof ELEMENT_COLORS, palette: any): string => {
  // Usar los colores elementales del sistema unificado
  return ELEMENT_COLORS[element]?.primary || palette.primary;
};

// ===== 🤝 MAPEO DE CONCEPTOS COOMUNITY =====
const getConceptColor = (concept: 'reciprocidad' | 'meritos' | 'ondas' | 'lukas' | 'bien-comun', palette: any): string => {
  // Transformar el concepto al formato adecuado para el objeto CONCEPT_COLORS
  const conceptMapping: Record<string, keyof typeof CONCEPT_COLORS> = {
    'reciprocidad': 'reciprocidad',
    'meritos': 'meritos',
    'ondas': 'ondas',
    'lukas': 'lukas',
    'bien-comun': 'bienComun'
  };

  const conceptKey = conceptMapping[concept];
  return CONCEPT_COLORS[conceptKey] || palette.primary;
};

// ===== 🎨 CREACIÓN DEL TEMA MATERIAL-UI GUARDIAN =====
const createGuardianTheme = (themeName: GuardianTheme): Theme => {
  // Asegurarse de que themeName sea válido, si no, usar el tema por defecto
  const validThemeName = THEME_PALETTES[themeName] ? themeName : DEFAULT_THEME;

  // Asegurarse de que la paleta exista
  const palette = THEME_PALETTES[validThemeName];

  // Verificación adicional para asegurarse de que palette no sea undefined
  if (!palette) {
    console.error(`Guardian theme palette not found for theme: ${themeName}, using default theme`);
    return createTheme(); // Tema MUI por defecto como fallback
  }

  const isDark = false; // El tema minimalista es claro

  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: palette.primary,
        light: isDark ? palette.primary : '#fef7e1',
        dark: isDark ? '#392768' : '#5C2483',
        contrastText: isDark ? '#ffffff' : '#ffffff'
      },
      secondary: {
        main: palette.secondary,
        light: palette.accent,
        dark: palette.mystic,
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
        main: palette.success,
        light: ELEMENT_COLORS.tierra.light,
        dark: ELEMENT_COLORS.tierra.dark,
      },
      warning: {
        main: palette.warning,
        light: CONCEPT_COLORS.meritos,
        dark: '#975A16',
      },
      error: {
        main: palette.error,
        light: '#fee2e2',
        dark: '#5D1626',
      },
      info: {
        main: palette.info,
        light: ELEMENT_COLORS.agua.light,
        dark: ELEMENT_COLORS.agua.dark,
      },
      divider: palette.divider,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 600,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      },
      body1: {
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
      },
      button: {
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'none',
      },
      caption: {
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
      },
      overline: {
        fontWeight: 500,
        fontSize: '0.75rem',
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0, 0, 0, 0.03)',
      '0px 3px 6px rgba(0, 0, 0, 0.04)',
      '0px 4px 8px rgba(0, 0, 0, 0.05)',
      '0px 5px 10px rgba(0, 0, 0, 0.06)',
      '0px 6px 12px rgba(0, 0, 0, 0.07)',
      '0px 7px 14px rgba(0, 0, 0, 0.08)',
      '0px 8px 16px rgba(0, 0, 0, 0.09)',
      '0px 9px 18px rgba(0, 0, 0, 0.10)',
      '0px 10px 20px rgba(0, 0, 0, 0.11)',
      '0px 11px 22px rgba(0, 0, 0, 0.12)',
      '0px 12px 24px rgba(0, 0, 0, 0.13)',
      '0px 13px 26px rgba(0, 0, 0, 0.14)',
      '0px 14px 28px rgba(0, 0, 0, 0.15)',
      '0px 15px 30px rgba(0, 0, 0, 0.16)',
      '0px 16px 32px rgba(0, 0, 0, 0.17)',
      '0px 17px 34px rgba(0, 0, 0, 0.18)',
      '0px 18px 36px rgba(0, 0, 0, 0.19)',
      '0px 19px 38px rgba(0, 0, 0, 0.20)',
      '0px 20px 40px rgba(0, 0, 0, 0.21)',
      '0px 21px 42px rgba(0, 0, 0, 0.22)',
      '0px 22px 44px rgba(0, 0, 0, 0.23)',
      '0px 23px 46px rgba(0, 0, 0, 0.24)',
      '0px 24px 48px rgba(0, 0, 0, 0.25)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: '8px',
            textTransform: 'none',
            padding: '0.5rem 1.25rem',
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
              transform: 'translateY(-1px)',
            }
          },
          containedPrimary: {
            backgroundColor: palette.primary,
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#5C2483',
            }
          },
          containedSecondary: {
            backgroundColor: palette.secondary,
            '&:hover': {
              backgroundColor: '#392768',
            }
          },
          outlined: {
            borderWidth: '1px',
            '&:hover': {
              borderWidth: '1px',
              backgroundColor: 'rgba(92, 36, 131, 0.04)'
            }
          },
          text: {
            '&:hover': {
              backgroundColor: 'rgba(92, 36, 131, 0.04)'
            }
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: 'none',
            border: `1px solid ${palette.divider}`,
            transition: 'all 0.2s ease-in-out',
            backgroundColor: palette.background,
            '&:hover': {
              boxShadow: '0 1px 6px rgba(0, 0, 0, 0.03)',
              borderColor: 'rgba(92, 36, 131, 0.1)',
            }
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
            borderRadius: '12px',
          },
          elevation1: {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            border: `1px solid ${palette.divider}`,
          },
          elevation2: {
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
          },
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            height: 'auto',
            borderRadius: '6px',
            fontWeight: 500,
            fontSize: '0.75rem',
            padding: '0.1rem 0',
            backgroundColor: 'rgba(92, 36, 131, 0.04)',
            border: 'none',
            '&.MuiChip-outlined': {
              backgroundColor: 'transparent',
              border: `1px solid ${palette.divider}`,
            }
          },
          label: {
            padding: '0.25rem 0.5rem',
          },
          icon: {
            fontSize: '0.875rem',
          },
          deleteIcon: {
            fontSize: '0.875rem',
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: palette.divider,
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            minHeight: '48px',
            padding: '0.5rem 1rem',
            '&.Mui-selected': {
              color: palette.primary,
              fontWeight: 600
            }
          }
        }
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: '48px',
            borderBottom: `1px solid ${palette.divider}`,
          },
          indicator: {
            height: '2px',
            backgroundColor: palette.primary,
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(92, 36, 131, 0.04)',
              transform: 'translateY(-1px)',
            }
          }
        }
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollBehavior: 'smooth',
            fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
            backgroundColor: palette.background
          }
        }
      }
    }
  });
};

// ===== 🎨 FUNCIÓN PARA APLICAR TEMA AL DOCUMENTO =====
const applyThemeToDocument = (theme: any) => {
  // Verificar que theme no sea null o undefined antes de procesar
  if (!theme) return;

  // Aplicar CSS variables al :root para acceso global
  Object.entries(theme).forEach(([key, value]) => {
    if (typeof value === 'string') {
      document.documentElement.style.setProperty(`--guardian-${key}`, value);
    } else if (key === 'text' && typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([textKey, textValue]) => {
        document.documentElement.style.setProperty(`--guardian-text-${textKey}`, textValue as string);
      });
    }
  });
};

// ===== 🎭 PROPS DEL PROVIDER =====
interface GuardianColorProviderProps {
  children: ReactNode;
  initialTheme?: GuardianTheme; // Permitir un tema inicial
}

// ===== 🌟 COMPONENTE PROVIDER =====
export const GuardianColorProvider: React.FC<GuardianColorProviderProps> = ({
  children,
  initialTheme = 'minimalist' // Establecer 'minimalist' como defecto
}) => {
  // Validar que el tema inicial sea válido
  const validInitialTheme = THEME_PALETTES[initialTheme] ? initialTheme : DEFAULT_THEME;

  const [currentTheme, setCurrentTheme] = useState<GuardianTheme>(validInitialTheme);

  // Asegurarse de que la paleta siempre exista
  const currentPalette = THEME_PALETTES[currentTheme] || THEME_PALETTES[DEFAULT_THEME];

  useEffect(() => {
    // Aplicar CSS variables al :root para acceso global
    Object.entries(currentPalette).forEach(([key, value]) => {
      if (typeof value === 'string') {
        document.documentElement.style.setProperty(`--guardian-${key}`, value);
      } else if (key === 'text' && typeof value === 'object') {
        Object.entries(value).forEach(([textKey, textValue]) => {
          document.documentElement.style.setProperty(`--guardian-text-${textKey}`, textValue as string);
        });
      }
    });
  }, [currentTheme, currentPalette]);

  const switchTheme = (newTheme: GuardianTheme) => {
    // Validar que el nuevo tema sea válido
    if (THEME_PALETTES[newTheme]) {
      setCurrentTheme(newTheme);
      localStorage.setItem('guardian-theme', newTheme);
    } else {
      console.error(`Invalid theme: ${newTheme}, using default theme`);
      setCurrentTheme(DEFAULT_THEME);
    }
  };

  const applyColorClass = (element: string) => {
    return `guardian-${element}`;
  };

  // Crear el tema MUI basado en la paleta Guardian
  const muiTheme = createGuardianTheme(currentTheme);

  return (
    <GuardianColorContext.Provider
      value={{
        currentTheme,
        palette: currentPalette,
        switchTheme,
        getElementColor: (element) => getElementColor(element, currentPalette),
        getConceptColor: (concept) => getConceptColor(concept, currentPalette),
        applyColorClass
      }}
    >
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </GuardianColorContext.Provider>
  );
};

// ===== 🎣 HOOK PARA USAR EL CONTEXTO =====
export const useGuardianColors = (): GuardianColorContextType => {
  const context = useContext(GuardianColorContext);
  if (!context) {
    throw new Error('useGuardianColors must be used within a GuardianColorProvider');
  }
  return context;
};

// ===== 🎚️ SELECTOR DE TEMAS =====
export const GuardianThemeSelector: React.FC = () => {
  const { currentTheme, switchTheme } = useGuardianColors();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchTheme(e.target.value as GuardianTheme);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg">
      <select
        value={currentTheme}
        onChange={handleThemeChange}
        className="p-2 border border-gray-300 rounded"
      >
        {Object.keys(THEME_PALETTES).map((theme) => (
          <option key={theme} value={theme}>
            {THEME_PALETTES[theme as GuardianTheme].name}
          </option>
        ))}
      </select>
    </div>
  );
};

// ===== 🎨 HOOK PARA CLASES CSS =====
export const useGuardianClasses = () => {
  const { currentTheme, palette } = useGuardianColors();

  const getElementClass = (element: string): string => {
    return `guardian-${element} guardian-theme-${currentTheme}`;
  };

  return {
    getElementClass,
    currentTheme,
    palette
  };
};

export default GuardianColorProvider;
