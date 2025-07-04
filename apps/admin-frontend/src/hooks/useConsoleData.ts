/**
 * 🔗 Console Data Hooks - Conectores del Flujo Vital
 *
 * Hooks de React Query que conectan la Consola de Experiencias con el Backend NestJS Real
 * ACTIVANDO EL CORAZÓN OPERATIVO DE COOMUNITY CON DATOS REALES.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  consoleApiService,
  type DashboardMetrics,
  type ConsoleOverview,
  type ConsoleNotification,
  type Stage,
  type Contest,
  type StageAnalytics,
  type OctalysisAnalytics,
  type Challenge
} from '../services/console-api.service';

// ===============================================================================
// QUERY KEYS - Claves para React Query Cache Management
// ===============================================================================

export const CONSOLE_QUERY_KEYS = {
  analytics: ['console', 'analytics'] as const,
  overview: ['console', 'overview'] as const,
  stages: ['console', 'stages'] as const,
  contests: ['console', 'contests'] as const,
  notifications: ['console', 'notifications'] as const,
  octalysis: ['console', 'octalysis'] as const,
  challenges: ['console', 'challenges'] as const,
} as const;


// ===============================================================================
// HOOK PRINCIPAL - useConsoleData
// ===============================================================================

/**
 * 🚀 Hook principal que orquesta todos los datos de la Consola de Experiencias.
 * Implementa conexión real con backend NestJS, manejo de estado con React Query,
 * y operaciones de mutación para una gestión de datos completa.
 */
export const useConsoleData = (realTimeUpdates: boolean = true) => {
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------
  // QUERIES (Lectura de Datos)
  // ---------------------------------------------------------------------------

  const { data: metrics, isLoading: isLoadingMetrics, error: errorMetrics } = useQuery({
    queryKey: CONSOLE_QUERY_KEYS.analytics,
    queryFn: () => consoleApiService.getConsoleAnalytics(),
    staleTime: 60 * 1000, // 1 minuto
    refetchInterval: realTimeUpdates ? 65 * 1000 : false, // Refrescar solo si realTimeUpdates está activo
  });

  const { data: consoleStats, isLoading: isLoadingStats, error: errorStats } = useQuery({
    queryKey: CONSOLE_QUERY_KEYS.overview,
    queryFn: () => consoleApiService.getConsoleOverview(),
    staleTime: 60 * 1000,
    refetchInterval: realTimeUpdates ? 70 * 1000 : false,
  });

  const { data: stages, isLoading: isLoadingStages, error: errorStages } = useQuery({
    queryKey: CONSOLE_QUERY_KEYS.stages,
    queryFn: () => consoleApiService.getAllStages(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const { data: challengesData, isLoading: isLoadingChallenges, error: errorChallenges } = useQuery({
    queryKey: CONSOLE_QUERY_KEYS.challenges,
    queryFn: () => consoleApiService.getAllChallenges(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // ✅ FIXED: Asegurar que challenges sea siempre un array válido
  const challenges = challengesData || [];

  // ---------------------------------------------------------------------------
  // MUTATIONS (Escritura y Modificación de Datos)
  // ---------------------------------------------------------------------------

  const { mutateAsync: createChallenge, isPending: isCreatingChallenge } = useMutation({
    mutationFn: (challengeData: Omit<Challenge, 'id'>) => consoleApiService.createChallenge(challengeData),
    onSuccess: () => {
      // Invalidar y refetchear la query de challenges para obtener la lista actualizada
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.challenges });
    },
    onError: (error) => {
      console.error("Error creating challenge:", error);
      // Aquí se podría integrar un sistema de notificaciones como toast
    },
  });

  const { mutateAsync: updateChallenge, isPending: isUpdatingChallenge } = useMutation({
    mutationFn: ({ challengeId, data }: { challengeId: string; data: Partial<Challenge> }) =>
      consoleApiService.updateChallenge(challengeId, data),
    onSuccess: (_, variables) => {
      // Invalidar la query específica de este challenge y la lista general
      queryClient.invalidateQueries({ queryKey: [...CONSOLE_QUERY_KEYS.challenges, variables.challengeId] });
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.challenges });
    },
  });

  const { mutateAsync: deleteChallenge, isPending: isDeletingChallenge } = useMutation({
    mutationFn: (challengeId: string) => consoleApiService.deleteChallenge(challengeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSOLE_QUERY_KEYS.challenges });
    },
  });

  // ---------------------------------------------------------------------------
  // FUNCIONES DE CONTROL
  // ---------------------------------------------------------------------------

  const refreshConsole = () => {
    return Promise.all([
      queryClient.refetchQueries({ queryKey: CONSOLE_QUERY_KEYS.analytics }),
      queryClient.refetchQueries({ queryKey: CONSOLE_QUERY_KEYS.overview }),
      queryClient.refetchQueries({ queryKey: CONSOLE_QUERY_KEYS.stages }),
      queryClient.refetchQueries({ queryKey: CONSOLE_QUERY_KEYS.challenges }),
    ]);
  };

  // ---------------------------------------------------------------------------
  // ESTADO AGREGADO Y RETORNO DEL HOOK
  // ---------------------------------------------------------------------------

  const isLoading = isLoadingMetrics || isLoadingStats || isLoadingStages || isLoadingChallenges;
  const isWorking = isCreatingChallenge || isUpdatingChallenge || isDeletingChallenge;
  const error = errorMetrics || errorStats || errorStages || errorChallenges;

  return {
    // Datos
    metrics,
    consoleStats,
    stages,
    challenges, // ✅ FIXED: Ahora siempre retorna un array válido

    // Estado de carga y error
    isLoading,
    isWorking,
    error,

    // Mutaciones y acciones
    createChallenge,
    updateChallenge,
    deleteChallenge,
    refreshConsole,
  };
};

// ===============================================================================
// HOOKS ESPECIALIZADOS (Ejemplos)
// ===============================================================================

/**
 * Hook para obtener los analytics de un stage específico
 */
export const useStageAnalytics = (stageId: string) => {
  return useQuery({
    queryKey: ['console', 'stageAnalytics', stageId],
    queryFn: () => consoleApiService.getStageAnalytics(stageId),
    enabled: !!stageId, // Solo ejecutar si stageId no es nulo/undefined
    staleTime: 5 * 60 * 1000,
  });
};
