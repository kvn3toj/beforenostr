'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);

  // Translations
  const translations = {
    title: {
      es: 'Dashboard',
      en: 'Dashboard',
      pt: 'Painel',
    },
    welcome: {
      es: 'Bienvenido a tu Dashboard',
      en: 'Welcome to your Dashboard',
      pt: 'Bem-vindo ao seu Painel',
    },
    quizHistory: {
      es: 'Historial de Quiz',
      en: 'Quiz History',
      pt: 'Histórico de Questionários',
    },
    latestResult: {
      es: 'Último Resultado',
      en: 'Latest Result',
      pt: 'Resultado Mais Recente',
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
  };

  const getText = (key: keyof typeof translations) => {
    return translations[key][language] || translations[key].es;
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status, router]);

  // This simulates checking if the user has completed any quizzes
  const hasResults = true; // In a real app, this would be determined from the database

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if the current user is the admin test user
  // TEMPORARY: Treat any authenticated user as admin for testing
  const isAdminTestUser = !!session?.user; // Check if session.user exists

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">{getText('title')}</h1>
          <p className="text-muted-foreground mt-2">
            {getText('welcome')}{session?.user?.name ? `, ${session.user.name}` : ''}!
          </p>
          {/* Display admin message if it's the admin test user */}
          {isAdminTestUser && (
            <p className="text-primary font-semibold mt-1">¡Modo Administrador de Prueba Activo! (Temporal)</p>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">{getText('latestResult')}</h2>

              {hasResults ? (
                <DashboardStats userId={session?.user?.id} />
              ) : (
                <div className="rounded-lg border border-border bg-card p-6 text-center">
                  <p className="text-muted-foreground mb-4">{getText('noResults')}</p>
                  <Button onClick={() => router.push('/')}>
                    {getText('takeQuiz')}
                  </Button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <section className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">{getText('quizHistory')}</h2>

              {/* Mock quiz history - this would be populated from the database */}
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-3 rounded-md bg-background hover:bg-muted/50 transition-colors border border-border">
                    <p className="font-medium">Quiz #{item}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Date.now() - item * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
