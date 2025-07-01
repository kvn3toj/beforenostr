/**
 * 🎮 Console API Service - Backend Integration
 *
 * Servicio para conectar el frontend de la Consola con los endpoints del backend NestJS
 * Implementa todos los endpoints definidos en el backend Console Module
 */

import { ApiService } from './api.service';

// Types matching backend DTOs
export interface DashboardMetrics {
  activeUsers: {
    weekly: number;
    growth: number;
  };
  stageProgression: {
    seekerToSolver: number;
    target: number;
  };
  engagement: {
    gplEngagement: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
  };
  trustVotes: {
    thisWeek: number;
    dailyAverage: number;
  };
}

export interface ConsoleOverview {
  totalUsers: number;
  activeContests: number;
  pendingValidations: number;
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface ConsoleNotification {
  id: string;
  type: 'contest' | 'validation' | 'system' | 'user';
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  completionRate: number;
  timeframe: string;
  philosophyAlignment?: 'reciprocidad' | 'bien_comun' | 'metanoia';
}

export interface StageAnalytics {
  stageId: string;
  userCount: number;
  completionRate: number;
  averageTimeInStage: string;
  conversionRate: number;
}

export interface Contest {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  type: 'weekly' | 'monthly' | 'special';
  isActive: boolean;
  participants: number;
  totalPrize: number;
  leaderboard: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  position: number;
  meritos: number;
  ondas: number;
  isEligible: boolean;
}

export interface ContestAnalytics {
  contestId: string;
  totalParticipants: number;
  engagementRate: number;
  averageScore: number;
  completionRate: number;
}

export interface TrustVotingSystem {
  id: string;
  isActive: boolean;
  coompetenciaFormula: {
    ondasFactor: number;
    purchasesFactor: number;
    salesFactor: number;
    meritosFactor: number;
    childrenPurchasesFactor: number;
  };
}

export interface TrustVotingAnalytics {
  totalVotes: number;
  weeklyAverage: number;
  validationRate: number;
}

export interface GPLContent {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  videos: {
    id: string;
    title: string;
    duration: number;
    category: string;
    philosophyAlignment: string;
    isEpicContent: boolean;
  }[];
}

export interface GPLContentAnalytics {
  contentId: string;
  views: number;
  engagement: number;
  completionRate: number;
}

export interface OctalysisConfig {
  elements: OctalysisElement[];
}

export interface OctalysisElement {
  id: string;
  type: string;
  name: string;
  description: string;
  intensity: number;
  isActive: boolean;
}

export interface OctalysisAnalytics {
  totalElements: number;
  activeElements: number;
  averageIntensity: number;
  userEngagement: number;
}

class ConsoleApiService {
  private apiService: ApiService;

  constructor() {
    this.apiService = ApiService.getInstance();
  }

  // Console Analytics & Overview
  async getConsoleAnalytics(): Promise<DashboardMetrics> {
    try {
      const response = await this.apiService.get<DashboardMetrics>('/console/analytics');
      return response;
    } catch (error) {
      console.error('Error fetching console analytics:', error);
      throw error;
    }
  }

  async getConsoleOverview(): Promise<ConsoleOverview> {
    try {
      const response = await this.apiService.get<ConsoleOverview>('/console/overview');
      return response;
    } catch (error) {
      console.error('Error fetching console overview:', error);
      throw error;
    }
  }

  async getConsoleNotifications(): Promise<ConsoleNotification[]> {
    try {
      const response = await this.apiService.get<ConsoleNotification[]>('/console/notifications');
      return response;
    } catch (error) {
      console.error('Error fetching console notifications:', error);
      throw error;
    }
  }

  // Stages Management
  async getAllStages(): Promise<Stage[]> {
    try {
      const response = await this.apiService.get<Stage[]>('/console/stages');
      return response;
    } catch (error) {
      console.error('Error fetching stages:', error);
      throw error;
    }
  }

  async getStageById(stageId: string): Promise<Stage> {
    try {
      const response = await this.apiService.get<Stage>(`/console/stages/${stageId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching stage ${stageId}:`, error);
      throw error;
    }
  }

  async updateStage(stageId: string, data: Partial<Stage>): Promise<Stage> {
    try {
      const response = await this.apiService.put<Stage>(`/console/stages/${stageId}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating stage ${stageId}:`, error);
      throw error;
    }
  }

  async getStageAnalytics(stageId: string): Promise<StageAnalytics> {
    try {
      const response = await this.apiService.get<StageAnalytics>(`/console/stages/${stageId}/analytics`);
      return response;
    } catch (error) {
      console.error(`Error fetching stage ${stageId} analytics:`, error);
      throw error;
    }
  }

  // Contests Management
  async getAllContests(): Promise<Contest[]> {
    try {
      const response = await this.apiService.get<Contest[]>('/console/contests');
      return response;
    } catch (error) {
      console.error('Error fetching contests:', error);
      throw error;
    }
  }

  async getContestById(contestId: string): Promise<Contest> {
    try {
      const response = await this.apiService.get<Contest>(`/console/contests/${contestId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching contest ${contestId}:`, error);
      throw error;
    }
  }

  async createContest(data: Partial<Contest>): Promise<Contest> {
    try {
      const response = await this.apiService.post<Contest>('/console/contests', data);
      return response;
    } catch (error) {
      console.error('Error creating contest:', error);
      throw error;
    }
  }

  async updateContest(contestId: string, data: Partial<Contest>): Promise<Contest> {
    try {
      const response = await this.apiService.put<Contest>(`/console/contests/${contestId}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating contest ${contestId}:`, error);
      throw error;
    }
  }

  async getContestLeaderboard(contestId: string): Promise<LeaderboardEntry[]> {
    try {
      const response = await this.apiService.get<LeaderboardEntry[]>(`/console/contests/${contestId}/leaderboard`);
      return response;
    } catch (error) {
      console.error(`Error fetching contest ${contestId} leaderboard:`, error);
      throw error;
    }
  }

  async getContestAnalytics(contestId: string): Promise<ContestAnalytics> {
    try {
      const response = await this.apiService.get<ContestAnalytics>(`/console/contests/${contestId}/analytics`);
      return response;
    } catch (error) {
      console.error(`Error fetching contest ${contestId} analytics:`, error);
      throw error;
    }
  }

  // Trust Voting System
  async getTrustVotingSystem(): Promise<TrustVotingSystem> {
    try {
      const response = await this.apiService.get<TrustVotingSystem>('/console/trust-voting');
      return response;
    } catch (error) {
      console.error('Error fetching trust voting system:', error);
      throw error;
    }
  }

  async updateTrustVotingSystem(data: Partial<TrustVotingSystem>): Promise<TrustVotingSystem> {
    try {
      const response = await this.apiService.put<TrustVotingSystem>('/console/trust-voting', data);
      return response;
    } catch (error) {
      console.error('Error updating trust voting system:', error);
      throw error;
    }
  }

  async getTrustVotingAnalytics(): Promise<TrustVotingAnalytics> {
    try {
      const response = await this.apiService.get<TrustVotingAnalytics>('/console/trust-voting/analytics');
      return response;
    } catch (error) {
      console.error('Error fetching trust voting analytics:', error);
      throw error;
    }
  }

  // GPL Content Management
  async getAllGPLContent(): Promise<GPLContent[]> {
    try {
      const response = await this.apiService.get<GPLContent[]>('/console/gpl-content');
      return response;
    } catch (error) {
      console.error('Error fetching GPL content:', error);
      throw error;
    }
  }

  async getGPLContentById(contentId: string): Promise<GPLContent> {
    try {
      const response = await this.apiService.get<GPLContent>(`/console/gpl-content/${contentId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching GPL content ${contentId}:`, error);
      throw error;
    }
  }

  async updateGPLContent(contentId: string, data: Partial<GPLContent>): Promise<GPLContent> {
    try {
      const response = await this.apiService.put<GPLContent>(`/console/gpl-content/${contentId}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating GPL content ${contentId}:`, error);
      throw error;
    }
  }

  async getGPLContentAnalytics(contentId: string): Promise<GPLContentAnalytics> {
    try {
      const response = await this.apiService.get<GPLContentAnalytics>(`/console/gpl-content/${contentId}/analytics`);
      return response;
    } catch (error) {
      console.error(`Error fetching GPL content ${contentId} analytics:`, error);
      throw error;
    }
  }

  // Octalysis Framework
  async getOctalysisConfig(): Promise<OctalysisConfig> {
    try {
      const response = await this.apiService.get<OctalysisConfig>('/console/octalysis');
      return response;
    } catch (error) {
      console.error('Error fetching Octalysis config:', error);
      throw error;
    }
  }

  async updateOctalysisElement(elementId: string, element: Partial<OctalysisElement>): Promise<OctalysisElement> {
    try {
      const response = await this.apiService.put<OctalysisElement>(`/console/octalysis/elements/${elementId}`, element);
      return response;
    } catch (error) {
      console.error(`Error updating Octalysis element ${elementId}:`, error);
      throw error;
    }
  }

  async getOctalysisAnalytics(): Promise<OctalysisAnalytics> {
    try {
      const response = await this.apiService.get<OctalysisAnalytics>('/console/octalysis/analytics');
      return response;
    } catch (error) {
      console.error('Error fetching Octalysis analytics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const consoleApiService = new ConsoleApiService();
