/**
 * 💰 Ünits Economy System - Exportaciones Principales
 *
 * Sistema completo de economía digital CoomÜnity que implementa los principios
 * de Economia Sagrada con revenue sharing, reciprocidad y community bonus
 */

// Componentes principales del sistema de economía
export { default as UnitsTransactionModal } from './UnitsTransactionModal';
export { default as RevenueSharingSystem } from './RevenueSharingSystem';
export { default as ReciprocityIncentivesSystem } from './ReciprocityIncentivesSystem';

// Tipos TypeScript para el sistema de economía
export type {
  // Transaction types
  UnitsTransactionModalProps,
  TransactionStep,
  
  // Revenue sharing types  
  RevenueTransaction,
  RevenueStats,
  RevenueSharingSystemProps,
  
  // Reciprocity incentives types
  ReciprocityEvent,
  CommunityBonus,
  IncentiveMetrics,
  ReciprocityIncentivesSystemProps,
} from './types';

// Re-export utility functions
export {
  formatUnitsAmount,
  calculateRevenueSharing,
  calculateReciprocityMultiplier,
  getPhilosophyColor,
  getCurrencyIcon,
  getCurrencyName,
} from './utils';