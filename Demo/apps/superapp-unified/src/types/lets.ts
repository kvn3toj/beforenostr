// 🔄 Tipos para el Sistema LETS (Local Exchange Trading System)
// Implementación de economía colaborativa basada en Ayni y reciprocidad

// ============================================================================
// CORE LETS CURRENCY SYSTEM
// ============================================================================

export interface UnitsWallet {
  id: string;
  userId: string;
  balance: number;
  creditLimit: number; // Límite de saldo negativo permitido
  trustScore: number; // Puntuación de confianza (0-1)
  createdAt: string;
  updatedAt: string;
}

export interface UnitsTransaction {
  id: string;
  fromUserId?: string; // Opcional para transacciones del sistema
  toUserId: string;
  amount: number;
  transactionType: 'service' | 'product' | 'knowledge' | 'cop_participation' | 'system_reward' | 'trust_bonus';
  referenceId?: string; // ID del marketplace item, cop activity, etc.
  description: string;
  metadata?: {
    itemTitle?: string;
    category?: string;
    estimatedHours?: number;
    copName?: string;
    sessionType?: string;
    [key: string]: any;
  };
  status: 'pending' | 'completed' | 'failed' | 'disputed';
  createdAt: string;
}

// ============================================================================
// TRUST SYSTEM
// ============================================================================

export interface TrustRating {
  id: string;
  raterId: string;
  ratedId: string;
  transactionId?: string;
  rating: number; // 1.0 - 5.0
  communicationRating: number;
  deliveryRating: number;
  qualityRating: number;
  comments?: string;
  createdAt: string;
}

export interface CreditLimit {
  id: string;
  userId: string;
  limitAmount: number;
  reason: 'initial' | 'trust_increase' | 'community_endorsement' | 'merit_bonus';
  grantedBy?: string;
  validUntil?: string;
  active: boolean;
  createdAt: string;
}

// ============================================================================
// MARKETPLACE LETS INTEGRATION
// ============================================================================

export interface LetsListing {
  id: string;
  userId: string;
  type: 'offer' | 'request';
  title: string;
  description: string;
  category: string;
  unitsValue: number;
  estimatedHours?: number;
  location?: string;
  availabilitySchedule?: {
    days: string[];
    timeSlots: { start: string; end: string }[];
  };
  tags: string[];
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
    trustScore: number;
  };
}

export interface LetsSearchFilters {
  type?: 'offer' | 'request';
  category?: string;
  location?: string;
  maxUnitsValue?: number;
  minTrustScore?: number;
  tags?: string[];
  searchTerm?: string;
}

// ============================================================================
// COMMUNITIES OF PRACTICE (CoP) KNOWLEDGE EXCHANGE
// ============================================================================

export interface CopKnowledgeExchange {
  id: string;
  copId: string;
  teacherId: string;
  learnerId?: string; // NULL para sesiones grupales
  sessionType: 'one_to_one' | 'workshop' | 'mentoring' | 'group_session';
  title: string;
  description: string;
  knowledgeAreas: string[];
  unitsCost: number;
  durationHours: number;
  maxParticipants?: number;
  currentParticipants: number;
  scheduledAt: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  materialsShared?: {
    documents: string[];
    links: string[];
    resources: string[];
  };
  feedback?: {
    averageRating: number;
    comments: string[];
  };
  createdAt: string;
}

export interface CopKnowledgeParticipant {
  id: string;
  exchangeId: string;
  participantId: string;
  role: 'teacher' | 'learner' | 'observer';
  unitsPaid: number;
  attendanceConfirmed: boolean;
  feedbackRating?: number;
  feedbackComment?: string;
  meritosEarned: number;
  createdAt: string;
}

export interface CopHierarchyLevel {
  id: string;
  copId: string;
  userId: string;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1=Aprendiz, 7=Maestro
  levelName: 'Aprendiz' | 'Iniciado' | 'Practicante' | 'Competente' | 'Especialista' | 'Experto' | 'Maestro';
  earnedAt: string;
  requirementsMet: {
    sessionsCompleted: number;
    hoursContributed: number;
    positiveRatings: number;
    knowledgeShared: string[];
    mentorshipProvided: number;
  };
  mentorId?: string;
}

// ============================================================================
// ANALYTICS AND REPORTING
// ============================================================================

export interface LetsAnalytics {
  totalUnitsInCirculation: number;
  totalTransactions: number;
  averageTransactionValue: number;
  activeListings: number;
  communityTrustScore: number;
  topCategories: Array<{
    category: string;
    transactionCount: number;
    unitsVolume: number;
  }>;
  userEngagement: {
    activeUsers: number;
    newUsersThisMonth: number;
    retentionRate: number;
  };
  ayniBalance: {
    giversCount: number;
    receiversCount: number;
    balanceRatio: number; // Ideal: 1.0 (equilibrio perfecto)
  };
}

export interface UserLetsProfile {
  userId: string;
  wallet: UnitsWallet;
  trustRating: {
    average: number;
    totalRatings: number;
    breakdown: {
      communication: number;
      delivery: number;
      quality: number;
    };
  };
  transactionHistory: {
    totalGiven: number;
    totalReceived: number;
    ayniRatio: number; // Ratio de reciprocidad
  };
  activeListings: LetsListing[];
  copParticipation: Array<{
    copId: string;
    copName: string;
    hierarchyLevel: CopHierarchyLevel;
    contributionScore: number;
  }>;
}

// ============================================================================
// CONSTANTS AND ENUMS
// ============================================================================

export const LETS_CATEGORIES = [
  'Alimentación',
  'Artesanías',
  'Cuidado Personal',
  'Educación',
  'Entretenimiento',
  'Hogar y Jardín',
  'Salud y Bienestar',
  'Servicios Profesionales',
  'Tecnología',
  'Transporte',
  'Intercambio de Conocimiento',
  'Experiencias',
  'Otros'
] as const;

export const COP_HIERARCHY_LEVELS = [
  { level: 1, name: 'Aprendiz', description: 'Nuevo en la comunidad, aprendiendo los fundamentos' },
  { level: 2, name: 'Iniciado', description: 'Ha completado sesiones básicas y muestra compromiso' },
  { level: 3, name: 'Practicante', description: 'Puede enseñar conceptos básicos y ayudar a otros' },
  { level: 4, name: 'Competente', description: 'Domina habilidades intermedias y puede liderar sesiones' },
  { level: 5, name: 'Especialista', description: 'Experto en áreas específicas, mentor activo' },
  { level: 6, name: 'Experto', description: 'Reconocido líder de conocimiento en la comunidad' },
  { level: 7, name: 'Maestro', description: 'Máximo nivel, guía espiritual y técnico de la comunidad' }
] as const;

export const TRANSACTION_TYPES = {
  SERVICE: 'service',
  PRODUCT: 'product',
  KNOWLEDGE: 'knowledge',
  COP_PARTICIPATION: 'cop_participation',
  SYSTEM_REWARD: 'system_reward',
  TRUST_BONUS: 'trust_bonus'
} as const;

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateLetsListingRequest {
  type: 'offer' | 'request';
  title: string;
  description: string;
  category: string;
  unitsValue: number;
  estimatedHours?: number;
  location?: string;
  tags: string[];
  availabilitySchedule?: {
    days: string[];
    timeSlots: { start: string; end: string }[];
  };
}

// Alias para compatibilidad con componentes
export type CreateLetsListingDto = CreateLetsListingRequest;

export interface TransferUnitsRequest {
  toUserId: string;
  amount: number;
  transactionType: string;
  referenceId?: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface CreateKnowledgeExchangeRequest {
  copId: string;
  sessionType: 'one_to_one' | 'workshop' | 'mentoring' | 'group_session';
  title: string;
  description: string;
  knowledgeAreas: string[];
  unitsCost: number;
  durationHours: number;
  maxParticipants?: number;
  scheduledAt: string;
}

export interface RateTrustRequest {
  ratedUserId: string;
  transactionId?: string;
  rating: number;
  communicationRating: number;
  deliveryRating: number;
  qualityRating: number;
  comments?: string;
}

// ============================================================================
// UI COMPONENT PROPS
// ============================================================================

export interface UnitsWalletProps {
  userId: string;
  compact?: boolean;
  showTransferButton?: boolean;
  showHistory?: boolean;
}

export interface LetsListingsProps {
  filters?: LetsSearchFilters;
  showCreateButton?: boolean;
  maxItems?: number;
  layout?: 'grid' | 'list';
}

export interface KnowledgeExchangeHubProps {
  copId: string;
  userId: string;
  userHierarchyLevel?: number;
  showCreateSession?: boolean;
}

export interface TrustRatingComponentProps {
  userId: string;
  transactionId?: string;
  onRatingSubmitted?: (rating: TrustRating) => void;
}

// ============================================================================
// CONSTANTS (UNIFIED) - Removed duplicates, keeping array versions above
// ============================================================================ 