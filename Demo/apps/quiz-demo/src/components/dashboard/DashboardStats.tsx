'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

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

interface DashboardStatsProps {
  userId?: string;
}

export default function DashboardStats({ userId }: DashboardStatsProps) {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Format the data for the radar chart
  const chartData = mockCategories.map((category, index) => ({
    subject: category.translation[language] || category.translation.es,
    A: mockResults.find(r => r.category === category.name)?.value || 0,
    fullMark: 100,
  }));

  // Translations
  const translations = {
    title: {
      es: 'Tu Perfil de Competencias',
      en: 'Your Competency Profile',
      pt: 'Seu Perfil de Competências',
    },
    subtitle: {
      es: 'Basado en tus respuestas al quiz',
      en: 'Based on your quiz responses',
      pt: 'Baseado em suas respostas ao questionário',
    },
    score: {
      es: 'Puntuación',
      en: 'Score',
      pt: 'Pontuação',
    },
    tooltip: {
      es: 'Puntuación: ',
      en: 'Score: ',
      pt: 'Pontuação: ',
    },
  };

  const getText = (key: keyof typeof translations) => {
    return translations[key][language] || translations[key].es;
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md">
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-xl font-semibold mb-2">{getText('title')}</h3>
      <p className="text-muted-foreground mb-6">{getText('subtitle')}</p>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={90} width={730} height={250} data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name={getText('score')}
              dataKey="A"
              stroke="#e6215a"
              fill="#e6215a"
              fillOpacity={0.5}
              dot
              activeDot={{ r: 8 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6">
        <h4 className="text-lg font-medium mb-2">
          {language === 'es' ? 'Leyenda' :
           language === 'en' ? 'Legend' :
           'Legenda'}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockCategories.map((category, index) => (
            <div key={category.name} className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
              <span>{category.translation[language] || category.translation.es}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
