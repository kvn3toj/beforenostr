// 🎯 HOOKS DE CACHE INTELIGENTE REFACTORIZADOS
// Archivo principal que re-exporta hooks especializados sin dependencias circulares

// ✅ ESTRATEGIAS DE QUERY BÁSICAS
export {
  useUserDataQuery,
  useGamificationQuery,
  useMediaContentQuery,
  useRealTimeQuery,
  useStaticListQuery,
} from './query/useQueryStrategies';

// ✅ ESTRATEGIAS DE PREFETCHING
export {
  useBasicPrefetch,
  useDashboardPrefetch,
  useRelatedModulesPrefetch,
  useNextContentPrefetch,
  useContextualPrefetch,
} from './query/usePrefetchStrategies';

// ✅ ESTRATEGIAS DE INVALIDACIÓN
export {
  useBasicInvalidation,
  useGamificationInvalidation,
  useContentInvalidation,
  useSocialInvalidation,
} from './query/useInvalidationStrategies';

// ✅ ESTRATEGIAS DE CACHE LOCAL
export {
  useLocalCache,
  useSessionCache,
} from './query/useLocalCacheStrategies';

// ✅ ESTRATEGIAS DE OPTIMISTIC UPDATES
export {
  useSocialOptimisticUpdates,
  useGameOptimisticUpdates,
  useWalletOptimisticUpdates,
  useOptimisticRollback,
} from './query/useOptimisticStrategies';

// ✅ ESTRATEGIAS DE PREFETCHING DE NAVEGACIÓN
export {
  useHoverPrefetch,
  useScrollPrefetch,
  useTimePrefetch,
} from './query/useNavigationPrefetchStrategies';

// 🎯 HOOKS COMPUESTOS PARA CASOS DE USO COMUNES
// Estos hooks combinan múltiples estrategias de forma controlada

import { useCallback } from 'react';
import { useBasicPrefetch, useDashboardPrefetch } from './query/usePrefetchStrategies';
import { useBasicInvalidation, useGamificationInvalidation } from './query/useInvalidationStrategies';

/**
 * Hook compuesto para manejo completo de prefetching
 * Combina múltiples estrategias sin crear dependencias circulares
 */
export const usePrefetch = () => {
  const { prefetchUserData, prefetchModule } = useBasicPrefetch();
  const { prefetchDashboardData } = useDashboardPrefetch();

  // Función compuesta que usa las estrategias básicas
  const prefetchUserProfile = useCallback(async (userId: string) => {
    await prefetchUserData(userId);
    await prefetchDashboardData(userId);
  }, [prefetchUserData, prefetchDashboardData]);

  return {
    prefetchUserData,
    prefetchModule,
    prefetchDashboardData,
    prefetchUserProfile,
  };
};

/**
 * Hook compuesto para manejo completo de invalidaciones
 * Combina múltiples estrategias sin crear dependencias circulares
 */
export const useSmartInvalidation = () => {
  const { invalidateUserData, invalidateModule } = useBasicInvalidation();
  const { invalidateGamification, invalidateUserProgress } = useGamificationInvalidation();

  // Función compuesta que invalida datos relacionados
  const invalidateUserSession = useCallback(async (userId: string) => {
    await invalidateUserData(userId);
    await invalidateUserProgress(userId);
  }, [invalidateUserData, invalidateUserProgress]);

  return {
    invalidateUserData,
    invalidateModule,
    invalidateGamification,
    invalidateUserProgress,
    invalidateUserSession,
  };
};

/**
 * Hook compuesto para navegación inteligente
 * Combina prefetching de navegación sin dependencias circulares
 */
export const useNavigationPrefetch = () => {
  const { setupHoverPrefetch } = useHoverPrefetch();
  const { setupScrollPrefetch } = useScrollPrefetch();
  const { setupTimePrefetch } = useTimePrefetch();

  return {
    setupHoverPrefetch,
    setupScrollPrefetch,
    setupTimePrefetch,
  };
};

/**
 * Hook compuesto para optimistic updates
 * Combina múltiples estrategias sin dependencias circulares
 */
export const useOptimisticUpdates = () => {
  const { optimisticLike, optimisticComment } = useSocialOptimisticUpdates();
  const { optimisticGameProgress, optimisticAchievement } = useGameOptimisticUpdates();
  const { optimisticWalletTransaction } = useWalletOptimisticUpdates();
  const { rollbackOptimisticUpdate, rollbackMultipleUpdates } = useOptimisticRollback();

  return {
    optimisticLike,
    optimisticComment,
    optimisticGameProgress,
    optimisticAchievement,
    optimisticWalletTransaction,
    rollbackOptimisticUpdate,
    rollbackMultipleUpdates,
  };
}; 