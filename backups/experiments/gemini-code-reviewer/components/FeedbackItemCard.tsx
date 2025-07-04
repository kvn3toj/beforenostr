
import React from 'react';
import { FeedbackItem, FeedbackSeverity } from '../types';

interface FeedbackItemCardProps {
  item: FeedbackItem;
}

const getSeverityStyles = (severity: FeedbackSeverity): { icon: React.ReactNode; borderColor: string; textColor: string; bgColor: string } => {
  switch (severity) {
    case FeedbackSeverity.Error:
      return {
        icon: <ErrorIcon />,
        borderColor: 'border-accent-red',
        textColor: 'text-accent-red',
        bgColor: 'bg-red-900 bg-opacity-20',
      };
    case FeedbackSeverity.Warning:
      return {
        icon: <WarningIcon />,
        borderColor: 'border-accent-yellow',
        textColor: 'text-accent-yellow',
        bgColor: 'bg-yellow-900 bg-opacity-20',
      };
    case FeedbackSeverity.Suggestion:
      return {
        icon: <SuggestionIcon />,
        borderColor: 'border-accent-blue',
        textColor: 'text-accent-blue',
        bgColor: 'bg-blue-900 bg-opacity-20',
      };
    case FeedbackSeverity.Info:
    default:
      return {
        icon: <InfoIcon />,
        borderColor: 'border-accent-green',
        textColor: 'text-accent-green',
        bgColor: 'bg-green-900 bg-opacity-20',
      };
  }
};

const ErrorIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 102 0V5zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);
const WarningIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.216 3.001-1.742 3.001H4.42c-1.526 0-2.492-1.667-1.742-3.001l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm0-7a1 1 0 00-1 1v3a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);
const SuggestionIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2a6 6 0 00-6 6c0 1.888.868 3.566 2.217 4.693A.5.5 0 016.5 12.5v2.086a2.5 2.5 0 001.404 2.283A2.504 2.504 0 0010.5 18a2.5 2.5 0 002.596-2.131A2.5 2.5 0 0013.5 14.586V12.5a.5.5 0 01.283-.443A5.963 5.963 0 0016 8a6 6 0 00-6-6zm0 11a3 3 0 100-6 3 3 0 000 6z" />
     <path d="M9.5 14.5A.5.5 0 019 14V9.5a.5.5 0 011 0V14a.5.5 0 01-.5.5z" />
  </svg>
);
const InfoIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);


export const FeedbackItemCard: React.FC<FeedbackItemCardProps> = ({ item }) => {
  const { icon, borderColor, textColor, bgColor } = getSeverityStyles(item.severity);

  return (
    <div className={`p-4 rounded-lg border-l-4 ${borderColor} ${bgColor} shadow-md`}>
      <div className="flex items-start space-x-3">
        <span className={`mt-0.5 ${textColor}`}>{icon}</span>
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-semibold ${textColor}`}>{item.severity}</span>
            {item.line_number !== null && (
              <span className="text-xs text-text-secondary">Line: {item.line_number}</span>
            )}
          </div>
          <p className="text-sm text-text-primary mt-1">{item.message}</p>
          {item.recommendation && (
            <div className="mt-2 p-2 bg-gray-800 rounded">
              <p className="text-xs font-semibold text-text-secondary mb-1">Recommendation:</p>
              <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono">{item.recommendation}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
