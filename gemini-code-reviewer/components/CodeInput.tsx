
import React from 'react';

interface CodeInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  language: string; // Currently not used for syntax highlighting, but good for context
}

export const CodeInput: React.FC<CodeInputProps> = ({ id, value, onChange, language }) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`// Paste your ${language} code here...`}
      className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-gray-200 border border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary resize-y shadow-inner"
      spellCheck="false"
    />
  );
};
