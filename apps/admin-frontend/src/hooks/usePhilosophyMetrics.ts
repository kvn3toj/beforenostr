/**
 * =============================================================================
 * HOOK: usePhilosophyMetrics - GAMIFIER ADMIN
 * =============================================================================
 * Hook personalizado para gestionar las métricas filosóficas (HambrE, IEA).
 * Integra React Query con mocks para desarrollo independiente del backend.
 *
 * Inspirado en las mejores prácticas de:
 * - https://www.robinwieruch.de/react-mock-data/
 * - https://apidog.com/blog/mock-rest-api-from-react/
 *
 * Guardianes responsables:
 * - MIRA (La Curadora de Herramientas): Arquitectura de hooks y estado
 * - ATLAS (El Backend Whisperer): Preparación para integración real
 * - PHOENIX (El Agente Transformador): Optimización de rendimiento
 * =============================================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import {
  PhilosophyMetricsState,
  HambreMetric,
  IEAReciprocidad
} from '../../../packages/shared-types/src/philosophy-metrics';
import {
  mockPhilosophyAPI,
  mockPhilosophyState,
  mockHambreHistory
} from '../mocks/philosophy-metrics.mock';
import { philosophyApiService } from '../services/philosophy-api.service';

/**
 * Configuración de claves para React Query
 */
export const philosophyQueryKeys = {
  all: ['philosophy'] as const,
  metrics: () => [...philosophyQueryKeys.all, 'metrics'] as const,
  hambreHistory: () => [...philosophyQueryKeys.all, 'hambre-history'] as const,
  ieaHistory: () => [...philosophyQueryKeys.all, 'iea-history'] as const,
} as const;

/**
 * Configuración del hook
 */
interface UsePhilosophyMetricsConfig {
  /** Habilitar refetch automático */
  enableAutoRefresh?: boolean;

  /** Intervalo de refetch en milisegundos */
  refreshInterval?: number;

  /** Usar datos mock en lugar de API real */
  useMockData?: boolean;
}

/**
 * Hook principal para métricas filosóficas
 */
export const usePhilosophyMetrics = (config: UsePhilosophyMetricsConfig = {}) => {
  const {
    enableAutoRefresh = false,
    refreshInterval = 60000, // 1 minuto por defecto
    useMockData = true // Por defecto usar mocks durante desarrollo
  } = config;

  const queryClient = useQueryClient();
  const [optimisticUpdates, setOptimisticUpdates] = useState<{
    hambre?: HambreMetric;
    iea?: IEAReciprocidad;
  }>({});

  /**
   * Query principal para obtener métricas
   */
  const {
    data: metricsData,
    isLoading,
    isError,
    error,
    refetch: refetchMetrics
  } = useQuery({
    queryKey: philosophyQueryKeys.metrics(),
    queryFn: async (): Promise<PhilosophyMetricsState> => {
      if (useMockData) {
        return await mockPhilosophyAPI.getMetrics();
      }
      // ✅ Llamada real al backend NestJS
      const backendResponse = await philosophyApiService.getMetrics();
      return philosophyApiService.backendResponseToFrontendState(backendResponse);
    },
    refetchInterval: enableAutoRefresh ? refreshInterval : false,
    staleTime: 30000, // 30 segundos
    gcTime: 300000, // 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  /**
   * Query para historial de HambrE
   */
  const {
    data: hambreHistory,
    isLoading: isLoadingHistory,
    refetch: refetchHistory
  } = useQuery({
    queryKey: philosophyQueryKeys.hambreHistory(),
    queryFn: async (): Promise<HambreMetric[]> => {
      if (useMockData) {
        return await mockPhilosophyAPI.getHambreHistory();
      }
      // TODO: Reemplazar con llamada real al backend
      // return await apiService.get('/api/philosophy/hambre/history');
      throw new Error('Real API not implemented yet');
    },
    staleTime: 60000, // 1 minuto
    enabled: !!metricsData, // Solo ejecutar si tenemos métricas base
  });

  /**
   * Mutation para actualizar HambrE
   */
  const updateHambreMutation = useMutation({
    mutationFn: async ({ value, notes }: { value: number; notes?: string }): Promise<HambreMetric> => {
      if (useMockData) {
        return await mockPhilosophyAPI.updateHambre(value);
      }
      // TODO: Reemplazar con llamada real al backend
      // return await apiService.patch('/api/philosophy/hambre', { value, notes });
      throw new Error('Real API not implemented yet');
    },
    onMutate: async ({ value }) => {
      // Cancelar refetches pendientes
      await queryClient.cancelQueries({ queryKey: philosophyQueryKeys.metrics() });

      // Snapshot del estado actual
      const previousMetrics = queryClient.getQueryData(philosophyQueryKeys.metrics());

      // Actualización optimista
      if (previousMetrics && typeof previousMetrics === 'object' && 'hambre' in previousMetrics) {
        const optimisticHambre: HambreMetric = {
          ...((previousMetrics as PhilosophyMetricsState).hambre),
          value,
          level: value <= 33 ? 'bajo' : value >= 67 ? 'alto' : 'medio',
          updatedAt: new Date().toISOString(),
          metadata: {
            ...((previousMetrics as PhilosophyMetricsState).hambre.metadata),
            source: 'manual',
            notes: 'Actualización optimista...'
          }
        };

        queryClient.setQueryData(philosophyQueryKeys.metrics(), {
          ...(previousMetrics as PhilosophyMetricsState),
          hambre: optimisticHambre,
          lastSync: new Date().toISOString()
        });

        // Guardar para rollback
        setOptimisticUpdates(prev => ({ ...prev, hambre: optimisticHambre }));
      }

      return { previousMetrics };
    },
    onError: (err, variables, context) => {
      // Rollback en caso de error
      if (context?.previousMetrics) {
        queryClient.setQueryData(philosophyQueryKeys.metrics(), context.previousMetrics);
      }
      setOptimisticUpdates(prev => ({ ...prev, hambre: undefined }));
      console.error('Error actualizando HambrE:', err);
    },
    onSuccess: (data) => {
      // Limpiar actualización optimista
      setOptimisticUpdates(prev => ({ ...prev, hambre: undefined }));

      // Invalidar queries relacionadas para refetch
      queryClient.invalidateQueries({ queryKey: philosophyQueryKeys.hambreHistory() });
    },
    onSettled: () => {
      // Siempre refetch para asegurar consistencia
      queryClient.invalidateQueries({ queryKey: philosophyQueryKeys.metrics() });
    }
  });

  /**
   * Estado derivado con fallbacks
   */
  const metrics = metricsData || mockPhilosophyState;
  const currentHambre = optimisticUpdates.hambre || metrics.hambre;
  const currentIEA = optimisticUpdates.iea || metrics.iea;

  return {
    // Estado principal
    metrics: {
      ...metrics,
      hambre: currentHambre,
      iea: currentIEA
    },
    hambreHistory: hambreHistory || mockHambreHistory,

    // Estados de carga
    isLoading,
    isLoadingHistory,
    isUpdatingHambre: updateHambreMutation.isPending,

    // Estados de error
    isError,
    error: error as Error | null,
    updateHambreError: updateHambreMutation.error as Error | null,

    // Acciones
    updateHambre: useCallback(async (value: number, notes?: string) => {
      return updateHambreMutation.mutateAsync({ value, notes });
    }, [updateHambreMutation]),

    refreshAllMetrics: useCallback(async () => {
      await Promise.all([
        refetchMetrics(),
        refetchHistory()
      ]);
    }, [refetchMetrics, refetchHistory]),

    // Utilidades
    hasOptimisticUpdates: !!(optimisticUpdates.hambre || optimisticUpdates.iea),
    config: {
      useMockData,
      enableAutoRefresh,
      refreshInterval
    }
  };
};
