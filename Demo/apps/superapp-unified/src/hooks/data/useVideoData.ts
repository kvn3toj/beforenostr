import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { 
  VideoData, 
  VideoProgress, 
  PlayerMetrics,
  validateVideoData,
  validateVideoProgress,
  validatePlayerMetrics
} from '../../types/video-player.schemas';
import { apiService } from '../../lib/api-service';

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================

const QUERY_KEYS = {
  VIDEOS: 'videos',
  VIDEO_DETAIL: 'video-detail',
  VIDEO_PROGRESS: 'video-progress',
  PLAYER_METRICS: 'player-metrics',
  VIDEO_ANALYTICS: 'video-analytics',
  ACHIEVEMENTS: 'achievements',
} as const;

const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutos
  CACHE_TIME: 10 * 60 * 1000, // 10 minutos
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const;

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

interface VideoListParams {
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  limit?: number;
  offset?: number;
  search?: string;
}

interface VideoProgressUpdate {
  videoId: string;
  currentTime: number;
  duration: number;
  completed?: boolean;
  questionsAnswered?: Array<{
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
}

interface PlayerMetricsUpdate {
  meritos?: number;
  ondas?: number;
  experiencia?: number;
  preguntasCorrectas?: number;
  preguntasTotales?: number;
  rachaActual?: number;
  tiempoTotalVisto?: number;
  videosCompletados?: number;
  logrosDesbloqueados?: string[];
}

interface UseVideoDataOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

// ============================================================================
// SERVICIOS API
// ============================================================================

const VideoApiService = {
  // Obtener lista de videos
  async getVideos(params: VideoListParams = {}): Promise<VideoData[]> {
    const queryParams = new URLSearchParams();
    
    if (params.category) queryParams.append('category', params.category);
    if (params.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params.tags?.length) queryParams.append('tags', params.tags.join(','));
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await apiService.get(`/video-items?${queryParams.toString()}`);
    
    // Validar cada video en la respuesta
    if (Array.isArray(response.data)) {
      return response.data.map((video: unknown) => validateVideoData(video));
    }
    
    return [];
  },

  // Obtener detalle de un video específico
  async getVideoById(videoId: string): Promise<VideoData> {
    const response = await apiService.get(`/videos/${videoId}`);
    return validateVideoData(response.data);
  },

  // Obtener progreso de un video
  async getVideoProgress(videoId: string): Promise<VideoProgress | null> {
    try {
      const response = await apiService.get(`/video-progress/${videoId}`);
      return response.data ? validateVideoProgress(response.data) : null;
    } catch (error) {
      // Si no existe progreso, retornar null en lugar de error
      if ((error as any)?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Actualizar progreso de un video
  async updateVideoProgress(update: VideoProgressUpdate): Promise<VideoProgress> {
    const response = await apiService.post('/video-progress', update);
    return validateVideoProgress(response.data);
  },

  // Obtener métricas del jugador
  async getPlayerMetrics(): Promise<PlayerMetrics> {
    const response = await apiService.get('/player-metrics');
    return validatePlayerMetrics(response.data);
  },

  // Actualizar métricas del jugador
  async updatePlayerMetrics(updates: PlayerMetricsUpdate): Promise<PlayerMetrics> {
    const response = await apiService.patch('/player-metrics', updates);
    return validatePlayerMetrics(response.data);
  },

  // Obtener videos recomendados
  async getRecommendedVideos(limit: number = 10): Promise<VideoData[]> {
    const response = await apiService.get(`/video-items/recommended?limit=${limit}`);
    
    if (Array.isArray(response.data)) {
      return response.data.map((video: unknown) => validateVideoData(video));
    }
    
    return [];
  },

  // Buscar videos
  async searchVideos(query: string, filters: VideoListParams = {}): Promise<VideoData[]> {
    const params = { ...filters, search: query };
    return this.getVideos(params);
  },
};

// ============================================================================
// HOOKS PRINCIPALES
// ============================================================================

/**
 * Hook para obtener lista de videos
 */
export const useVideos = (
  params: VideoListParams = {},
  options: UseVideoDataOptions = {}
) => {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    refetchInterval,
    onError,
    onSuccess,
  } = options;

  return useQuery({
    queryKey: [QUERY_KEYS.VIDEOS, params],
    queryFn: () => VideoApiService.getVideos(params),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.RETRY_COUNT,
    retryDelay: CACHE_CONFIG.RETRY_DELAY,
    enabled,
    refetchOnWindowFocus,
    refetchInterval,
    onError,
    onSuccess,
  });
};

/**
 * Hook para obtener detalle de un video específico
 */
export const useVideoDetail = (
  videoId: string,
  options: UseVideoDataOptions = {}
) => {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    onError,
    onSuccess,
  } = options;

  return useQuery({
    queryKey: [QUERY_KEYS.VIDEO_DETAIL, videoId],
    queryFn: () => VideoApiService.getVideoById(videoId),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.RETRY_COUNT,
    retryDelay: CACHE_CONFIG.RETRY_DELAY,
    enabled: enabled && !!videoId,
    refetchOnWindowFocus,
    onError,
    onSuccess,
  });
};

/**
 * Hook para obtener progreso de un video
 */
export const useVideoProgress = (
  videoId: string,
  options: UseVideoDataOptions = {}
) => {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    onError,
    onSuccess,
  } = options;

  return useQuery({
    queryKey: [QUERY_KEYS.VIDEO_PROGRESS, videoId],
    queryFn: () => VideoApiService.getVideoProgress(videoId),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.RETRY_COUNT,
    retryDelay: CACHE_CONFIG.RETRY_DELAY,
    enabled: enabled && !!videoId,
    refetchOnWindowFocus,
    onError,
    onSuccess,
  });
};

/**
 * Hook para obtener métricas del jugador
 */
export const usePlayerMetrics = (options: UseVideoDataOptions = {}) => {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    refetchInterval,
    onError,
    onSuccess,
  } = options;

  return useQuery({
    queryKey: [QUERY_KEYS.PLAYER_METRICS],
    queryFn: VideoApiService.getPlayerMetrics,
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.RETRY_COUNT,
    retryDelay: CACHE_CONFIG.RETRY_DELAY,
    enabled,
    refetchOnWindowFocus,
    refetchInterval,
    onError,
    onSuccess,
  });
};

/**
 * Hook para obtener videos recomendados
 */
export const useRecommendedVideos = (
  limit: number = 10,
  options: UseVideoDataOptions = {}
) => {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    onError,
    onSuccess,
  } = options;

  return useQuery({
    queryKey: [QUERY_KEYS.VIDEOS, 'recommended', limit],
    queryFn: () => VideoApiService.getRecommendedVideos(limit),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.RETRY_COUNT,
    retryDelay: CACHE_CONFIG.RETRY_DELAY,
    enabled,
    refetchOnWindowFocus,
    onError,
    onSuccess,
  });
};

/**
 * Hook para buscar videos
 */
export const useVideoSearch = (
  query: string,
  filters: VideoListParams = {},
  options: UseVideoDataOptions = {}
) => {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    onError,
    onSuccess,
  } = options;

  return useQuery({
    queryKey: [QUERY_KEYS.VIDEOS, 'search', query, filters],
    queryFn: () => VideoApiService.searchVideos(query, filters),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.RETRY_COUNT,
    retryDelay: CACHE_CONFIG.RETRY_DELAY,
    enabled: enabled && !!query.trim(),
    refetchOnWindowFocus,
    onError,
    onSuccess,
  });
};

// ============================================================================
// HOOKS DE MUTACIÓN
// ============================================================================

/**
 * Hook para actualizar progreso de video
 */
export const useUpdateVideoProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: VideoApiService.updateVideoProgress,
    onSuccess: (data, variables) => {
      // Actualizar cache del progreso específico
      queryClient.setQueryData(
        [QUERY_KEYS.VIDEO_PROGRESS, variables.videoId],
        data
      );

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PLAYER_METRICS],
      });

      // Actualizar cache de videos si el video fue completado
      if (variables.completed) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.VIDEOS],
        });
      }
    },
    onError: (error) => {
      console.error('Error updating video progress:', error);
    },
  });
};

/**
 * Hook para actualizar métricas del jugador
 */
export const useUpdatePlayerMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: VideoApiService.updatePlayerMetrics,
    onSuccess: (data) => {
      // Actualizar cache de métricas
      queryClient.setQueryData([QUERY_KEYS.PLAYER_METRICS], data);

      // Invalidar queries relacionadas si hay cambios significativos
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ACHIEVEMENTS],
      });
    },
    onError: (error) => {
      console.error('Error updating player metrics:', error);
    },
  });
};

// ============================================================================
// HOOKS COMPUESTOS Y UTILIDADES
// ============================================================================

/**
 * Hook compuesto que combina video detail y progress
 */
export const useVideoWithProgress = (
  videoId: string,
  options: UseVideoDataOptions = {}
) => {
  const videoQuery = useVideoDetail(videoId, options);
  const progressQuery = useVideoProgress(videoId, options);

  return {
    video: videoQuery.data,
    progress: progressQuery.data,
    isLoading: videoQuery.isLoading || progressQuery.isLoading,
    error: videoQuery.error || progressQuery.error,
    isError: videoQuery.isError || progressQuery.isError,
    refetch: useCallback(() => {
      videoQuery.refetch();
      progressQuery.refetch();
    }, [videoQuery, progressQuery]),
  };
};

/**
 * Hook para invalidar todas las queries relacionadas con videos
 */
export const useInvalidateVideoQueries = () => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.VIDEOS],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.VIDEO_DETAIL],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.VIDEO_PROGRESS],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.PLAYER_METRICS],
    });
  }, [queryClient]);
};

/**
 * Hook para prefetch de videos relacionados
 */
export const usePrefetchRelatedVideos = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (videoId: string, category?: string) => {
      // Prefetch videos de la misma categoría
      if (category) {
        queryClient.prefetchQuery({
          queryKey: [QUERY_KEYS.VIDEOS, { category }],
          queryFn: () => VideoApiService.getVideos({ category }),
          staleTime: CACHE_CONFIG.STALE_TIME,
        });
      }

      // Prefetch videos recomendados
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.VIDEOS, 'recommended', 5],
        queryFn: () => VideoApiService.getRecommendedVideos(5),
        staleTime: CACHE_CONFIG.STALE_TIME,
      });
    },
    [queryClient]
  );
};

// ============================================================================
// UTILIDADES DE CACHE
// ============================================================================

/**
 * Utilidades para manejo manual del cache
 */
export const VideoDataCache = {
  // Obtener datos del cache sin hacer request
  getVideoFromCache: (queryClient: ReturnType<typeof useQueryClient>, videoId: string): VideoData | undefined => {
    return queryClient.getQueryData([QUERY_KEYS.VIDEO_DETAIL, videoId]);
  },

  // Obtener progreso del cache
  getProgressFromCache: (queryClient: ReturnType<typeof useQueryClient>, videoId: string): VideoProgress | undefined => {
    return queryClient.getQueryData([QUERY_KEYS.VIDEO_PROGRESS, videoId]);
  },

  // Obtener métricas del cache
  getMetricsFromCache: (queryClient: ReturnType<typeof useQueryClient>): PlayerMetrics | undefined => {
    return queryClient.getQueryData([QUERY_KEYS.PLAYER_METRICS]);
  },

  // Actualizar video en cache
  setVideoInCache: (queryClient: ReturnType<typeof useQueryClient>, videoId: string, video: VideoData) => {
    queryClient.setQueryData([QUERY_KEYS.VIDEO_DETAIL, videoId], video);
  },

  // Actualizar progreso en cache
  setProgressInCache: (queryClient: ReturnType<typeof useQueryClient>, videoId: string, progress: VideoProgress) => {
    queryClient.setQueryData([QUERY_KEYS.VIDEO_PROGRESS, videoId], progress);
  },

  // Limpiar cache específico
  clearVideoCache: (queryClient: ReturnType<typeof useQueryClient>, videoId: string) => {
    queryClient.removeQueries({
      queryKey: [QUERY_KEYS.VIDEO_DETAIL, videoId],
    });
    queryClient.removeQueries({
      queryKey: [QUERY_KEYS.VIDEO_PROGRESS, videoId],
    });
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  VideoApiService,
  VideoDataCache,
  QUERY_KEYS,
  CACHE_CONFIG,
};

export type {
  VideoListParams,
  VideoProgressUpdate,
  PlayerMetricsUpdate,
  UseVideoDataOptions,
}; 