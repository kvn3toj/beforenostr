import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CosmicBrainService,
  type CosmicDashboardData,
  type GuardianStatus,
  type PhilosophyMetrics,
  type SystemHealth,
  type Mission,
  type HarmonyMetrics
} from '../services/cosmic-brain.service';

/**
 * 🎣 useCosmicBrainData Hook - Backend Integration
 *
 * Hook personalizado para gestionar el estado y datos del AI Cosmic Brain
 * integrado con el backend NestJS. Implementa principios de "Naming as a Process"
 * para máxima claridad y mantenibilidad del código.
 *
 * Características:
 * - Integración completa con backend NestJS
 * - React Query para caché inteligente y sincronización
 * - Actualizaciones automáticas en intervalos configurables
 * - Manejo robusto de errores
 * - Estado de carga optimizado
 * - Limpieza automática de recursos
 */

interface UseCosmicBrainDataReturn {
  // Datos principales
  dashboardData: CosmicDashboardData | null;
  guardians: GuardianStatus[];
  philosophyMetrics: PhilosophyMetrics | null;
  systemHealth: SystemHealth | null;
  missions: Mission[];
  harmonyMetrics: HarmonyMetrics | null;

  // Estados de carga y error
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Funciones de control
  refreshData: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
  refreshGuardians: () => Promise<void>;
  refreshPhilosophy: () => Promise<void>;
  refreshSystemHealth: () => Promise<void>;
  refreshMissions: () => Promise<void>;
  refreshHarmony: () => Promise<void>;

  // Metadatos útiles
  lastUpdateTimestamp: Date | null;
  isAutoRefreshActive: boolean;
  pauseAutoRefresh: () => void;
  resumeAutoRefresh: () => void;
}

/**
 * 🔄 Hook principal para datos del Cosmic Brain con backend integration
 */
export const useCosmicBrainData = (
  refreshIntervalMs: number = 30000,
  enableAutoRefresh: boolean = true
): UseCosmicBrainDataReturn => {

  // ============================================================================
  // 📊 State Management con nombres que explican el propósito
  // ============================================================================

  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState<boolean>(enableAutoRefresh);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<Date | null>(null);
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  // ============================================================================
  // 🔄 React Query Hooks para diferentes tipos de datos
  // ============================================================================

  // Query para datos completos del dashboard
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    error: dashboardError,
    refetch: refetchDashboard
  } = useQuery({
    queryKey: ['cosmic-brain', 'dashboard'],
    queryFn: CosmicBrainService.getDashboardData,
    refetchInterval: isAutoRefreshActive ? refreshIntervalMs : false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    onSuccess: () => {
      setLastUpdateTimestamp(new Date());
    },
    onError: (error) => {
      console.error('Error fetching dashboard data:', error);
    }
  });

  // Query para guardians
  const {
    data: guardians = [],
    isLoading: isGuardiansLoading,
    isError: isGuardiansError,
    error: guardiansError,
    refetch: refetchGuardians
  } = useQuery({
    queryKey: ['cosmic-brain', 'guardians'],
    queryFn: CosmicBrainService.getGuardians,
    refetchInterval: isAutoRefreshActive ? refreshIntervalMs : false,
    staleTime: 2 * 60 * 1000, // 2 minutos
    cacheTime: 5 * 60 * 1000, // 5 minutos
    onError: (error) => {
      console.error('Error fetching guardians:', error);
    }
  });

  // Query para métricas de filosofía
  const {
    data: philosophyMetrics,
    isLoading: isPhilosophyLoading,
    isError: isPhilosophyError,
    error: philosophyError,
    refetch: refetchPhilosophy
  } = useQuery({
    queryKey: ['cosmic-brain', 'philosophy'],
    queryFn: CosmicBrainService.getPhilosophyMetrics,
    refetchInterval: isAutoRefreshActive ? refreshIntervalMs : false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    onError: (error) => {
      console.error('Error fetching philosophy metrics:', error);
    }
  });

  // Query para salud del sistema
  const {
    data: systemHealth,
    isLoading: isSystemHealthLoading,
    isError: isSystemHealthError,
    error: systemHealthError,
    refetch: refetchSystemHealth
  } = useQuery({
    queryKey: ['cosmic-brain', 'system-health'],
    queryFn: CosmicBrainService.getSystemHealth,
    refetchInterval: isAutoRefreshActive ? refreshIntervalMs / 2 : false, // Más frecuente
    staleTime: 1 * 60 * 1000, // 1 minuto
    cacheTime: 3 * 60 * 1000, // 3 minutos
    onError: (error) => {
      console.error('Error fetching system health:', error);
    }
  });

  // Query para misiones
  const {
    data: missions = [],
    isLoading: isMissionsLoading,
    isError: isMissionsError,
    error: missionsError,
    refetch: refetchMissions
  } = useQuery({
    queryKey: ['cosmic-brain', 'missions'],
    queryFn: CosmicBrainService.getMissions,
    refetchInterval: isAutoRefreshActive ? refreshIntervalMs : false,
    staleTime: 3 * 60 * 1000, // 3 minutos
    cacheTime: 7 * 60 * 1000, // 7 minutos
    onError: (error) => {
      console.error('Error fetching missions:', error);
    }
  });

  // Query para métricas de armonía
  const {
    data: harmonyMetrics,
    isLoading: isHarmonyLoading,
    isError: isHarmonyError,
    error: harmonyError,
    refetch: refetchHarmony
  } = useQuery({
    queryKey: ['cosmic-brain', 'harmony'],
    queryFn: CosmicBrainService.getHarmonyMetrics,
    refetchInterval: isAutoRefreshActive ? refreshIntervalMs : false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    onError: (error) => {
      console.error('Error fetching harmony metrics:', error);
    }
  });

  // ============================================================================
  // 🔄 Computed States
  // ============================================================================

  const isLoading = isDashboardLoading || isGuardiansLoading || isPhilosophyLoading ||
                   isSystemHealthLoading || isMissionsLoading || isHarmonyLoading;

  const isError = isDashboardError || isGuardiansError || isPhilosophyError ||
                 isSystemHealthError || isMissionsError || isHarmonyError;

  const error = dashboardError || guardiansError || philosophyError ||
               systemHealthError || missionsError || harmonyError;

  // ============================================================================
  // 🔄 Refresh Functions
  // ============================================================================

  const refreshDashboard = useCallback(async (): Promise<void> => {
    try {
      await refetchDashboard();
      setLastUpdateTimestamp(new Date());
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    }
  }, [refetchDashboard]);

  const refreshGuardians = useCallback(async (): Promise<void> => {
    try {
      await refetchGuardians();
    } catch (error) {
      console.error('Error refreshing guardians:', error);
    }
  }, [refetchGuardians]);

  const refreshPhilosophy = useCallback(async (): Promise<void> => {
    try {
      await refetchPhilosophy();
    } catch (error) {
      console.error('Error refreshing philosophy:', error);
    }
  }, [refetchPhilosophy]);

  const refreshSystemHealth = useCallback(async (): Promise<void> => {
    try {
      await refetchSystemHealth();
    } catch (error) {
      console.error('Error refreshing system health:', error);
    }
  }, [refetchSystemHealth]);

  const refreshMissions = useCallback(async (): Promise<void> => {
    try {
      await refetchMissions();
    } catch (error) {
      console.error('Error refreshing missions:', error);
    }
  }, [refetchMissions]);

  const refreshHarmony = useCallback(async (): Promise<void> => {
    try {
      await refetchHarmony();
    } catch (error) {
      console.error('Error refreshing harmony:', error);
    }
  }, [refetchHarmony]);

  const refreshData = useCallback(async (): Promise<void> => {
    try {
      await Promise.all([
        refreshDashboard(),
        refreshGuardians(),
        refreshPhilosophy(),
        refreshSystemHealth(),
        refreshMissions(),
        refreshHarmony()
      ]);
    } catch (error) {
      console.error('Error refreshing all data:', error);
    }
  }, [refreshDashboard, refreshGuardians, refreshPhilosophy, refreshSystemHealth, refreshMissions, refreshHarmony]);

  // ============================================================================
  // ⏱️ Auto-refresh Management
  // ============================================================================

  const pauseAutoRefresh = useCallback(() => {
    setIsAutoRefreshActive(false);
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
      autoRefreshIntervalRef.current = null;
    }
  }, []);

  const resumeAutoRefresh = useCallback(() => {
    setIsAutoRefreshActive(true);
  }, []);

  // ============================================================================
  // 🔄 Effect Hooks para inicialización y limpieza
  // ============================================================================

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, []);

  // ============================================================================
  // 📤 Return Hook Data
  // ============================================================================

  return {
    // Datos principales
    dashboardData: dashboardData || null,
    guardians,
    philosophyMetrics: philosophyMetrics || null,
    systemHealth: systemHealth || null,
    missions,
    harmonyMetrics: harmonyMetrics || null,

    // Estados de carga y error
    isLoading,
    isError,
    error: error as Error | null,

    // Funciones de control
    refreshData,
    refreshDashboard,
    refreshGuardians,
    refreshPhilosophy,
    refreshSystemHealth,
    refreshMissions,
    refreshHarmony,

    // Metadatos útiles
    lastUpdateTimestamp,
    isAutoRefreshActive,
    pauseAutoRefresh,
    resumeAutoRefresh
  };
};

export default useCosmicBrainData;
