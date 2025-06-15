import { useQuery, QueryKey, UseQueryOptions } from '@tanstack/react-query';

// 🧠 ESTRATEGIAS DE CACHE BÁSICAS
// Hooks especializados para diferentes tipos de queries sin dependencias circulares

/**
 * Hook para datos de usuario - Cache agresivo ya que cambian poco
 */
export const useUserDataQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 15, // 15 minutes - Datos de usuario cambian poco
    cacheTime: 1000 * 60 * 60, // 1 hour - Cache largo para datos de usuario
    refetchOnWindowFocus: false,
    refetchOnMount: false, // No refetch automático para datos de usuario
    ...options,
  });
};

/**
 * Hook para datos de gamificación - Cache moderado con refetch periódico
 */
export const useGamificationQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 2, // 2 minutes - Datos de gamificación se actualizan frecuentemente
    cacheTime: 1000 * 60 * 10, // 10 minutes - Cache moderado
    refetchInterval: 1000 * 60 * 5, // Auto-refetch cada 5 minutos
    refetchIntervalInBackground: false, // No refetch en background
    ...options,
  });
};

/**
 * Hook para contenido multimedia - Cache muy agresivo
 */
export const useMediaContentQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 60, // 1 hour - Contenido multimedia no cambia frecuentemente
    cacheTime: 1000 * 60 * 60 * 4, // 4 hours - Cache muy largo para multimedia
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

/**
 * Hook para datos en tiempo real - Cache mínimo con refetch agresivo
 */
export const useRealTimeQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 30, // 30 seconds - Datos en tiempo real se vuelven stale rápido
    cacheTime: 1000 * 60 * 2, // 2 minutes - Cache corto
    refetchInterval: 1000 * 60, // Refetch cada minuto
    refetchOnWindowFocus: true, // Refetch al volver a la ventana
    refetchOnReconnect: true,
    ...options,
  });
};

/**
 * Hook para listas estáticas - Cache muy agresivo
 */
export const useStaticListQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - Listas estáticas casi nunca cambian
    cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days - Cache muy largo
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    ...options,
  });
}; 