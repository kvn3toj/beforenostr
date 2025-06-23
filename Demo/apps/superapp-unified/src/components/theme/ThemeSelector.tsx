import React from 'react';
import { useDynamicTheme } from '../../context/DynamicThemeContext';
import { themes } from '../../theme/themeConfig';

const ThemeSelector: React.FC = () => {
  const { setCurrentTheme } = useDynamicTheme();

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-white text-lg mb-4">Theme Selector</h3>
      <div className="flex space-x-4">
        <button
          onClick={() => setCurrentTheme('dark')}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Dark Theme
        </button>
        <button
          onClick={() => setCurrentTheme('light')}
          className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
        >
          Light Theme
        </button>
      </div>
       {/* More complex controls can be added here later */}
    </div>
  );
};

export default ThemeSelector;
