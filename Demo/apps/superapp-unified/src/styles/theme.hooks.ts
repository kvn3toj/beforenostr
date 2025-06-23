import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import { CoomunityTheme } from './theme.types';
import { getElementTheme } from './theme.variants';
import { getGlassmorphismStyles, getElevationStyles } from './theme.utils';

// Hook para obtener el tema actual con tipado correcto
export const useCoomunityTheme = () => {
  return useTheme<CoomunityTheme>();
};

// Hook para manejar el modo oscuro/claro
export const useDarkMode = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);

  useEffect(() => {
    const storedMode = localStorage.getItem('theme-mode');
    if (storedMode) {
      setIsDarkMode(storedMode === 'dark');
    } else {
      setIsDarkMode(prefersDarkMode);
    }
  }, [prefersDarkMode]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme-mode', newMode ? 'dark' : 'light');
  };

  return { isDarkMode, toggleDarkMode };
};

// Hook para manejar el elemento actual
export const useElement = (defaultElement: 'fuego' | 'agua' | 'tierra' | 'aire' = 'tierra') => {
  const [element, setElement] = useState(defaultElement);

  useEffect(() => {
    const storedElement = localStorage.getItem('theme-element');
    if (storedElement) {
      setElement(storedElement as 'fuego' | 'agua' | 'tierra' | 'aire');
    }
  }, []);

  const changeElement = (newElement: 'fuego' | 'agua' | 'tierra' | 'aire') => {
    setElement(newElement);
    localStorage.setItem('theme-element', newElement);
  };

  const elementTheme = useMemo(() => getElementTheme(element), [element]);

  return { element, changeElement, elementTheme };
};

// Hook para manejar estilos de glassmorphism
export const useGlassmorphism = (intensity: number = 0.1) => {
  const theme = useCoomunityTheme();
  return useMemo(() => getGlassmorphismStyles(theme, intensity), [theme, intensity]);
};

// Hook para manejar estilos de elevación
export const useElevation = (elevation: number = 1) => {
  const theme = useCoomunityTheme();
  return useMemo(() => getElevationStyles(theme, elevation), [theme, elevation]);
};

// Hook para manejar el modo de contraste
export const useContrastMode = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const storedContrast = localStorage.getItem('theme-contrast');
    if (storedContrast) {
      setIsHighContrast(storedContrast === 'high');
    }
  }, []);

  const toggleContrastMode = () => {
    const newMode = !isHighContrast;
    setIsHighContrast(newMode);
    localStorage.setItem('theme-contrast', newMode ? 'high' : 'normal');
  };

  return { isHighContrast, toggleContrastMode };
};

// Hook para manejar la intensidad de los efectos visuales
export const useVisualEffects = () => {
  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    const storedIntensity = localStorage.getItem('theme-effects-intensity');
    if (storedIntensity) {
      setIntensity(Number(storedIntensity));
    }
  }, []);

  const changeIntensity = (newIntensity: number) => {
    setIntensity(newIntensity);
    localStorage.setItem('theme-effects-intensity', String(newIntensity));
  };

  return { intensity, changeIntensity };
};

// Hook para manejar las preferencias de animación
export const useAnimationPreferences = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const storedPreference = localStorage.getItem('theme-reduced-motion');
    if (storedPreference) {
      setReducedMotion(storedPreference === 'true');
    } else {
      setReducedMotion(prefersReducedMotion);
    }
  }, [prefersReducedMotion]);

  const toggleReducedMotion = () => {
    const newPreference = !reducedMotion;
    setReducedMotion(newPreference);
    localStorage.setItem('theme-reduced-motion', String(newPreference));
  };

  return { reducedMotion, toggleReducedMotion };
};

// Hook para manejar el tamaño de fuente
export const useFontSize = () => {
  const [fontSize, setFontSize] = useState(1);

  useEffect(() => {
    const storedSize = localStorage.getItem('theme-font-size');
    if (storedSize) {
      setFontSize(Number(storedSize));
    }
  }, []);

  const changeFontSize = (newSize: number) => {
    setFontSize(newSize);
    localStorage.setItem('theme-font-size', String(newSize));
    document.documentElement.style.fontSize = `${newSize * 100}%`;
  };

  return { fontSize, changeFontSize };
};

// Hook para manejar el espaciado
export const useSpacing = () => {
  const [spacing, setSpacing] = useState(1);

  useEffect(() => {
    const storedSpacing = localStorage.getItem('theme-spacing');
    if (storedSpacing) {
      setSpacing(Number(storedSpacing));
    }
  }, []);

  const changeSpacing = (newSpacing: number) => {
    setSpacing(newSpacing);
    localStorage.setItem('theme-spacing', String(newSpacing));
  };

  return { spacing, changeSpacing };
};

// Hook para manejar el radio de borde
export const useBorderRadius = () => {
  const [borderRadius, setBorderRadius] = useState(1);

  useEffect(() => {
    const storedRadius = localStorage.getItem('theme-border-radius');
    if (storedRadius) {
      setBorderRadius(Number(storedRadius));
    }
  }, []);

  const changeBorderRadius = (newRadius: number) => {
    setBorderRadius(newRadius);
    localStorage.setItem('theme-border-radius', String(newRadius));
  };

  return { borderRadius, changeBorderRadius };
};

// Hook para manejar todas las preferencias de tema
export const useThemePreferences = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { element, changeElement, elementTheme } = useElement();
  const { isHighContrast, toggleContrastMode } = useContrastMode();
  const { intensity, changeIntensity } = useVisualEffects();
  const { reducedMotion, toggleReducedMotion } = useAnimationPreferences();
  const { fontSize, changeFontSize } = useFontSize();
  const { spacing, changeSpacing } = useSpacing();
  const { borderRadius, changeBorderRadius } = useBorderRadius();

  return {
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
  };
};