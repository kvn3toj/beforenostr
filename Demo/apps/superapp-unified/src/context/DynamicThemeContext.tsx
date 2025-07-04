import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { defaultTheme, ThemePalette, themes } from '../theme/themeConfig';

interface DynamicThemeContextType {
  theme: ThemePalette;
  setTheme: (theme: ThemePalette) => void;
  setCurrentTheme: (name: 'light' | 'dark') => void;
}

const DynamicThemeContext = createContext<DynamicThemeContextType | undefined>(undefined);

export const DynamicThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemePalette>(defaultTheme);

  useEffect(() => {
    Object.entries(theme).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      document.documentElement.style.setProperty(cssVarName, value);
    });
  }, [theme]);

  const setCurrentTheme = (name: 'light' | 'dark') => {
      setTheme(themes[name]);
  }

  const value = useMemo(() => ({
    theme,
    setTheme,
    setCurrentTheme
  }), [theme]);

  return (
    <DynamicThemeContext.Provider value={value}>
      {children}
    </DynamicThemeContext.Provider>
  );
};

export const useDynamicTheme = (): DynamicThemeContextType => {
  const context = useContext(DynamicThemeContext);
  if (!context) {
    throw new Error('useDynamicTheme must be used within a DynamicThemeProvider');
  }
  return context;
};
