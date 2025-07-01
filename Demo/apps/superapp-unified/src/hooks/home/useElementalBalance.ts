import { useMemo } from 'react';

export type ElementType = 'tierra' | 'agua' | 'fuego' | 'aire';

export interface ElementConfig {
  name: string;
  icon: string;
  color: string;
  description: string;
  philosophy: string;
}

export interface ElementalBalance {
  elements: Record<ElementType, number>;
  dominantElement: ElementType;
  balanceScore: number;
  recommendations: string[];
  weatherElement: ElementType;
  reciprocidadEfficiency: number;
  communityImpact: number;
  picture: any; // TODO: Definir el tipo correcto para la visualización
}

export const elementConfig: Record<ElementType, ElementConfig> = {
  tierra: {
    name: 'Tierra',
    icon: '🌱',
    color: '#8B4513',
    description: 'Estabilidad y confianza',
    philosophy: 'La base sólida sobre la que se construye la comunidad',
  },
  agua: {
    name: 'Agua',
    icon: '💧',
    color: '#4682B4',
    description: 'Fluir y adaptabilidad',
    philosophy: 'La capacidad de adaptarse y fluir con los cambios',
  },
  fuego: {
    name: 'Fuego',
    icon: '🔥',
    color: '#FF6347',
    description: 'Pasión y acción',
    philosophy: 'La energía transformadora que impulsa el cambio',
  },
  aire: {
    name: 'Aire',
    icon: '💨',
    color: '#87CEEB',
    description: 'Comunicación e ideas',
    philosophy: 'La conexión que une a todos los seres en la red de Reciprocidad',
  },
};

export const useElementalBalance = (
  elementos: Record<ElementType, number>,
  ondas: number,
  meritos: number,
  weatherElement?: ElementType
): ElementalBalance => {
  return useMemo(() => {
    // Calcular elemento dominante
    const dominantElement = Object.entries(elementos).reduce((a, b) =>
      elementos[a[0] as ElementType] > elementos[b[0] as ElementType] ? a : b
    )[0] as ElementType;

    // Calcular balance score (qué tan equilibrados están los elementos)
    const values = Object.values(elementos);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    const balanceScore = Math.max(0, 100 - Math.sqrt(variance));

    // Calcular eficiencia de Reciprocidad
    const reciprocidadEfficiency = meritos > 0 ? (meritos / ondas) * 100 : 0;

    // Calcular impacto comunitario
    const communityImpact = (balanceScore * meritos) / 100;

    // Generar recomendaciones basadas en el balance
    const recommendations = generateRecommendations(elementos, dominantElement, balanceScore);

    return {
      elements: elementos,
      dominantElement,
      balanceScore,
      recommendations,
      weatherElement: weatherElement || dominantElement,
      reciprocidadEfficiency,
      communityImpact,
      picture: null, // TODO: Implementar la lógica de la imagen
    };
  }, [elementos, ondas, meritos, weatherElement]);
};

const generateRecommendations = (
  elementos: Record<ElementType, number>,
  dominantElement: ElementType,
  balanceScore: number
): string[] => {
  const recommendations: string[] = [];

  // Recomendaciones basadas en balance general
  if (balanceScore < 60) {
    recommendations.push('Considera equilibrar tus elementos participando en actividades diversas');
  }

  // Recomendaciones específicas por elemento dominante
  const elementRecommendations = {
    tierra: [
      'Tu estabilidad es admirable. Comparte tu sabiduría con nuevos miembros',
      'Considera explorar nuevas formas de contribuir al Bien Común',
    ],
    agua: [
      'Tu adaptabilidad es valiosa. Ayuda a mediar en conflictos comunitarios',
      'Explora oportunidades de colaboración intercultural',
    ],
    fuego: [
      'Tu pasión inspira. Lidera iniciativas de cambio positivo',
      'Recuerda equilibrar la acción con la reflexión',
    ],
    aire: [
      'Tu comunicación conecta. Facilita diálogos importantes en la comunidad',
      'Comparte ideas innovadoras para el crecimiento colectivo',
    ],
  };

  recommendations.push(...elementRecommendations[dominantElement]);

  // Recomendaciones para elementos bajos
  Object.entries(elementos).forEach(([element, value]) => {
    if (value < 70) {
      const lowElementAdvice = {
        tierra: 'Dedica tiempo a actividades que fortalezcan la confianza comunitaria',
        agua: 'Practica la escucha activa y la adaptabilidad en tus intercambios',
        fuego: 'Involúcrate en proyectos que requieran iniciativa y liderazgo',
        aire: 'Participa más en discusiones y comparte tus ideas abiertamente',
      };
      recommendations.push(lowElementAdvice[element as ElementType]);
    }
  });

  return recommendations.slice(0, 3); // Limitar a 3 recomendaciones principales
};

// Utility functions for calculations

/**
 * Calcula la eficiencia de Reciprocidad basada en méritos, ondas y balance de elementos
 * @param meritos - Cantidad de méritos acumulados
 * @param ondas - Cantidad de ondas generadas
 * @param balanceScore - Puntuación de balance elemental (0-100)
 * @returns Porcentaje de eficiencia de Reciprocidad (0-100)
 */
export const calculateReciprocidadEfficiency = (meritos: number, ondas: number, balanceScore: number = 100): number => {
  // La eficiencia de Reciprocidad considera tanto la relación méritos/ondas como el balance elemental
  const baseEfficiency = ondas > 0 ? (meritos / ondas) * 100 : 0;
  // El balance elemental actúa como un multiplicador (0.5-1.5)
  const balanceMultiplier = 0.5 + (balanceScore / 100);

  return Math.min(100, baseEfficiency * balanceMultiplier);
};

export const calculateCommunityImpact = (balanceScore: number, meritos: number, bienComun: number = 1): number => {
  // Se incorpora el bienComun como un factor multiplicador
  return (balanceScore * meritos * (bienComun > 0 ? Math.log(bienComun + 1) : 1)) / 100;
};

export const getElementAnimation = (element: ElementType): string => {
  // Eliminadas las animaciones problemáticas que causaban efecto de olas
  const animations = {
    tierra: '',
    agua: '',
    fuego: '',
    aire: '',
  };
  return animations[element];
};
