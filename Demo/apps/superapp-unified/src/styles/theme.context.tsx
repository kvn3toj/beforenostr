import React, { createContext, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemePreferences } from './theme.hooks';
import { coomunityTheme, coomunityThemeDark } from './theme-autumn';
import { getElementTheme } from './theme.variants';

// Definir el tipo para el contexto
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  element: 'fuego' | 'agua' | 'tierra' | 'aire';
  changeElement: (element: 'fuego' | 'agua' | 'tierra' | 'aire') => void;
  isHighContrast: boolean;
  toggleContrastMode: () => void;
  intensity: number;
  changeIntensity: (intensity: number) => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  fontSize: number;
  changeFontSize: (size: number) => void;
  spacing: number;
  changeSpacing: (spacing: number) => void;
  borderRadius: number;
  changeBorderRadius: (radius: number) => void;
}

// Crear el contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// Props para el proveedor de tema
interface ThemeProviderProps {
  children: React.ReactNode;
}

// Componente proveedor de tema
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    element,
    changeElement,
    elementTheme,
    isHighContrast,
    toggleContrastMode,
    intensity,
    changeIntensity,
    reducedMotion,
    toggleReducedMotion,
    fontSize,
    changeFontSize,
    spacing,
    changeSpacing,
    borderRadius,
    changeBorderRadius,
  } = useThemePreferences();

  // Crear el tema base según el modo oscuro/claro
  const baseTheme = isDarkMode ? coomunityThemeDark : coomunityTheme;

  // Obtener el tema del elemento actual
  const currentElementTheme = getElementTheme(element);

  // Combinar el tema base con el tema del elemento y las preferencias
  const theme = React.useMemo(() => {
    return {
      ...baseTheme,
      ...currentElementTheme,
      palette: {
        ...baseTheme.palette,
        ...currentElementTheme.palette,
        mode: isDarkMode ? 'dark' : 'light',
      },
      typography: {
        ...baseTheme.typography,
        fontSize: 16 * fontSize,
      },
      spacing: (factor: number) => spacing * baseTheme.spacing(factor),
      shape: {
        ...baseTheme.shape,
        borderRadius: borderRadius * baseTheme.shape.borderRadius,
      },
      components: {
        ...baseTheme.components,
        ...currentElementTheme.components,
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              transition: reducedMotion ? 'none' : undefined,
            },
          },
        },
      },
    };
  }, [
    baseTheme,
    currentElementTheme,
    isDarkMode,
    fontSize,
    spacing,
    borderRadius,
    reducedMotion,
  ]);

  // Aplicar preferencias de contraste alto
  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.style.setProperty('forced-colors', 'active');
    } else {
      document.documentElement.style.removeProperty('forced-colors');
    }
  }, [isHighContrast]);

  // Aplicar preferencias de movimiento reducido
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.style.setProperty('prefers-reduced-motion', 'reduce');
    } else {
      document.documentElement.style.removeProperty('prefers-reduced-motion');
    }
  }, [reducedMotion]);

  // Aplicar tamaño de fuente
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
  }, [fontSize]);

  const value = {
    isDarkMode,
    toggleDarkMode,
    element,
    changeElement,
    isHighContrast,
    toggleContrastMode,
    intensity,
    changeIntensity,
    reducedMotion,
    toggleReducedMotion,
    fontSize,
    changeFontSize,
    spacing,
    changeSpacing,
    borderRadius,
    changeBorderRadius,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook para obtener el tema actual
export const useCurrentTheme = () => {
  const { isDarkMode, element } = useThemeContext();
  const baseTheme = isDarkMode ? coomunityThemeDark : coomunityTheme;
  const elementTheme = getElementTheme(element);

  return React.useMemo(
    () => ({
      ...baseTheme,
      ...elementTheme,
      palette: {
        ...baseTheme.palette,
        ...elementTheme.palette,
        mode: isDarkMode ? 'dark' : 'light',
      },
    }),
    [baseTheme, elementTheme, isDarkMode]
  );
};

// Hook para obtener los colores del elemento actual
export const useElementColors = () => {
  const { element } = useThemeContext();
  const theme = useCurrentTheme();

  return React.useMemo(
    () => ({
      main: theme.palette.primary.main,
      light: theme.palette.primary.light,
      dark: theme.palette.primary.dark,
      contrastText: theme.palette.primary.contrastText,
    }),
    [theme, element]
  );
};

// Hook para obtener los estilos de glassmorphism
export const useGlassmorphismStyles = (intensity?: number) => {
  const { intensity: globalIntensity } = useThemeContext();
  const theme = useCurrentTheme();

  return React.useMemo(
    () => ({
      backgroundColor: `rgba(255, 255, 255, ${(intensity || globalIntensity) * 0.1})`,
      backdropFilter: 'blur(8px)',
      borderRadius: theme.shape.borderRadius,
      border: `1px solid rgba(255, 255, 255, ${(intensity || globalIntensity) * 0.2})`,
    }),
    [theme, intensity, globalIntensity]
  );
};

// Hook para obtener los estilos de elevación
export const useElevationStyles = (elevation: number = 1) => {
  const theme = useCurrentTheme();

  return React.useMemo(
    () => ({
      boxShadow: theme.shadows[elevation],
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
    }),
    [theme, elevation]
  );
};

// Hook para obtener los estilos de gradiente
export const useGradientStyles = () => {
  const { element } = useThemeContext();
  const colors = useElementColors();

  return React.useMemo(
    () => ({
      background: `linear-gradient(135deg, ${colors.main} 0%, ${colors.light} 100%)`,
    }),
    [colors]
  );
};

// Hook para obtener los estilos de animación
export const useAnimationStyles = (duration: number = 300) => {
  const { reducedMotion } = useThemeContext();

  return React.useMemo(
    () => ({
      transition: reducedMotion
        ? 'none'
        : `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    }),
    [reducedMotion, duration]
  );
};