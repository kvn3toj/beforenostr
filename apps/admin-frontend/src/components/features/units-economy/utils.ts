/**
 * 💰 Ünits Economy System - Utility Functions
 * 
 * Funciones de utilidad para cálculos de economía, formateo y lógica de negocio
 */

import { CurrencyType, RevenueTransaction, ReciprocityEvent } from './types';

// Currency formatting utilities
export const formatUnitsAmount = (amount: number, currency: CurrencyType): string => {
  const symbols: Record<CurrencyType, string> = {
    units: 'Ü',
    ondas: 'Ö', 
    meritos: 'M'
  };
  
  return `${symbols[currency]} ${amount.toLocaleString()}`;
};

export const getCurrencyName = (currency: CurrencyType): string => {
  const names: Record<CurrencyType, string> = {
    units: 'Ünits',
    ondas: 'Öndas',
    meritos: 'Méritos'
  };
  
  return names[currency];
};

export const getCurrencyIcon = (currency: CurrencyType): string => {
  const icons: Record<CurrencyType, string> = {
    units: '💎',
    ondas: '🌊',
    meritos: '🏆'
  };
  
  return icons[currency];
};

// Revenue sharing calculations
export const calculateRevenueSharing = (
  totalAmount: number,
  sharingPercentages: { creator: number; community: number; platform: number } = {
    creator: 70,
    community: 20, 
    platform: 10
  }
): { creator: number; community: number; platform: number } => {
  return {
    creator: Math.round((totalAmount * sharingPercentages.creator) / 100),
    community: Math.round((totalAmount * sharingPercentages.community) / 100),
    platform: Math.round((totalAmount * sharingPercentages.platform) / 100)
  };
};

// Reciprocity multiplier calculations
export const calculateReciprocityMultiplier = (
  collaboratorCount: number,
  projectSize: number,
  impactLevel: 'low' | 'medium' | 'high',
  qualityScore: number = 0
): number => {
  let baseMultiplier = 1.0;
  
  // Collaboration size multiplier
  if (collaboratorCount >= 8) {
    baseMultiplier += 0.8;
  } else if (collaboratorCount >= 4) {
    baseMultiplier += 0.5;
  } else if (collaboratorCount >= 2) {
    baseMultiplier += 0.3;
  }
  
  // Project size impact
  if (projectSize >= 15) {
    baseMultiplier += 0.4;
  } else if (projectSize >= 8) {
    baseMultiplier += 0.2;
  }
  
  // Impact level modifier
  const impactModifiers = {
    low: 0.1,
    medium: 0.3,
    high: 0.6
  };
  baseMultiplier += impactModifiers[impactLevel];
  
  // Quality bonus
  if (qualityScore >= 90) {
    baseMultiplier += 0.2;
  } else if (qualityScore >= 75) {
    baseMultiplier += 0.1;
  }
  
  // Cap maximum multiplier at 3.0x to prevent abuse
  return Math.min(baseMultiplier, 3.0);
};

// Community bonus calculations
export const calculateCommunityBonus = (
  usageCount: number,
  qualityScore: number,
  collaborationIndex: number,
  helpfulnessVotes: number
): number => {
  let bonus = 0;
  
  // Usage milestone bonuses
  if (usageCount >= 500) {
    bonus += 200;
  } else if (usageCount >= 200) {
    bonus += 100;
  } else if (usageCount >= 100) {
    bonus += 50;
  } else if (usageCount >= 50) {
    bonus += 25;
  }
  
  // Quality score bonus
  if (qualityScore >= 95) {
    bonus += 100;
  } else if (qualityScore >= 90) {
    bonus += 75;
  } else if (qualityScore >= 80) {
    bonus += 50;
  }
  
  // Collaboration bonus
  if (collaborationIndex >= 95) {
    bonus += 80;
  } else if (collaborationIndex >= 85) {
    bonus += 50;
  } else if (collaborationIndex >= 75) {
    bonus += 25;
  }
  
  // Helpfulness bonus
  if (helpfulnessVotes >= 500) {
    bonus += 60;
  } else if (helpfulnessVotes >= 200) {
    bonus += 30;
  } else if (helpfulnessVotes >= 100) {
    bonus += 15;
  }
  
  return bonus;
};

// Philosophy alignment color coding
export const getPhilosophyColor = (score: number): string => {
  if (score >= 90) return '#4CAF50'; // Excellent alignment
  if (score >= 80) return '#8BC34A'; // Good alignment  
  if (score >= 70) return '#CDDC39'; // Acceptable alignment
  if (score >= 60) return '#FFC107'; // Needs improvement
  if (score >= 50) return '#FF9800'; // Poor alignment
  return '#f44336'; // Very poor alignment
};

// Transaction status utilities
export const getTransactionStatusColor = (status: RevenueTransaction['status']): string => {
  switch (status) {
    case 'completed': return '#4CAF50';
    case 'pending': return '#FF9800';
    case 'failed': return '#f44336';
    default: return '#9E9E9E';
  }
};

export const getEventStatusColor = (status: ReciprocityEvent['status']): string => {
  switch (status) {
    case 'distributed': return '#4CAF50';
    case 'processed': return '#FF9800';
    case 'pending': return '#2196F3';
    default: return '#9E9E9E';
  }
};

// Date formatting utilities
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const eventTime = new Date(timestamp);
  const diffMs = now.getTime() - eventTime.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 60) {
    return `hace ${diffMinutes} minutos`;
  } else if (diffHours < 24) {
    return `hace ${diffHours} horas`;
  } else if (diffDays < 30) {
    return `hace ${diffDays} días`;
  } else {
    return eventTime.toLocaleDateString();
  }
};

// Validation utilities
export const validateTransaction = (
  amount: number,
  currency: CurrencyType,
  walletBalance: Record<CurrencyType, number>
): { isValid: boolean; error?: string } => {
  if (amount <= 0) {
    return { isValid: false, error: 'El monto debe ser mayor a 0' };
  }
  
  if (walletBalance[currency] < amount) {
    return { 
      isValid: false, 
      error: `Balance insuficiente. Tienes ${formatUnitsAmount(walletBalance[currency], currency)} pero necesitas ${formatUnitsAmount(amount, currency)}` 
    };
  }
  
  return { isValid: true };
};

// Philosophy scoring utilities
export const calculatePhilosophyScore = (
  sharingActions: number,
  collaborationActions: number,
  communityContributions: number,
  helpfulness: number
): {
  reciprocidad: number;
  bienComun: number;
  cooperacion: number;
  overallAlignment: number;
} => {
  // Scoring based on actions and contributions
  const reciprocidad = Math.min(100, (sharingActions * 2 + collaborationActions) / 3);
  const bienComun = Math.min(100, (communityContributions * 3 + helpfulness) / 4);
  const cooperacion = Math.min(100, (collaborationActions * 2 + sharingActions) / 3);
  
  const overallAlignment = Math.round((reciprocidad + bienComun + cooperacion) / 3);
  
  return {
    reciprocidad: Math.round(reciprocidad),
    bienComun: Math.round(bienComun),
    cooperacion: Math.round(cooperacion),
    overallAlignment
  };
};

// Economy performance metrics
export const calculateVirtousCycleIndex = (
  activeParticipants: number,
  reciprocityEvents: number,
  communityBonuses: number,
  averageMultiplier: number
): number => {
  // Complex formula that considers multiple factors for measuring ecosystem health
  const participationFactor = Math.min(100, activeParticipants * 2);
  const activityFactor = Math.min(100, reciprocityEvents * 0.5);
  const bonusFactor = Math.min(100, communityBonuses * 3);
  const multiplierFactor = Math.min(100, (averageMultiplier - 1) * 50);
  
  return Math.round((participationFactor + activityFactor + bonusFactor + multiplierFactor) / 4);
};

// Export all utilities as default object for easy importing
export default {
  formatUnitsAmount,
  getCurrencyName,
  getCurrencyIcon,
  calculateRevenueSharing,
  calculateReciprocityMultiplier,
  calculateCommunityBonus,
  getPhilosophyColor,
  getTransactionStatusColor,
  getEventStatusColor,
  formatTimeAgo,
  validateTransaction,
  calculatePhilosophyScore,
  calculateVirtousCycleIndex
};