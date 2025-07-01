/**
 * 🎮 Console Service - Experience Management API
 *
 * Servicio para gestionar todas las funcionalidades de la Consola de Experiencias
 * Conecta con el backend NestJS para operaciones CRUD de gamificación avanzada
 */

import { apiService } from './api.service';

// Types from Experience Console
export interface UserStage {
  id: 'buyer' | 'seeker' | 'solver' | 'promoter';
  name: string;
  description: string;
  actions: StageAction[];
  requirements: StageRequirement[];
  rewards: StageReward[];
  timeframe: string;
  isActive: boolean;
  completionRate: number;
}

export interface StageAction {
  id: string;
  name: string;
  description: string;
  type: 'onboarding' | 'scaffolding' | 'endgame' | 'discovery';
  isRequired: boolean;
  isCompleted: boolean;
  octalysisElements: OctalysisElement[];
  mentalTriggers: MentalTrigger[];
}

export interface StageRequirement {
  id: string;
  type: 'meritos' | 'ondas' | 'trust_votes' | 'purchases' | 'time';
  value: number;
  description: string;
  isCompleted: boolean;
}

export interface StageReward {
  id: string;
  type: 'lukas' | 'meritos' | 'ondas' | 'access' | 'perks';
  value: number;
  description: string;
}

export interface OctalysisElement {
  id: string;
  type: 'epic' | 'accomplishment' | 'empowerment' | 'ownership' | 'social' | 'scarcity' | 'unpredictability' | 'avoidance';
  name: string;
  description: string;
  intensity: number; // 1-10
  isActive: boolean;
}

export interface MentalTrigger {
  id: string;
  type: 'reciprocity' | 'scarcity' | 'authority' | 'social_proof' | 'anticipation' | 'surprise';
  name: string;
  description: string;
  isActive: boolean;
}

export interface MeritContest {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  type: 'weekly' | 'monthly' | 'special';
  isActive: boolean;
  participants: number;
  totalPrize: number;
  rules: ContestRule[];
  leaderboard: LeaderboardEntry[];
}

export interface ContestRule {
  id: string;
  description: string;
  meritMultiplier: number;
  isActive: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  position: number;
  meritos: number;
  ondas: number;
  isEligible: boolean;
}

export interface TrustVotingSystem {
  id: string;
  isActive: boolean;
  coompetenciaFormula: CoompetenciaFormula;
  votingRules: VotingRule[];
  validationWorkflows: ValidationWorkflow[];
}

export interface CoompetenciaFormula {
  ondasFactor: number; // 0.1
  purchasesFactor: number; // 0.3
  salesFactor: number; // 0.4
  meritosFactor: number; // 0.2
  childrenPurchasesFactor: number; // 0.15
}

export interface VotingRule {
  id: string;
  fromStage: string;
  toStage: string;
  requiredCoompetencia: number;
  maxVotesPerWeek: number;
  voteWeight: number;
}

export interface ValidationWorkflow {
  id: string;
  stageName: string;
  requiresPromoterApproval: boolean;
  minimumTrustVotes: number;
  timeoutDays: number;
}

export interface GPLContentConfig {
  id: string;
  name: string;
  type: 'buyer' | 'seeker' | 'solver' | 'promoter' | 'frontier' | 'resonance';
  videos: GPLVideo[];
  questions: GPLQuestion[];
  unlockMechanism: UnlockMechanism;
  isActive: boolean;
}

export interface GPLVideo {
  id: string;
  title: string;
  duration: number;
  category: string;
  philosophyAlignment: 'reciprocidad' | 'bien_comun' | 'metanoia';
  activationTime?: Date;
  isEpicContent: boolean;
}

export interface GPLQuestion {
  id: string;
  videoId: string;
  timestamp: number;
  type: 'attention' | 'profiling' | 'summary';
  question: string;
  options: string[];
  correctAnswer: string;
  reward: {
    meritos: number;
    ondas: number;
  };
  socialValidation: {
    totalAnswers: number;
    popularChoice: string;
    consensusPercentage: number;
  };
}

export interface UnlockMechanism {
  id: string;
  type: 'rope' | 'meritos' | 'ondas' | 'time' | 'achievement';
  description: string;
  requiredValue: number;
  availableMinutes?: number;
}

export interface ConsoleAnalytics {
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
    status: 'excellent' | 'good' | 'needs_improvement';
  };
  trustVotes: {
    thisWeek: number;
    dailyAverage: number;
  };
}

export interface CreateContestRequest {
  name: string;
  type: 'weekly' | 'monthly' | 'special';
  startDate: Date;
  endDate: Date;
  totalPrize: number;
  rules: Omit<ContestRule, 'id'>[];
}

export interface UpdateStageRequest {
  id: string;
  isActive?: boolean;
  completionRate?: number;
  timeframe?: string;
  actions?: Partial<StageAction>[];
  requirements?: Partial<StageRequirement>[];
  rewards?: Partial<StageReward>[];
}

export interface UpdateTrustSystemRequest {
  isActive?: boolean;
  coompetenciaFormula?: Partial<CoompetenciaFormula>;
  votingRules?: Partial<VotingRule>[];
  validationWorkflows?: Partial<ValidationWorkflow>[];
}

export interface UpdateGPLContentRequest {
  id: string;
  isActive?: boolean;
  videos?: Partial<GPLVideo>[];
  questions?: Partial<GPLQuestion>[];
  unlockMechanism?: Partial<UnlockMechanism>;
}

class ConsoleService {
  // 🎭 Customer Journey / Stages Management
  async getAllStages(): Promise<UserStage[]> {
    return apiService.get<UserStage[]>('/console/stages');
  }

  async getStageById(stageId: string): Promise<UserStage> {
    return apiService.get<UserStage>(`/console/stages/${stageId}`);
  }

  async updateStage(stageId: string, data: UpdateStageRequest): Promise<UserStage> {
    return apiService.put<UserStage>(`/console/stages/${stageId}`, data);
  }

  async getStageAnalytics(stageId: string): Promise<any> {
    return apiService.get(`/console/stages/${stageId}/analytics`);
  }

  // 🏆 Merit Contests Management
  async getAllContests(): Promise<MeritContest[]> {
    return apiService.get<MeritContest[]>('/console/contests');
  }

  async getContestById(contestId: string): Promise<MeritContest> {
    return apiService.get<MeritContest>(`/console/contests/${contestId}`);
  }

  async createContest(data: CreateContestRequest): Promise<MeritContest> {
    return apiService.post<MeritContest>('/console/contests', data);
  }

  async updateContest(contestId: string, data: Partial<MeritContest>): Promise<MeritContest> {
    return apiService.put<MeritContest>(`/console/contests/${contestId}`, data);
  }

  async startContest(contestId: string): Promise<MeritContest> {
    return apiService.post<MeritContest>(`/console/contests/${contestId}/start`);
  }

  async pauseContest(contestId: string): Promise<MeritContest> {
    return apiService.post<MeritContest>(`/console/contests/${contestId}/pause`);
  }

  async endContest(contestId: string): Promise<MeritContest> {
    return apiService.post<MeritContest>(`/console/contests/${contestId}/end`);
  }

  async getContestLeaderboard(contestId: string): Promise<LeaderboardEntry[]> {
    return apiService.get<LeaderboardEntry[]>(`/console/contests/${contestId}/leaderboard`);
  }

  async getContestAnalytics(contestId: string): Promise<any> {
    return apiService.get(`/console/contests/${contestId}/analytics`);
  }

  // 🤝 Trust Voting System Management
  async getTrustVotingSystem(): Promise<TrustVotingSystem> {
    return apiService.get<TrustVotingSystem>('/console/trust-voting');
  }

  async updateTrustVotingSystem(data: UpdateTrustSystemRequest): Promise<TrustVotingSystem> {
    return apiService.put<TrustVotingSystem>('/console/trust-voting', data);
  }

  async updateCoompetenciaFormula(formula: Partial<CoompetenciaFormula>): Promise<CoompetenciaFormula> {
    return apiService.put<CoompetenciaFormula>('/console/trust-voting/formula', formula);
  }

  async addVotingRule(rule: Omit<VotingRule, 'id'>): Promise<VotingRule> {
    return apiService.post<VotingRule>('/console/trust-voting/rules', rule);
  }

  async updateVotingRule(ruleId: string, rule: Partial<VotingRule>): Promise<VotingRule> {
    return apiService.put<VotingRule>(`/console/trust-voting/rules/${ruleId}`, rule);
  }

  async deleteVotingRule(ruleId: string): Promise<void> {
    return apiService.delete(`/console/trust-voting/rules/${ruleId}`);
  }

  async updateValidationWorkflow(workflowId: string, workflow: Partial<ValidationWorkflow>): Promise<ValidationWorkflow> {
    return apiService.put<ValidationWorkflow>(`/console/trust-voting/workflows/${workflowId}`, workflow);
  }

  async getTrustVotingAnalytics(): Promise<any> {
    return apiService.get('/console/trust-voting/analytics');
  }

  // 🎬 GPL Content Management
  async getAllGPLContent(): Promise<GPLContentConfig[]> {
    return apiService.get<GPLContentConfig[]>('/console/gpl-content');
  }

  async getGPLContentById(contentId: string): Promise<GPLContentConfig> {
    return apiService.get<GPLContentConfig>(`/console/gpl-content/${contentId}`);
  }

  async updateGPLContent(contentId: string, data: UpdateGPLContentRequest): Promise<GPLContentConfig> {
    return apiService.put<GPLContentConfig>(`/console/gpl-content/${contentId}`, data);
  }

  async addGPLVideo(contentId: string, video: Omit<GPLVideo, 'id'>): Promise<GPLVideo> {
    return apiService.post<GPLVideo>(`/console/gpl-content/${contentId}/videos`, video);
  }

  async updateGPLVideo(contentId: string, videoId: string, video: Partial<GPLVideo>): Promise<GPLVideo> {
    return apiService.put<GPLVideo>(`/console/gpl-content/${contentId}/videos/${videoId}`, video);
  }

  async deleteGPLVideo(contentId: string, videoId: string): Promise<void> {
    return apiService.delete(`/console/gpl-content/${contentId}/videos/${videoId}`);
  }

  async addGPLQuestion(contentId: string, question: Omit<GPLQuestion, 'id'>): Promise<GPLQuestion> {
    return apiService.post<GPLQuestion>(`/console/gpl-content/${contentId}/questions`, question);
  }

  async updateGPLQuestion(contentId: string, questionId: string, question: Partial<GPLQuestion>): Promise<GPLQuestion> {
    return apiService.put<GPLQuestion>(`/console/gpl-content/${contentId}/questions/${questionId}`, question);
  }

  async deleteGPLQuestion(contentId: string, questionId: string): Promise<void> {
    return apiService.delete(`/console/gpl-content/${contentId}/questions/${questionId}`);
  }

  async updateUnlockMechanism(contentId: string, mechanism: Partial<UnlockMechanism>): Promise<UnlockMechanism> {
    return apiService.put<UnlockMechanism>(`/console/gpl-content/${contentId}/unlock-mechanism`, mechanism);
  }

  async getGPLContentAnalytics(contentId: string): Promise<any> {
    return apiService.get(`/console/gpl-content/${contentId}/analytics`);
  }

  // 🎯 Octalysis Framework Management
  async getOctalysisConfig(): Promise<any> {
    return apiService.get('/console/octalysis');
  }

  async updateOctalysisElement(elementId: string, element: Partial<OctalysisElement>): Promise<OctalysisElement> {
    return apiService.put<OctalysisElement>(`/console/octalysis/elements/${elementId}`, element);
  }

  async addMentalTrigger(trigger: Omit<MentalTrigger, 'id'>): Promise<MentalTrigger> {
    return apiService.post<MentalTrigger>('/console/octalysis/triggers', trigger);
  }

  async updateMentalTrigger(triggerId: string, trigger: Partial<MentalTrigger>): Promise<MentalTrigger> {
    return apiService.put<MentalTrigger>(`/console/octalysis/triggers/${triggerId}`, trigger);
  }

  async getOctalysisAnalytics(): Promise<any> {
    return apiService.get('/console/octalysis/analytics');
  }

  // 📊 Console Analytics & Overview
  async getConsoleAnalytics(): Promise<ConsoleAnalytics> {
    return apiService.get<ConsoleAnalytics>('/console/analytics');
  }

  async getConsoleOverview(): Promise<any> {
    return apiService.get('/console/overview');
  }

  async exportConsoleData(format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<any> {
    return apiService.get(`/console/export?format=${format}`);
  }

  async importConsoleData(file: File): Promise<any> {
    // For now, return a placeholder. This would need to be implemented
    // when the backend supports file upload
    console.warn('File upload not yet implemented in apiService');
    return Promise.resolve({ message: 'File upload feature coming soon' });
  }

  // 🔔 Real-time Notifications & Events
  async getConsoleNotifications(): Promise<any[]> {
    return apiService.get('/console/notifications');
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    return apiService.post(`/console/notifications/${notificationId}/read`);
  }

  async subscribeToConsoleEvents(): Promise<EventSource> {
    // WebSocket/SSE connection for real-time updates
    const baseUrl = 'http://localhost:3002'; // Use the same base URL as apiService
    return new EventSource(`${baseUrl}/console/events/stream`);
  }

  // 🎮 Game State Management (Deploy to SuperApp)
  async deployExperienceToSuperApp(experienceId: string): Promise<any> {
    return apiService.post(`/console/deploy/${experienceId}`);
  }

  async previewExperience(experienceId: string): Promise<any> {
    return apiService.get(`/console/preview/${experienceId}`);
  }

  async rollbackExperience(experienceId: string, version: string): Promise<any> {
    return apiService.post(`/console/rollback/${experienceId}/${version}`);
  }

  async getExperienceVersions(experienceId: string): Promise<any[]> {
    return apiService.get(`/console/experiences/${experienceId}/versions`);
  }

  // 🧪 A/B Testing & Experimentation
  async createABTest(test: any): Promise<any> {
    return apiService.post('/console/ab-tests', test);
  }

  async getABTestResults(testId: string): Promise<any> {
    return apiService.get(`/console/ab-tests/${testId}/results`);
  }

  async updateABTest(testId: string, data: any): Promise<any> {
    return apiService.put(`/console/ab-tests/${testId}`, data);
  }

  // 🎯 Targeting & Segmentation
  async getUserSegments(): Promise<any[]> {
    return apiService.get('/console/segments');
  }

  async createUserSegment(segment: any): Promise<any> {
    return apiService.post('/console/segments', segment);
  }

  async updateUserSegment(segmentId: string, segment: any): Promise<any> {
    return apiService.put(`/console/segments/${segmentId}`, segment);
  }

  async getSegmentAnalytics(segmentId: string): Promise<any> {
    return apiService.get(`/console/segments/${segmentId}/analytics`);
  }
}

// Export singleton instance
export const consoleService = new ConsoleService();
export default consoleService;
