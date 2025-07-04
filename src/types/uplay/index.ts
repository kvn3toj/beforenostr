// UPlay - Sistema de Tipos Avanzado para Aprendizaje Gamificado
// Conectado con Backend NestJS CoomÜnity

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number; // en segundos
  category: VideoCategory;
  difficulty: DifficultyLevel;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  questions: InteractiveQuestion[];
  chapters: VideoChapter[];
  metadata: VideoMetadata;
  rewards: VideoRewards;
  analytics: VideoAnalytics;
}

export interface InteractiveQuestion {
  id: string;
  videoId: string;
  timestamp: number; // momento del video donde aparece la pregunta
  type: QuestionType;
  title: string;
  content: string;
  options: QuestionOption[];
  correctAnswers: string[];
  explanation: string;
  points: number;
  difficulty: DifficultyLevel;
  timeLimit?: number; // segundos para responder
  hints: string[];
  rewards: QuestionRewards;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_BLANK = 'fill_blank',
  DRAG_DROP = 'drag_drop',
  ORDERING = 'ordering',
  TEXT_INPUT = 'text_input'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum VideoCategory {
  CHARLAS_INSPIRADORAS = 'charlas_inspiradoras',
  LIFEHACKS_SABIDURIA = 'lifehacks_sabiduria',
  DOCUMENTALES_CONSCIENTES = 'documentales_conscientes',
  SABIDURIA_TRANSFORMADORA = 'sabiduria_transformadora',
  SERIES_TEMATICAS = 'series_tematicas'
}

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description?: string;
  thumbnail?: string;
}

export interface VideoMetadata {
  resolution: string[];
  subtitles: SubtitleTrack[];
  aspectRatio: string;
  frameRate: number;
  fileSize: number;
  encoding: string;
}

export interface SubtitleTrack {
  language: string;
  label: string;
  url: string;
  isDefault: boolean;
}

export interface VideoRewards {
  meritos: number;
  ondas: number;
  cristales: number;
  experiencePoints: number;
  badges: BadgeReward[];
}

export interface BadgeReward {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  rarity: BadgeRarity;
}

export enum BadgeRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export interface QuestionRewards {
  basePoints: number;
  speedBonus: number;
  accuracyBonus: number;
  streakMultiplier: number;
}

export interface VideoAnalytics {
  totalViews: number;
  averageCompletion: number;
  averageScore: number;
  totalQuestions: number;
  difficulty: DifficultyLevel;
  engagement: EngagementMetrics;
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  bookmarks: number;
  shares: number;
  averageWatchTime: number;
  completionRate: number;
}

// Dashboard y Estadísticas del Usuario
export interface UserStats {
  userId: string;
  totalVideosWatched: number;
  totalTimeSpent: number; // en minutos
  averageScore: number;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  experiencePoints: number;
  nextLevelXP: number;
  categoriesProgress: CategoryProgress[];
  recentAchievements: Achievement[];
  weeklyGoals: WeeklyGoals;
  learningPath: LearningPath[];
}

export interface CategoryProgress {
  category: VideoCategory;
  videosCompleted: number;
  totalVideos: number;
  averageScore: number;
  timeSpent: number;
  level: number;
  nextLevelProgress: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt: string;
  category: AchievementCategory;
  rarity: BadgeRarity;
  progress: number;
  maxProgress: number;
}

export enum AchievementCategory {
  SPEED = 'speed',
  ACCURACY = 'accuracy',
  CONSISTENCY = 'consistency',
  EXPLORER = 'explorer',
  SOCIAL = 'social',
  MASTERY = 'mastery'
}

export interface WeeklyGoals {
  videosToWatch: number;
  videosWatched: number;
  minutesToSpend: number;
  minutesSpent: number;
  pointsToEarn: number;
  pointsEarned: number;
  questionsToAnswer: number;
  questionsAnswered: number;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  videos: string[]; // video IDs
  currentVideoIndex: number;
  progress: number;
  estimatedTime: number;
  difficulty: DifficultyLevel;
  prerequisites: string[];
  rewards: VideoRewards;
}

// Salas de Estudio Colaborativas
export interface StudyRoom {
  id: string;
  name: string;
  description: string;
  hostId: string;
  participants: StudyRoomParticipant[];
  currentVideo?: VideoItem;
  maxParticipants: number;
  isPrivate: boolean;
  password?: string;
  category: VideoCategory;
  difficulty: DifficultyLevel;
  language: string;
  status: StudyRoomStatus;
  scheduledAt?: string;
  createdAt: string;
  tags: string[];
  rules: StudyRoomRules;
}

export interface StudyRoomParticipant {
  userId: string;
  username: string;
  avatarUrl?: string;
  role: ParticipantRole;
  joinedAt: string;
  isActive: boolean;
  permissions: ParticipantPermissions;
}

export enum ParticipantRole {
  HOST = 'host',
  MODERATOR = 'moderator',
  PARTICIPANT = 'participant'
}

export interface ParticipantPermissions {
  canChangeVideo: boolean;
  canKickUsers: boolean;
  canModerateChat: boolean;
  canShareScreen: boolean;
}

export enum StudyRoomStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended'
}

export interface StudyRoomRules {
  allowChat: boolean;
  allowReactions: boolean;
  allowQuestions: boolean;
  autoPlay: boolean;
  syncPlayback: boolean;
  allowBreakoutRooms: boolean;
}

// Chat y Comunicación
export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  type: MessageType;
  timestamp: string;
  reactions: MessageReaction[];
  replyTo?: string;
}

export enum MessageType {
  TEXT = 'text',
  EMOJI = 'emoji',
  QUESTION = 'question',
  ANSWER = 'answer',
  SYSTEM = 'system'
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  username: string;
}

// Video Player Avanzado
export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  quality: VideoQuality;
  isFullscreen: boolean;
  isMuted: boolean;
  showControls: boolean;
  subtitlesEnabled: boolean;
  currentSubtitleTrack?: string;
  buffered: TimeRange[];
  seeking: boolean;
}

export interface VideoQuality {
  height: number;
  width: number;
  bitrate: number;
  label: string;
}

export interface TimeRange {
  start: number;
  end: number;
}

// Gamificación y Economía Virtual
export interface UserCurrency {
  meritos: number;
  ondas: number;
  cristales: number;
  energia: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: keyof UserCurrency;
  category: ShopCategory;
  rarity: BadgeRarity;
  imageUrl: string;
  isLimited: boolean;
  expiresAt?: string;
  requirements?: ShopRequirement[];
}

export enum ShopCategory {
  AVATARS = 'avatars',
  THEMES = 'themes',
  POWER_UPS = 'power_ups',
  EARLY_ACCESS = 'early_access',
  EXCLUSIVE_CONTENT = 'exclusive_content'
}

export interface ShopRequirement {
  type: RequirementType;
  value: number;
  description: string;
}

export enum RequirementType {
  LEVEL = 'level',
  VIDEOS_COMPLETED = 'videos_completed',
  ACHIEVEMENT = 'achievement',
  TIME_SPENT = 'time_spent'
}

// Eventos y Temporadas
export interface SeasonEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: EventType;
  rewards: EventRewards;
  challenges: EventChallenge[];
  leaderboard: EventLeaderboard;
  participants: number;
  isActive: boolean;
}

export enum EventType {
  BATTLE_PASS = 'battle_pass',
  TOURNAMENT = 'tournament',
  COMMUNITY_CHALLENGE = 'community_challenge',
  THEMED_WEEK = 'themed_week'
}

export interface EventRewards {
  tiers: RewardTier[];
  exclusiveItems: ShopItem[];
  specialBadges: BadgeReward[];
}

export interface RewardTier {
  level: number;
  requiredPoints: number;
  rewards: (ShopItem | BadgeReward)[];
}

export interface EventChallenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  target: number;
  progress: number;
  points: number;
  deadline: string;
}

export enum ChallengeType {
  WATCH_VIDEOS = 'watch_videos',
  ANSWER_QUESTIONS = 'answer_questions',
  ACHIEVE_STREAK = 'achieve_streak',
  COMPLETE_CATEGORY = 'complete_category',
  SOCIAL_INTERACTION = 'social_interaction'
}

export interface EventLeaderboard {
  entries: LeaderboardEntry[];
  userRank?: number;
  totalParticipants: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  points: number;
  avatarUrl?: string;
}

// API Responses
export interface UPlayApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Filtros y Búsqueda
export interface VideoFilters {
  category?: VideoCategory;
  difficulty?: DifficultyLevel;
  duration?: DurationRange;
  hasQuestions?: boolean;
  language?: string;
  tags?: string[];
  rating?: number;
  sortBy?: VideoSortBy;
  sortOrder?: SortOrder;
}

export interface DurationRange {
  min: number;
  max: number;
}

export enum VideoSortBy {
  CREATED_AT = 'createdAt',
  DURATION = 'duration',
  RATING = 'rating',
  VIEWS = 'views',
  DIFFICULTY = 'difficulty',
  TITLE = 'title'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

// WebSocket Events para Salas de Estudio
export interface WebSocketEvent {
  type: WebSocketEventType;
  payload: any;
  timestamp: string;
  userId?: string;
}

export enum WebSocketEventType {
  // Room Events
  ROOM_JOINED = 'room_joined',
  ROOM_LEFT = 'room_left',
  ROOM_UPDATED = 'room_updated',
  
  // Video Events
  VIDEO_PLAY = 'video_play',
  VIDEO_PAUSE = 'video_pause',
  VIDEO_SEEK = 'video_seek',
  VIDEO_ENDED = 'video_ended',
  VIDEO_CHANGED = 'video_changed',
  
  // Chat Events
  MESSAGE_SENT = 'message_sent',
  REACTION_ADDED = 'reaction_added',
  
  // Question Events
  QUESTION_APPEARED = 'question_appeared',
  ANSWER_SUBMITTED = 'answer_submitted',
  
  // User Events
  USER_TYPING = 'user_typing',
  USER_ACTIVE = 'user_active',
  USER_INACTIVE = 'user_inactive'
}