import { z } from 'zod';

// ============================================================================
// ESQUEMAS BASE DEL VIDEO PLAYER
// ============================================================================

export const QuestionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  timestamp: z.number().min(0),
  question: z.string(),
  options: z.array(QuestionOptionSchema).min(2).max(6),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  timeLimit: z.number().min(5).max(60).default(15),
  points: z.number().min(1).default(10),
  category: z.string().optional(),
  explanation: z.string().optional(),
});

export const VideoDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  url: z.string().url(),
  thumbnail: z.string().optional(),
  duration: z.number().min(0),
  questions: z.array(QuestionSchema).default([]),
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  tags: z.array(z.string()).default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// ============================================================================
// ESQUEMAS DE MÉTRICAS Y GAMIFICACIÓN
// ============================================================================

export const PlayerMetricsSchema = z.object({
  meritos: z.number().min(0).default(0),
  ondas: z.number().min(0).default(0),
  nivel: z.number().min(1).default(1),
  experiencia: z.number().min(0).default(0),
  experienciaParaSiguienteNivel: z.number().min(0).default(100),
  precision: z.number().min(0).max(100).default(0),
  preguntasCorrectas: z.number().min(0).default(0),
  preguntasTotales: z.number().min(0).default(0),
  mejorRacha: z.number().min(0).default(0),
  rachaActual: z.number().min(0).default(0),
  tiempoTotalVisto: z.number().min(0).default(0), // en segundos
  videosCompletados: z.number().min(0).default(0),
  logrosDesbloqueados: z.array(z.string()).default([]),
});

export const RewardCalculationSchema = z.object({
  basePoints: z.number().min(0),
  speedMultiplier: z.number().min(0.1).max(3.0).default(1.0),
  difficultyMultiplier: z.number().min(0.5).max(2.0).default(1.0),
  levelMultiplier: z.number().min(1.0).max(5.0).default(1.0),
  streakMultiplier: z.number().min(1.0).max(3.0).default(1.0),
  reciprocidadBonus: z.number().min(0).default(0),
  finalPoints: z.number().min(0),
  ondas: z.number().min(0).default(0),
});

// ============================================================================
// ESQUEMAS DE PERSISTENCIA LOCAL
// ============================================================================

export const VideoProgressSchema = z.object({
  videoId: z.string(),
  currentTime: z.number().min(0).default(0),
  duration: z.number().min(0).default(0),
  completed: z.boolean().default(false),
  questionsAnswered: z.array(z.object({
    questionId: z.string(),
    selectedOption: z.string(),
    isCorrect: z.boolean(),
    timeSpent: z.number().min(0),
    timestamp: z.date(),
  })).default([]),
  lastWatched: z.date(),
  watchCount: z.number().min(0).default(1),
});

export const UserPreferencesSchema = z.object({
  volume: z.number().min(0).max(1).default(0.8),
  playbackSpeed: z.number().min(0.25).max(3.0).default(1.0),
  autoplay: z.boolean().default(true),
  showSubtitles: z.boolean().default(false),
  preferredQuality: z.enum(['auto', '240p', '360p', '480p', '720p', '1080p']).default('auto'),
  keyboardShortcuts: z.boolean().default(true),
  reducedMotion: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  language: z.string().default('es'),
});

export const LocalStorageDataSchema = z.object({
  userId: z.string().optional(),
  playerMetrics: PlayerMetricsSchema,
  videoProgress: z.array(VideoProgressSchema).default([]),
  userPreferences: UserPreferencesSchema,
  lastSync: z.date().optional(),
  version: z.string().default('1.0.0'),
});

// ============================================================================
// ESQUEMAS DE ANALYTICS Y ENGAGEMENT
// ============================================================================

export const VideoEventSchema = z.object({
  eventType: z.enum([
    'video_start',
    'video_pause',
    'video_resume',
    'video_seek',
    'video_complete',
    'question_shown',
    'question_answered',
    'question_skipped',
    'question_timeout',
    'reward_earned',
    'achievement_unlocked',
    'error_occurred'
  ]),
  videoId: z.string(),
  timestamp: z.date(),
  currentTime: z.number().min(0),
  metadata: z.record(z.any()).optional(),
});

export const EngagementMetricsSchema = z.object({
  sessionId: z.string(),
  userId: z.string().optional(),
  videoId: z.string(),
  startTime: z.date(),
  endTime: z.date().optional(),
  totalWatchTime: z.number().min(0).default(0),
  engagementRate: z.number().min(0).max(1).default(0), // tiempo visto / duración total
  interactionCount: z.number().min(0).default(0),
  questionsAttempted: z.number().min(0).default(0),
  questionsCorrect: z.number().min(0).default(0),
  averageResponseTime: z.number().min(0).default(0),
  pauseCount: z.number().min(0).default(0),
  seekCount: z.number().min(0).default(0),
  replayCount: z.number().min(0).default(0),
  dropoffPoint: z.number().min(0).optional(), // punto donde el usuario dejó de ver
  completionRate: z.number().min(0).max(1).default(0),
  satisfactionScore: z.number().min(1).max(5).optional(),
});

export const AnalyticsBatchSchema = z.object({
  sessionId: z.string(),
  events: z.array(VideoEventSchema),
  metrics: EngagementMetricsSchema,
  deviceInfo: z.object({
    userAgent: z.string(),
    screenResolution: z.string(),
    viewport: z.string(),
    connection: z.string().optional(),
  }).optional(),
  timestamp: z.date(),
});

// ============================================================================
// ESQUEMAS DE LOGROS Y PROGRESIÓN
// ============================================================================

export const AchievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  category: z.enum(['learning', 'engagement', 'social', 'reciprocidad', 'bien_comun']),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary']).default('common'),
  points: z.number().min(0),
  ondas: z.number().min(0).default(0),
  requirements: z.object({
    type: z.enum(['video_count', 'correct_answers', 'streak', 'time_watched', 'custom']),
    target: z.number().min(0),
    timeframe: z.enum(['daily', 'weekly', 'monthly', 'all_time']).optional(),
  }),
  unlockedAt: z.date().optional(),
  progress: z.number().min(0).max(100).default(0),
});

export const LevelProgressSchema = z.object({
  currentLevel: z.number().min(1).default(1),
  currentXP: z.number().min(0).default(0),
  xpForNextLevel: z.number().min(0).default(100),
  totalXP: z.number().min(0).default(0),
  xpMultiplier: z.number().min(1.0).default(1.0),
  prestigeLevel: z.number().min(0).default(0),
  skillPoints: z.number().min(0).default(0),
  unlockedFeatures: z.array(z.string()).default([]),
});

// ============================================================================
// TIPOS TYPESCRIPT DERIVADOS
// ============================================================================

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type VideoData = z.infer<typeof VideoDataSchema>;
export type PlayerMetrics = z.infer<typeof PlayerMetricsSchema>;
export type RewardCalculation = z.infer<typeof RewardCalculationSchema>;
export type VideoProgress = z.infer<typeof VideoProgressSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type LocalStorageData = z.infer<typeof LocalStorageDataSchema>;
export type VideoEvent = z.infer<typeof VideoEventSchema>;
export type EngagementMetrics = z.infer<typeof EngagementMetricsSchema>;
export type AnalyticsBatch = z.infer<typeof AnalyticsBatchSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type LevelProgress = z.infer<typeof LevelProgressSchema>;

// ============================================================================
// FUNCIONES DE VALIDACIÓN UTILITARIAS
// ============================================================================

export const validateVideoData = (data: unknown): VideoData => {
  return VideoDataSchema.parse(data);
};

export const validatePlayerMetrics = (data: unknown): PlayerMetrics => {
  return PlayerMetricsSchema.parse(data);
};

export const validateVideoProgress = (data: unknown): VideoProgress => {
  return VideoProgressSchema.parse(data);
};

export const validateUserPreferences = (data: unknown): UserPreferences => {
  return UserPreferencesSchema.parse(data);
};

export const validateLocalStorageData = (data: unknown): LocalStorageData => {
  return LocalStorageDataSchema.parse(data);
};

export const validateEngagementMetrics = (data: unknown): EngagementMetrics => {
  return EngagementMetricsSchema.parse(data);
};

export const validateAchievement = (data: unknown): Achievement => {
  return AchievementSchema.parse(data);
};

// ============================================================================
// FUNCIONES DE TRANSFORMACIÓN Y UTILIDADES
// ============================================================================

export const createDefaultPlayerMetrics = (): PlayerMetrics => {
  return PlayerMetricsSchema.parse({});
};

export const createDefaultUserPreferences = (): UserPreferences => {
  return UserPreferencesSchema.parse({});
};

export const createVideoProgress = (videoId: string, currentTime: number = 0): VideoProgress => {
  return VideoProgressSchema.parse({
    videoId,
    currentTime,
    lastWatched: new Date(),
  });
};

export const createEngagementMetrics = (sessionId: string, videoId: string): EngagementMetrics => {
  return EngagementMetricsSchema.parse({
    sessionId,
    videoId,
    startTime: new Date(),
  });
};

// ============================================================================
// CONSTANTES DE VALIDACIÓN
// ============================================================================

export const VALIDATION_CONSTANTS = {
  MIN_QUESTION_TIME_LIMIT: 5,
  MAX_QUESTION_TIME_LIMIT: 60,
  DEFAULT_QUESTION_TIME_LIMIT: 15,
  MIN_VIDEO_DURATION: 0,
  MAX_PLAYBACK_SPEED: 3.0,
  MIN_PLAYBACK_SPEED: 0.25,
  DEFAULT_VOLUME: 0.8,
  MAX_QUESTIONS_PER_VIDEO: 50,
  MIN_QUESTIONS_PER_VIDEO: 0,
} as const;

// ============================================================================
// ESQUEMAS DE ERROR HANDLING
// ============================================================================

export const ValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
  value: z.any().optional(),
});

export const ValidationResultSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  errors: z.array(ValidationErrorSchema).default([]),
});

export type ValidationError = z.infer<typeof ValidationErrorSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;

export const createValidationResult = <T>(
  success: boolean,
  data?: T,
  errors: ValidationError[] = []
): ValidationResult => {
  return ValidationResultSchema.parse({
    success,
    data,
    errors,
  });
}; 