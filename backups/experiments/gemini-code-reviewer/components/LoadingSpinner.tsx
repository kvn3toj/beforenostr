
import React from 'react';

interface LoadingSpinnerProps {
  simple?: boolean; // For a smaller spinner, e.g., inside a button
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ simple = false }) => {
  const sizeClasses = simple ? 'h-5 w-5' : 'h-12 w-12';
  const borderClasses = simple ? 'border-2' : 'border-4';

  return (
    <div className={`animate-spin rounded-full ${sizeClasses} ${borderClasses} border-t-primary border-r-primary border-b-transparent border-l-transparent`}></div>
  );
};
