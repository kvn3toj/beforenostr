import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { themes, moduleColors } from '../theme/themeConfig';

const ThemeSelector: React.FC = () => {
  const { themeName, setThemeByName, theme, setTheme } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setThemeByName(event.target.value);
  };

  const handleColorChange = (colorName: keyof typeof theme, value: string) => {
    setTheme({
        ...theme,
        [colorName]: value,
    });
  };

  return (
    <div className="p-4 rounded-lg bg-[var(--nav-menu-background)] text-[var(--primary-text)]">
      <h3 className="text-lg font-semibold mb-4">Theme Selector</h3>

      <div className="mb-4">
        <label htmlFor="theme-select" className="block mb-2 text-sm font-medium">Select Theme</label>
        <select
          id="theme-select"
          value={themeName}
          onChange={handleThemeChange}
          className="bg-[var(--button-secondary-background)] border border-gray-600 text-[var(--primary-text)] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          {Object.keys(themes).map(name => (
            <option key={name} value={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {Object.entries(theme).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <label htmlFor={`${key}-color`} className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type="color"
              id={`${key}-color`}
              value={value}
              onChange={(e) => handleColorChange(key as keyof typeof theme, e.target.value)}
              className="w-8 h-8 p-0 border-none rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
