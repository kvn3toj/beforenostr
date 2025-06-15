import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface PlayerMetrics {
  meritos: number;
  ondas: number;
  level: number;
  experience: number;
  experienceToNext: number;
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  maxStreak: number;
  totalWatchTime: number;
  completedVideos: number;
  precision: number;
  sessionScore: number;
  engagementLevel: number;
}

export interface VideoProgress {
  videoId: string;
  progress: number;
  completed: boolean;
  questionsAnswered: number;
  totalQuestions: number;
  meritsEarned: number;
  ondasEarned: number;
  lastWatched: Date;
  timeSpent: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'meritos' | 'ondas' | 'streak' | 'completion' | 'precision' | 'time';
  requirement: number;
  reward: {
    meritos: number;
    ondas: number;
  };
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export interface UPlaySettings {
  autoPlay: boolean;
  volume: number;
  playbackSpeed: number;
  subtitlesEnabled: boolean;
  notificationsEnabled: boolean;
  analyticsEnabled: boolean;
  horizontalModePreferred: boolean;
  questionsEnabled: boolean;
  gamificationEnabled: boolean;
}

export interface UPlayState {
  // Estado del jugador
  playerMetrics: PlayerMetrics;
  videoProgress: Record<string, VideoProgress>;
  achievements: Achievement[];
  settings: UPlaySettings;
  
  // Estado de sesión actual
  currentVideoId: string | null;
  isPlaying: boolean;
  currentTime: number;
  activeQuestion: any | null;
  showRewardFeedback: boolean;
  
  // Estado de UI
  isLoading: boolean;
  error: string | null;
  notifications: Array<{
    id: string;
    type: 'achievement' | 'reward' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
}

export interface UPlayActions {
  // Acciones de métricas del jugador
  updatePlayerMetrics: (metrics: Partial<PlayerMetrics>) => void;
  addMeritos: (amount: number, reason?: string) => void;
  addOndas: (amount: number, reason?: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  updateLevel: () => void;
  
  // Acciones de progreso de video
  updateVideoProgress: (videoId: string, progress: Partial<VideoProgress>) => void;
  markVideoCompleted: (videoId: string, finalMetrics: Partial<VideoProgress>) => void;
  
  // Acciones de logros
  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => void;
  
  // Acciones de configuración
  updateSettings: (settings: Partial<UPlaySettings>) => void;
  
  // Acciones de sesión
  setCurrentVideo: (videoId: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setActiveQuestion: (question: any) => void;
  showReward: (reward: { meritos: number; ondas: number }) => void;
  hideReward: () => void;
  
  // Acciones de UI
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (notification: Omit<UPlayState['notifications'][0], 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Acciones de reset
  resetSession: () => void;
  resetAllProgress: () => void;
}

// ============================================================================
// ESTADO INICIAL
// ============================================================================

const initialPlayerMetrics: PlayerMetrics = {
  meritos: 0,
  ondas: 0,
  level: 1,
  experience: 0,
  experienceToNext: 100,
  questionsAnswered: 0,
  correctAnswers: 0,
  currentStreak: 0,
  maxStreak: 0,
  totalWatchTime: 0,
  completedVideos: 0,
  precision: 0,
  sessionScore: 0,
  engagementLevel: 0,
};

const initialSettings: UPlaySettings = {
  autoPlay: false,
  volume: 0.8,
  playbackSpeed: 1.0,
  subtitlesEnabled: false,
  notificationsEnabled: true,
  analyticsEnabled: true,
  horizontalModePreferred: false,
  questionsEnabled: true,
  gamificationEnabled: true,
};

const defaultAchievements: Achievement[] = [
  {
    id: 'first-video',
    title: 'Primer Paso',
    description: 'Completa tu primer video en ÜPlay',
    icon: '🎬',
    type: 'completion',
    requirement: 1,
    reward: { meritos: 50, ondas: 25 },
    isUnlocked: false,
  },
  {
    id: 'streak-master',
    title: 'Maestro de Rachas',
    description: 'Consigue una racha de 10 respuestas correctas',
    icon: '🔥',
    type: 'streak',
    requirement: 10,
    reward: { meritos: 100, ondas: 50 },
    isUnlocked: false,
  },
  {
    id: 'merit-collector',
    title: 'Coleccionista de Mëritos',
    description: 'Acumula 1000 Mëritos',
    icon: '💎',
    type: 'meritos',
    requirement: 1000,
    reward: { meritos: 200, ondas: 100 },
    isUnlocked: false,
  },
  {
    id: 'ondas-master',
    title: 'Maestro de Öndas',
    description: 'Genera 500 Öndas positivas',
    icon: '⚡',
    type: 'ondas',
    requirement: 500,
    reward: { meritos: 150, ondas: 200 },
    isUnlocked: false,
  },
  {
    id: 'precision-expert',
    title: 'Experto en Precisión',
    description: 'Mantén 90% de precisión en 20 preguntas',
    icon: '🎯',
    type: 'precision',
    requirement: 90,
    reward: { meritos: 300, ondas: 150 },
    isUnlocked: false,
  },
];

// ============================================================================
// STORE PRINCIPAL
// ============================================================================

export const useUPlayStore = create<UPlayState & UPlayActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Estado inicial
        playerMetrics: initialPlayerMetrics,
        videoProgress: {},
        achievements: defaultAchievements,
        settings: initialSettings,
        currentVideoId: null,
        isPlaying: false,
        currentTime: 0,
        activeQuestion: null,
        showRewardFeedback: false,
        isLoading: false,
        error: null,
        notifications: [],

        // ========================================================================
        // ACCIONES DE MÉTRICAS DEL JUGADOR
        // ========================================================================

        updatePlayerMetrics: (metrics) => {
          set((state) => {
            Object.assign(state.playerMetrics, metrics);
            
            // Recalcular precisión
            if (state.playerMetrics.questionsAnswered > 0) {
              state.playerMetrics.precision = Math.round(
                (state.playerMetrics.correctAnswers / state.playerMetrics.questionsAnswered) * 100
              );
            }
          });
          
          // Verificar logros después de actualizar métricas
          get().checkAchievements();
        },

        addMeritos: (amount, reason) => {
          set((state) => {
            state.playerMetrics.meritos += amount;
            state.playerMetrics.experience += amount;
            
            // Agregar notificación
            if (amount > 0) {
              state.notifications.unshift({
                id: `merit-${Date.now()}`,
                type: 'reward',
                title: 'Mëritos Ganados',
                message: `+${amount} Mëritos${reason ? ` por ${reason}` : ''}`,
                timestamp: new Date(),
                read: false,
              });
            }
          });
          
          get().updateLevel();
          get().checkAchievements();
        },

        addOndas: (amount, reason) => {
          set((state) => {
            state.playerMetrics.ondas += amount;
            
            // Agregar notificación
            if (amount > 0) {
              state.notifications.unshift({
                id: `ondas-${Date.now()}`,
                type: 'reward',
                title: 'Öndas Generadas',
                message: `+${amount} Öndas${reason ? ` por ${reason}` : ''}`,
                timestamp: new Date(),
                read: false,
              });
            }
          });
          
          get().checkAchievements();
        },

        incrementStreak: () => {
          set((state) => {
            state.playerMetrics.currentStreak += 1;
            if (state.playerMetrics.currentStreak > state.playerMetrics.maxStreak) {
              state.playerMetrics.maxStreak = state.playerMetrics.currentStreak;
            }
          });
          
          get().checkAchievements();
        },

        resetStreak: () => {
          set((state) => {
            state.playerMetrics.currentStreak = 0;
          });
        },

        updateLevel: () => {
          set((state) => {
            const { experience, level } = state.playerMetrics;
            const baseExp = 100;
            const expMultiplier = 1.5;
            
            // Calcular nuevo nivel basado en experiencia
            let newLevel = 1;
            let totalExpRequired = 0;
            
            while (totalExpRequired <= experience) {
              totalExpRequired += Math.floor(baseExp * Math.pow(expMultiplier, newLevel - 1));
              if (totalExpRequired <= experience) {
                newLevel++;
              }
            }
            
            if (newLevel > level) {
              // Subida de nivel
              state.playerMetrics.level = newLevel;
              state.playerMetrics.experienceToNext = totalExpRequired - experience;
              
              // Recompensa por subir de nivel
              const levelReward = newLevel * 25;
              state.playerMetrics.meritos += levelReward;
              state.playerMetrics.ondas += Math.floor(levelReward / 2);
              
              // Notificación de subida de nivel
              state.notifications.unshift({
                id: `level-up-${Date.now()}`,
                type: 'achievement',
                title: '¡Nivel Alcanzado!',
                message: `¡Felicidades! Ahora eres nivel ${newLevel}`,
                timestamp: new Date(),
                read: false,
              });
            } else {
              // Actualizar experiencia para siguiente nivel
              const currentLevelExp = Math.floor(baseExp * Math.pow(expMultiplier, level - 1));
              state.playerMetrics.experienceToNext = currentLevelExp - (experience - totalExpRequired + currentLevelExp);
            }
          });
        },

        // ========================================================================
        // ACCIONES DE PROGRESO DE VIDEO
        // ========================================================================

        updateVideoProgress: (videoId, progress) => {
          set((state) => {
            if (!state.videoProgress[videoId]) {
              state.videoProgress[videoId] = {
                videoId,
                progress: 0,
                completed: false,
                questionsAnswered: 0,
                totalQuestions: 0,
                meritsEarned: 0,
                ondasEarned: 0,
                lastWatched: new Date(),
                timeSpent: 0,
              };
            }
            
            Object.assign(state.videoProgress[videoId], progress, {
              lastWatched: new Date(),
            });
          });
        },

        markVideoCompleted: (videoId, finalMetrics) => {
          set((state) => {
            if (state.videoProgress[videoId]) {
              state.videoProgress[videoId].completed = true;
              state.videoProgress[videoId].progress = 100;
              Object.assign(state.videoProgress[videoId], finalMetrics);
            }
            
            state.playerMetrics.completedVideos += 1;
          });
          
          get().checkAchievements();
        },

        // ========================================================================
        // ACCIONES DE LOGROS
        // ========================================================================

        unlockAchievement: (achievementId) => {
          set((state) => {
            const achievement = state.achievements.find(a => a.id === achievementId);
            if (achievement && !achievement.isUnlocked) {
              achievement.isUnlocked = true;
              achievement.unlockedAt = new Date();
              
              // Otorgar recompensa
              state.playerMetrics.meritos += achievement.reward.meritos;
              state.playerMetrics.ondas += achievement.reward.ondas;
              
              // Notificación de logro
              state.notifications.unshift({
                id: `achievement-${achievementId}-${Date.now()}`,
                type: 'achievement',
                title: '🏆 ¡Logro Desbloqueado!',
                message: `${achievement.icon} ${achievement.title}`,
                timestamp: new Date(),
                read: false,
              });
            }
          });
        },

        checkAchievements: () => {
          const state = get();
          const { playerMetrics, videoProgress } = state;
          
          // Verificar cada logro
          state.achievements.forEach(achievement => {
            if (achievement.isUnlocked) return;
            
            let shouldUnlock = false;
            
            switch (achievement.type) {
              case 'completion':
                shouldUnlock = playerMetrics.completedVideos >= achievement.requirement;
                break;
              case 'streak':
                shouldUnlock = playerMetrics.currentStreak >= achievement.requirement;
                break;
              case 'meritos':
                shouldUnlock = playerMetrics.meritos >= achievement.requirement;
                break;
              case 'ondas':
                shouldUnlock = playerMetrics.ondas >= achievement.requirement;
                break;
              case 'precision':
                shouldUnlock = playerMetrics.precision >= achievement.requirement && 
                              playerMetrics.questionsAnswered >= 20;
                break;
            }
            
            if (shouldUnlock) {
              state.unlockAchievement(achievement.id);
            }
          });
        },

        // ========================================================================
        // ACCIONES DE CONFIGURACIÓN
        // ========================================================================

        updateSettings: (newSettings) => {
          set((state) => {
            Object.assign(state.settings, newSettings);
          });
        },

        // ========================================================================
        // ACCIONES DE SESIÓN
        // ========================================================================

        setCurrentVideo: (videoId) => {
          set((state) => {
            state.currentVideoId = videoId;
          });
        },

        setIsPlaying: (isPlaying) => {
          set((state) => {
            state.isPlaying = isPlaying;
          });
        },

        setCurrentTime: (time) => {
          set((state) => {
            state.currentTime = time;
          });
        },

        setActiveQuestion: (question) => {
          set((state) => {
            state.activeQuestion = question;
          });
        },

        showReward: (reward) => {
          set((state) => {
            state.showRewardFeedback = true;
          });
          
          // Auto-hide después de 3 segundos
          setTimeout(() => {
            get().hideReward();
          }, 3000);
        },

        hideReward: () => {
          set((state) => {
            state.showRewardFeedback = false;
          });
        },

        // ========================================================================
        // ACCIONES DE UI
        // ========================================================================

        setLoading: (loading) => {
          set((state) => {
            state.isLoading = loading;
          });
        },

        setError: (error) => {
          set((state) => {
            state.error = error;
          });
        },

        addNotification: (notification) => {
          set((state) => {
            state.notifications.unshift({
              ...notification,
              id: `notification-${Date.now()}`,
              timestamp: new Date(),
            });
            
            // Mantener solo las últimas 50 notificaciones
            if (state.notifications.length > 50) {
              state.notifications = state.notifications.slice(0, 50);
            }
          });
        },

        markNotificationRead: (id) => {
          set((state) => {
            const notification = state.notifications.find(n => n.id === id);
            if (notification) {
              notification.read = true;
            }
          });
        },

        clearNotifications: () => {
          set((state) => {
            state.notifications = [];
          });
        },

        // ========================================================================
        // ACCIONES DE RESET
        // ========================================================================

        resetSession: () => {
          set((state) => {
            state.currentVideoId = null;
            state.isPlaying = false;
            state.currentTime = 0;
            state.activeQuestion = null;
            state.showRewardFeedback = false;
            state.error = null;
          });
        },

        resetAllProgress: () => {
          set((state) => {
            state.playerMetrics = { ...initialPlayerMetrics };
            state.videoProgress = {};
            state.achievements = defaultAchievements.map(a => ({ ...a, isUnlocked: false, unlockedAt: undefined }));
            state.notifications = [];
          });
        },
      })),
      {
        name: 'uplay-store',
        partialize: (state) => ({
          playerMetrics: state.playerMetrics,
          videoProgress: state.videoProgress,
          achievements: state.achievements,
          settings: state.settings,
        }),
      }
    ),
    {
      name: 'UPlay Store',
    }
  )
);

// ============================================================================
// SELECTORES ESPECIALIZADOS
// ============================================================================

export const usePlayerMetrics = () => useUPlayStore(state => state.playerMetrics);
export const useVideoProgress = (videoId?: string) => 
  useUPlayStore(state => videoId ? state.videoProgress[videoId] : state.videoProgress);
export const useAchievements = () => useUPlayStore(state => state.achievements);
export const useUPlaySettings = () => useUPlayStore(state => state.settings);
export const useCurrentSession = () => useUPlayStore(state => ({
  currentVideoId: state.currentVideoId,
  isPlaying: state.isPlaying,
  currentTime: state.currentTime,
  activeQuestion: state.activeQuestion,
}));
export const useNotifications = () => useUPlayStore(state => state.notifications);

// Selectores computados
export const useUnlockedAchievements = () => 
  useUPlayStore(state => state.achievements.filter(a => a.isUnlocked));
export const useUnreadNotifications = () => 
  useUPlayStore(state => state.notifications.filter(n => !n.read));
export const useCompletedVideosCount = () => 
  useUPlayStore(state => Object.values(state.videoProgress).filter(p => p.completed).length); 