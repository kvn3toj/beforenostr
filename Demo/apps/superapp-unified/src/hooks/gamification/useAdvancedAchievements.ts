import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Achievement, 
  PlayerMetrics, 
  LevelProgress,
  validateAchievement,
  validatePlayerMetrics,
  validateLevelProgress
} from '../../types/video-player.schemas';
import { apiService } from '../../lib/api-service';

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================

const ACHIEVEMENT_CONFIG = {
  CHECK_INTERVAL: 5000, // 5 segundos
  NOTIFICATION_DURATION: 5000, // 5 segundos
  MAX_CONCURRENT_NOTIFICATIONS: 3,
  CELEBRATION_DURATION: 3000, // 3 segundos
  AYNI_BONUS_MULTIPLIER: 1.5,
  BIEN_COMUN_THRESHOLD: 0.7, // 70% de contribución al bien común
} as const;

// Definición de logros basados en filosofía CoomÜnity
const COOMUNITY_ACHIEVEMENTS = {
  // Categoría: Aprendizaje (Learning)
  LEARNING: [
    {
      id: 'first_video_complete',
      name: 'Primer Paso en el Camino',
      description: 'Completa tu primer video en ÜPlay',
      icon: '🌱',
      category: 'learning' as const,
      rarity: 'common' as const,
      points: 50,
      ondas: 10,
      requirements: {
        type: 'video_count' as const,
        target: 1,
        timeframe: 'all_time' as const,
      },
    },
    {
      id: 'knowledge_seeker',
      name: 'Buscador de Conocimiento',
      description: 'Completa 10 videos con 80% de precisión',
      icon: '🔍',
      category: 'learning' as const,
      rarity: 'rare' as const,
      points: 200,
      ondas: 50,
      requirements: {
        type: 'custom' as const,
        target: 10,
        timeframe: 'all_time' as const,
      },
    },
    {
      id: 'wisdom_keeper',
      name: 'Guardián de la Sabiduría',
      description: 'Alcanza 95% de precisión en 50 videos',
      icon: '🧠',
      category: 'learning' as const,
      rarity: 'epic' as const,
      points: 500,
      ondas: 150,
      requirements: {
        type: 'custom' as const,
        target: 50,
        timeframe: 'all_time' as const,
      },
    },
  ],

  // Categoría: Ayni (Reciprocidad)
  AYNI: [
    {
      id: 'ayni_balance',
      name: 'Equilibrio Ayni',
      description: 'Mantén un balance perfecto entre dar y recibir',
      icon: '⚖️',
      category: 'ayni' as const,
      rarity: 'rare' as const,
      points: 300,
      ondas: 100,
      requirements: {
        type: 'custom' as const,
        target: 1,
        timeframe: 'weekly' as const,
      },
    },
    {
      id: 'reciprocity_master',
      name: 'Maestro de la Reciprocidad',
      description: 'Practica Ayni durante 30 días consecutivos',
      icon: '🔄',
      category: 'ayni' as const,
      rarity: 'epic' as const,
      points: 750,
      ondas: 250,
      requirements: {
        type: 'custom' as const,
        target: 30,
        timeframe: 'daily' as const,
      },
    },
  ],

  // Categoría: Bien Común
  BIEN_COMUN: [
    {
      id: 'community_contributor',
      name: 'Contribuyente Comunitario',
      description: 'Contribuye al Bien Común de la comunidad',
      icon: '🤝',
      category: 'bien_comun' as const,
      rarity: 'common' as const,
      points: 100,
      ondas: 30,
      requirements: {
        type: 'custom' as const,
        target: 1,
        timeframe: 'all_time' as const,
      },
    },
    {
      id: 'bien_comun_champion',
      name: 'Campeón del Bien Común',
      description: 'Dedica 70% de tu actividad al Bien Común',
      icon: '🏆',
      category: 'bien_comun' as const,
      rarity: 'legendary' as const,
      points: 1000,
      ondas: 500,
      requirements: {
        type: 'custom' as const,
        target: 70,
        timeframe: 'monthly' as const,
      },
    },
  ],

  // Categoría: Engagement
  ENGAGEMENT: [
    {
      id: 'daily_learner',
      name: 'Aprendiz Diario',
      description: 'Aprende algo nuevo cada día durante una semana',
      icon: '📅',
      category: 'engagement' as const,
      rarity: 'common' as const,
      points: 150,
      ondas: 40,
      requirements: {
        type: 'custom' as const,
        target: 7,
        timeframe: 'daily' as const,
      },
    },
    {
      id: 'streak_master',
      name: 'Maestro de la Constancia',
      description: 'Mantén una racha de 30 días de aprendizaje',
      icon: '🔥',
      category: 'engagement' as const,
      rarity: 'epic' as const,
      points: 600,
      ondas: 200,
      requirements: {
        type: 'streak' as const,
        target: 30,
        timeframe: 'daily' as const,
      },
    },
  ],

  // Categoría: Social
  SOCIAL: [
    {
      id: 'knowledge_sharer',
      name: 'Compartidor de Conocimiento',
      description: 'Ayuda a otros miembros de la comunidad',
      icon: '💡',
      category: 'social' as const,
      rarity: 'rare' as const,
      points: 250,
      ondas: 75,
      requirements: {
        type: 'custom' as const,
        target: 5,
        timeframe: 'all_time' as const,
      },
    },
  ],
} as const;

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

interface UseAdvancedAchievementsOptions {
  userId?: string;
  enableAutoCheck?: boolean;
  enableNotifications?: boolean;
  enableCelebrations?: boolean;
  onAchievementUnlocked?: (achievement: Achievement) => void;
  onLevelUp?: (newLevel: number, rewards: any) => void;
  onError?: (error: Error) => void;
}

interface UseAdvancedAchievementsReturn {
  // Estado
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  availableAchievements: Achievement[];
  levelProgress: LevelProgress;
  isLoading: boolean;
  error: Error | null;
  
  // Notificaciones activas
  activeNotifications: AchievementNotification[];
  
  // Funciones de verificación
  checkAchievements: () => Promise<Achievement[]>;
  checkSpecificAchievement: (achievementId: string) => Promise<boolean>;
  
  // Funciones de progreso
  updateProgress: (metrics: Partial<PlayerMetrics>) => Promise<void>;
  calculateLevelProgress: (currentXP: number) => LevelProgress;
  
  // Funciones de notificación
  showAchievementNotification: (achievement: Achievement) => void;
  dismissNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  
  // Funciones de utilidad
  getAchievementsByCategory: (category: Achievement['category']) => Achievement[];
  getAchievementProgress: (achievementId: string) => number;
  getNextLevelRequirements: () => { xpNeeded: number; nextLevel: number };
  
  // Estadísticas
  getAchievementStats: () => {
    totalAchievements: number;
    unlockedCount: number;
    completionRate: number;
    totalPoints: number;
    totalOndas: number;
    rarityBreakdown: Record<Achievement['rarity'], number>;
  };
}

interface AchievementNotification {
  id: string;
  achievement: Achievement;
  timestamp: Date;
  isVisible: boolean;
  celebrationLevel: 'normal' | 'epic' | 'legendary';
}

interface AchievementCheckResult {
  achievementId: string;
  unlocked: boolean;
  progress: number;
  requirements: any;
  currentValue: any;
}

// ============================================================================
// UTILIDADES DE LOGROS
// ============================================================================

const AchievementUtils = {
  // Obtener todos los logros definidos
  getAllAchievements(): Achievement[] {
    const allAchievements: Achievement[] = [];
    
    Object.values(COOMUNITY_ACHIEVEMENTS).forEach(category => {
      category.forEach(achievement => {
        allAchievements.push({
          ...achievement,
          unlockedAt: undefined,
          progress: 0,
        });
      });
    });
    
    return allAchievements;
  },

  // Calcular progreso de un logro específico
  calculateAchievementProgress(
    achievement: Achievement,
    metrics: PlayerMetrics,
    customData?: any
  ): number {
    const { requirements } = achievement;
    
    switch (requirements.type) {
      case 'video_count':
        return Math.min((metrics.videosCompletados / requirements.target) * 100, 100);
      
      case 'correct_answers':
        return Math.min((metrics.preguntasCorrectas / requirements.target) * 100, 100);
      
      case 'streak':
        return Math.min((metrics.rachaActual / requirements.target) * 100, 100);
      
      case 'time_watched':
        const hoursWatched = metrics.tiempoTotalVisto / 3600; // convertir a horas
        return Math.min((hoursWatched / requirements.target) * 100, 100);
      
      case 'custom':
        return AchievementUtils.calculateCustomProgress(achievement, metrics, customData);
      
      default:
        return 0;
    }
  },

  // Calcular progreso para logros personalizados
  calculateCustomProgress(
    achievement: Achievement,
    metrics: PlayerMetrics,
    customData?: any
  ): number {
    switch (achievement.id) {
      case 'knowledge_seeker':
        // 10 videos con 80% de precisión
        const videosWithHighPrecision = customData?.videosWithHighPrecision || 0;
        return Math.min((videosWithHighPrecision / 10) * 100, 100);
      
      case 'wisdom_keeper':
        // 95% de precisión en 50 videos
        const videosWithExcellentPrecision = customData?.videosWithExcellentPrecision || 0;
        return Math.min((videosWithExcellentPrecision / 50) * 100, 100);
      
      case 'ayni_balance':
        // Balance perfecto entre dar y recibir
        const ayniBalance = customData?.ayniBalance || 0;
        return Math.min(ayniBalance * 100, 100);
      
      case 'reciprocity_master':
        // 30 días consecutivos de Ayni
        const consecutiveAyniDays = customData?.consecutiveAyniDays || 0;
        return Math.min((consecutiveAyniDays / 30) * 100, 100);
      
      case 'community_contributor':
        // Contribución al Bien Común
        const communityContributions = customData?.communityContributions || 0;
        return communityContributions > 0 ? 100 : 0;
      
      case 'bien_comun_champion':
        // 70% de actividad dedicada al Bien Común
        const bienComunPercentage = customData?.bienComunPercentage || 0;
        return Math.min((bienComunPercentage / 70) * 100, 100);
      
      case 'daily_learner':
        // 7 días consecutivos de aprendizaje
        const consecutiveLearningDays = customData?.consecutiveLearningDays || 0;
        return Math.min((consecutiveLearningDays / 7) * 100, 100);
      
      case 'knowledge_sharer':
        // Ayudar a 5 miembros de la comunidad
        const helpedMembers = customData?.helpedMembers || 0;
        return Math.min((helpedMembers / 5) * 100, 100);
      
      default:
        return 0;
    }
  },

  // Verificar si un logro debe desbloquearse
  shouldUnlockAchievement(
    achievement: Achievement,
    metrics: PlayerMetrics,
    customData?: any
  ): boolean {
    if (achievement.unlockedAt) return false; // Ya desbloqueado
    
    const progress = AchievementUtils.calculateAchievementProgress(achievement, metrics, customData);
    return progress >= 100;
  },

  // Calcular recompensas con bonificaciones Ayni
  calculateRewards(achievement: Achievement, ayniMultiplier: number = 1): {
    points: number;
    ondas: number;
    ayniBonus: number;
  } {
    const basePoints = achievement.points;
    const baseOndas = achievement.ondas;
    
    const ayniBonus = ayniMultiplier > 1 ? (ayniMultiplier - 1) * basePoints : 0;
    const finalPoints = Math.floor(basePoints * ayniMultiplier);
    const finalOndas = Math.floor(baseOndas * ayniMultiplier);
    
    return {
      points: finalPoints,
      ondas: finalOndas,
      ayniBonus,
    };
  },

  // Determinar nivel de celebración
  getCelebrationLevel(achievement: Achievement): 'normal' | 'epic' | 'legendary' {
    switch (achievement.rarity) {
      case 'legendary':
        return 'legendary';
      case 'epic':
        return 'epic';
      default:
        return 'normal';
    }
  },

  // Generar ID único para notificación
  generateNotificationId(): string {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};

// ============================================================================
// SERVICIOS DE LOGROS
// ============================================================================

const AchievementService = {
  // Obtener logros del usuario
  async getUserAchievements(): Promise<Achievement[]> {
    try {
      const response = await apiService.get('/achievements/user');
      return response.data.map((achievement: any) => validateAchievement(achievement));
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  },

  // Desbloquear logro
  async unlockAchievement(achievementId: string): Promise<Achievement> {
    const response = await apiService.post(`/achievements/${achievementId}/unlock`);
    return validateAchievement(response.data);
  },

  // Obtener progreso de nivel
  async getLevelProgress(): Promise<LevelProgress> {
    const response = await apiService.get('/player/level-progress');
    return validateLevelProgress(response.data);
  },

  // Actualizar progreso de nivel
  async updateLevelProgress(updates: Partial<LevelProgress>): Promise<LevelProgress> {
    const response = await apiService.patch('/player/level-progress', updates);
    return validateLevelProgress(response.data);
  },

  // Obtener datos personalizados para logros
  async getCustomAchievementData(): Promise<any> {
    try {
      const response = await apiService.get('/achievements/custom-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching custom achievement data:', error);
      return {};
    }
  },
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export const useAdvancedAchievements = (
  options: UseAdvancedAchievementsOptions = {}
): UseAdvancedAchievementsReturn => {
  const {
    userId,
    enableAutoCheck = true,
    enableNotifications = true,
    enableCelebrations = true,
    onAchievementUnlocked,
    onLevelUp,
    onError,
  } = options;

  // ============================================================================
  // ESTADO LOCAL
  // ============================================================================

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [levelProgress, setLevelProgress] = useState<LevelProgress>({
    currentLevel: 1,
    currentXP: 0,
    xpForNextLevel: 100,
    totalXP: 0,
    xpMultiplier: 1.0,
    prestigeLevel: 0,
    skillPoints: 0,
    unlockedFeatures: [],
  });
  const [activeNotifications, setActiveNotifications] = useState<AchievementNotification[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Referencias para timers
  const checkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const notificationTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const queryClient = useQueryClient();

  // ============================================================================
  // QUERIES Y MUTACIONES
  // ============================================================================

  const {
    data: userAchievements,
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useQuery({
    queryKey: ['achievements', 'user', userId],
    queryFn: AchievementService.getUserAchievements,
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!userId,
  });

  const {
    data: levelProgressData,
    isLoading: levelLoading,
    error: levelError,
  } = useQuery({
    queryKey: ['level-progress', userId],
    queryFn: AchievementService.getLevelProgress,
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });

  const {
    data: customData,
    isLoading: customDataLoading,
  } = useQuery({
    queryKey: ['achievements', 'custom-data', userId],
    queryFn: AchievementService.getCustomAchievementData,
    staleTime: 2 * 60 * 1000, // 2 minutos
    enabled: !!userId,
  });

  const unlockAchievementMutation = useMutation({
    mutationFn: AchievementService.unlockAchievement,
    onSuccess: (unlockedAchievement) => {
      // Actualizar cache local
      setAchievements(prev => 
        prev.map(achievement => 
          achievement.id === unlockedAchievement.id 
            ? unlockedAchievement 
            : achievement
        )
      );

      // Mostrar notificación
      if (enableNotifications) {
        showAchievementNotification(unlockedAchievement);
      }

      // Callback personalizado
      onAchievementUnlocked?.(unlockedAchievement);

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['achievements'],
      });
      queryClient.invalidateQueries({
        queryKey: ['player-metrics'],
      });
    },
    onError: (error) => {
      handleError(error instanceof Error ? error : new Error('Error unlocking achievement'));
    },
  });

  // ============================================================================
  // FUNCIONES DE UTILIDAD INTERNA
  // ============================================================================

  const handleError = useCallback((error: Error) => {
    setError(error);
    onError?.(error);
    console.error('AdvancedAchievements error:', error);
  }, [onError]);

  // ============================================================================
  // FUNCIONES DE VERIFICACIÓN
  // ============================================================================

  const checkAchievements = useCallback(async (): Promise<Achievement[]> => {
    if (!achievements.length) return [];

    try {
      const playerMetrics = queryClient.getQueryData(['player-metrics']) as PlayerMetrics;
      if (!playerMetrics) return [];

      const newlyUnlocked: Achievement[] = [];
      const updatedAchievements = [...achievements];

      for (let i = 0; i < updatedAchievements.length; i++) {
        const achievement = updatedAchievements[i];
        
        if (!achievement.unlockedAt) {
          const progress = AchievementUtils.calculateAchievementProgress(
            achievement,
            playerMetrics,
            customData
          );

          // Actualizar progreso
          updatedAchievements[i] = { ...achievement, progress };

          // Verificar si debe desbloquearse
          if (AchievementUtils.shouldUnlockAchievement(achievement, playerMetrics, customData)) {
            try {
              const unlockedAchievement = await unlockAchievementMutation.mutateAsync(achievement.id);
              updatedAchievements[i] = unlockedAchievement;
              newlyUnlocked.push(unlockedAchievement);
            } catch (error) {
              console.error(`Error unlocking achievement ${achievement.id}:`, error);
            }
          }
        }
      }

      setAchievements(updatedAchievements);
      return newlyUnlocked;
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Error checking achievements'));
      return [];
    }
  }, [achievements, customData, queryClient, unlockAchievementMutation, handleError]);

  const checkSpecificAchievement = useCallback(async (achievementId: string): Promise<boolean> => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlockedAt) return false;

    try {
      const playerMetrics = queryClient.getQueryData(['player-metrics']) as PlayerMetrics;
      if (!playerMetrics) return false;

      const shouldUnlock = AchievementUtils.shouldUnlockAchievement(
        achievement,
        playerMetrics,
        customData
      );

      if (shouldUnlock) {
        await unlockAchievementMutation.mutateAsync(achievementId);
        return true;
      }

      return false;
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Error checking specific achievement'));
      return false;
    }
  }, [achievements, customData, queryClient, unlockAchievementMutation, handleError]);

  // ============================================================================
  // FUNCIONES DE PROGRESO
  // ============================================================================

  const updateProgress = useCallback(async (metrics: Partial<PlayerMetrics>): Promise<void> => {
    try {
      // Actualizar métricas en cache
      const currentMetrics = queryClient.getQueryData(['player-metrics']) as PlayerMetrics;
      if (currentMetrics) {
        const updatedMetrics = { ...currentMetrics, ...metrics };
        queryClient.setQueryData(['player-metrics'], updatedMetrics);
      }

      // Verificar logros automáticamente si está habilitado
      if (enableAutoCheck) {
        await checkAchievements();
      }
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Error updating progress'));
    }
  }, [queryClient, enableAutoCheck, checkAchievements, handleError]);

  const calculateLevelProgress = useCallback((currentXP: number): LevelProgress => {
    // Fórmula de progresión exponencial suave
    const baseXP = 100;
    const growthFactor = 1.2;
    
    let level = 1;
    let totalXPForLevel = 0;
    let xpForCurrentLevel = baseXP;
    
    // Encontrar el nivel actual
    while (totalXPForLevel + xpForCurrentLevel <= currentXP) {
      totalXPForLevel += xpForCurrentLevel;
      level++;
      xpForCurrentLevel = Math.floor(baseXP * Math.pow(growthFactor, level - 1));
    }
    
    const currentLevelXP = currentXP - totalXPForLevel;
    const xpForNextLevel = xpForCurrentLevel - currentLevelXP;
    
    return {
      currentLevel: level,
      currentXP: currentLevelXP,
      xpForNextLevel,
      totalXP: currentXP,
      xpMultiplier: 1.0 + (level - 1) * 0.1, // 10% por nivel
      prestigeLevel: Math.floor(level / 100), // Prestigio cada 100 niveles
      skillPoints: Math.floor(level / 10), // 1 punto de habilidad cada 10 niveles
      unlockedFeatures: [], // Se llenarían según el nivel
    };
  }, []);

  // ============================================================================
  // FUNCIONES DE NOTIFICACIÓN
  // ============================================================================

  const showAchievementNotification = useCallback((achievement: Achievement) => {
    if (!enableNotifications) return;

    const notificationId = AchievementUtils.generateNotificationId();
    const celebrationLevel = AchievementUtils.getCelebrationLevel(achievement);

    const notification: AchievementNotification = {
      id: notificationId,
      achievement,
      timestamp: new Date(),
      isVisible: true,
      celebrationLevel,
    };

    setActiveNotifications(prev => {
      // Limitar número de notificaciones concurrentes
      const filtered = prev.slice(-(ACHIEVEMENT_CONFIG.MAX_CONCURRENT_NOTIFICATIONS - 1));
      return [...filtered, notification];
    });

    // Programar auto-dismiss
    const timer = setTimeout(() => {
      dismissNotification(notificationId);
    }, ACHIEVEMENT_CONFIG.NOTIFICATION_DURATION);

    notificationTimersRef.current.set(notificationId, timer);
  }, [enableNotifications]);

  const dismissNotification = useCallback((notificationId: string) => {
    setActiveNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );

    // Limpiar timer
    const timer = notificationTimersRef.current.get(notificationId);
    if (timer) {
      clearTimeout(timer);
      notificationTimersRef.current.delete(notificationId);
    }
  }, []);

  const clearAllNotifications = useCallback(() => {
    setActiveNotifications([]);
    
    // Limpiar todos los timers
    notificationTimersRef.current.forEach(timer => clearTimeout(timer));
    notificationTimersRef.current.clear();
  }, []);

  // ============================================================================
  // FUNCIONES DE UTILIDAD
  // ============================================================================

  const getAchievementsByCategory = useCallback((category: Achievement['category']): Achievement[] => {
    return achievements.filter(achievement => achievement.category === category);
  }, [achievements]);

  const getAchievementProgress = useCallback((achievementId: string): number => {
    const achievement = achievements.find(a => a.id === achievementId);
    return achievement?.progress || 0;
  }, [achievements]);

  const getNextLevelRequirements = useCallback(() => {
    const nextLevel = levelProgress.currentLevel + 1;
    const xpNeeded = levelProgress.xpForNextLevel;
    
    return { xpNeeded, nextLevel };
  }, [levelProgress]);

  const getAchievementStats = useCallback(() => {
    const totalAchievements = achievements.length;
    const unlockedCount = achievements.filter(a => a.unlockedAt).length;
    const completionRate = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;
    
    const unlockedAchievements = achievements.filter(a => a.unlockedAt);
    const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
    const totalOndas = unlockedAchievements.reduce((sum, a) => sum + a.ondas, 0);
    
    const rarityBreakdown = achievements.reduce((acc, achievement) => {
      if (achievement.unlockedAt) {
        acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1;
      }
      return acc;
    }, {} as Record<Achievement['rarity'], number>);

    return {
      totalAchievements,
      unlockedCount,
      completionRate,
      totalPoints,
      totalOndas,
      rarityBreakdown,
    };
  }, [achievements]);

  // ============================================================================
  // EFECTOS
  // ============================================================================

  // Inicializar logros
  useEffect(() => {
    if (userAchievements) {
      const allAchievements = AchievementUtils.getAllAchievements();
      
      // Combinar logros del servidor con definiciones locales
      const combinedAchievements = allAchievements.map(localAchievement => {
        const serverAchievement = userAchievements.find(a => a.id === localAchievement.id);
        return serverAchievement || localAchievement;
      });
      
      setAchievements(combinedAchievements);
    }
  }, [userAchievements]);

  // Actualizar progreso de nivel
  useEffect(() => {
    if (levelProgressData) {
      setLevelProgress(levelProgressData);
    }
  }, [levelProgressData]);

  // Auto-verificación periódica
  useEffect(() => {
    if (!enableAutoCheck) return;

    checkTimerRef.current = setInterval(() => {
      checkAchievements();
    }, ACHIEVEMENT_CONFIG.CHECK_INTERVAL);

    return () => {
      if (checkTimerRef.current) {
        clearInterval(checkTimerRef.current);
      }
    };
  }, [enableAutoCheck, checkAchievements]);

  // Manejo de errores
  useEffect(() => {
    if (achievementsError || levelError) {
      const error = achievementsError || levelError;
      handleError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }, [achievementsError, levelError, handleError]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (checkTimerRef.current) {
        clearInterval(checkTimerRef.current);
      }
      
      notificationTimersRef.current.forEach(timer => clearTimeout(timer));
      notificationTimersRef.current.clear();
    };
  }, []);

  // ============================================================================
  // VALORES DERIVADOS
  // ============================================================================

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const availableAchievements = achievements.filter(a => !a.unlockedAt);
  const isLoading = achievementsLoading || levelLoading || customDataLoading;

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Estado
    achievements,
    unlockedAchievements,
    availableAchievements,
    levelProgress,
    isLoading,
    error,
    
    // Notificaciones activas
    activeNotifications,
    
    // Funciones de verificación
    checkAchievements,
    checkSpecificAchievement,
    
    // Funciones de progreso
    updateProgress,
    calculateLevelProgress,
    
    // Funciones de notificación
    showAchievementNotification,
    dismissNotification,
    clearAllNotifications,
    
    // Funciones de utilidad
    getAchievementsByCategory,
    getAchievementProgress,
    getNextLevelRequirements,
    
    // Estadísticas
    getAchievementStats,
  };
}; 