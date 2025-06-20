
import React, { useState, useCallback } from 'react';
import { CodeInput } from './components/CodeInput';
import { LanguageSelector } from './components/LanguageSelector';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { getCodeReview } from './services/geminiService';
import { FeedbackItem, LanguageOption } from './types';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, INITIAL_CODE_PLACEHOLDER } from './constants';

const App: React.FC = () => {
  const [code, setCode] = useState<string>(INITIAL_CODE_PLACEHOLDER);
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [feedback, setFeedback] = useState<FeedbackItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitReview = useCallback(async () => {
    if (!code.trim()) {
      setError("Code input cannot be empty.");
      setFeedback(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const reviewResults = await getCodeReview(code, language);
      setFeedback(reviewResults);
      if (reviewResults.length === 0) {
        // If no issues, display a positive message or keep feedback as empty array
        // This is handled in FeedbackDisplay component
      }
    } catch (err) {
      console.error("Error getting code review:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during review.");
      setFeedback(null);
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Column */}
          <div className="bg-surface p-6 rounded-lg shadow-xl flex flex-col space-y-6">
            <div>
              <label htmlFor="language-selector" className="block text-sm font-medium text-text-secondary mb-1">
                Select Language
              </label>
              <LanguageSelector
                id="language-selector"
                value={language}
                onChange={setLanguage}
                languages={SUPPORTED_LANGUAGES}
              />
            </div>
            <div>
              <label htmlFor="code-input" className="block text-sm font-medium text-text-secondary mb-1">
                Paste Your Code
              </label>
              <CodeInput
                id="code-input"
                value={code}
                onChange={setCode}
                language={language}
              />
            </div>
            <button
              onClick={handleSubmitReview}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner simple={true} />
                  <span className="ml-2">Reviewing...</span>
                </>
              ) : (
                'Review Code'
              )}
            </button>
          </div>

          {/* Output Column */}
          <div className="bg-surface p-6 rounded-lg shadow-xl min-h-[300px] flex flex-col">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Review Feedback</h2>
            {error && <ErrorDisplay message={error} onClear={() => setError(null)} />}
            {isLoading && !error && (
              <div className="flex-grow flex flex-col items-center justify-center">
                <LoadingSpinner />
                <p className="mt-2 text-text-secondary">Analyzing your code...</p>
              </div>
            )}
            {!isLoading && !error && feedback !== null && (
              <FeedbackDisplay feedback={feedback} />
            )}
            {!isLoading && !error && feedback === null && (
              <div className="flex-grow flex items-center justify-center">
                <p className="text-text-secondary">Submit your code to see the review feedback here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
