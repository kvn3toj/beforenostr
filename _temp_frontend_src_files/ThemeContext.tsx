import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, PaletteMode } from '@mui/material';
import { createAppTheme } from '../theme';

interface ThemeContextProps {
  mode: PaletteMode;
  toggleTheme: () => void;
  theme: Theme;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleTheme: () => {},
  theme: createAppTheme('light'),
  isDarkMode: false,
});

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  const theme = createAppTheme(mode);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value: ThemeContextProps = {
    mode,
    toggleTheme,
    theme,
    isDarkMode: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Exportar también con el nombre original para compatibilidad
export const ThemeProvider = CustomThemeProvider;

export const useThemeContext = () => useContext(ThemeContext);

// Hook adicional para compatibilidad con el sistema de diseño
export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return {
    isDarkMode: context.isDarkMode,
    toggleTheme: context.toggleTheme,
    mode: context.mode,
  };
};
