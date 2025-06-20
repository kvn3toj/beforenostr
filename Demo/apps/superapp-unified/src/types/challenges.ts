// Types for Challenges Module - CoomÜnity SuperApp
// Based on backend structure and gamification principles

export enum ChallengeType {
  CUSTOM = 'CUSTOM',
  AUTOMATED = 'AUTOMATED',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  SEASONAL = 'SEASONAL'
}

export enum ChallengeStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED'
}

export enum ChallengeDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export enum ChallengeCategory {
  LEARNING = 'LEARNING',
  SOCIAL = 'SOCIAL',
  WELLNESS = 'WELLNESS',
  CREATIVITY = 'CREATIVITY',
  COMMUNITY = 'COMMUNITY',
  SUSTAINABILITY = 'SUSTAINABILITY',
  INNOVATION = 'INNOVATION'
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  type: ChallengeType;
  status: ChallengeStatus;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  points: number;
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;
  duration?: number; // in days
  imageUrl?: string;
  tags?: string[];
  requirements?: string[];
  rewards?: ChallengeReward[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  
  // Aggregated data
  _count?: {
    participants: number;
    completions: number;
  };
  
  // User-specific data
  userProgress?: UserChallengeProgress;
  isParticipating?: boolean;
  isCompleted?: boolean;
}

export interface ChallengeReward {
  id: string;
  type: 'MERITS' | 'LUKAS' | 'ONDAS' | 'BADGE' | 'ITEM';
  amount?: number;
  description: string;
  imageUrl?: string;
}

export interface UserChallengeProgress {
  id: string;
  userId: string;
  challengeId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'ABANDONED';
  progress: number; // 0-100
  startedAt: string;
  completedAt?: string;
  tasksCompleted?: number;
  totalTasks?: number;
  currentStep?: string;
  metadata?: Record<string, any>;
}

export interface ChallengeTask {
  id: string;
  challengeId: string;
  title: string;
  description: string;
  order: number;
  type: 'ACTION' | 'VERIFICATION' | 'SUBMISSION' | 'QUIZ' | 'SOCIAL';
  isRequired: boolean;
  points: number;
  metadata?: Record<string, any>;
}

export interface ChallengeParticipation {
  challengeId: string;
  userId: string;
  joinedAt: string;
  progress: UserChallengeProgress;
}

// API DTOs
export interface CreateChallengeDto {
  title: string;
  description: string;
  shortDescription?: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  points: number;
  maxParticipants?: number;
  startDate?: string;
  endDate?: string;
  duration?: number;
  imageUrl?: string;
  tags?: string[];
  requirements?: string[];
}

export interface UpdateChallengeDto extends Partial<CreateChallengeDto> {
  status?: ChallengeStatus;
}

export interface JoinChallengeDto {
  challengeId: string;
}

export interface UpdateProgressDto {
  progress: number;
  currentStep?: string;
  metadata?: Record<string, any>;
}

// UI State Types
export interface ChallengesPageState {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  filters: ChallengeFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ChallengeFilters {
  status?: ChallengeStatus[];
  type?: ChallengeType[];
  difficulty?: ChallengeDifficulty[];
  category?: ChallengeCategory[];
  search?: string;
  sortBy?: 'title' | 'points' | 'startDate' | 'endDate' | 'participants';
  sortOrder?: 'asc' | 'desc';
}

export interface ChallengeCardProps {
  challenge: Challenge;
  onJoin?: (challengeId: string) => void;
  onView?: (challengeId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface ChallengeDetailProps {
  challengeId: string;
  challenge?: Challenge;
  onJoin?: (challengeId: string) => void;
  onLeave?: (challengeId: string) => void;
} 