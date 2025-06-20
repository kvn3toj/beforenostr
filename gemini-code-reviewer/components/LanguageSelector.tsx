
import React from 'react';
import { LanguageOption } from '../types';

interface LanguageSelectorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  languages: LanguageOption[];
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ id, value, onChange, languages }) => {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 bg-gray-900 text-gray-200 border border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary shadow-sm"
    >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value} className="bg-gray-900 text-gray-200">
          {lang.label}
        </option>
      ))}
    </select>
  );
};
