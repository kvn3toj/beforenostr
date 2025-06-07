'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Share2, Download } from 'lucide-react';

// Mock data for demonstration purposes
// In a real app, this would come from the database
const mockCategories = [
  { name: 'established', translation: { es: 'Lo Establecido', en: 'The Established', pt: 'O Estabelecido' } },
  { name: 'creativity', translation: { es: 'Creatividad', en: 'Creativity', pt: 'Criatividade' } },
  { name: 'innovation', translation: { es: 'Innovación', en: 'Innovation', pt: 'Inovação' } },
  { name: 'leadership', translation: { es: 'Liderazgo', en: 'Leadership', pt: 'Liderança' } },
  { name: 'entrepreneurship', translation: { es: 'Emprendimiento', en: 'Entrepreneurship', pt: 'Empreendedorismo' } },
];

const mockResults = [
  { category: 'established', value: 70 },
  { category: 'creativity', value: 85 },
  { category: 'innovation', value: 90 },
  { category: 'leadership', value: 65 },
  { category: 'entrepreneurship', value: 80 },
];

interface ResultsChartProps {
  quizId?: string;
}

export default function ResultsChart({ quizId }: ResultsChartProps) {
  const { language } = useLanguage();

  // Format the data for the bar chart
  const chartData = mockCategories.map((category) => ({
    name: category.translation[language] || category.translation.es,
    score: mockResults.find(r => r.category === category.name)?.value || 0,
  }));

  // Translations
  const translations = {
    title: {
      es: 'Resultados del Quiz',
      en: 'Quiz Results',
      pt: 'Resultados do Questionário',
    },
    subtitle: {
      es: 'Análisis detallado de tus respuestas',
      en: 'Detailed analysis of your responses',
      pt: 'Análise detalhada das suas respostas',
    },
    score: {
      es: 'Puntuación',
      en: 'Score',
      pt: 'Pontuação',
    },
    category: {
      es: 'Categoría',
      en: 'Category',
      pt: 'Categoria',
    },
    downloadResults: {
      es: 'Descargar Resultados',
      en: 'Download Results',
      pt: 'Baixar Resultados',
    },
    share: {
      es: 'Compartir',
      en: 'Share',
      pt: 'Compartilhar',
    },
    summary: {
      es: 'Resumen',
      en: 'Summary',
      pt: 'Resumo',
    },
    analysis: {
      es: 'Análisis',
      en: 'Analysis',
      pt: 'Análise',
    },
  };

  const getText = (key: keyof typeof translations) => {
    return translations[key][language] || translations[key].es;
  };

  // Handle download results
  const handleDownload = () => {
    // In a real application, this would generate a PDF or CSV file
    alert('Downloading results...');
  };

  // Handle share results
  const handleShare = () => {
    // In a real application, this would open a share dialog
    alert('Sharing results...');
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-primary">{`${getText('score')}: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold">{getText('title')}</h3>
            <p className="text-muted-foreground">{getText('subtitle')}</p>
          </div>

          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              {getText('downloadResults')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              {getText('share')}
            </Button>
          </div>
        </div>

        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="score" name={getText('score')} fill="#e6215a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Results Summary */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4">{getText('summary')}</h3>

        <div className="space-y-4">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-48 sm:w-64">
                <p className="font-medium">{item.name}</p>
              </div>
              <div className="flex-1">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                    <div
                      style={{ width: `${item.score}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1">{item.score}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4">{getText('analysis')}</h3>

        <p className="text-muted-foreground mb-4">
          {language === 'es'
            ? 'Basado en tus respuestas, destacas especialmente en Innovación y Creatividad. Estas cualidades te permiten aportar soluciones originales y pensar de manera disruptiva. Tu perfil muestra una tendencia a cuestionar lo establecido y buscar nuevos caminos, lo que te hace un valioso agente de cambio en tu entorno.'
            : language === 'en'
            ? 'Based on your responses, you excel particularly in Innovation and Creativity. These qualities allow you to provide original solutions and think disruptively. Your profile shows a tendency to question the established and seek new paths, making you a valuable agent of change in your environment.'
            : 'Com base em suas respostas, você se destaca particularmente em Inovação e Criatividade. Essas qualidades permitem que você forneça soluções originais e pense de forma disruptiva. Seu perfil mostra uma tendência a questionar o estabelecido e buscar novos caminhos, tornando-o um valioso agente de mudança em seu ambiente.'
          }
        </p>

        <p className="text-muted-foreground">
          {language === 'es'
            ? 'Las áreas donde podrías enfocarte para mejorar son Liderazgo y relación con lo Establecido. Desarrollar más tus habilidades para trabajar dentro de marcos existentes y guiar a otros podría complementar tu perfil innovador.'
            : language === 'en'
            ? 'The areas where you could focus on improving are Leadership and relationship with the Established. Developing your skills to work within existing frameworks and guide others could complement your innovative profile.'
            : 'As áreas onde você poderia se concentrar em melhorar são Liderança e relacionamento com o Estabelecido. Desenvolver suas habilidades para trabalhar dentro de estruturas existentes e orientar os outros poderia complementar seu perfil inovador.'
          }
        </p>
      </div>
    </div>
  );
}
