import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  VideoEvent, 
  EngagementMetrics, 
  AnalyticsBatch,
  validateEngagementMetrics,
  createEngagementMetrics
} from '../../types/video-player.schemas';
import { apiService } from '../../lib/api-service';

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================

const ANALYTICS_CONFIG = {
  BATCH_SIZE: 10, // Número máximo de eventos por batch
  BATCH_INTERVAL: 30000, // 30 segundos
  FLUSH_ON_UNLOAD: true,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  DEBOUNCE_DELAY: 500, // Para eventos frecuentes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
} as const;

const EVENT_PRIORITIES = {
  HIGH: ['video_complete', 'achievement_unlocked', 'error_occurred'],
  MEDIUM: ['question_answered', 'question_skipped', 'reward_earned'],
  LOW: ['video_pause', 'video_resume', 'video_seek'],
} as const;

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

interface VideoAnalyticsOptions {
  videoId: string;
  userId?: string;
  enableBatching?: boolean;
  enableRealTimeEvents?: boolean;
  sessionTimeout?: number;
  onError?: (error: Error) => void;
  onBatchSent?: (batch: AnalyticsBatch) => void;
}

interface VideoAnalyticsReturn {
  // Estado
  sessionId: string;
  isTracking: boolean;
  metrics: EngagementMetrics;
  pendingEvents: number;
  
  // Funciones de tracking
  trackEvent: (eventType: VideoEvent['eventType'], metadata?: Record<string, any>) => void;
  trackVideoStart: () => void;
  trackVideoPause: () => void;
  trackVideoResume: () => void;
  trackVideoSeek: (fromTime: number, toTime: number) => void;
  trackVideoComplete: () => void;
  trackQuestionShown: (questionId: string, timestamp: number) => void;
  trackQuestionAnswered: (questionId: string, selectedOption: string, isCorrect: boolean, timeSpent: number) => void;
  trackQuestionSkipped: (questionId: string, timestamp: number) => void;
  trackQuestionTimeout: (questionId: string, timestamp: number) => void;
  trackRewardEarned: (rewardType: string, amount: number, multipliers?: Record<string, number>) => void;
  trackAchievementUnlocked: (achievementId: string, achievementName: string) => void;
  trackError: (errorType: string, errorMessage: string, context?: Record<string, any>) => void;
  
  // Funciones de métricas
  updateEngagementMetrics: (updates: Partial<EngagementMetrics>) => void;
  calculateEngagementRate: () => number;
  calculateCompletionRate: () => number;
  getAverageResponseTime: () => number;
  
  // Funciones de control
  startSession: () => void;
  endSession: () => void;
  flushEvents: () => Promise<boolean>;
  clearPendingEvents: () => void;
  
  // Funciones de utilidad
  getSessionStats: () => {
    duration: number;
    eventsCount: number;
    lastActivity: Date;
    engagementScore: number;
  };
}

interface SessionData {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  events: VideoEvent[];
  metrics: EngagementMetrics;
}

// ============================================================================
// UTILIDADES DE ANALYTICS
// ============================================================================

const AnalyticsUtils = {
  // Generar ID de sesión único
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Obtener información del dispositivo
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
    };
  },

  // Calcular engagement rate
  calculateEngagementRate(watchTime: number, totalDuration: number): number {
    if (totalDuration <= 0) return 0;
    return Math.min(watchTime / totalDuration, 1);
  },

  // Calcular completion rate
  calculateCompletionRate(currentTime: number, totalDuration: number): number {
    if (totalDuration <= 0) return 0;
    return Math.min(currentTime / totalDuration, 1);
  },

  // Determinar prioridad del evento
  getEventPriority(eventType: VideoEvent['eventType']): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (EVENT_PRIORITIES.HIGH.includes(eventType)) return 'HIGH';
    if (EVENT_PRIORITIES.MEDIUM.includes(eventType)) return 'MEDIUM';
    return 'LOW';
  },

  // Validar y limpiar metadata
  sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(metadata)) {
      // Filtrar valores undefined, null, o funciones
      if (value !== undefined && value !== null && typeof value !== 'function') {
        // Truncar strings muy largos
        if (typeof value === 'string' && value.length > 1000) {
          sanitized[key] = value.substring(0, 1000) + '...';
        } else {
          sanitized[key] = value;
        }
      }
    }
    
    return sanitized;
  },
};

// ============================================================================
// SERVICIOS DE ANALYTICS
// ============================================================================

const AnalyticsService = {
  // Enviar batch de eventos
  async sendBatch(batch: AnalyticsBatch): Promise<boolean> {
    try {
      await apiService.post('/analytics/video-events', batch);
      return true;
    } catch (error) {
      console.error('Error sending analytics batch:', error);
      return false;
    }
  },

  // Enviar evento individual (para eventos de alta prioridad)
  async sendEvent(event: VideoEvent): Promise<boolean> {
    try {
      await apiService.post('/analytics/video-event', event);
      return true;
    } catch (error) {
      console.error('Error sending analytics event:', error);
      return false;
    }
  },

  // Enviar métricas de engagement
  async sendEngagementMetrics(metrics: EngagementMetrics): Promise<boolean> {
    try {
      await apiService.post('/analytics/engagement-metrics', metrics);
      return true;
    } catch (error) {
      console.error('Error sending engagement metrics:', error);
      return false;
    }
  },
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useVideoAnalytics = (options: VideoAnalyticsOptions): VideoAnalyticsReturn => {
  const {
    videoId,
    userId,
    enableBatching = true,
    enableRealTimeEvents = false,
    sessionTimeout = ANALYTICS_CONFIG.SESSION_TIMEOUT,
    onError,
    onBatchSent,
  } = options;

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [pendingEvents, setPendingEvents] = useState(0);

  // Referencias para timers y debouncing
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastEventTimeRef = useRef<Date>(new Date());

  // ============================================================================
  // FUNCIONES DE UTILIDAD INTERNA
  // ============================================================================

  const handleError = useCallback((error: Error) => {
    console.error('VideoAnalytics error:', error);
    onError?.(error);
  }, [onError]);

  const createNewSession = useCallback((): SessionData => {
    const sessionId = AnalyticsUtils.generateSessionId();
    const now = new Date();
    
    return {
      sessionId,
      startTime: now,
      lastActivity: now,
      events: [],
      metrics: createEngagementMetrics(sessionId, videoId),
    };
  }, [videoId]);

  // ============================================================================
  // FUNCIONES DE GESTIÓN DE SESIÓN
  // ============================================================================

  const startSession = useCallback(() => {
    const newSession = createNewSession();
    setSessionData(newSession);
    setIsTracking(true);

    // Configurar timer de timeout de sesión
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
    }

    sessionTimerRef.current = setTimeout(() => {
      endSession();
    }, sessionTimeout);

    console.log(`Analytics session started: ${newSession.sessionId}`);
  }, [createNewSession, sessionTimeout]);

  const endSession = useCallback(async () => {
    if (!sessionData) return;

    setIsTracking(false);

    // Limpiar timers
    if (batchTimerRef.current) {
      clearTimeout(batchTimerRef.current);
    }
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
    }

    // Enviar eventos pendientes
    await flushEvents();

    // Enviar métricas finales
    try {
      const finalMetrics = {
        ...sessionData.metrics,
        endTime: new Date(),
      };
      await AnalyticsService.sendEngagementMetrics(finalMetrics);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Error sending final metrics'));
    }

    console.log(`Analytics session ended: ${sessionData.sessionId}`);
    setSessionData(null);
  }, [sessionData]);

  // ============================================================================
  // FUNCIONES DE TRACKING DE EVENTOS
  // ============================================================================

  const addEvent = useCallback((
    eventType: VideoEvent['eventType'],
    metadata: Record<string, any> = {}
  ) => {
    if (!sessionData || !isTracking) return;

    const now = new Date();
    const sanitizedMetadata = AnalyticsUtils.sanitizeMetadata(metadata);

    const event: VideoEvent = {
      eventType,
      videoId,
      timestamp: now,
      currentTime: metadata.currentTime || 0,
      metadata: sanitizedMetadata,
    };

    // Actualizar sesión
    setSessionData(prev => {
      if (!prev) return prev;

      const updatedEvents = [...prev.events, event];
      const updatedMetrics = {
        ...prev.metrics,
        interactionCount: prev.metrics.interactionCount + 1,
      };

      return {
        ...prev,
        events: updatedEvents,
        lastActivity: now,
        metrics: updatedMetrics,
      };
    });

    setPendingEvents(prev => prev + 1);
    lastEventTimeRef.current = now;

    // Enviar inmediatamente si es evento de alta prioridad y real-time está habilitado
    if (enableRealTimeEvents && AnalyticsUtils.getEventPriority(eventType) === 'HIGH') {
      AnalyticsService.sendEvent(event).catch(handleError);
    }

    // Programar batch si está habilitado
    if (enableBatching) {
      scheduleBatchSend();
    }

    // Resetear timer de sesión
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = setTimeout(endSession, sessionTimeout);
    }
  }, [sessionData, isTracking, videoId, enableRealTimeEvents, enableBatching, sessionTimeout, endSession, handleError]);

  const trackEvent = useCallback((
    eventType: VideoEvent['eventType'],
    metadata: Record<string, any> = {}
  ) => {
    // Debounce para eventos frecuentes
    if (EVENT_PRIORITIES.LOW.includes(eventType)) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        addEvent(eventType, metadata);
      }, ANALYTICS_CONFIG.DEBOUNCE_DELAY);
    } else {
      addEvent(eventType, metadata);
    }
  }, [addEvent]);

  // ============================================================================
  // FUNCIONES ESPECÍFICAS DE TRACKING
  // ============================================================================

  const trackVideoStart = useCallback(() => {
    trackEvent('video_start', { currentTime: 0 });
  }, [trackEvent]);

  const trackVideoPause = useCallback(() => {
    trackEvent('video_pause');
    updateEngagementMetrics({ pauseCount: (sessionData?.metrics.pauseCount || 0) + 1 });
  }, [trackEvent, sessionData]);

  const trackVideoResume = useCallback(() => {
    trackEvent('video_resume');
  }, [trackEvent]);

  const trackVideoSeek = useCallback((fromTime: number, toTime: number) => {
    trackEvent('video_seek', { fromTime, toTime, seekDistance: Math.abs(toTime - fromTime) });
    updateEngagementMetrics({ seekCount: (sessionData?.metrics.seekCount || 0) + 1 });
  }, [trackEvent, sessionData]);

  const trackVideoComplete = useCallback(() => {
    trackEvent('video_complete');
    updateEngagementMetrics({ completionRate: 1.0 });
  }, [trackEvent]);

  const trackQuestionShown = useCallback((questionId: string, timestamp: number) => {
    trackEvent('question_shown', { questionId, timestamp });
  }, [trackEvent]);

  const trackQuestionAnswered = useCallback((
    questionId: string,
    selectedOption: string,
    isCorrect: boolean,
    timeSpent: number
  ) => {
    trackEvent('question_answered', {
      questionId,
      selectedOption,
      isCorrect,
      timeSpent,
    });

    const currentMetrics = sessionData?.metrics;
    if (currentMetrics) {
      const newQuestionsAttempted = currentMetrics.questionsAttempted + 1;
      const newQuestionsCorrect = currentMetrics.questionsCorrect + (isCorrect ? 1 : 0);
      const totalResponseTime = (currentMetrics.averageResponseTime * currentMetrics.questionsAttempted) + timeSpent;
      const newAverageResponseTime = totalResponseTime / newQuestionsAttempted;

      updateEngagementMetrics({
        questionsAttempted: newQuestionsAttempted,
        questionsCorrect: newQuestionsCorrect,
        averageResponseTime: newAverageResponseTime,
      });
    }
  }, [trackEvent, sessionData]);

  const trackQuestionSkipped = useCallback((questionId: string, timestamp: number) => {
    trackEvent('question_skipped', { questionId, timestamp });
  }, [trackEvent]);

  const trackQuestionTimeout = useCallback((questionId: string, timestamp: number) => {
    trackEvent('question_timeout', { questionId, timestamp });
  }, [trackEvent]);

  const trackRewardEarned = useCallback((
    rewardType: string,
    amount: number,
    multipliers: Record<string, number> = {}
  ) => {
    trackEvent('reward_earned', {
      rewardType,
      amount,
      multipliers,
    });
  }, [trackEvent]);

  const trackAchievementUnlocked = useCallback((achievementId: string, achievementName: string) => {
    trackEvent('achievement_unlocked', {
      achievementId,
      achievementName,
    });
  }, [trackEvent]);

  const trackError = useCallback((
    errorType: string,
    errorMessage: string,
    context: Record<string, any> = {}
  ) => {
    trackEvent('error_occurred', {
      errorType,
      errorMessage,
      context,
    });
  }, [trackEvent]);

  // ============================================================================
  // FUNCIONES DE MÉTRICAS
  // ============================================================================

  const updateEngagementMetrics = useCallback((updates: Partial<EngagementMetrics>) => {
    if (!sessionData) return;

    setSessionData(prev => {
      if (!prev) return prev;

      try {
        const updatedMetrics = validateEngagementMetrics({
          ...prev.metrics,
          ...updates,
        });

        return {
          ...prev,
          metrics: updatedMetrics,
        };
      } catch (error) {
        handleError(error instanceof Error ? error : new Error('Error updating metrics'));
        return prev;
      }
    });
  }, [sessionData, handleError]);

  const calculateEngagementRate = useCallback((): number => {
    if (!sessionData?.metrics) return 0;
    return sessionData.metrics.engagementRate;
  }, [sessionData]);

  const calculateCompletionRate = useCallback((): number => {
    if (!sessionData?.metrics) return 0;
    return sessionData.metrics.completionRate;
  }, [sessionData]);

  const getAverageResponseTime = useCallback((): number => {
    if (!sessionData?.metrics) return 0;
    return sessionData.metrics.averageResponseTime;
  }, [sessionData]);

  // ============================================================================
  // FUNCIONES DE BATCH PROCESSING
  // ============================================================================

  const scheduleBatchSend = useCallback(() => {
    if (!enableBatching || !sessionData) return;

    // Si ya hay un timer programado, no crear otro
    if (batchTimerRef.current) return;

    // Si hay suficientes eventos, enviar inmediatamente
    if (sessionData.events.length >= ANALYTICS_CONFIG.BATCH_SIZE) {
      flushEvents();
      return;
    }

    // Programar envío
    batchTimerRef.current = setTimeout(() => {
      flushEvents();
    }, ANALYTICS_CONFIG.BATCH_INTERVAL);
  }, [enableBatching, sessionData]);

  const flushEvents = useCallback(async (): Promise<boolean> => {
    if (!sessionData || sessionData.events.length === 0) return true;

    // Limpiar timer
    if (batchTimerRef.current) {
      clearTimeout(batchTimerRef.current);
      batchTimerRef.current = null;
    }

    try {
      const batch: AnalyticsBatch = {
        sessionId: sessionData.sessionId,
        events: [...sessionData.events],
        metrics: sessionData.metrics,
        deviceInfo: AnalyticsUtils.getDeviceInfo(),
        timestamp: new Date(),
      };

      const success = await AnalyticsService.sendBatch(batch);

      if (success) {
        // Limpiar eventos enviados
        setSessionData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            events: [],
          };
        });

        setPendingEvents(0);
        onBatchSent?.(batch);
        
        console.log(`Analytics batch sent: ${batch.events.length} events`);
      }

      return success;
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Error flushing events'));
      return false;
    }
  }, [sessionData, onBatchSent, handleError]);

  const clearPendingEvents = useCallback(() => {
    if (!sessionData) return;

    setSessionData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        events: [],
      };
    });

    setPendingEvents(0);

    if (batchTimerRef.current) {
      clearTimeout(batchTimerRef.current);
      batchTimerRef.current = null;
    }
  }, [sessionData]);

  // ============================================================================
  // FUNCIONES DE UTILIDAD
  // ============================================================================

  const getSessionStats = useCallback(() => {
    if (!sessionData) {
      return {
        duration: 0,
        eventsCount: 0,
        lastActivity: new Date(),
        engagementScore: 0,
      };
    }

    const duration = Date.now() - sessionData.startTime.getTime();
    const engagementScore = Math.min(
      (sessionData.metrics.engagementRate * 0.4) +
      (sessionData.metrics.completionRate * 0.3) +
      (Math.min(sessionData.metrics.questionsCorrect / Math.max(sessionData.metrics.questionsAttempted, 1), 1) * 0.3),
      1
    );

    return {
      duration,
      eventsCount: sessionData.events.length,
      lastActivity: sessionData.lastActivity,
      engagementScore,
    };
  }, [sessionData]);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  // Auto-iniciar sesión
  useEffect(() => {
    if (videoId && !sessionData) {
      startSession();
    }
  }, [videoId, sessionData, startSession]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Enviar eventos pendientes antes de desmontar
      if (sessionData && sessionData.events.length > 0) {
        flushEvents();
      }
    };
  }, [sessionData, flushEvents]);

  // Flush automático al cerrar/recargar página
  useEffect(() => {
    if (!ANALYTICS_CONFIG.FLUSH_ON_UNLOAD) return;

    const handleBeforeUnload = () => {
      if (sessionData && sessionData.events.length > 0) {
        // Usar sendBeacon para envío confiable al cerrar
        const batch: AnalyticsBatch = {
          sessionId: sessionData.sessionId,
          events: sessionData.events,
          metrics: sessionData.metrics,
          deviceInfo: AnalyticsUtils.getDeviceInfo(),
          timestamp: new Date(),
        };

        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            '/api/analytics/video-events',
            JSON.stringify(batch)
          );
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionData]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Estado
    sessionId: sessionData?.sessionId || '',
    isTracking,
    metrics: sessionData?.metrics || createEngagementMetrics('', videoId),
    pendingEvents,
    
    // Funciones de tracking
    trackEvent,
    trackVideoStart,
    trackVideoPause,
    trackVideoResume,
    trackVideoSeek,
    trackVideoComplete,
    trackQuestionShown,
    trackQuestionAnswered,
    trackQuestionSkipped,
    trackQuestionTimeout,
    trackRewardEarned,
    trackAchievementUnlocked,
    trackError,
    
    // Funciones de métricas
    updateEngagementMetrics,
    calculateEngagementRate,
    calculateCompletionRate,
    getAverageResponseTime,
    
    // Funciones de control
    startSession,
    endSession,
    flushEvents,
    clearPendingEvents,
    
    // Funciones de utilidad
    getSessionStats,
  };
}; 