
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-surface shadow-lg">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.371A4.481 4.481 0 0012 16.5c.838 0 1.624.265 2.25.721" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V15m0-6.75V6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.25 8.25 0 100-16.5 8.25 8.25 0 000 16.5z" />
          </svg>
          <h1 className="text-3xl font-bold text-text-primary">
            Gemini <span className="text-primary">Code Reviewer</span>
          </h1>
        </div>
        <p className="text-text-secondary mt-1 text-sm">
          Automated code analysis powered by Google's Gemini.
        </p>
      </div>
    </header>
  );
};
