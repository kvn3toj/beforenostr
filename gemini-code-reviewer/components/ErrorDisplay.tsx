
import React from 'react';

interface ErrorDisplayProps {
  message: string | null;
  onClear?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onClear }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-red-700 bg-opacity-30 border border-accent-red text-accent-red p-4 rounded-lg mb-4 shadow-md" role="alert">
      <div className="flex justify-between items-start">
        <div>
          <strong className="font-bold">Error:</strong>
          <p className="text-sm mt-1">{message}</p>
        </div>
        {onClear && (
           <button 
             onClick={onClear} 
             className="ml-4 text-accent-red hover:text-red-400 transition-colors"
             aria-label="Clear error"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        )}
      </div>
    </div>
  );
};
