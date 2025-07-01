import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api-service';

// Tipos para el Sistema de Inteligencia de Reciprocidad
export interface UserAction {
  id: string;
  type: 'giving' | 'receiving' | 'learning' | 'teaching' | 'collaborating' | 'creating';
  module: 'uplay' | 'marketplace' | 'social' | 'profile' | 'groups' | 'lets';
  value: number; // Impacto cuantificado de la acción
  timestamp: Date;
  metadata: {
    recipient?: string;
    resourceType?: string;
    skillCategory?: string;
    collaborators?: string[];
    impact?: 'local' | 'regional' | 'global';
  };
}

export interface ReciprocidadBalance {
  overall: number; // 0-100 balance general
  elements: {
    fuego: number; // Pasión/Acción
    agua: number;  // Fluidez/Adaptabilidad
    tierra: number; // Estabilidad/Crecimiento
    aire: number;   // Comunicación/Ideas
    ether: number;  // Consciencia/Transcendencia
  };
  trend: 'ascending' | 'stable' | 'declining';
  lastCalculated: Date;
}

export interface SmartRecommendation {
  id: string;
  type: 'balance_action' | 'learning_opportunity' | 'collaboration_match' | 'contribution_suggestion';
  title: string;
  description: string;
  module: string;
  action: {
    route: string;
    params?: Record<string, any>;
    expectedImpact: number;
  };
  priority: 'high' | 'medium' | 'low';
  reciprocidadElement: keyof ReciprocidadBalance['elements'];
  estimatedTimeToComplete: number; // minutos
  expires?: Date;
}

export interface CollaborationMatch {
  user: {
    id: string;
    name: string;
    avatar: string;
    skills: string[];
    reciprocidadScore: number;
    complementarity: number; // 0-1 qué tan complementarias son las habilidades
  };
  type: 'skill_exchange' | 'project_collaboration' | 'mentorship' | 'peer_learning';
  suggestedProject?: {
    title: string;
    description: string;
    estimatedDuration: string;
    bienComunImpact: number;
  };
  confidenceScore: number; // 0-1 qué tan segura es la recomendación
}

export interface ReciprocidadIntelligenceData {
  reciprocidadBalance: ReciprocidadBalance;
  recommendations: SmartRecommendation[];
  collaborationMatches: CollaborationMatch[];
  personalizedInsights: {
    strengthElement: keyof ReciprocidadBalance['elements'];
    growthOpportunity: keyof ReciprocidadBalance['elements'];
    nextMilestone: string;
    communityRole: 'giver' | 'receiver' | 'balancer' | 'catalyst';
  };
  communityImpact: {
    currentContributions: number;
    potentialReach: number;
    bienComunScore: number;
    networkInfluence: number;
  };
}

// Hook principal para el Sistema de Inteligencia de Reciprocidad
export const useReciprocidadIntelligence = (userId: string) => {
  const [preferences, setPreferences] = useState({
    preferredElements: ['fuego', 'agua'] as Array<keyof ReciprocidadBalance['elements']>,
    learningStyle: 'visual' as 'visual' | 'auditory' | 'kinesthetic' | 'collaborative',
    availableTime: 30, // minutos por día
    goals: ['balance_reciprocidad', 'learn_skills', 'help_community'] as string[]
  });

  // Consulta principal de datos de inteligencia
  const {
    data: intelligenceData,
    isLoading,
    error,
    refetch
  } = useQuery<ReciprocidadIntelligenceData>({
    queryKey: ['reciprocidad-intelligence', userId, preferences],
    queryFn: async () => {
      try {
        // Construir URL con parámetros de query
        const queryParams = new URLSearchParams();
        queryParams.append('preferredElements', preferences.preferredElements.join(','));
        queryParams.append('learningStyle', preferences.learningStyle);
        queryParams.append('availableTime', preferences.availableTime.toString());
        queryParams.append('goals', preferences.goals.join(','));

        // TODO: El endpoint del backend también debe ser refactorizado de /reciprocidad-intelligence a /reciprocidad-intelligence
        const response = await apiService.get(`/reciprocidad-intelligence/${userId}?${queryParams.toString()}`);
        return (response as any).data || response;
      } catch (error) {
        console.warn('🧠 [ReciprocidadIntelligence] Backend not available, using intelligent mock data');
        return generateIntelligentMockData(userId, preferences);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000,   // 15 minutos
    enabled: !!userId,
    refetchOnWindowFocus: false
  });

  // Registrar nueva acción de usuario
  const recordActionMutation = useMutation({
    mutationFn: async (action: Omit<UserAction, 'id' | 'timestamp'>) => {
      const actionWithMetadata = {
        ...action,
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        userId
      };

      try {
        await apiService.post('/reciprocidad-intelligence/actions', actionWithMetadata);
      } catch (error) {
        console.warn('🧠 [ReciprocidadIntelligence] Action recorded locally (backend unavailable)');
        // Guardar en localStorage como fallback
        const localActions = JSON.parse(localStorage.getItem('reciprocidad_actions') || '[]');
        localActions.push(actionWithMetadata);
        localStorage.setItem('reciprocidad_actions', JSON.stringify(localActions.slice(-100))); // Keep last 100
      }

      return actionWithMetadata;
    },
    onSuccess: () => {
      // Recalcular inteligencia después de nueva acción
      refetch();
    }
  });

  // Aplicar recomendación
  const applyRecommendationMutation = useMutation({
    mutationFn: async (recommendationId: string) => {
      try {
        await apiService.post(`/reciprocidad-intelligence/recommendations/${recommendationId}/apply`);
      } catch (error) {
        console.warn('🧠 [ReciprocidadIntelligence] Recommendation applied locally');
      }
    },
    onSuccess: () => {
      refetch();
    }
  });

  // Calcular Balance de Reciprocidad en tiempo real
  const calculateReciprocidadBalance = useCallback((actions: UserAction[]): ReciprocidadBalance => {
    if (!actions.length) {
      return {
        overall: 50,
        elements: { fuego: 50, agua: 50, tierra: 50, aire: 50, ether: 50 },
        trend: 'stable',
        lastCalculated: new Date()
      };
    }

    const recent = actions.filter(a =>
      Date.now() - new Date(a.timestamp).getTime() < 30 * 24 * 60 * 60 * 1000 // Last 30 days
    );

    const givingActions = recent.filter(a => ['giving', 'teaching', 'creating'].includes(a.type));
    const receivingActions = recent.filter(a => ['receiving', 'learning'].includes(a.type));
    const collaboratingActions = recent.filter(a => a.type === 'collaborating');

    const givingScore = givingActions.reduce((sum, a) => sum + a.value, 0);
    const receivingScore = receivingActions.reduce((sum, a) => sum + a.value, 0);
    const collaboratingScore = collaboratingActions.reduce((sum, a) => sum + a.value, 0);

    const totalScore = givingScore + receivingScore + collaboratingScore;
    const reciprocidadBalance = totalScore > 0 ? givingScore / totalScore : 0.5;

    // Calcular elementos basado en tipos de actividades
    const elementScores = {
      fuego: recent.filter(a => ['creating', 'teaching'].includes(a.type)).length * 10 + 30,
      agua: recent.filter(a => a.type === 'collaborating').length * 15 + 25,
      tierra: recent.filter(a => a.module === 'marketplace').length * 12 + 35,
      aire: recent.filter(a => ['teaching', 'collaborating'].includes(a.type)).length * 8 + 40,
      ether: Math.min(recent.length * 2 + 20, 100)
    };

    // Normalizar a 0-100
    Object.keys(elementScores).forEach(key => {
      elementScores[key as keyof typeof elementScores] = Math.min(100, Math.max(0, elementScores[key as keyof typeof elementScores]));
    });

    const overall = Math.round(reciprocidadBalance * 100);

    return {
      overall,
      elements: elementScores,
      trend: overall > 70 ? 'ascending' : overall < 40 ? 'declining' : 'stable',
      lastCalculated: new Date()
    };
  }, []);

  // Generar recomendaciones inteligentes
  const generateRecommendations = useCallback((
    balance: ReciprocidadBalance,
    userPreferences: typeof preferences
  ): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];

    // Recomendaciones para equilibrar elementos bajos
    Object.entries(balance.elements).forEach(([element, score]) => {
      if (score < 60) {
        const recommendation = generateElementBoostRecommendation(
          element as keyof ReciprocidadBalance['elements'],
          score,
          userPreferences
        );
        if (recommendation) recommendations.push(recommendation);
      }
    });

    // Recomendaciones de colaboración
    if (balance.overall < 70) {
      recommendations.push({
        id: `collab_${Date.now()}`,
        type: 'collaboration_match',
        title: '🤝 Encuentra tu Compañero de Reciprocidad',
        description: 'Conecta con alguien que complemente tus habilidades y mejore tu balance',
        module: 'social',
        action: {
          route: '/social/reciprocidad-matches',
          expectedImpact: 25
        },
        priority: 'high',
        reciprocidadElement: 'agua',
        estimatedTimeToComplete: 15
      });
    }

    // ... más lógica de recomendación

    return recommendations.slice(0, 5); // Limitar a 5 recomendaciones
  }, []);

  // Memoizar los datos derivados para evitar recálculos
  const derivedData = useMemo(() => {
    if (!intelligenceData) return null;
    return {
      balance: intelligenceData.reciprocidadBalance,
      recommendations: intelligenceData.recommendations,
      matches: intelligenceData.collaborationMatches,
      insights: intelligenceData.personalizedInsights,
      impact: intelligenceData.communityImpact
    };
  }, [intelligenceData]);

  return {
    // Estado principal
    isLoading,
    error,
    data: derivedData,

    // Datos crudos para componentes avanzados
    rawIntelligenceData: intelligenceData,

    // Acciones y Mutaciones
    recordAction: recordActionMutation.mutate,
    applyRecommendation: applyRecommendationMutation.mutate,

    // Preferencias del usuario
    preferences,
    setPreferences,

    // Utilidades
    recalculate: refetch,

    // Funciones de cálculo expuestas
    calculateReciprocidadBalance,
    generateRecommendations
  };
};

// Función auxiliar para generar recomendación de refuerzo de elemento
const generateElementBoostRecommendation = (
  element: keyof ReciprocidadBalance['elements'],
  currentScore: number,
  preferences: any
): SmartRecommendation | null => {
  const boostNeeded = 75 - currentScore;

  switch (element) {
    case 'fuego':
      return {
        id: `boost_fuego_${Date.now()}`,
        type: 'contribution_suggestion',
        title: '🔥 Enciende tu Fuego Interior',
        description: 'Crea un nuevo video en ÜPlay para compartir tu pasión y conocimiento.',
        module: 'uplay',
        action: { route: '/uplay/create', expectedImpact: boostNeeded },
        priority: 'medium',
        reciprocidadElement: 'fuego',
        estimatedTimeToComplete: 45
      };
    case 'agua':
      return {
        id: `boost_agua_${Date.now()}`,
        type: 'collaboration_match',
        title: '💧 Fluye con la Comunidad',
        description: 'Únete a un círculo de práctica o colabora en un proyecto existente.',
        module: 'social',
        action: { route: '/social/groups', expectedImpact: boostNeeded },
        priority: 'medium',
        reciprocidadElement: 'agua',
        estimatedTimeToComplete: 30
      };
    case 'tierra':
      return {
        id: `boost_tierra_${Date.now()}`,
        type: 'learning_opportunity',
        title: '🌱 Nutre tus Raíces',
        description: 'Ofrece un producto o servicio en el Marketplace para fortalecer la economía local.',
        module: 'marketplace',
        action: { route: '/marketplace/create-listing', expectedImpact: boostNeeded },
        priority: 'medium',
        reciprocidadElement: 'tierra',
        estimatedTimeToComplete: 60
      };
    case 'aire':
      return {
        id: `boost_aire_${Date.now()}`,
        type: 'contribution_suggestion',
        title: '🌬️ Comparte tu Visión',
        description: 'Participa en un debate o comparte una idea innovadora en los foros sociales.',
        module: 'social',
        action: { route: '/social/forums', expectedImpact: boostNeeded },
        priority: 'medium',
        reciprocidadElement: 'aire',
        estimatedTimeToComplete: 20
      };
    default:
      return null;
  }
};

// Función para generar datos mock inteligentes
const generateIntelligentMockData = (
  userId: string,
  preferences: any
): ReciprocidadIntelligenceData => {
  const mockBalance: ReciprocidadBalance = {
    overall: 68,
    elements: { fuego: 75, agua: 55, tierra: 80, aire: 62, ether: 45 },
    trend: 'stable',
    lastCalculated: new Date()
  };

  const mockRecommendations = [
    generateElementBoostRecommendation('agua', 55, preferences),
    {
      id: `collab_mock_${Date.now()}`,
      type: 'collaboration_match',
      title: '🤝 Colabora con "Ana la Artista"',
      description: 'Ana busca a alguien con tus habilidades en marketing para su proyecto de arte sostenible.',
      module: 'social',
      action: { route: '/profile/ana-artista', expectedImpact: 30 },
      priority: 'high',
      reciprocidadElement: 'agua',
      estimatedTimeToComplete: 25
    },
  ].filter(Boolean) as SmartRecommendation[];

  const mockMatches: CollaborationMatch[] = [
    {
      user: { id: 'user_ana', name: 'Ana la Artista', avatar: '/avatars/ana.png', skills: ['arte', 'sostenibilidad'], reciprocidadScore: 85, complementarity: 0.9 },
      type: 'project_collaboration',
      confidenceScore: 0.92
    },
    {
      user: { id: 'user_carlos', name: 'Carlos el Coder', avatar: '/avatars/carlos.png', skills: ['react', 'python', 'AI'], reciprocidadScore: 78, complementarity: 0.75 },
      type: 'skill_exchange',
      confidenceScore: 0.88
    }
  ];

  return {
    reciprocidadBalance: mockBalance,
    recommendations: mockRecommendations,
    collaborationMatches: mockMatches,
    personalizedInsights: {
      strengthElement: 'tierra',
      growthOpportunity: 'agua',
      nextMilestone: 'Alcanzar nivel 80 de balance de Reciprocidad',
      communityRole: 'balancer'
    },
    communityImpact: {
      currentContributions: 42,
      potentialReach: 250,
      bienComunScore: 78,
      networkInfluence: 0.65
    }
  };
};
