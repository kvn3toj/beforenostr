/**
 * 🎓 Hooks para LETS en Comunidades de Práctica
 * 
 * Maneja intercambios de conocimiento, jerarquía de usuarios y transacciones de Ünits
 * dentro de las Comunidades de Práctica.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { letsBackendService } from '../lib/lets-backend-service';
import type { 
  KnowledgeExchange, 
  CopHierarchyLevel, 
  UnitsWallet,
  UnitsTransaction 
} from '../lib/lets-backend-service';
// Removed duplicate import - using types from lets-backend-service

// ============================================================================
// HOOKS PARA INTERCAMBIOS DE CONOCIMIENTO
// ============================================================================

export const useKnowledgeExchanges = (copId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['knowledge-exchanges', copId],
    queryFn: async () => {
      try {
        return await letsBackendService.getKnowledgeExchanges(copId);
      } catch (error) {
        console.warn('Error fetching knowledge exchanges:', error);
        return [];
      }
    },
    staleTime: 30000, // 30 segundos
  });

  const createExchange = useMutation({
    mutationFn: async (exchangeData: Partial<CopKnowledgeExchange>) => {
      try {
        const response = await apiService.post(`/cops/${copId}/knowledge-exchanges`, exchangeData);
        return (response as any)?.data;
      } catch (error) {
        console.error('Error creating exchange:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-exchanges', copId] });
    },
  });

  const joinExchange = useMutation({
    mutationFn: async ({ exchangeId, participantId, role }: {
      exchangeId: string;
      participantId: string;
      role: 'learner' | 'observer';
    }) => {
      try {
        const response = await apiService.post(`/cops/${copId}/knowledge-exchanges/${exchangeId}/join`, {
          participantId,
          role
        });
        return (response as any)?.data;
      } catch (error) {
        console.error('Error joining exchange:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-exchanges', copId] });
      queryClient.invalidateQueries({ queryKey: ['units-wallet'] });
    },
  });

  const evaluateParticipation = useMutation({
    mutationFn: async ({ exchangeId, participantId, rating, comment }: {
      exchangeId: string;
      participantId: string;
      rating: number;
      comment?: string;
    }) => {
      const response = await apiService.post(`/cops/${copId}/knowledge-exchanges/${exchangeId}/evaluate`, {
        participantId,
        feedbackRating: rating,
        feedbackComment: comment
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-exchanges', copId] });
      queryClient.invalidateQueries({ queryKey: ['cop-hierarchy'] });
    },
  });

  return {
    exchanges: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createExchange,
    joinExchange,
    evaluateParticipation,
    refetch: query.refetch
  };
};

// ============================================================================
// HOOKS PARA JERARQUÍA EN COPS
// ============================================================================

export const useCopHierarchy = (userId: string, copId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['cop-hierarchy', userId, copId],
    queryFn: async () => {
      try {
        const response = await apiService.get(`/cops/${copId}/hierarchy/${userId}`);
        return (response as any)?.data;
      } catch (error) {
        console.warn('Error fetching cop hierarchy:', error);
        return null;
      }
    },
    staleTime: 300000, // 5 minutos
    enabled: !!userId && !!copId,
  });

  const updateHierarchy = useMutation({
    mutationFn: async (hierarchyData: Partial<CopHierarchyLevel>) => {
      try {
        const response = await apiService.put(`/cops/${copId}/hierarchy/${userId}`, hierarchyData);
        return (response as any)?.data;
      } catch (error) {
        console.error('Error updating hierarchy:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cop-hierarchy', userId, copId] });
    },
  });

  // Calcular progreso hacia el siguiente nivel
  const calculateLevelProgress = (userLevel: any) => {
    if (!userLevel || !query.data?.requirements) return 0;

    const requirements = query.data.requirements;
    const current = userLevel.requirementsMet || {};
    
    // Calcular porcentaje basado en múltiples métricas
    const progressMetrics = [
      (current?.sessionsAttended || 0) / (requirements?.sessionsAttended || 1),
      (current?.hoursLearned || 0) / (requirements?.hoursLearned || 1),
      (current?.sessionsTaught || 0) / (requirements?.sessionsTaught || 1),
      (current?.averageRating || 0) / (requirements?.averageRating || 5)
    ];

    const averageProgress = progressMetrics.reduce((sum, metric) => sum + Math.min(metric, 1), 0) / progressMetrics.length;
    return Math.round(averageProgress * 100);
  };

  return {
    userLevel: query.data?.userLevel,
    levelProgress: calculateLevelProgress(query.data?.userLevel),
    requirements: query.data?.requirements,
    isLoading: query.isLoading,
    error: query.error,
    updateHierarchy,
    refetch: query.refetch
  };
};

// ============================================================================
// HOOKS PARA ESTADÍSTICAS DE COPS
// ============================================================================

export const useCopLetsStats = (copId: string) => {
  return useQuery({
    queryKey: ['cop-lets-stats', copId],
    queryFn: async () => {
      try {
        const response = await apiService.get(`/cops/${copId}/lets-stats`);
        return (response as any)?.data;
      } catch (error) {
        console.warn('Error fetching cop stats:', error);
        return null;
      }
    },
    staleTime: 60000, // 1 minuto
  });
};

// ============================================================================
// HOOKS PARA MENTORÍAS
// ============================================================================

export const useMentorships = (copId: string, userId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['mentorships', copId, userId],
    queryFn: async () => {
      try {
        const endpoint = userId 
          ? `/cops/${copId}/mentorships?userId=${userId}`
          : `/cops/${copId}/mentorships`;
        const response = await apiService.get(endpoint);
        return (response as any)?.data || [];
      } catch (error) {
        console.warn('Error fetching mentorships:', error);
        return [];
      }
    },
    staleTime: 60000,
  });

  const createMentorship = useMutation({
    mutationFn: async (mentorshipData: {
      mentorId: string;
      menteeId: string;
      knowledgeAreas: string[];
      duration: number;
      unitsCost: number;
    }) => {
      try {
        const response = await apiService.post(`/cops/${copId}/mentorships`, mentorshipData);
        return (response as any)?.data;
      } catch (error) {
        console.error('Error creating mentorship:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorships', copId] });
    },
  });

  const requestMentorship = useMutation({
    mutationFn: async ({ mentorId, message, knowledgeAreas }: {
      mentorId: string;
      message: string;
      knowledgeAreas: string[];
    }) => {
      const response = await apiService.post(`/cops/${copId}/mentorships/request`, {
        mentorId,
        message,
        knowledgeAreas
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorships', copId] });
    },
  });

  return {
    mentorships: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createMentorship,
    requestMentorship,
    refetch: query.refetch
  };
};

// ============================================================================
// HOOKS PARA TALLERES GRUPALES
// ============================================================================

export const useWorkshops = (copId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['workshops', copId],
    queryFn: async () => {
      try {
        const response = await apiService.get(`/cops/${copId}/workshops`);
        return (response as any)?.data || [];
      } catch (error) {
        console.warn('Error fetching workshops:', error);
        return [];
      }
    },
    staleTime: 30000,
  });

  const createWorkshop = useMutation({
    mutationFn: async (workshopData: {
      title: string;
      description: string;
      facilitatorId: string;
      maxParticipants: number;
      unitsCost: number;
      durationHours: number;
      scheduledAt: string;
      materials?: string[];
    }) => {
      try {
        const response = await apiService.post(`/cops/${copId}/workshops`, workshopData);
        return (response as any)?.data;
      } catch (error) {
        console.error('Error creating workshop:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops', copId] });
    },
  });

  const joinWorkshop = useMutation({
    mutationFn: async ({ workshopId, participantId }: {
      workshopId: string;
      participantId: string;
    }) => {
      const response = await apiService.post(`/cops/${copId}/workshops/${workshopId}/join`, {
        participantId
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops', copId] });
      queryClient.invalidateQueries({ queryKey: ['units-wallet'] });
    },
  });

  return {
    workshops: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createWorkshop,
    joinWorkshop,
    refetch: query.refetch
  };
};

// ============================================================================
// HOOKS PARA BÚSQUEDA DE MENTORES
// ============================================================================

export const useMentorSearch = (copId: string, filters?: {
  knowledgeAreas?: string[];
  minLevel?: number;
  availability?: 'available' | 'busy' | 'all';
}) => {
  return useQuery({
    queryKey: ['mentor-search', copId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.knowledgeAreas?.length) {
        params.append('knowledgeAreas', filters.knowledgeAreas.join(','));
      }
      if (filters?.minLevel) {
        params.append('minLevel', filters.minLevel.toString());
      }
      if (filters?.availability && filters.availability !== 'all') {
        params.append('availability', filters.availability);
      }

      const response = await apiService.get(`/cops/${copId}/mentors?${params.toString()}`);
      return response.data;
    },
    staleTime: 120000, // 2 minutos
    enabled: !!copId,
  });
};

// ============================================================================
// HOOKS PARA HISTORIAL DE TRANSACCIONES LETS EN COPS
// ============================================================================

export const useCopTransactionHistory = (copId: string, userId?: string) => {
  return useQuery({
    queryKey: ['cop-transactions', copId, userId],
    queryFn: async () => {
      const endpoint = userId 
        ? `/cops/${copId}/transactions?userId=${userId}`
        : `/cops/${copId}/transactions`;
      const response = await apiService.get(endpoint);
      return response.data;
    },
    staleTime: 60000,
  });
};

// ============================================================================
// HOOKS PARA CERTIFICACIONES Y RECONOCIMIENTOS
// ============================================================================

export const useCopCertifications = (copId: string, userId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['cop-certifications', copId, userId],
    queryFn: async () => {
      const response = await apiService.get(`/cops/${copId}/certifications/${userId}`);
      return response.data;
    },
    staleTime: 300000, // 5 minutos
  });

  const awardCertification = useMutation({
    mutationFn: async ({ recipientId, certificationType, knowledgeAreas }: {
      recipientId: string;
      certificationType: string;
      knowledgeAreas: string[];
    }) => {
      const response = await apiService.post(`/cops/${copId}/certifications`, {
        recipientId,
        certificationType,
        knowledgeAreas
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cop-certifications', copId] });
    },
  });

  return {
    certifications: query.data,
    isLoading: query.isLoading,
    error: query.error,
    awardCertification,
    refetch: query.refetch
  };
};

// ============================================================================
// TIPOS AUXILIARES
// ============================================================================

export interface MentorProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  expertise: string[];
  rating: number;
  totalSessions: number;
  availability: 'available' | 'busy';
  hourlyRate: number; // En Ünits
  bio: string;
  languages: string[];
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  facilitator: {
    id: string;
    name: string;
    avatar: string;
    level: number;
  };
  maxParticipants: number;
  currentParticipants: number;
  unitsCost: number;
  durationHours: number;
  scheduledAt: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  materials?: string[];
  knowledgeAreas: string[];
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    joinedAt: string;
  }>;
}

export interface CopLetsStats {
  totalExchanges: number;
  totalUnitsCirculated: number;
  activeMembers: number;
  averageRating: number;
  topKnowledgeAreas: Array<{
    area: string;
    count: number;
  }>;
  monthlyGrowth: number;
  ayniBalance: number; // Índice de reciprocidad
} 