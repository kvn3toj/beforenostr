// 🏫 Tipos para Sistema de Salas Compartidas de Estudio - ÜPlay
// Basado en especificaciones del UPLAY_ENVIRONMENT_REVIEW.md
// Implementa funcionalidades sociales avanzadas para CoomÜnity

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  level: number;
  meritos: number;
  ondas: number;
}

export interface VideoData {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  thumbnail?: string;
}

export interface StudyRoom {
  id: string;
  name: string;
  hostId: string;
  host: User;
  participants: User[];
  currentVideo?: VideoData;
  syncedTimestamp: number;
  chatEnabled: boolean;
  maxParticipants: number;
  isPrivate: boolean;
  studyFocus: 'filosofia' | 'gamificacion' | 'colaboracion' | 'ayni' | 'bien-común';
  status: 'waiting' | 'active' | 'paused' | 'completed';
  createdAt: Date;
  scheduledStartTime?: Date;
  totalMeritosEarned: number;
  totalOndasEarned: number;
  questionsAnswered: number;
  averageAccuracy: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  user: User;
  message: string;
  timestamp: Date;
  type: 'message' | 'system' | 'question' | 'reaction';
  questionId?: number;
  reactionType?: 'like' | 'celebrate' | 'insight' | 'ayni';
}

export interface VideoParty {
  id: string;
  videoId: string;
  video: VideoData;
  scheduledTime: Date;
  minParticipants: number;
  maxParticipants: number;
  activationThreshold: number; // ej: 10 usuarios para activar
  status: 'scheduled' | 'countdown' | 'active' | 'completed' | 'cancelled';
  participants: User[];
  rewards: {
    meritos: number;
    ondas: number;
    exclusiveAchievements: string[];
  };
  countdownStartTime?: Date;
  actualStartTime?: Date;
  studyFocus: string;
  collaborativeQuestions: boolean;
}

export interface CollaborativeMission {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'partner' | 'group' | 'community';
  requirements: {
    minParticipants: number;
    maxParticipants: number;
    videosToComplete: number;
    accuracyThreshold: number; // %
    timeLimit?: number; // horas
  };
  rewards: {
    meritos: number;
    ondas: number;
    achievements: string[];
    exclusiveContent?: string[];
  };
  status: 'available' | 'in-progress' | 'completed' | 'expired';
  progress: {
    participantsJoined: number;
    videosCompleted: number;
    questionsAnswered: number;
    currentAccuracy: number;
  };
  deadline: Date;
  studyFocus: string;
  isTemporalEvent: boolean;
}

// Eventos en tiempo real para WebSocket
export interface RoomEvent {
  type: 'user-joined' | 'user-left' | 'video-sync' | 'chat-message' | 'question-answered' | 'party-activated';
  roomId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

export interface SyncData {
  currentTime: number;
  isPlaying: boolean;
  videoId: string;
  lastSyncUserId: string;
  timestamp: Date;
}

// Estados para componentes React
export interface StudyRoomState {
  currentRoom?: StudyRoom;
  isHost: boolean;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  syncedTime: number;
  lastSyncUpdate: Date;
  chatMessages: ChatMessage[];
  activeParticipants: User[];
}

export interface VideoPartyState {
  activeParty?: VideoParty;
  isParticipating: boolean;
  countdown: number;
  statusMessage: string;
  rewards?: {
    meritos: number;
    ondas: number;
    achievements: string[];
  };
}

// APIs y servicios
export interface StudyRoomAPI {
  createRoom: (roomData: Partial<StudyRoom>) => Promise<StudyRoom>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  listRooms: (filters?: StudyRoomFilters) => Promise<StudyRoom[]>;
  syncVideo: (roomId: string, syncData: SyncData) => Promise<void>;
  sendMessage: (roomId: string, message: string) => Promise<void>;
}

export interface StudyRoomFilters {
  studyFocus?: string;
  isPrivate?: boolean;
  hasSpace?: boolean;
  status?: string;
  minParticipants?: number;
  maxParticipants?: number;
} 