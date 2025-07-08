/**
 * 🌌 useCosmicBrainData Hook
 * 
 * Hook personalizado para manejar datos del AI Cosmic Brain.
 * Utiliza React Query para gestionar estado, cache y sincronización
 * con el backend NestJS.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: Hook reutilizable para todo el equipo
 * - Ayni: Balance entre funcionalidad y performance
 * - Neguentropía: Gestión ordenada del estado
 * - Metanöia: Evolución continua de la funcionalidad
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CosmicBrainService } from '../services/cosmic-brain.service';
import {
  CosmicDashboardData,
  PhilosophyMetrics,
  SystemHealth,
  Mission,
  HarmonyMetrics,
  GuardianStatus,
  GuardianType,
  EvolutionResult,
  LoadingState
} from '../types/cosmic-brain.types';

// ============================================================================
// 🔑 Query Keys
// ============================================================================

export const COSMIC_BRAIN_QUERY_KEYS = {
  dashboard: ['cosmic-brain', 'dashboard'] as const,
  philosophyMetrics: ['cosmic-brain', 'philosophy-metrics'] as const,
  systemHealth: ['cosmic-brain', 'system-health'] as const,
  harmonyMetrics: ['cosmic-brain', 'harmony-metrics'] as const,
  missions: ['cosmic-brain', 'missions'] as const,
  guardians: ['cosmic-brain', 'guardians'] as const,
  guardian: (type: GuardianType) => ['cosmic-brain', 'guardian', type] as const,
  health: ['cosmic-brain', 'health'] as const,
};

// ============================================================================
// 🖥️ Dashboard Hook
// ============================================================================

export function useCosmicBrainDashboard(options?: {
  includeGuardianDetails?: boolean;
  includePhilosophyMetrics?: boolean;
  includeActiveMissions?: boolean;
  includeHarmonyMetrics?: boolean;
  refetchInterval?: number;
}) {
  return useQuery({
    queryKey: [...COSMIC_BRAIN_QUERY_KEYS.dashboard, options],
    queryFn: () => CosmicBrainService.getDashboardData(options),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: options?.refetchInterval || 30 * 1000, // 30 segundos por defecto
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// ============================================================================
// 📊 Metrics Hooks
// ============================================================================

export function usePhilosophyMetrics(refetchInterval?: number) {
  return useQuery({
    queryKey: COSMIC_BRAIN_QUERY_KEYS.philosophyMetrics,
    queryFn: () => CosmicBrainService.getPhilosophyMetrics(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchInterval: refetchInterval || 60 * 1000, // 1 minuto por defecto
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

export function useSystemHealth(refetchInterval?: number) {
  return useQuery({
    queryKey: COSMIC_BRAIN_QUERY_KEYS.systemHealth,
    queryFn: () => CosmicBrainService.getSystemHealth(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: refetchInterval || 15 * 1000, // 15 segundos por defecto
    refetchOnWindowFocus: true,
    retry: 3,
  });
}

export function useHarmonyMetrics(refetchInterval?: number) {
  return useQuery({
    queryKey: COSMIC_BRAIN_QUERY_KEYS.harmonyMetrics,
    queryFn: () => CosmicBrainService.getHarmonyMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: refetchInterval || 45 * 1000, // 45 segundos por defecto
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

// ============================================================================
// 🎯 Mission Hooks
// ============================================================================

export function useActiveMissions(options?: {
  limit?: number;
  status?: string;
  refetchInterval?: number;
}) {
  return useQuery({
    queryKey: [...COSMIC_BRAIN_QUERY_KEYS.missions, options],
    queryFn: () => CosmicBrainService.getActiveMissions(options),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: options?.refetchInterval || 60 * 1000, // 1 minuto por defecto
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

// ============================================================================
// 🛡️ Guardian Hooks
// ============================================================================

export function useAllGuardians(refetchInterval?: number) {
  return useQuery({
    queryKey: COSMIC_BRAIN_QUERY_KEYS.guardians,
    queryFn: () => CosmicBrainService.getAllGuardians(),
    staleTime: 3 * 60 * 1000, // 3 minutos
    refetchInterval: refetchInterval || 30 * 1000, // 30 segundos por defecto
    refetchOnWindowFocus: true,
    retry: 3,
  });
}

export function useGuardianByType(type: GuardianType, refetchInterval?: number) {
  return useQuery({
    queryKey: COSMIC_BRAIN_QUERY_KEYS.guardian(type),
    queryFn: () => CosmicBrainService.getGuardianByType(type),
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchInterval: refetchInterval || 20 * 1000, // 20 segundos por defecto
    refetchOnWindowFocus: true,
    retry: 3,
    enabled: !!type,
  });
}

// ============================================================================
// 🔄 Evolution Hooks
// ============================================================================

export function useEvolutionTrigger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CosmicBrainService.triggerEvolution(),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas después de la evolución
      queryClient.invalidateQueries({
        queryKey: ['cosmic-brain'],
      });
    },
    onError: (error) => {
      console.error('❌ Error triggering evolution:', error);
    },
  });
}

// ============================================================================
// 🏥 Health Check Hook
// ============================================================================

export function useCosmicBrainHealth(refetchInterval?: number) {
  return useQuery({
    queryKey: COSMIC_BRAIN_QUERY_KEYS.health,
    queryFn: () => CosmicBrainService.healthCheck(),
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: refetchInterval || 10 * 1000, // 10 segundos por defecto
    refetchOnWindowFocus: true,
    retry: 5,
  });
}

// ============================================================================
// 🎛️ Composite Hooks
// ============================================================================

/**
 * Hook compuesto que combina múltiples queries para el dashboard completo
 */
export function useCosmicBrainFullDashboard() {
  const dashboard = useCosmicBrainDashboard({
    includeGuardianDetails: true,
    includePhilosophyMetrics: true,
    includeActiveMissions: true,
    includeHarmonyMetrics: true,
  });

  const systemHealth = useSystemHealth();
  const guardians = useAllGuardians();
  const missions = useActiveMissions({ limit: 10 });

  const isLoading = dashboard.isLoading || systemHealth.isLoading || guardians.isLoading || missions.isLoading;
  const isError = dashboard.isError || systemHealth.isError || guardians.isError || missions.isError;
  const error = dashboard.error || systemHealth.error || guardians.error || missions.error;

  return {
    dashboard: dashboard.data,
    systemHealth: systemHealth.data,
    guardians: guardians.data,
    missions: missions.data,
    isLoading,
    isError,
    error,
    refetch: () => {
      dashboard.refetch();
      systemHealth.refetch();
      guardians.refetch();
      missions.refetch();
    },
  };
}

/**
 * Hook para obtener el estado general del sistema
 */
export function useCosmicBrainStatus() {
  const health = useCosmicBrainHealth();
  const systemHealth = useSystemHealth();
  const guardians = useAllGuardians();

  const overallStatus: LoadingState = health.isLoading || systemHealth.isLoading || guardians.isLoading
    ? 'loading'
    : health.isError || systemHealth.isError || guardians.isError
    ? 'error'
    : 'success';

  const statusScore = systemHealth.data?.overallHealth || 0;
  const activeGuardians = guardians.data?.filter(g => g.status === 'active').length || 0;
  const totalGuardians = guardians.data?.length || 0;

  return {
    status: overallStatus,
    score: statusScore,
    activeGuardians,
    totalGuardians,
    isHealthy: statusScore >= 80 && activeGuardians >= totalGuardians * 0.8,
    lastCheck: health.data?.timestamp,
    refetch: () => {
      health.refetch();
      systemHealth.refetch();
      guardians.refetch();
    },
  };
}

// ============================================================================
// 🔧 Utility Functions
// ============================================================================

/**
 * Función para invalidar todas las queries del cosmic brain
 */
export function useInvalidateCosmicBrainQueries() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ['cosmic-brain'],
    });
  };
}

/**
 * Función para precargar datos del cosmic brain
 */
export function usePrefetchCosmicBrainData() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: COSMIC_BRAIN_QUERY_KEYS.dashboard,
      queryFn: () => CosmicBrainService.getDashboardData(),
      staleTime: 5 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: COSMIC_BRAIN_QUERY_KEYS.systemHealth,
      queryFn: () => CosmicBrainService.getSystemHealth(),
      staleTime: 2 * 60 * 1000,
    });

    queryClient.prefetchQuery({
      queryKey: COSMIC_BRAIN_QUERY_KEYS.guardians,
      queryFn: () => CosmicBrainService.getAllGuardians(),
      staleTime: 3 * 60 * 1000,
    });
  };
}
