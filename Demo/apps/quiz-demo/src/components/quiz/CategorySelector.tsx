'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategorySelectorProps {
  onCategorySelect: (categoryId: string) => void;
}

export default function CategorySelector({ onCategorySelect }: CategorySelectorProps) {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Translations
  const translations = {
    title: {
      es: 'Elige una categoría',
      en: 'Choose a category',
      pt: 'Escolha uma categoria',
    },
    subtitle: {
      es: 'Selecciona un tema para empezar el quiz',
      en: 'Select a topic to start the quiz',
      pt: 'Selecione um tema para iniciar o questionário',
    },
    loading: {
      es: 'Cargando categorías...',
      en: 'Loading categories...',
      pt: 'Carregando categorias...',
    },
    error: {
      es: 'Error al cargar las categorías. Por favor, intenta de nuevo.',
      en: 'Error loading categories. Please try again.',
      pt: 'Erro ao carregar categorias. Por favor, tente novamente.',
    },
    startQuiz: {
      es: 'Comenzar Quiz',
      en: 'Start Quiz',
      pt: 'Iniciar Questionário',
    },
    selectCategory: {
      es: 'Seleccionar Categoría',
      en: 'Select Category',
      pt: 'Selecionar Categoria',
    },
  };

  const getText = (key: keyof typeof translations): string => {
    return translations[key][language] || translations[key].es;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/quiz/categories?language=${language}`);

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data.categories || []);

        // If categories are available, select the first one by default
        if (data.categories && data.categories.length > 0) {
          setSelectedCategoryId(data.categories[0].id);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(getText('error'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [language]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleStartQuiz = () => {
    if (selectedCategoryId) {
      onCategorySelect(selectedCategoryId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">{getText('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{getText('title')}</h2>
        <p className="text-muted-foreground">{getText('subtitle')}</p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-muted-foreground">No categories available.</p>
        </div>
      ) : (
        <>
          <Tabs
            defaultValue={categories[0]?.id}
            className="w-full"
            onValueChange={handleCategorySelect}
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {language === 'es'
                        ? 'Este quiz te ayudará a conocer tu perfil en este área.'
                        : language === 'en'
                        ? 'This quiz will help you learn about your profile in this area.'
                        : 'Este questionário irá ajudá-lo a conhecer seu perfil nesta área.'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleStartQuiz}>{getText('startQuiz')}</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
}
