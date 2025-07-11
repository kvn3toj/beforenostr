/**
 * 🛒 Template Marketplace Types - CoomÜnity Values Integration
 * 
 * 🎯 INTENT: Definir tipos que reflejen la filosofía de sharing vs hoarding
 * 🌟 VALUES: Reciprocidad, Bien Común, Neguentropía, Cooperar > Competir
 * ⚡ CONSTRAINTS: TypeScript estricto, integración con Challenge Builder
 */

import { ChallengeElement, ChallengeFlow, OctalysisElement } from './challenge-builder.types';

// Tipos base para el marketplace de templates
export interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  
  // Template Content
  challengeFlow: ChallengeFlow;
  elements: ChallengeElement[];
  octalysisProfile: OctalysisElement[];
  
  // Metadata
  category: TemplateCategory;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: string; // "30 minutes", "2 hours", etc.
  targetAudience: string[];
  
  // Creator & Community
  creator: TemplateCreator;
  collaborators: TemplateCreator[];
  isPublic: boolean; // Default: true (VALUES: sharing over hoarding)
  
  // Community Engagement
  analytics: TemplateAnalytics;
  community: CommunityMetrics;
  
  // Version & Evolution
  version: string;
  parentTemplateId?: string; // For remixes/forks
  remixChain: TemplateRemix[];
  
  // Economy
  pricing: TemplatePricing;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  
  // Status & Moderation
  status: 'draft' | 'published' | 'featured' | 'archived' | 'reported';
  moderationNotes?: string;
  
  // Filosofía CoomÜnity
  philosophyAlignment: PhilosophyAlignment;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isCollaborative: boolean; // VALUES: prioritize collaborative categories
}

export interface TemplateCreator {
  id: string;
  name: string;
  avatar?: string;
  reputation: number; // Mëritos system
  trustLevel: number;
  contributionScore: number; // Based on sharing behavior
  specialties: string[];
  socialProof: {
    templatesShared: number;
    templatesRemixed: number;
    communityHelp: number;
    collaborations: number;
  };
}

export interface TemplateAnalytics {
  // Usage Metrics
  views: number;
  downloads: number;
  uses: number;
  
  // Community Metrics  
  favorites: number;
  remixes: number;
  shares: number;
  
  // Quality Metrics
  rating: number;
  reviewCount: number;
  completionRate: number;
  
  // Collaboration Metrics (VALUES: measure cooperation)
  teamUsage: number;
  groupCollaborations: number;
  knowledgeTransfer: number;
}

export interface CommunityMetrics {
  // Engagement
  comments: TemplateComment[];
  reviews: TemplateReview[];
  contributors: string[]; // User IDs who contributed improvements
  
  // Sharing Behavior (VALUES: anti-hoarding metrics)
  sharingScore: number; // Algorithm-calculated based on community benefit
  collaborationIndex: number; // How much it enables group work
  reciprocityRating: number; // Users give back after using
  
  // Community Health
  helpfulnessVotes: number;
  reportCount: number;
  moderationFlags: string[];
}

export interface TemplateRemix {
  id: string;
  remixedBy: TemplateCreator;
  remixedAt: string;
  improvementsDescription: string;
  changesCount: number;
  isSharedBack: boolean; // VALUES: track reciprocity
}

export interface TemplatePricing {
  isFree: boolean;
  price?: number;
  currency?: 'units' | 'meritos';
  revenueSharing: {
    creator: number; // 70%
    community: number; // 20%
    platform: number; // 10%
  };
  
  // Special CoomÜnity Economics
  reciprocityBenefit: number; // Ongoing Ünits when template enables collaboration
  communityBonus: number; // Extra rewards for free, high-quality templates
  sharingIncentive: number; // Bonus for making premium templates occasionally free
}

export interface TemplateComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  helpfulVotes: number;
  isCreatorResponse: boolean;
  improvementSuggestions?: string[]; // VALUES: constructive feedback
}

export interface TemplateReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  title: string;
  content: string;
  
  // CoomÜnity-specific review criteria
  criteria: {
    easeOfUse: number;
    educational: number;
    collaborative: number; // VALUES: does it promote teamwork?
    innovative: number;
    documentation: number;
  };
  
  usageContext: string; // How they used the template
  improvements: string[]; // Suggestions for enhancement
  wouldRecommend: boolean;
  helpfulVotes: number;
  
  createdAt: string;
  updatedAt?: string;
}

export interface PhilosophyAlignment {
  // CoomÜnity Values Scoring (0-100)
  reciprocidad: number; // Promotes mutual exchange
  bienComun: number; // Benefits community over individual
  negentropia: number; // Creates order, reduces chaos
  cooperacion: number; // Collaboration over competition
  metanoia: number; // Promotes consciousness transformation
  
  // Composite Score
  overallAlignment: number;
  
  // Qualitative Assessment
  positiveImpacts: string[];
  areasForImprovement: string[];
  philosophicalNotes: string;
}

// Search and Filtering
export interface TemplateSearchFilters {
  query?: string;
  categories?: string[];
  tags?: string[];
  difficulty?: string[];
  pricing?: 'free' | 'premium' | 'all';
  rating?: number; // Minimum rating
  duration?: string[];
  
  // Philosophy-based filters (VALUES: enable values-based discovery)
  highCollaboration?: boolean;
  highReciprocity?: boolean;
  communityFeatured?: boolean;
  recentlyShared?: boolean;
  
  // Creator filters
  creatorId?: string;
  trustLevel?: number;
  
  // Sorting
  sortBy?: 'relevance' | 'rating' | 'recent' | 'popular' | 'collaborative' | 'reciprocity';
  sortOrder?: 'asc' | 'desc';
}

export interface TemplateSearchResult {
  templates: ChallengeTemplate[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  
  // Search insights
  suggestedFilters: string[];
  relatedCategories: TemplateCategory[];
  featuredTemplates: ChallengeTemplate[];
  
  // Community highlights (VALUES: promote sharing behavior)
  recentlyShared: ChallengeTemplate[];
  highCollaboration: ChallengeTemplate[];
  communityFavorites: ChallengeTemplate[];
}

// Marketplace Actions & Interactions
export interface TemplateAction {
  type: 'use' | 'download' | 'remix' | 'favorite' | 'share' | 'comment' | 'review' | 'improve';
  templateId: string;
  userId: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface TemplateImprovement {
  id: string;
  templateId: string;
  suggestedBy: string;
  description: string;
  implementationNotes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'implemented';
  communityVotes: number;
  creatorResponse?: string;
  
  // VALUES: Track collaborative improvement
  isCollaborativeEffort: boolean;
  contributorIds: string[];
  
  createdAt: string;
  updatedAt?: string;
}

// Template Collections & Curation
export interface TemplateCollection {
  id: string;
  title: string;
  description: string;
  curatedBy: TemplateCreator;
  templates: string[]; // Template IDs
  isPublic: boolean;
  isCommunityFeatured: boolean;
  
  // Community curation (VALUES: community-driven content)
  communityVotes: number;
  contributorCount: number;
  collaborativeScore: number;
  
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Export Types for External Use
export type {
  ChallengeTemplate as Template,
  TemplateAnalytics as Analytics,
  CommunityMetrics as Community,
  PhilosophyAlignment as Philosophy,
  TemplateSearchFilters as SearchFilters,
  TemplateSearchResult as SearchResult
};

// Constants for UI
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'collaborative',
    name: 'Colaborativo',
    description: 'Templates que fomentan trabajo en equipo',
    icon: '🤝',
    color: '#4CAF50',
    isCollaborative: true
  },
  {
    id: 'educational',
    name: 'Educativo',
    description: 'Templates para aprendizaje y desarrollo',
    icon: '📚',
    color: '#2196F3',
    isCollaborative: false
  },
  {
    id: 'community',
    name: 'Comunitario',
    description: 'Templates para construir comunidad',
    icon: '🌍',
    color: '#FF9800',
    isCollaborative: true
  },
  {
    id: 'wellness',
    name: 'Bienestar',
    description: 'Templates para salud y bienestar integral',
    icon: '🌱',
    color: '#8BC34A',
    isCollaborative: false
  },
  {
    id: 'creativity',
    name: 'Creatividad',
    description: 'Templates para expresión artística y creativa',
    icon: '🎨',
    color: '#E91E63',
    isCollaborative: false
  }
];

export const PHILOSOPHY_WEIGHTS = {
  reciprocidad: 0.25,
  bienComun: 0.25,
  negentropia: 0.20,
  cooperacion: 0.20,
  metanoia: 0.10
} as const;

export const DEFAULT_REVENUE_SHARING = {
  creator: 70,
  community: 20,
  platform: 10
} as const;