/**
 * 💰 Ünits Economy System - Type Definitions
 * 
 * Tipos TypeScript centralizados para todo el sistema de economía CoomÜnity
 */

// Base currency types
export type CurrencyType = 'units' | 'ondas' | 'meritos';

export interface WalletBalance {
  units: number;
  ondas: number;
  meritos: number;
}

// Transaction Modal Types
export interface TransactionStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
}

export interface UnitsTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any; // ChallengeTemplate from template-marketplace.types
  onTransactionComplete: (transactionId: string, template: any) => void;
  userWallet: WalletBalance;
}

// Revenue Sharing Types
export interface RevenueTransaction {
  id: string;
  templateId: string;
  templateTitle: string;
  buyerId: string;
  buyerName: string;
  creatorId: string;
  creatorName: string;
  totalAmount: number;
  currency: CurrencyType;
  distribution: {
    creator: number;
    community: number;
    platform: number;
  };
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  reciprocityBenefits: number;
  communityBonus: number;
}

export interface RevenueStats {
  totalRevenue: number;
  creatorEarnings: number;
  communityFund: number;
  platformFee: number;
  transactionCount: number;
  averageTransaction: number;
  topEarningTemplate: string;
  reciprocityGenerated: number;
}

export interface RevenueSharingSystemProps {
  isOpen: boolean;
  onClose: () => void;
  templateId?: string;
  creatorId?: string;
}

// Reciprocity Incentives Types
export type ReciprocityEventType = 
  | 'template_used' 
  | 'collaboration_started' 
  | 'remix_created' 
  | 'knowledge_shared' 
  | 'community_help';

export interface ReciprocityEvent {
  id: string;
  type: ReciprocityEventType;
  templateId: string;
  templateTitle: string;
  originalCreatorId: string;
  originalCreatorName: string;
  beneficiaryId: string;
  beneficiaryName: string;
  unitsGenerated: number;
  collaborationMultiplier: number;
  timestamp: string;
  status: 'pending' | 'processed' | 'distributed';
  triggerDetails: {
    projectSize: number;
    collaboratorCount: number;
    impactLevel: 'low' | 'medium' | 'high';
    communityReach: number;
  };
}

export type CommunityBonusType = 
  | 'quality_milestone' 
  | 'collaboration_boost' 
  | 'knowledge_transfer' 
  | 'community_choice';

export interface CommunityBonus {
  id: string;
  templateId: string;
  templateTitle: string;
  creatorId: string;
  creatorName: string;
  bonusType: CommunityBonusType;
  bonusAmount: number;
  criteria: {
    qualityScore: number;
    usageCount: number;
    collaborationIndex: number;
    helpfulness: number;
  };
  achievedAt: string;
  distributedAt?: string;
  status: 'earned' | 'distributed';
}

export interface IncentiveMetrics {
  totalReciprocityGenerated: number;
  totalBonusDistributed: number;
  activeIncentiveCycles: number;
  reciprocityParticipants: number;
  averageMultiplier: number;
  topPerformingTemplate: string;
  communityGrowthRate: number;
  virtouseCycleIndex: number;
}

export interface ReciprocityIncentivesSystemProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId?: string;
  templateId?: string;
}

// Economy Configuration Types
export interface EconomySettings {
  revenueSharing: {
    creator: number; // 70%
    community: number; // 20%
    platform: number; // 10%
  };
  reciprocityMultipliers: {
    base: number;
    collaboration: number;
    quality: number;
    impact: number;
  };
  communityBonusThresholds: {
    qualityScore: number;
    usageCount: number;
    collaborationIndex: number;
    helpfulness: number;
  };
  autoIncentives: {
    enabled: boolean;
    detectionSensitivity: 'low' | 'medium' | 'high';
    distributionFrequency: 'immediate' | 'daily' | 'weekly';
  };
}

// Philosophy Integration Types
export interface PhilosophyAlignment {
  reciprocidad: number;
  bienComun: number;
  negentropia: number;
  cooperacion: number;
  metanoia: number;
  overallAlignment: number;
}

export interface EconomyPhilosophyMetrics {
  sharingVsHoarding: number;
  collaborationBoost: number;
  communityImpact: number;
  virtousCycleStrength: number;
  ayniPrinciple: number;
}