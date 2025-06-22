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

// Specific result types for each agent to provide strong typing
interface FuegoTaskResults {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedResolution: string;
  resourcesNeeded: string[];
  ayniImpact: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface AguaTaskResults {
  stakeholdersNotified: string[];
  collaborationChannels: string[];
  consensusLevel: number;
  ayniFlow: 'BALANCED' | 'UNBALANCED';
}

interface TierraTaskResults {
  knowledgeArticlesCreated: number;
  bestPracticesUpdated: string[];
  wisdomScore: number;
  foundationStrength: 'SOLID' | 'NEEDS_IMPROVEMENT';
}

interface AireTaskResults {
  trendsIdentified: string[];
  innovationOpportunities: number;
  futureImpactScore: number;
  visionClarity: 'CRYSTAL_CLEAR' | 'NEEDS_FOCUS';
}

// A union type for all possible task results
type TaskResults =
  | FuegoTaskResults
  | AguaTaskResults
  | TierraTaskResults
  | AireTaskResults
  | Record<string, unknown>;

export interface CollaborationTask {
  id: string;
  type: 'ANALYZE' | 'PRIORITIZE' | 'RESOLVE' | 'DISTRIBUTE';
  feedbackId: string;
  assignedAgents: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  results: TaskResults;
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
