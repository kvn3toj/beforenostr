import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ThemePalette, defaultTheme, themes } from '../theme/themeConfig';

interface ThemeContextType {
  theme: ThemePalette;
  themeName: string;
  setTheme: (theme: ThemePalette) => void;
  setThemeByName: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyThemeToDocument = (theme: ThemePalette) => {
  for (const key in theme) {
    document.documentElement.style.setProperty(`--${toKebabCase(key)}`, theme[key as keyof ThemePalette]);
  }
};

const toKebabCase = (str: string) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemePalette>(defaultTheme);
  const [themeName, setThemeName] = useState<string>('dark');

  useEffect(() => {
    const savedThemeName = localStorage.getItem('app-theme') || 'dark';
    const savedTheme = themes[savedThemeName as keyof typeof themes] || defaultTheme;
    setTheme(savedTheme);
    setThemeName(savedThemeName);
    applyThemeToDocument(savedTheme);
  }, []);

  const handleSetTheme = useCallback((newTheme: ThemePalette) => {
    setTheme(newTheme);
    applyThemeToDocument(newTheme);
  }, []);

  const handleSetThemeByName = useCallback((name: string) => {
    const newTheme = themes[name as keyof typeof themes];
    if (newTheme) {
        setTheme(newTheme);
        setThemeName(name);
        applyThemeToDocument(newTheme);
        localStorage.setItem('app-theme', name);
    }
  }, []);

  const value = useMemo(() => ({
    theme,
    themeName,
    setTheme: handleSetTheme,
    setThemeByName: handleSetThemeByName,
  }), [theme, themeName, handleSetTheme, handleSetThemeByName]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
