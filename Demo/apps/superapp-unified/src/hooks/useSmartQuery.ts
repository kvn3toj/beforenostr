import { useQuery, useQueryClient, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

// 📊 CONFIGURACIÓN INTELIGENTE DE CACHÉ POR TIPO DE QUERY - FASE 2.5
// Este hook aplica automáticamente configuraciones optimizadas según el tipo de datos

// Cache times constants - Mismas que en App.tsx
const CACHE_TIMES = {
  // 🔥 Datos críticos que cambian frecuentemente
  REAL_TIME: {
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 5, // 5 minutos
  },
  // ⚡ Datos dinámicos con cambios moderados
  DYNAMIC: {
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  },
  // 📊 Datos estándar con cambios ocasionales
  STANDARD: {
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
  },
  // 🏛️ Datos semi-estáticos que cambian poco
  SEMI_STATIC: {
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60, // 1 hora
  },
  // 📋 Datos estáticos que raramente cambian
  STATIC: {
    staleTime: 1000 * 60 * 60, // 1 hora
    gcTime: 1000 * 60 * 120, // 2 horas
  },
} as const;

// 🎯 Tipos de query específicos de CoomÜnity
export type QueryType = 
  | 'real-time'    // Wallet, Social Feed, Notificaciones
  | 'dynamic'      // Méritos, Transacciones, Stats
  | 'content'      // Videos, Comments, Likes
  | 'standard'     // Profile, Settings, Preferences
  | 'semi-static'  // Mundos, Categories, Lists
  | 'static';      // System config, Terms, Help

// 🔧 Configuración automática por tipo de query
const getConfigForQueryType = (type: QueryType): Partial<UseQueryOptions> => {
  switch (type) {
    case 'real-time':
      return {
        ...CACHE_TIMES.REAL_TIME,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 60, // 1 minuto para datos críticos
        meta: { 
          queryType: 'real-time',
          description: 'Datos críticos que requieren alta frecuencia de actualización'
        },
      };
      
    case 'dynamic':
      return {
        ...CACHE_TIMES.DYNAMIC,
        refetchOnWindowFocus: true,
        meta: { 
          queryType: 'dynamic',
          description: 'Datos que cambian con frecuencia moderada'
        },
      };
      
    case 'content':
      return {
        ...CACHE_TIMES.DYNAMIC,
        refetchOnWindowFocus: false, // No interrumpir reproducción
        meta: { 
          queryType: 'content',
          description: 'Contenido multimedia que no debe interrumpirse'
        },
      };
      
    case 'standard':
      return {
        ...CACHE_TIMES.STANDARD,
        refetchOnWindowFocus: false,
        meta: { 
          queryType: 'standard',
          description: 'Datos estándar con cambios ocasionales'
        },
      };
      
    case 'semi-static':
      return {
        ...CACHE_TIMES.SEMI_STATIC,
        refetchOnWindowFocus: false,
        meta: { 
          queryType: 'semi-static',
          description: 'Datos que cambian poco, cacheo prolongado'
        },
      };
      
    case 'static':
      return {
        ...CACHE_TIMES.STATIC,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        meta: { 
          queryType: 'static',
          description: 'Datos estáticos que raramente cambian'
        },
      };
      
    default:
      return {
        ...CACHE_TIMES.STANDARD,
        meta: { 
          queryType: 'standard',
          description: 'Configuración por defecto'
        },
      };
  }
};

// 🚀 Hook principal useSmartQuery
export function useSmartQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[]
>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TQueryFnData>,
  queryType: QueryType,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  
  // 🎯 Aplicar configuración automática según el tipo
  const typeConfig = getConfigForQueryType(queryType);
  
  // 🔀 Combinar configuración automática con opciones personalizadas
  const finalOptions = {
    ...typeConfig,
    ...options,
    // Las opciones personalizadas tienen prioridad sobre la configuración automática
    meta: {
      ...typeConfig.meta,
      ...options?.meta,
    },
  };
  
  // 📊 Log de configuración en desarrollo
  if (import.meta.env.DEV) {
    console.log(`🎯 Smart Query [${queryType}]:`, {
      queryKey: queryKey[0],
      staleTime: finalOptions.staleTime,
      gcTime: finalOptions.gcTime,
      refetchOnWindowFocus: finalOptions.refetchOnWindowFocus,
      refetchInterval: finalOptions.refetchInterval,
    });
  }
  
  return useQuery({
    queryKey,
    queryFn,
    ...finalOptions
  });
}

// 🎯 Hooks especializados para diferentes tipos de datos CoomÜnity

/**
 * 🔥 Para datos críticos que cambian frecuentemente
 * Uso: Wallet balance, notificaciones en vivo, chat social
 */
export function useRealTimeQuery<TData = unknown, TError = unknown>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useSmartQuery(queryKey, queryFn, 'real-time', options);
}

/**
 * ⚡ Para datos dinámicos con cambios moderados
 * Uso: Méritos, transacciones, estadísticas del usuario
 */
export function useDynamicQuery<TData = unknown, TError = unknown>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useSmartQuery(queryKey, queryFn, 'dynamic', options);
}

/**
 * 🎮 Para contenido multimedia y reproducción
 * Uso: Video player, comentarios, likes, progreso de videos
 */
export function useContentQuery<TData = unknown, TError = unknown>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useSmartQuery(queryKey, queryFn, 'content', options);
}

/**
 * 📊 Para datos estándar del usuario
 * Uso: Perfil, configuración, preferencias
 */
export function useStandardQuery<TData = unknown, TError = unknown>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useSmartQuery(queryKey, queryFn, 'standard', options);
}

/**
 * 🏛️ Para datos que cambian poco
 * Uso: Lista de mundos, categorías, listas de contenido
 */
export function useSemiStaticQuery<TData = unknown, TError = unknown>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useSmartQuery(queryKey, queryFn, 'semi-static', options);
}

/**
 * 📋 Para datos estáticos del sistema
 * Uso: Configuración del sistema, términos, contenido de ayuda
 */
export function useStaticQuery<TData = unknown, TError = unknown>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useSmartQuery(queryKey, queryFn, 'static', options);
}

// 🎯 Hook para invalidar queries por tipo
export function useQueryInvalidation() {
  const queryClient = useQueryClient();
  
  const invalidateByType = (queryType: QueryType) => {
    if (!queryClient) return;
    
    // Invalidar todas las queries que coincidan con el tipo
    queryClient.invalidateQueries({
      predicate: (query) => {
        return query.meta?.queryType === queryType;
      },
    });
  };
  
  const invalidateRealTime = () => invalidateByType('real-time');
  const invalidateDynamic = () => invalidateByType('dynamic');
  const invalidateContent = () => invalidateByType('content');
  const invalidateStandard = () => invalidateByType('standard');
  
  return {
    invalidateByType,
    invalidateRealTime,
    invalidateDynamic,
    invalidateContent,
    invalidateStandard,
  };
}

// 📊 Hook para métricas de caché
export function useCacheMetrics() {
  const queryClient = useQueryClient();
  
  const getCacheStats = () => {
    if (!queryClient) return null;
    
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();
    
    const stats = queries.reduce((acc, query) => {
      const type = query.meta?.queryType as QueryType || 'unknown';
      
      if (!acc[type]) {
        acc[type] = {
          total: 0,
          stale: 0,
          fresh: 0,
          fetching: 0,
          error: 0,
        };
      }
      
      acc[type].total++;
      
      if (query.isStale()) acc[type].stale++;
      if (!query.isStale()) acc[type].fresh++;
      if (query.isFetching()) acc[type].fetching++;
      if (query.state.error) acc[type].error++;
      
      return acc;
    }, {} as Record<string, any>);
    
    return stats;
  };
  
  return { getCacheStats };
}

// 🔧 Utilidades para debugging de caché
export const cacheDebugUtils = {
  /**
   * Log del estado actual del caché por tipo
   */
  logCacheState: () => {
    if (!import.meta.env.DEV) return;
    
    const { getCacheStats } = useCacheMetrics();
    const stats = getCacheStats();
    
    console.group('🎯 Smart Query Cache Stats');
    Object.entries(stats || {}).forEach(([type, data]) => {
      console.log(`${type}:`, data);
    });
    console.groupEnd();
  },
  
  /**
   * Verificar configuración de una query específica
   */
  inspectQuery: (queryKey: readonly unknown[]) => {
    if (!import.meta.env.DEV) return;
    
    const key = queryKey[0];
    console.log(`🔍 Inspecting query: ${key}`, {
      queryKey,
      // Más detalles se pueden agregar aquí
    });
  },
}; 