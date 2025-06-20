
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface text-center py-6 mt-auto shadow-top">
      <p className="text-text-secondary text-sm">
        &copy; {new Date().getFullYear()} Gemini Code Reviewer. 
        Powered by <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Gemini API</a>.
      </p>
    </footer>
  );
};
