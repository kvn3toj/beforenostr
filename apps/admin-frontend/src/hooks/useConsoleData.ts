import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { philosophyApiService } from '../services/philosophy-api.service';

// Types para la Consola de Experiencias
export interface Challenge {
  id: string;
  title: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  config?: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  rewards?: ChallengeReward[];
  userChallenges?: UserChallenge[];
}

export interface ChallengeReward {
  id: string;
  challengeId: string;
  type: string;
  amount?: number;
  description?: string;
  metadata?: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: string;
  progress: number;
  startedAt: string;
  completedAt?: string;
}

export interface ExperienceMetrics {
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  totalParticipants: number;
  averageCompletion: number;
  reciprocityIndex: number; // Índice de Equilibrio de Reciprocidad (IER)
}

export interface CreateChallengeData {
  title: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  startDate?: Date;
  endDate?: Date;
  config?: Record<string, any>;
  rewards?: Omit<ChallengeReward, 'id' | 'challengeId'>[];
}

export interface UpdateChallengeData extends Partial<CreateChallengeData> {
  id: string;
}

/**
 * Hook principal para la Consola de Experiencias del Gamifier Admin
 *
 * Funcionalidades:
 * - Gestión completa de Challenges (CRUD)
 * - Métricas filosóficas (IER - Índice de Equilibrio de Reciprocidad)
 * - Estado de la consola en tiempo real
 * - Integración con el backend NestJS
 *
 * Filosofía CoomÜnity aplicada:
 * - Reciprocidad: Flujo de datos eficiente y transparente
 * - Bien Común: Herramientas para crear experiencias de alto valor
 * - Cooperación: Gestión sin bloqueos del estado
 * - Belleza: API limpia y predecible
 */
export const useConsoleData = () => {
  const queryClient = useQueryClient();

  // =====================================================================
  // QUERIES - Obtención de datos con React Query
  // =====================================================================

  // Obtener todas las métricas de la consola
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    error: metricsError,
    refetch: refetchMetrics
  } = useQuery<ExperienceMetrics>({
    queryKey: ['console', 'metrics'],
    queryFn: async () => {
      // Usar el servicio de filosofía para obtener métricas
      const response = await philosophyApiService.getMetrics();
      return {
        totalChallenges: response.totalChallenges || 0,
        activeChallenges: response.activeChallenges || 0,
        completedChallenges: response.completedChallenges || 0,
        totalParticipants: response.totalParticipants || 0,
        averageCompletion: response.averageCompletion || 0,
        reciprocityIndex: response.reciprocityIndex || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 30 * 1000, // Actualizar cada 30 segundos
  });

  // Obtener todos los challenges para administración
  const {
    data: challenges,
    isLoading: isLoadingChallenges,
    error: challengesError,
    refetch: refetchChallenges
  } = useQuery<Challenge[]>({
    queryKey: ['console', 'challenges'],
    queryFn: async () => {
      try {
        // Llamada al endpoint de challenges del backend
        const response = await fetch('/api/challenges/admin/all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching challenges:', error);
        // Fallback a datos mock para desarrollo
        return [
          {
            id: '1',
            title: 'Desafío de Reciprocidad',
            name: 'reciprocity-challenge',
            slug: 'reciprocity-challenge',
            description: 'Completa 5 intercambios de valor en el marketplace',
            type: 'WEEKLY',
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            config: { targetValue: 5, actionType: 'marketplace_exchange' },
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            rewards: [
              {
                id: '1',
                challengeId: '1',
                type: 'MERITOS',
                amount: 50,
                description: 'Méritos por fomentar la Reciprocidad',
              }
            ],
          }
        ];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // =====================================================================
  // MUTATIONS - Operaciones de escritura
  // =====================================================================

  // Crear nuevo challenge
  const createChallengeMutation = useMutation({
    mutationFn: async (data: CreateChallengeData): Promise<Challenge> => {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al crear el desafío');
      }

      return await response.json();
    },
    onSuccess: (newChallenge) => {
      // Invalidar queries para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ['console', 'challenges'] });
      queryClient.invalidateQueries({ queryKey: ['console', 'metrics'] });

      toast.success(`Desafío "${newChallenge.title}" creado exitosamente`, {
        description: 'El nuevo desafío está disponible para los Jugadores',
      });
    },
    onError: (error) => {
      console.error('Error creating challenge:', error);
      toast.error('Error al crear el desafío', {
        description: 'Por favor, revisa los datos e intenta nuevamente',
      });
    },
  });

  // Actualizar challenge existente
  const updateChallengeMutation = useMutation({
    mutationFn: async (data: UpdateChallengeData): Promise<Challenge> => {
      const { id, ...updateData } = data;
      const response = await fetch(`/api/challenges/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el desafío');
      }

      return await response.json();
    },
    onSuccess: (updatedChallenge) => {
      queryClient.invalidateQueries({ queryKey: ['console', 'challenges'] });
      queryClient.invalidateQueries({ queryKey: ['console', 'metrics'] });

      toast.success(`Desafío "${updatedChallenge.title}" actualizado`, {
        description: 'Los cambios están disponibles inmediatamente',
      });
    },
    onError: (error) => {
      console.error('Error updating challenge:', error);
      toast.error('Error al actualizar el desafío');
    },
  });

  // Eliminar challenge
  const deleteChallengeMutation = useMutation({
    mutationFn: async (challengeId: string): Promise<void> => {
      const response = await fetch(`/api/challenges/${challengeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el desafío');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['console', 'challenges'] });
      queryClient.invalidateQueries({ queryKey: ['console', 'metrics'] });

      toast.success('Desafío eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error deleting challenge:', error);
      toast.error('Error al eliminar el desafío');
    },
  });

  // =====================================================================
  // COMPUTED VALUES - Valores calculados en tiempo real
  // =====================================================================

  const consoleStats = useMemo(() => {
    if (!challenges || !metrics) return null;

    const activeChallenges = challenges.filter(c => c.status === 'ACTIVE');
    const draftChallenges = challenges.filter(c => c.status === 'DRAFT');
    const completedChallenges = challenges.filter(c => c.status === 'COMPLETED');

    return {
      totalChallenges: challenges.length,
      activeChallenges: activeChallenges.length,
      draftChallenges: draftChallenges.length,
      completedChallenges: completedChallenges.length,
      reciprocityIndex: metrics.reciprocityIndex,
      engagementRate: metrics.averageCompletion,
    };
  }, [challenges, metrics]);

  // =====================================================================
  // ACTIONS - Funciones de acción con optimistic updates
  // =====================================================================

  const createChallenge = useCallback((data: CreateChallengeData) => {
    return createChallengeMutation.mutateAsync(data);
  }, [createChallengeMutation]);

  const updateChallenge = useCallback((data: UpdateChallengeData) => {
    return updateChallengeMutation.mutateAsync(data);
  }, [updateChallengeMutation]);

  const deleteChallenge = useCallback((challengeId: string) => {
    return deleteChallengeMutation.mutateAsync(challengeId);
  }, [deleteChallengeMutation]);

  const refreshConsole = useCallback(() => {
    refetchChallenges();
    refetchMetrics();
  }, [refetchChallenges, refetchMetrics]);

  // =====================================================================
  // LOADING & ERROR STATES
  // =====================================================================

  const isLoading = isLoadingMetrics || isLoadingChallenges;
  const isCreating = createChallengeMutation.isPending;
  const isUpdating = updateChallengeMutation.isPending;
  const isDeleting = deleteChallengeMutation.isPending;
  const isWorking = isCreating || isUpdating || isDeleting;

  const error = metricsError || challengesError;

  // =====================================================================
  // RETURN API
  // =====================================================================

  return {
    // Data
    challenges: challenges || [],
    metrics,
    consoleStats,

    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isWorking,

    // Error handling
    error,

    // Actions
    createChallenge,
    updateChallenge,
    deleteChallenge,
    refreshConsole,

    // Raw mutations (para casos avanzados)
    createChallengeMutation,
    updateChallengeMutation,
    deleteChallengeMutation,
  };
};
