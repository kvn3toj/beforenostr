import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, PaletteMode } from '@mui/material';
import { createCentralizedTheme } from '../theme-centralized';

interface ThemeContextProps {
  mode: PaletteMode;
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleTheme: () => {},
  theme: createCentralizedTheme('light'),
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  const theme = createCentralizedTheme(mode);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value: ThemeContextProps = {
    mode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

// Alias for backwards compatibility
export const useTheme = useThemeContext;
