import React, { useState } from 'react';
import { Locale } from '@/lib/i18n';

interface RatingScaleProps {
  questionId: string;
  isRedRightSide?: boolean;
  onRatingSelected: (questionId: string, rating: number) => void;
  currentRating?: number;
  language?: Locale;
}

// Text translations
const translations = {
  disagree: {
    es: 'No estoy de acuerdo',
    en: 'I disagree',
    pt: 'Não concordo'
  },
  agree: {
    es: 'Estoy de acuerdo',
    en: 'I agree',
    pt: 'Concordo'
  }
};

const RatingScale: React.FC<RatingScaleProps> = ({
  questionId,
  isRedRightSide = true,
  onRatingSelected,
  currentRating = 0,
  language = 'es'
}) => {
  const [animating, setAnimating] = useState<number | null>(null);

  // Define the border classes based on which side is red
  const leftBorderClass = isRedRightSide ? 'border-black' : 'border-red';
  const rightBorderClass = isRedRightSide ? 'border-red' : 'border-black';

  // Helper to get translated text
  const getText = (key: keyof typeof translations): string => {
    return translations[key][language] || translations[key].es;
  };

  // Handle click on rating button
  const handleRatingClick = (rating: number) => {
    setAnimating(rating);
    onRatingSelected(questionId, rating);

    // Reset animation after a short delay
    setTimeout(() => {
      setAnimating(null);
    }, 500);
  };

  // Get button class based on selected rating and animation state
  const getButtonClass = (buttonRating: number) => {
    const isSelected = currentRating === buttonRating;
    const isAnimating = animating === buttonRating;

    return `transition-all duration-300 ${
      isSelected ? 'bg-primary' : ''
    } ${
      isAnimating ? 'scale-125' : ''
    }`;
  };

  return (
    <div className="item w-full max-w-[320px] sm:max-w-[400px] md:max-w-none mx-auto">
      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
        {/* -3 */}
        <button
          type="button"
          className={`btn-social btn-just-icon btn-round ${leftBorderClass} width-3 ${getButtonClass(-3)}`}
          onClick={() => handleRatingClick(-3)}
          aria-label="Strongly disagree"
        >
          <div className="ripple-container"></div>
        </button>

        {/* -2 */}
        <button
          type="button"
          className={`btn-social btn-just-icon btn-round ${leftBorderClass} width-2 ${getButtonClass(-2)}`}
          onClick={() => handleRatingClick(-2)}
          aria-label="Disagree"
        >
          <div className="ripple-container"></div>
        </button>

        {/* -1 */}
        <button
          type="button"
          className={`btn-social btn-just-icon btn-round ${leftBorderClass} width-1 ${getButtonClass(-1)}`}
          onClick={() => handleRatingClick(-1)}
          aria-label="Somewhat disagree"
        >
          <div className="ripple-container"></div>
        </button>

        {/* 0 */}
        <button
          type="button"
          className={`btn-social btn-just-icon btn-round border-gray width ${getButtonClass(0)}`}
          onClick={() => handleRatingClick(0)}
          aria-label="Neutral"
        >
          <div className="ripple-container"></div>
        </button>

        {/* 1 */}
        <button
          type="button"
          className={`btn-social btn-just-icon btn-round ${rightBorderClass} width-1 ${getButtonClass(1)}`}
          onClick={() => handleRatingClick(1)}
          aria-label="Somewhat agree"
        >
          <div className="ripple-container"></div>
        </button>

        {/* 2 */}
        <button
          type="button"
          className={`btn-social btn-just-icon btn-round ${rightBorderClass} width-2 ${getButtonClass(2)}`}
          onClick={() => handleRatingClick(2)}
          aria-label="Agree"
        >
          <div className="ripple-container"></div>
        </button>

        {/* 3 */}
        <button
          type="button"
          className={`btn-social btn-just-icon btn-round ${rightBorderClass} width-3 ${getButtonClass(3)}`}
          onClick={() => handleRatingClick(3)}
          aria-label="Strongly agree"
        >
          <div className="ripple-container"></div>
        </button>
      </div>

      {/* Labels */}
      <div className="row mt-2 flex justify-center">
        <div className="w-full flex justify-between px-2 sm:px-4">
          <p className="text-xs sm:text-sm text-muted-foreground">{getText('disagree')}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">{getText('agree')}</p>
        </div>
      </div>
    </div>
  );
};

export default RatingScale;
