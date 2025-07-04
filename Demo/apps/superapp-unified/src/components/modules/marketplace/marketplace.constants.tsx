import {
  AutoAwesome,
  EmojiNature,
  SelfImprovement,
  WaterDrop,
} from '@mui/icons-material';
import React from 'react';

export interface Category {
  id: string;
  name: string;
  icon: string;
  impact: string;
  color: string;
  bgColor: string;
}

export const impactCategories: Category[] = [
  {
    id: 'sostenibilidad',
    name: 'Sostenibilidad',
    icon: 'eco',
    impact: 'PROYECTOS ECO-FRIENDLY Y SOSTENIBLES',
    color: '#2e7d32', // Un verde profundo y natural
    bgColor: '#e8f5e9',
  },
  {
    id: 'educacion',
    name: 'Educación',
    icon: 'school',
    impact: 'CONOCIMIENTO ACCESIBLE PARA TODOS',
    color: '#1565c0', // Un azul académico y confiable
    bgColor: '#e3f2fd',
  },
  {
    id: 'salud-bienestar',
    name: 'Salud & Bienestar',
    icon: 'healing',
    impact: 'BIENESTAR FÍSICO Y MENTAL',
    color: '#c62828', // Un rojo vibrante y lleno de vida
    bgColor: '#ffebee',
  },
  {
    id: 'desarrollo-comunitario',
    name: 'Desarrollo Comunitario',
    icon: 'volunteer',
    impact: 'FORTALECIMIENTO SOCIAL',
    color: '#ef6c00', // Un naranja cálido y comunitario
    bgColor: '#fff3e0',
  },
  {
    id: 'tecnologia-social',
    name: 'Tecnología Social',
    icon: 'tech',
    impact: 'TECH PARA IMPACTO POSITIVO',
    color: '#4527a0', // Un púrpura innovador y tecnológico
    bgColor: '#ede7f6',
  },
  {
    id: 'agricultura-consciente',
    name: 'Agricultura Consciente',
    icon: 'agriculture',
    impact: 'ALIMENTACIÓN SOSTENIBLE',
    color: '#558b2f', // Un verde olivo, terrenal
    bgColor: '#f1f8e9',
  },
  {
    id: 'economia-circular',
    name: 'Economía Circular',
    icon: 'recycling',
    impact: 'REDUCIR, REUTILIZAR, RECICLAR',
    color: '#00838f', // Un cian que inspira flujo y renovación
    bgColor: '#e0f7fa',
  },
  {
    id: 'inclusion-social',
    name: 'Inclusión Social',
    icon: 'inclusion',
    impact: 'OPORTUNIDADES PARA TODOS',
    color: '#ad1457', // Un magenta inclusivo y audaz
    bgColor: '#fce4ec',
  },
];

export const getConsciousnessStyle = (level?: string) => {
  switch (level) {
    case 'TRANSCENDENT':
      return {
        name: 'Trascendente',
        color: '#fbbf24',
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        glow: '0 0 20px rgba(251, 191, 36, 0.3)',
        icon: <AutoAwesome />,
      };
    case 'FLOURISHING':
      return {
        name: 'Floreciente',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        glow: '0 0 15px rgba(16, 185, 129, 0.2)',
        icon: <EmojiNature />,
      };
    case 'GROWING':
      return {
        name: 'En Crecimiento',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        glow: '0 0 10px rgba(59, 130, 246, 0.2)',
        icon: <SelfImprovement />,
      };
    case 'SEED':
    default:
      return {
        name: 'Semilla',
        color: '#6b7280',
        gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        glow: '0 0 5px rgba(107, 114, 128, 0.1)',
        icon: <WaterDrop />,
      };
  }
};
