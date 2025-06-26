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
import { z } from 'zod';

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
// ADAPTADOR PARA DATOS DEL BACKEND
// ============================================================================

/**
 * Adapta los datos del backend al formato esperado por VideoDataSchema
 */
const adaptBackendVideoData = (backendVideo: any): any => {
  console.log('🔧 Adaptando video del backend:', backendVideo);

  try {
    // Parsear arrays JSON si son strings
    let categories: string[] = [];
    let tags: string[] = [];

    if (typeof backendVideo.categories === 'string') {
      try {
        categories = JSON.parse(backendVideo.categories);
      } catch {
        categories = [backendVideo.categories];
      }
    } else if (Array.isArray(backendVideo.categories)) {
      categories = backendVideo.categories;
    }

    if (typeof backendVideo.tags === 'string') {
      try {
        const parsed = JSON.parse(backendVideo.tags);
        if (Array.isArray(parsed)) {
          tags = parsed;
        } else if (parsed && typeof parsed === 'object') {
          // Extrae solo los valores string del objeto
          tags = Object.values(parsed).map(String);
        } else {
          tags = [String(parsed)];
        }
      } catch {
        tags = [backendVideo.tags];
      }
    } else if (Array.isArray(backendVideo.tags)) {
      tags = backendVideo.tags;
    } else if (backendVideo.tags && typeof backendVideo.tags === 'object') {
      tags = Object.values(backendVideo.tags).map(String);
    }

    // Adaptar preguntas al formato esperado
    const adaptedQuestions = (backendVideo.questions || []).map((q: any) => ({
      id: String(q.id),
      timestamp: q.timestamp || 0,
      question: q.text || q.question || '',
      options: (q.answerOptions || []).map((opt: any) => ({
        id: String(opt.id),
        text: opt.text || '',
        isCorrect: opt.isCorrect || false,
      })),
      difficulty: 'medium', // Default ya que el backend no tiene este campo
      timeLimit: 15, // Default
      points: 10, // Default
      category: categories[0] || 'General',
      explanation: '', // El backend no tiene este campo
    }));

    // Construir objeto adaptado
    const adaptedVideo = {
      id: String(backendVideo.id), // Convertir número a string
      title: backendVideo.title || '',
      description: backendVideo.description || '',
      url: backendVideo.url || '',
      thumbnail: backendVideo.thumbnailUrl || backendVideo.thumbnail || '🎬', // Emoji por defecto
      duration: backendVideo.duration || 0,
      questions: adaptedQuestions,
      category: categories[0] || 'General', // Tomar la primera categoría
      difficulty: 'beginner', // Default ya que el backend no mapea difficulty
      tags,
      createdAt: backendVideo.createdAt ? new Date(backendVideo.createdAt) : undefined,
      updatedAt: backendVideo.updatedAt ? new Date(backendVideo.updatedAt) : undefined,

      // Campos requeridos por la interfaz VideoItem del dashboard
      rewards: {
        meritos: Math.floor(Math.random() * 100) + 50, // Mëritos aleatorios entre 50-150
        ondas: Math.floor(Math.random() * 50) + 25,    // Öndas aleatorias entre 25-75
      },
      isCompleted: false, // Por defecto no completado
      progress: 0, // Progreso inicial 0%
      questionsCount: adaptedQuestions.length,

      // Campos adicionales del backend que podemos preservar
      playlistId: backendVideo.playlistId,
      platform: backendVideo.platform,
      externalId: backendVideo.externalId,
      order: backendVideo.order,
      isActive: backendVideo.isActive,
    };

    console.log('✅ Video adaptado exitosamente:', adaptedVideo);
    return adaptedVideo;
  } catch (error) {
    console.error('Error adaptando datos del video:', error, backendVideo);
    // Retornar formato mínimo válido en caso de error
    return {
      id: String(backendVideo.id || 'unknown'),
      title: backendVideo.title || 'Video sin título',
      description: backendVideo.description || '',
      url: backendVideo.url || '',
      thumbnail: backendVideo.thumbnailUrl || '🎬',
      duration: backendVideo.duration || 0,
      questions: [],
      category: 'General',
      difficulty: 'beginner',
      tags: [],
      rewards: {
        meritos: 50,
        ondas: 25,
      },
      isCompleted: false,
      progress: 0,
      questionsCount: 0,
      playlistId: backendVideo.playlistId,
    };
  }
};

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

    console.log('🎬 Obteniendo videos del backend...');
    const response: any = await apiService.get(`/video-items?${queryParams.toString()}`);
    console.log('🎬 Respuesta completa del backend:', response);

    // La respuesta directa ya es el array de videos
    const videosArray = response;
    console.log('🎬 Videos array:', videosArray);
    console.log('🎬 Es array?', Array.isArray(videosArray));

    // Adaptar y validar cada video en la respuesta
    if (Array.isArray(videosArray)) {
      console.log('🎥 Procesando videos del backend:', videosArray.length, 'videos');
      const processedVideos = videosArray.map((video: unknown, index: number) => {
        console.log(`📹 Procesando video ${index + 1}:`, video);
        const adaptedVideo = adaptBackendVideoData(video);
        const validatedVideo = validateVideoData(adaptedVideo);
        console.log(`✅ Video ${index + 1} validado:`, validatedVideo);
        return validatedVideo;
      });
      console.log('🎬 Videos finales procesados:', processedVideos);
      return processedVideos;
    }

    return [];
  },

  // Obtener detalle de un video específico
  async getVideoById(videoId: string): Promise<VideoData> {
    const response: any = await apiService.get(`/video-items/${videoId}`);
    const adaptedVideo = adaptBackendVideoData(response.data);
    return validateVideoData(adaptedVideo);
  },

  // Obtener progreso de un video
  async getVideoProgress(videoId: string): Promise<VideoProgress | null> {
    try {
      const response: any = await apiService.get(`/video-progress/${videoId}`);
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
    const response: any = await apiService.patch(`/video-progress/${update.videoId}`, update);
    return validateVideoProgress(response.data);
  },

  // Obtener métricas del jugador
  async getPlayerMetrics(): Promise<PlayerMetrics> {
    const response: any = await apiService.get('/player-metrics');
    return validatePlayerMetrics(response.data);
  },

  // Actualizar métricas del jugador
  async updatePlayerMetrics(updates: PlayerMetricsUpdate): Promise<PlayerMetrics> {
    const response: any = await apiService.patch('/player-metrics', updates);
    return validatePlayerMetrics(response.data);
  },

  // Obtener videos recomendados
  async getRecommendedVideos(limit: number = 10): Promise<VideoData[]> {
    const response: any = await apiService.get(`/videos/recommended?limit=${limit}`);
    return (response.data || []).map(adaptBackendVideoData).map(validateVideoData);
  },

  // Buscar videos
  async searchVideos(query: string, filters: VideoListParams = {}): Promise<VideoData[]> {
    const response: any = await apiService.get(`/videos/search?q=${query}&${new URLSearchParams(filters as any).toString()}`);
    return (response.data || []).map(adaptBackendVideoData).map(validateVideoData);
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
  const queryClient = useQueryClient();

  return useQuery<VideoData[]>({
    // Identificador único para la query, incluyendo los parámetros
    queryKey: [QUERY_KEYS.VIDEOS, params],

    // Función que se ejecutará para obtener los datos
    queryFn: () => VideoApiService.getVideos(params),

    // Configuración de la caché y reintentos
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    retry: CACHE_CONFIG.RETRY_COUNT,

    // Placeholder data para una mejor experiencia de usuario inicial
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook para obtener detalle de un video específico
 */
export const useVideoDetail = (
  videoId: string,
  options: UseVideoDataOptions = {}
) => {
  return useQuery<VideoData>({
    queryKey: [QUERY_KEYS.VIDEO_DETAIL, videoId],
    queryFn: () => VideoApiService.getVideoById(videoId),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
  });
};

/**
 * Hook para obtener progreso de un video
 */
export const useVideoProgress = (
  videoId: string,
  options: UseVideoDataOptions = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.VIDEO_PROGRESS, videoId],
    queryFn: () => VideoApiService.getVideoProgress(videoId),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
  });
};

/**
 * Hook para obtener métricas del jugador
 */
export const usePlayerMetrics = (options: UseVideoDataOptions = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLAYER_METRICS],
    queryFn: () => VideoApiService.getPlayerMetrics(),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
  });
};

/**
 * Hook para obtener videos recomendados
 */
export const useRecommendedVideos = (
  limit: number = 10,
  options: UseVideoDataOptions = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.VIDEOS, 'recommended', limit],
    queryFn: () => VideoApiService.getRecommendedVideos(limit),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
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
  return useQuery({
    queryKey: [QUERY_KEYS.VIDEOS, 'search', query, filters],
    queryFn: () => VideoApiService.searchVideos(query, filters),
    staleTime: CACHE_CONFIG.STALE_TIME,
    gcTime: CACHE_CONFIG.CACHE_TIME,
    enabled: !!query && query.length > 2, // Solo ejecutar si la búsqueda tiene más de 2 caracteres
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
  QUERY_KEYS,
  CACHE_CONFIG,
};

// VideoDataCache ya se exporta arriba como const

export type {
  VideoListParams,
  VideoProgressUpdate,
  PlayerMetricsUpdate,
  UseVideoDataOptions,
};
