'use client';

import React, { useState, useEffect } from 'react';
import Question from './Question';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';

// Define the quiz question interface
interface QuizQuestion {
  id: string;
  text: string;
  isRedRightSide: boolean;
  translations?: {
    en?: string;
    es?: string;
    pt?: string;
  };
}

// Multi-language quiz questions
const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    text: 'En el mundo de los negocios es mejor cooperar que competir',
    isRedRightSide: true,
    translations: {
      en: 'In the business world, it\'s better to cooperate than compete',
      pt: 'No mundo dos negócios é melhor cooperar do que competir'
    }
  },
  {
    id: '2',
    text: 'Tratar de cambiar al mundo con pequeñas acciones es perder el tiempo',
    isRedRightSide: false,
    translations: {
      en: 'Trying to change the world with small actions is a waste of time',
      pt: 'Tentar mudar o mundo com pequenas ações é perder tempo'
    }
  },
  {
    id: '3',
    text: 'Para mejorar la economía hay que apoyar al emprendedor local',
    isRedRightSide: true,
    translations: {
      en: 'To improve the economy, we must support local entrepreneurs',
      pt: 'Para melhorar a economia, devemos apoiar o empreendedor local'
    }
  },
  {
    id: '4',
    text: 'Vivir de mi propósito es un cuento de hadas',
    isRedRightSide: false,
    translations: {
      en: 'Living from my purpose is a fairy tale',
      pt: 'Viver do meu propósito é um conto de fadas'
    }
  },
  {
    id: '5',
    text: 'Para ganar siempre hay que aplicar la regla del "vivo bobo"',
    isRedRightSide: false,
    translations: {
      en: 'To always win, you have to apply the "smart fool" rule',
      pt: 'Para ganhar sempre, você precisa aplicar a regra do "esperto-tolo"'
    }
  },
];

// Text translations
const translations = {
  introTitle: {
    es: 'Primer paso',
    en: 'First step',
    pt: 'Primeiro passo'
  },
  introSubtitle: {
    es: 'Jon, veamos qué tan bien te llevas con lo Establecido',
    en: 'Jon, let\'s see how well you get along with the Established',
    pt: 'Jon, vamos ver como você se relaciona com o Estabelecido'
  },
  continueButton: {
    es: 'Avanzar',
    en: 'Continue',
    pt: 'Avançar'
  },
  processingButton: {
    es: 'Procesando...',
    en: 'Processing...',
    pt: 'Processando...'
  },
  completeAllPrompt: {
    es: 'Por favor, responde todas las preguntas antes de continuar.',
    en: 'Please answer all questions before continuing.',
    pt: 'Por favor, responda todas as perguntas antes de continuar.'
  },
  thankYouMessage: {
    es: '¡Gracias por completar el quiz!',
    en: 'Thank you for completing the quiz!',
    pt: 'Obrigado por completar o questionário!'
  }
};

const QuizContainer: React.FC = () => {
  // Get the current language
  const { language } = useLanguage();
  const router = useRouter();

  // State to track ratings for each question
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [visibleQuestions, setVisibleQuestions] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper to get translated text
  const getTranslatedQuestionText = (question: QuizQuestion): string => {
    if (language === 'es') return question.text;
    return question.translations?.[language] || question.text;
  };

  const getText = (key: keyof typeof translations): string => {
    return translations[key][language] || translations[key].es;
  };

  // Handle rating selection
  const handleRatingSelected = (questionId: string, rating: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [questionId]: rating,
    }));

    // Show next question if available
    const currentQuestionIndex = quizQuestions.findIndex(q => q.id === questionId);
    if (currentQuestionIndex + 1 < quizQuestions.length &&
        visibleQuestions <= currentQuestionIndex + 1) {
      setTimeout(() => {
        setVisibleQuestions(prev => Math.min(prev + 1, quizQuestions.length));
      }, 300);
    }
  };

  // Calculate if all questions have been answered
  const allQuestionsAnswered = quizQuestions.every((q) => ratings[q.id] !== undefined);

  // Handle form submission
  const handleSubmit = async () => {
    if (allQuestionsAnswered) {
      setIsSubmitting(true);
      console.log('Quiz completed with ratings:', ratings);

      try {
        // Prepare data for API call
        const responses = quizQuestions.map(question => ({
          questionId: question.id,
          rating: ratings[question.id],
        })).filter(response => response.rating !== undefined);

        // Assuming a default category ID for now, you might need to get this dynamically
        const categoryId = 'red-pill'; // <-- REPLACE with actual category ID if needed

        const response = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categoryId, responses }),
        });

        if (!response.ok) {
          throw new Error(`Error submitting quiz: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Quiz submission successful:', result);

        // Redirect to results page
        if (result.resultId) {
          // Assuming result.sessionId is returned for anonymous users
          const redirectPath = result.sessionId
            ? `/results?resultId=${result.resultId}&sessionId=${result.sessionId}`
            : `/results?resultId=${result.resultId}`; // For authenticated users
          router.push(redirectPath);
        } else {
          // Handle case where submission was successful but no resultId returned
          alert('Quiz submitted, but could not retrieve results.');
        }

      } catch (error) {
        console.error('Error submitting quiz:', error);
        alert(`Failed to submit quiz: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert(getText('completeAllPrompt'));
    }
  };

  // Effect to progressively reveal questions when a question is answered
  useEffect(() => {
    const answeredQuestions = Object.keys(ratings).length;
    if (answeredQuestions > 0 && visibleQuestions < answeredQuestions + 1) {
      setVisibleQuestions(Math.min(answeredQuestions + 1, quizQuestions.length));
    }
  }, [ratings, visibleQuestions]);

  return (
    <div className="row custom_blur fade-in">
      <div className="col-md-8 mx-auto w-full px-4 sm:px-6">
        <div className="p-2 sm:p-4">
          <h3 className="text-muted-foreground text-center font-semibold text-lg sm:text-xl mb-2 animate-fade-in">
            {getText('introTitle')}
          </h3>
          <h2 className="title text-center text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-8 animate-fade-in">
            {getText('introSubtitle')}
          </h2>

          <div className="content-questions flex justify-center flex-col" id="questions">
            {quizQuestions.map((question, index) => (
              <div
                key={question.id}
                className={`transition-all duration-500 ${index < visibleQuestions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}
              >
                <Question
                  id={question.id}
                  text={getTranslatedQuestionText(question)}
                  isRedRightSide={question.isRedRightSide}
                  onRatingSelected={handleRatingSelected}
                  currentRating={ratings[question.id] || 0}
                  language={language}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-md-8 mx-auto pt-3 sm:pt-5 pb-4 text-center">
        <Button
          onClick={handleSubmit}
          disabled={!allQuestionsAnswered || isSubmitting}
          className={`btn-rose btn-round btn-lg px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg transition-all duration-300 ${
            isSubmitting ? 'opacity-70' : ''
          } ${
            allQuestionsAnswered ? 'animate-pulse' : ''
          }`}
        >
          {isSubmitting ? getText('processingButton') : getText('continueButton')}
        </Button>
      </div>
    </div>
  );
};

export default QuizContainer;
