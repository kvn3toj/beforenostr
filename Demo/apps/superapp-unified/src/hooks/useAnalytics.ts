import { useCallback, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsService, AdminFunnelEvents, type BetaUserProfile } from '../services/analytics';
import { useLocation } from 'react-router-dom';
import { apiService } from '../lib/api-service';

export interface UseAnalyticsOptions {
  userId?: string;
  trackPageView?: boolean;
  pageName?: string;
}

export interface UserEngagement {
  id: string;
  userId: string;
  eventType: string;
  contentId?: string;
  contentType?: string;
  duration?: number;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface CreateEngagementData {
  eventType: string;
  contentId?: string;
  contentType?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface VideoAnalytics {
  totalViews: number;
  averageWatchTime: number;
  mostViewedVideo: string;
  totalQuestionsAnswered: number;
  totalVideos: number;
  topVideos: Array<{
    id: string;
    title: string;
    views: number;
    duration: number;
  }>;
  viewsByDay: Array<{
    date: string;
    views: number;
  }>;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  engagement: {
    totalEvents: number;
    averageSessionTime: number;
    topEventTypes: Array<{
      type: string;
      count: number;
    }>;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user?: {
      id: string;
      name: string;
    };
  }>;
  reciprocidadMetrics: {
    totalMerits: number;
    meritsEarned: number;
    reciprocityScore: number;
  };
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  databaseStatus: string;
  cacheStatus: string;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  lastUpdated: string;
}

// 🔧 SERVICIOS API
const analyticsAPI = {
  // Registrar evento de engagement
  recordEvent: async (data: CreateEngagementData): Promise<UserEngagement> => {
    const response = await apiService.post('/analytics/events', data);
    return response as UserEngagement;
  },

  // Obtener mi historial de engagement
  getMyEngagement: async (): Promise<UserEngagement[]> => {
    const response = await apiService.get('/analytics/me/engagement');
    return response as UserEngagement[];
  },

  // Obtener analytics de videos
  getVideoAnalytics: async (): Promise<VideoAnalytics> => {
    const response = await apiService.get('/analytics/videos');
    return response as VideoAnalytics;
  },

  // Obtener métricas del dashboard
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const response = await apiService.get('/analytics/dashboard-metrics');
    return response as DashboardMetrics;
  },

  // Obtener salud del sistema
  getSystemHealth: async (): Promise<SystemHealth> => {
    const response = await apiService.get('/analytics/system-health');
    return response as SystemHealth;
  },

  // Obtener total de usuarios
  getTotalUsers: async (): Promise<{ count: number }> => {
    const response = await apiService.get('/analytics/total-users');
    return response as { count: number };
  },

  // Obtener usuarios activos en el tiempo
  getActiveUsersOverTime: async (params?: {
    interval?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Array<{ date: string; count: number }>> => {
    const queryParams = new URLSearchParams();
    if (params?.interval) queryParams.append('interval', params.interval);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const response = await apiService.get(`/analytics/active-users-over-time?${queryParams}`);
    return response as Array<{ date: string; count: number }>;
  },

  // Obtener contenido más interactuado
  getTopInteractedContent: async (): Promise<Array<{
    id: string;
    title: string;
    interactions: number;
    type: string;
  }>> => {
    const response = await apiService.get('/analytics/top-interacted-content');
    return response as Array<{
      id: string;
      title: string;
      interactions: number;
      type: string;
    }>;
  },
};

// 🪝 HOOK PRINCIPAL: useAnalytics
export const useAnalytics = () => {
  const queryClient = useQueryClient();

  // Query para métricas del dashboard
  const {
    data: dashboardMetrics,
    isLoading: isLoadingDashboard,
    error: dashboardError,
    refetch: refetchDashboard
  } = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: analyticsAPI.getDashboardMetrics,
    staleTime: 300000, // 5 minutos
    refetchInterval: 300000, // Refetch cada 5 minutos
  });

  // Query para analytics de videos
  const {
    data: videoAnalytics,
    isLoading: isLoadingVideos,
    error: videoError,
    refetch: refetchVideos
  } = useQuery({
    queryKey: ['analytics', 'videos'],
    queryFn: analyticsAPI.getVideoAnalytics,
    staleTime: 600000, // 10 minutos
  });

  // Query para mi engagement
  const {
    data: myEngagement,
    isLoading: isLoadingEngagement,
    error: engagementError,
    refetch: refetchEngagement
  } = useQuery({
    queryKey: ['analytics', 'my-engagement'],
    queryFn: analyticsAPI.getMyEngagement,
    staleTime: 300000, // 5 minutos
  });

  // Query para salud del sistema
  const {
    data: systemHealth,
    isLoading: isLoadingHealth,
    error: healthError,
    refetch: refetchHealth
  } = useQuery({
    queryKey: ['analytics', 'system-health'],
    queryFn: analyticsAPI.getSystemHealth,
    staleTime: 60000, // 1 minuto
    refetchInterval: 120000, // Refetch cada 2 minutos
  });

  // Mutación para registrar evento
  const recordEventMutation = useMutation({
    mutationFn: analyticsAPI.recordEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'my-engagement'] });
      queryClient.invalidateQueries({ queryKey: ['analytics', 'dashboard'] });
    },
  });

  return {
    // Datos
    dashboardMetrics,
    videoAnalytics,
    myEngagement: myEngagement || [],
    systemHealth,

    // Estados de carga
    isLoadingDashboard,
    isLoadingVideos,
    isLoadingEngagement,
    isLoadingHealth,
    isLoading: isLoadingDashboard || isLoadingVideos || isLoadingEngagement || isLoadingHealth,

    // Errores
    dashboardError,
    videoError,
    engagementError,
    healthError,

    // Acciones
    recordEvent: recordEventMutation.mutate,
    refetchDashboard,
    refetchVideos,
    refetchEngagement,
    refetchHealth,

    // Estados de mutación
    isRecording: recordEventMutation.isPending,
    recordError: recordEventMutation.error,
  };
};

// 🪝 HOOK ESPECÍFICO: useVideoAnalytics
export const useVideoAnalytics = () => {
  const {
    data: videoAnalytics,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['analytics', 'videos'],
    queryFn: analyticsAPI.getVideoAnalytics,
    staleTime: 600000, // 10 minutos
  });

  return {
    videoAnalytics,
    isLoading,
    error,
    refetch,
  };
};

// 🪝 HOOK ESPECÍFICO: useEngagementTracking
export const useEngagementTracking = () => {
  const queryClient = useQueryClient();

  const recordEvent = useMutation({
    mutationFn: analyticsAPI.recordEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'my-engagement'] });
      queryClient.invalidateQueries({ queryKey: ['analytics', 'dashboard'] });
    },
  });

  // Funciones de utilidad para eventos comunes
  const trackVideoView = (videoId: string, duration?: number) => {
    recordEvent.mutate({
      eventType: 'video_view',
      contentId: videoId,
      contentType: 'video',
      duration,
    });
  };

  const trackVideoComplete = (videoId: string, duration: number) => {
    recordEvent.mutate({
      eventType: 'video_complete',
      contentId: videoId,
      contentType: 'video',
      duration,
    });
  };

  const trackPlaylistView = (playlistId: string) => {
    recordEvent.mutate({
      eventType: 'playlist_view',
      contentId: playlistId,
      contentType: 'playlist',
    });
  };

  const trackQuestionAnswer = (questionId: string, isCorrect: boolean) => {
    recordEvent.mutate({
      eventType: 'question_answer',
      contentId: questionId,
      contentType: 'question',
      metadata: { isCorrect },
    });
  };

  const trackSearchUsage = (searchTerm: string, resultsCount: number) => {
    recordEvent.mutate({
      eventType: 'search',
      contentType: 'search',
      metadata: { searchTerm, resultsCount },
    });
  };

  return {
    // Acciones específicas
    trackVideoView,
    trackVideoComplete,
    trackPlaylistView,
    trackQuestionAnswer,
    trackSearchUsage,
    
    // Acción genérica
    recordEvent: recordEvent.mutate,
    
    // Estados
    isRecording: recordEvent.isPending,
    recordError: recordEvent.error,
  };
};

// 🪝 HOOK ESPECÍFICO: useUserProgress
export const useUserProgress = () => {
  const { myEngagement, isLoadingEngagement } = useAnalytics();

  // Calcular estadísticas de progreso del usuario
  const progress = useMemo(() => {
    if (!myEngagement) {
      return {
        totalViews: 0,
        totalWatchTime: 0,
        completedVideos: 0,
        averageWatchTime: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        accuracy: 0,
      };
    }

    const videoViews = myEngagement.filter((e: UserEngagement) => e.eventType === 'video_view');
    const videoCompletes = myEngagement.filter((e: UserEngagement) => e.eventType === 'video_complete');
    const questionAnswers = myEngagement.filter((e: UserEngagement) => e.eventType === 'question_answer');
    
    const totalWatchTime = videoViews.reduce((total: number, engagement: UserEngagement) => 
      total + (engagement.duration || 0), 0
    );
    
    const correctAnswers = questionAnswers.filter((e: UserEngagement) => 
      e.metadata && e.metadata.isCorrect === true
    ).length;

    return {
      totalViews: videoViews.length,
      totalWatchTime,
      completedVideos: videoCompletes.length,
      averageWatchTime: videoViews.length > 0 ? totalWatchTime / videoViews.length : 0,
      questionsAnswered: questionAnswers.length,
      correctAnswers,
      accuracy: questionAnswers.length > 0 ? (correctAnswers / questionAnswers.length) * 100 : 0,
    };
  }, [myEngagement]);

  return {
    progress,
    isLoading: isLoadingEngagement,
  };
};

/**
 * Convierte rutas de la aplicación en nombres de página legibles
 */
function getPageNameFromPath(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Home',
    '/login': 'Login',
    '/register': 'Register',
    '/dashboard': 'Dashboard',
    '/mundos': 'Mundos',
    '/uplay': 'UPlay',
    '/marketplace': 'Marketplace',
    '/social': 'Social',
    '/ustats': 'UStats',
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/pilgrim-journey': 'Pilgrim Journey',
    '/beta-onboarding': 'Beta Onboarding',
    '/philosophy-quiz': 'Philosophy Quiz',
    '/feedback': 'Feedback Form'
  };

  return routes[pathname] || pathname.replace('/', '').replace(/-/g, ' ') || 'Unknown Page';
}

/**
 * Hook para trackear tiempo en página
 * Útil para medir engagement en contenido educativo
 */
export const usePageTimeTracking = (pageName: string) => {
  const { recordEvent } = useAnalytics();

  useEffect(() => {
    const startTime = Date.now();

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      recordEvent({
        eventType: 'page_time_spent',
        contentType: 'page',
        metadata: {
        page_name: pageName,
        time_spent_seconds: timeSpent
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // También trackear cuando el componente se desmonta
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 5) { // Solo trackear si estuvo más de 5 segundos
        recordEvent({
          eventType: 'page_time_spent',
          contentType: 'page',
          metadata: {
          page_name: pageName,
          time_spent_seconds: timeSpent
          }
        });
      }
    };
  }, [pageName, recordEvent]);
};

/**
 * Hook para trackear interacciones con elementos específicos
 * Útil para entender qué características usan más los beta users
 */
export const useInteractionTracking = () => {
  const { recordEvent } = useAnalytics();

  const trackClick = useCallback((elementName: string, additionalData?: Record<string, any>) => {
    recordEvent({
      eventType: 'element_clicked',
      contentType: 'ui_element',
      metadata: {
      element_name: elementName,
      ...additionalData
      }
    });
  }, [recordEvent]);

  const trackFormSubmission = useCallback((formName: string, success: boolean, errors?: string[]) => {
    recordEvent({
      eventType: 'form_submitted',
      contentType: 'form',
      metadata: {
      form_name: formName,
      submission_success: success,
      errors: errors?.join(', ')
      }
    });
  }, [recordEvent]);

  const trackSearchQuery = useCallback((query: string, resultsCount: number) => {
    recordEvent({
      eventType: 'search_performed',
      contentType: 'search',
      metadata: {
      search_query: query,
      results_count: resultsCount
      }
    });
  }, [recordEvent]);

  return {
    trackClick,
    trackFormSubmission,
    trackSearchQuery
  };
}; 