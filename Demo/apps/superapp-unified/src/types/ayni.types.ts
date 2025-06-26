/**
 * Defines the shape of the Ayni Metrics data object
 * as returned by the backend endpoint `/users/{userId}/ayni-metrics`.
 * This type is used across services and hooks to ensure consistency.
 */
export interface AyniMetrics {
  ondas: number;
  meritos: number;
  balanceAyni: number;
  ayniLevel: string;
  nextLevel: string;
  ayniProgress: number;
  bienComunContributions: number;
  reciprocityScore: number;
  elementos: {
    fuego: number;
    agua: number;
    tierra: number;
    aire: number;
  };
  totalTransactions: number;
  positiveImpact: number;
  communityRank: number;
  weeklyGrowth: number;
  lastUpdated: string;
  joinedDate: string;
}
