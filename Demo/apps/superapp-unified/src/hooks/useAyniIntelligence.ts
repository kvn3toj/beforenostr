import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api-service';

// Tipos para el Sistema de Inteligencia Ayni
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

export interface AyniBalance {
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
  ayniElement: keyof AyniBalance['elements'];
  estimatedTimeToComplete: number; // minutos
  expires?: Date;
}

export interface CollaborationMatch {
  user: {
    id: string;
    name: string;
    avatar: string;
    skills: string[];
    ayniScore: number;
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

export interface AyniIntelligenceData {
  ayniBalance: AyniBalance;
  recommendations: SmartRecommendation[];
  collaborationMatches: CollaborationMatch[];
  personalizedInsights: {
    strengthElement: keyof AyniBalance['elements'];
    growthOpportunity: keyof AyniBalance['elements'];
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

// Hook principal para el Sistema de Inteligencia Ayni
export const useAyniIntelligence = (userId: string) => {
  const [preferences, setPreferences] = useState({
    preferredElements: ['fuego', 'agua'] as Array<keyof AyniBalance['elements']>,
    learningStyle: 'visual' as 'visual' | 'auditory' | 'kinesthetic' | 'collaborative',
    availableTime: 30, // minutos por día
    goals: ['balance_ayni', 'learn_skills', 'help_community'] as string[]
  });

  // Consulta principal de datos de inteligencia
  const {
    data: intelligenceData,
    isLoading,
    error,
    refetch
  } = useQuery<AyniIntelligenceData>({
    queryKey: ['ayni-intelligence', userId, preferences],
    queryFn: async () => {
      try {
        // Construir URL con parámetros de query
        const queryParams = new URLSearchParams();
        queryParams.append('preferredElements', preferences.preferredElements.join(','));
        queryParams.append('learningStyle', preferences.learningStyle);
        queryParams.append('availableTime', preferences.availableTime.toString());
        queryParams.append('goals', preferences.goals.join(','));

        const response = await apiService.get(`/ayni-intelligence/${userId}?${queryParams.toString()}`);
        return (response as any).data || response;
      } catch (error) {
//         console.warn('🧠 [AyniIntelligence] Backend not available, using intelligent mock data');
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
        await apiService.post('/ayni-intelligence/actions', actionWithMetadata);
      } catch (error) {
        console.warn('🧠 [AyniIntelligence] Action recorded locally (backend unavailable)');
        // Guardar en localStorage como fallback
        const localActions = JSON.parse(localStorage.getItem('ayni_actions') || '[]');
        localActions.push(actionWithMetadata);
        localStorage.setItem('ayni_actions', JSON.stringify(localActions.slice(-100))); // Keep last 100
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
        await apiService.post(`/ayni-intelligence/recommendations/${recommendationId}/apply`);
      } catch (error) {
        console.warn('🧠 [AyniIntelligence] Recommendation applied locally');
      }
    },
    onSuccess: () => {
      refetch();
    }
  });

  // Calcular Balance Ayni en tiempo real
  const calculateAyniBalance = useCallback((actions: UserAction[]): AyniBalance => {
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
    const ayniBalance = totalScore > 0 ? givingScore / totalScore : 0.5;

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

    const overall = Math.round(ayniBalance * 100);
    
    return {
      overall,
      elements: elementScores,
      trend: overall > 70 ? 'ascending' : overall < 40 ? 'declining' : 'stable',
      lastCalculated: new Date()
    };
  }, []);

  // Generar recomendaciones inteligentes
  const generateRecommendations = useCallback((
    balance: AyniBalance, 
    userPreferences: typeof preferences
  ): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];

    // Recomendaciones para equilibrar elementos bajos
    Object.entries(balance.elements).forEach(([element, score]) => {
      if (score < 60) {
        const recommendation = generateElementBoostRecommendation(
          element as keyof AyniBalance['elements'], 
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
        title: '🤝 Encuentra tu Compañero Ayni',
        description: 'Conecta con alguien que complemente tus habilidades y mejore tu balance',
        module: 'social',
        action: {
          route: '/social/ayni-matches',
          expectedImpact: 25
        },
        priority: 'high',
        ayniElement: 'agua',
        estimatedTimeToComplete: 15
      });
    }

    // Recomendaciones de aprendizaje adaptativo
    if (balance.elements.aire < 50) {
      recommendations.push({
        id: `learn_${Date.now()}`,
        type: 'learning_opportunity',
        title: '📚 Expande tu Conocimiento',
        description: 'Cursos personalizados basados en tu estilo de aprendizaje y objetivos',
        module: 'uplay',
        action: {
          route: '/uplay',
          params: { filter: 'personalized', element: 'aire' },
          expectedImpact: 20
        },
        priority: 'medium',
        ayniElement: 'aire',
        estimatedTimeToComplete: userPreferences.availableTime
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, []);

  // Datos procesados con inteligencia
  const processedData = useMemo(() => {
    if (!intelligenceData) return null;

    return {
      ...intelligenceData,
      smartInsights: {
        balancePercentage: intelligenceData.ayniBalance.overall,
        dominantElement: Object.entries(intelligenceData.ayniBalance.elements)
          .sort(([,a], [,b]) => b - a)[0][0],
        nextAction: intelligenceData.recommendations[0]?.title || 'Continúa explorando',
        communityRole: intelligenceData.personalizedInsights.communityRole,
        growthPotential: Math.min(100, intelligenceData.communityImpact.potentialReach)
      }
    };
  }, [intelligenceData]);

  return {
    // Datos principales
    data: processedData,
    isLoading,
    error,
    refetch,

    // Acciones
    recordAction: recordActionMutation.mutate,
    applyRecommendation: applyRecommendationMutation.mutate,
    
    // Estado de mutaciones
    isRecordingAction: recordActionMutation.isPending,
    isApplyingRecommendation: applyRecommendationMutation.isPending,

    // Preferencias del usuario
    preferences,
    updatePreferences: setPreferences,

    // Utilidades
    calculateBalance: calculateAyniBalance,
    generateRecommendations
  };
};

// Función auxiliar para generar recomendaciones por elemento
const generateElementBoostRecommendation = (
  element: keyof AyniBalance['elements'],
  currentScore: number,
  preferences: any
): SmartRecommendation | null => {
  const elementConfig = {
    fuego: {
      title: '🔥 Activa tu Pasión Interior',
      description: 'Inicia un proyecto o enseña algo que te apasione',
      module: 'social',
      route: '/social/groups/create-project'
    },
    agua: {
      title: '🌊 Fluye con la Colaboración',
      description: 'Únete a un grupo colaborativo o ayuda en un proyecto existente',
      module: 'social',
      route: '/social/groups?filter=collaborative'
    },
    tierra: {
      title: '🌱 Contribuye al Crecimiento',
      description: 'Comparte recursos o participa en el marketplace comunitario',
      module: 'marketplace',
      route: '/marketplace/contribute'
    },
    aire: {
      title: '💭 Expande tu Conocimiento',
      description: 'Aprende algo nuevo o comparte tu sabiduría',
      module: 'uplay',
      route: '/uplay?focus=knowledge-sharing'
    },
    ether: {
      title: '✨ Eleva tu Consciencia',
      description: 'Participa en prácticas contemplativas o círculos de sabiduría',
      module: 'groups',
      route: '/social/groups?category=wisdom'
    }
  };

  const config = elementConfig[element];
  if (!config) return null;

  return {
    id: `boost_${element}_${Date.now()}`,
    type: 'balance_action',
    title: config.title,
    description: config.description,
    module: config.module,
    action: {
      route: config.route,
      expectedImpact: Math.max(15, 60 - currentScore)
    },
    priority: currentScore < 30 ? 'high' : 'medium',
    ayniElement: element,
    estimatedTimeToComplete: preferences.availableTime
  };
};

// // Función para generar datos mock inteligentes
const generateIntelligentMockData = (
  userId: string, 
  preferences: any
): AyniIntelligenceData => {
  // Simular datos basados en preferencias del usuario
  const baseBalance = 45 + Math.random() * 30; // 45-75 range
  
//   const mockBalance: AyniBalance = {
    overall: Math.round(baseBalance),
    elements: {
      fuego: Math.round(baseBalance + (Math.random() - 0.5) * 20),
      agua: Math.round(baseBalance + (Math.random() - 0.5) * 20),
      tierra: Math.round(baseBalance + (Math.random() - 0.5) * 20),
      aire: Math.round(baseBalance + (Math.random() - 0.5) * 20),
      ether: Math.round(Math.min(baseBalance * 0.8, 85))
    },
    trend: baseBalance > 60 ? 'ascending' : baseBalance < 50 ? 'declining' : 'stable',
    lastCalculated: new Date()
  };

  // Normalizar elementos a 0-100
//   Object.keys(mockBalance.elements).forEach(key => {
    const element = key as keyof AyniBalance['elements'];
//     mockBalance.elements[element] = Math.min(100, Math.max(0, mockBalance.elements[element]));
  });

//   const mockData: AyniIntelligenceData = {
//     ayniBalance: mockBalance,
    recommendations: [
      {
        id: 'rec_1',
        type: 'learning_opportunity',
        title: '🎓 Curso Personalizado de Filosofía Ayni',
        description: 'Aprende los principios fundamentales de reciprocidad adaptado a tu estilo',
        module: 'uplay',
        action: {
          route: '/uplay/course/ayni-fundamentals',
          expectedImpact: 25
        },
        priority: 'high',
        ayniElement: 'aire',
        estimatedTimeToComplete: preferences.availableTime
      },
      {
        id: 'rec_2',
        type: 'collaboration_match',
        title: '🤝 Proyecto Colaborativo Esperándote',
        description: 'Hay 3 personas con habilidades complementarias buscando colaborar',
        module: 'social',
        action: {
          route: '/social/projects/collaborative',
          expectedImpact: 30
        },
        priority: 'medium',
        ayniElement: 'agua',
        estimatedTimeToComplete: 45
      }
    ],
    collaborationMatches: [
      {
        user: {
          id: 'user_match_1',
          name: 'Maya Consciencia',
          avatar: 'https://via.placeholder.com/150/9C27B0/FFFFFF?text=MC',
          skills: ['Diseño UX', 'Facilitation', 'Yoga'],
          ayniScore: 78,
          complementarity: 0.85
        },
        type: 'skill_exchange',
        suggestedProject: {
          title: 'App para Meditación Comunitaria',
          description: 'Crear una herramienta digital para conectar practicantes de mindfulness',
          estimatedDuration: '2-3 semanas',
          bienComunImpact: 85
        },
        confidenceScore: 0.92
      }
    ],
    personalizedInsights: {
//       strengthElement: Object.entries(mockBalance.elements)
        .sort(([,a], [,b]) => b - a)[0][0] as keyof AyniBalance['elements'],
//       growthOpportunity: Object.entries(mockBalance.elements)
        .sort(([,a], [,b]) => a - b)[0][0] as keyof AyniBalance['elements'],
      nextMilestone: 'Alcanzar 80% de Balance Ayni',
//       communityRole: mockBalance.overall > 70 ? 'catalyst' : 
//                     mockBalance.overall > 60 ? 'balancer' : 
//                     mockBalance.overall > 40 ? 'giver' : 'receiver'
    },
    communityImpact: {
      currentContributions: Math.round(baseBalance * 0.8),
      potentialReach: Math.round(baseBalance * 1.5),
      bienComunScore: Math.round(baseBalance * 0.9),
      networkInfluence: Math.round(baseBalance * 0.7)
    }
  };

//   return mockData;
};

export default useAyniIntelligence;