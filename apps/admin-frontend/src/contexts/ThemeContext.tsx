import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, PaletteMode } from '@mui/material';
import { createAppTheme } from '../theme';

interface ThemeContextProps {
  mode: PaletteMode;
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleTheme: () => {},
  theme: createAppTheme('light'),
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  const theme = createAppTheme(mode);

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