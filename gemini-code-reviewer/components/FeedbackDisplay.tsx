
import React from 'react';
import { FeedbackItem } from '../types';
import { FeedbackItemCard } from './FeedbackItemCard';

interface FeedbackDisplayProps {
  feedback: FeedbackItem[] | null;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  if (!feedback) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-text-secondary">No feedback to display yet. Submit your code for review.</p>
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 bg-green-900 bg-opacity-30 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-accent-green mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-semibold text-accent-green">Great job!</p>
        <p className="text-text-secondary text-center">No issues found in your code based on the review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
      {feedback.map((item, index) => (
        <FeedbackItemCard key={index} item={item} />
      ))}
    </div>
  );
};
