'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import ResultsChart from '@/components/results/ResultsChart';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

// Define interfaces for result data based on API response
interface QuizResultData {
  result: {
    id: string;
    score: number;
    createdAt: string;
    categoryId: string;
    userId: string | null;
    sessionId: string | null;
    category: { // Include category translations if needed
      name: string;
      language: string;
      translations?: { // Assuming translations exist in category
        en?: string;
        es?: string;
        pt?: string;
      };
    };
  };
  responses: Array<{
    id: string;
    rating: number;
    questionId: string;
    userId: string | null;
    sessionId: string | null;
    createdAt: string;
    question: { // Include question translations if needed
      text: string;
      isRedRightSide: boolean;
      language: string;
      translations?: { // Assuming translations exist in question
        en?: string;
        es?: string;
        pt?: string;
      };
    };
  }>;
}

export default function ResultsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language } = useLanguage();
  const searchParams = useSearchParams(); // Get URL search parameters

  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState<QuizResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Translations
  const translations = {
    title: {
      es: 'Resultados',
      en: 'Results',
      pt: 'Resultados',
    },
    noResults: {
      es: 'No hay resultados disponibles. ¡Completa un quiz para ver tus estadísticas!',
      en: 'No results available. Complete a quiz to see your statistics!',
      pt: 'Nenhum resultado disponível. Complete um questionário para ver suas estatísticas!',
    },
    takeQuiz: {
      es: 'Tomar Quiz',
      en: 'Take Quiz',
      pt: 'Fazer Questionário',
    },
    quizTitle: {
      es: 'Quiz: El Camino Rojo',
      en: 'Quiz: The Red Path',
      pt: 'Questionário: O Caminho Vermelho',
    },
    completedOn: {
      es: 'Completado el',
      en: 'Completed on',
      pt: 'Concluído em',
    },
    retakeQuiz: {
      es: 'Volver a tomar',
      en: 'Retake Quiz',
      pt: 'Refazer',
    },
  };

  const getText = (key: keyof typeof translations) => {
    return translations[key][language] || translations[key].es;
  };

  useEffect(() => {
    // No redirect here anymore, we handle loading/error states below
    setLoading(status === 'loading');
  }, [status]);

  useEffect(() => {
    const resultId = searchParams.get('resultId');
    const sessionId = searchParams.get('sessionId');
    const userId = session?.user?.id; // Get userId from session if authenticated

    // Fetch results only if we have a resultId AND either a userId (authenticated) or sessionId (anonymous)
    if (resultId && (userId || sessionId)) {
      const fetchResults = async () => {
        setLoading(true);
        setError(null);
        try {
          // Pass language, userId (if authenticated), and sessionId (if anonymous) to the API
          const response = await fetch(
            `/api/results/${resultId}?language=${language}${userId ? `&userId=${userId}` : ''}${sessionId ? `&sessionId=${sessionId}` : ''}`
          );

          if (!response.ok) {
            // Check for specific error status like 403 (Unauthorized)
            if (response.status === 403) {
               setError('No tienes permiso para ver este resultado.');
            } else if (response.status === 404) { 
               setError('Resultado no encontrado.');
            } else {
               throw new Error(`Error fetching results: ${response.statusText}`);
            }
            setResultData(null); // Clear previous data on error
          } else { 
            const data: QuizResultData = await response.json();
            setResultData(data);
          }
        } catch (err) {
          console.error('Error fetching results:', err);
          setError(`Error al cargar resultados: ${err.message}`);
          setResultData(null);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    } else if (!resultId) {
        // If no resultId is provided in the URL
        setLoading(false);
        setError('No se especificó un resultado para mostrar.');
        setResultData(null); // Ensure no old data is shown
    } else if (!userId && !sessionId) {
      // If resultId is present but neither authenticated user nor sessionId is available
      // This case should ideally not happen if QuizContainer redirects correctly,
      // but it's a fallback to indicate that access is needed.
      setLoading(false);
      setError('Inicia sesión o completa un quiz para ver resultados.');
      setResultData(null); // Ensure no old data is shown
    }

  }, [session, language, searchParams]); // Depend on session, language, and searchParams

  // Determine if results were found
  const hasResults = resultData !== null;

  // Logic to display completion date (use data from resultData if available)
  const completionDate = resultData?.result?.createdAt
    ? new Date(resultData.result.createdAt).toLocaleDateString(
        language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : new Date().toLocaleDateString(
        language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'pt-BR',
        { year: 'numeric', month: 'long', day: 'numeric' }
      ); // Fallback date if no result data

  // Get quiz title from result data or use placeholder/translation
  const quizTitle = resultData?.result?.category?.translations?.[language] 
    || resultData?.result?.category?.name
    || getText('quizTitle'); // Fallback title

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">{getText('title')}</h1>
        </header>

        {/* Display error message if any */}
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive-foreground mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Show results if found, otherwise show no results message */}
        {hasResults ? (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  {/* Use dynamic quiz title from resultData */}
                  <h2 className="text-2xl font-semibold">{quizTitle}</h2>
                  {/* Use dynamic completion date */}
                  <p className="text-muted-foreground">
                    {getText('completedOn')} {completionDate}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 sm:mt-0"
                  onClick={() => router.push('/')}
                >
                  {getText('retakeQuiz')}
                </Button>
              </div>
            </div>

            {/* Pass resultData.responses to ResultsChart */}
            {resultData?.responses && <ResultsChart responses={resultData.responses} />}
          </div>
        ) : ( // Show no results message only if not loading and no results found
          !loading && (
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground mb-4">{getText('noResults')}</p>
              <Button onClick={() => router.push('/')}>
                {getText('takeQuiz')}
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// Add prop types for ResultsChart if needed (or define interface directly)
// ResultsChart.propTypes = {
//   responses: PropTypes.array.isRequired,
// };
