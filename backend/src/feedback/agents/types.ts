/**
 * 🔮 CoP ORÁCULO - Tipos para Sistema Multi-Agente
 * Definiciones de tipos compartidas para el sistema de agentes
 */

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  element: 'FUEGO' | 'AGUA' | 'TIERRA' | 'AIRE';
  specialization: string;
  lukasBalance: number;
  level: number;
  activeQuests: string[];
}

export interface FeedbackAnalysis {
  sentiment: number; // -1 a 1
  urgency: number; // 1 a 5
  complexity: number; // 1 a 5
  category: string;
  recommendedPath: string;
  lukasReward: number;
}

export interface CollaborationTask {
  id: string;
  type: 'ANALYZE' | 'PRIORITIZE' | 'RESOLVE' | 'DISTRIBUTE';
  feedbackId: string;
  assignedAgents: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  results: any;
  lukasGenerated: number;
}

export interface CollaborationResult {
  tasks: CollaborationTask[];
  totalLukasGenerated: number;
  ayniBalance: number;
  collaborationScore: number;
}

export interface CommunityMetrics {
  wisdomQuotient: number;
  ayniIndex: number;
  collaborationVelocity: number;
  innovationScore: number;
}
