import React from 'react';
import RatingScale from './RatingScale';
import { Locale } from '@/lib/i18n';

interface QuestionProps {
  id: string;
  text: string;
  isRedRightSide?: boolean;
  onRatingSelected: (questionId: string, rating: number) => void;
  currentRating: number;
  language?: Locale;
}

const Question: React.FC<QuestionProps> = ({
  id,
  text,
  isRedRightSide = true,
  onRatingSelected,
  currentRating,
  language = 'es'
}) => {
  return (
    <div className="row wrapper mb-6 sm:mb-8" data-id={id} data-rate={currentRating}>
      <div className="col-12 text-center mt-2 sm:mt-4">
        <p className="text-base sm:text-lg font-medium px-2">{text}</p>
      </div>
      <div className="col-12 text-center mt-2 sm:mt-4 p-0">
        <RatingScale
          questionId={id}
          isRedRightSide={isRedRightSide}
          onRatingSelected={onRatingSelected}
          currentRating={currentRating}
          language={language}
        />
      </div>
      <hr className="hr border-t border-gray-800 mt-6 sm:mt-8 w-full max-w-[90%] mx-auto" />
    </div>
  );
};

export default Question;
