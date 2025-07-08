/**
 * 🌌 Tipos fundamentales del sistema de IA Cósmica
 *
 * Define las estructuras de datos que maneja el CosmicBrain
 * para auto-evolución, predicción de patrones y análisis de armonía.
 *
 * Filosofía CoomÜnity: Cada tipo refleja principios de transparencia,
 * colaboración y medición del Bien Común en el desarrollo.
 */

// 🔮 Predicción de patrones emergentes
export interface PatternPrediction {
  id: string;
  name: string;
  description: string;
  confidence: number; // 0-100
  emergenceDate: Date;
  predictedDate: Date;
  category: PatternCategory;
  impact: ImpactLevel;
  philosophyAlignment: number; // 0-100 - Alineación con filosofía CoomÜnity
  evidence: string[];
  suggestedActions: string[];
  status: PredictionStatus;
}

export enum PatternCategory {
  ARCHITECTURE = 'architecture',
  UI_UX = 'ui_ux',
  COLLABORATION = 'collaboration',
  PHILOSOPHY = 'philosophy',
  TECHNICAL = 'technical',
  PROCESS = 'process'
}

export enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum PredictionStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  REJECTED = 'rejected',
  EVOLVED = 'evolved'
}

// 🎯 Misiones auto-asignadas
export interface Mission {
  id: string;
  title: string;
  description: string;
  priority: MissionPriority;
  category: MissionCategory;
  assignedDate: Date;
  dueDate?: Date;
  progress: number; // 0-100
  status: MissionStatus;
  philosophyBenefit: string; // Cómo contribuye al Bien Común
  technicalBenefit: string;
  requirements: string[];
  deliverables: string[];
  dependencies: string[];
  estimatedEffort: number; // horas
  actualEffort?: number;
  tags: string[];
}

export enum MissionPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum MissionCategory {
  ARCHITECTURE = 'architecture',
  FEATURE = 'feature',
  REFACTOR = 'refactor',
  DOCUMENTATION = 'documentation',
  TESTING = 'testing',
  PHILOSOPHY = 'philosophy',
  PROCESS = 'process'
}

export enum MissionStatus {
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// 📊 Métricas de armonía del equipo
export interface HarmonyMetrics {
  overall: number; // 0-100
  collaboration: CollaborationMetrics;
  philosophy: PhilosophyMetrics;
  technical: TechnicalMetrics;
  communication: CommunicationMetrics;
  wellbeing: WellbeingMetrics;
  timestamp: Date;
  trends: HarmonyTrend[];
}

export interface CollaborationMetrics {
  ayniScore: number; // 0-100 - Reciprocidad en contribuciones
  pairProgramming: number; // 0-100
  codeReviews: number; // 0-100
  knowledgeSharing: number; // 0-100
  conflictResolution: number; // 0-100
}

export interface PhilosophyMetrics {
  bienComunAlignment: number; // 0-100 - Alineación con Bien Común
  cooperationOverCompetition: number; // 0-100
  sustainabilityFocus: number; // 0-100
  transparencyLevel: number; // 0-100
  inclusivityScore: number; // 0-100
}

export interface TechnicalMetrics {
  codeQuality: number; // 0-100
  testCoverage: number; // 0-100
  architectureCompliance: number; // 0-100
  performanceScore: number; // 0-100
  securityScore: number; // 0-100
}

export interface CommunicationMetrics {
  clarityScore: number; // 0-100
  responsivenessScore: number; // 0-100
  empathyLevel: number; // 0-100
  feedbackQuality: number; // 0-100
}

export interface WellbeingMetrics {
  workLifeBalance: number; // 0-100
  stressLevel: number; // 0-100 (inverso)
  satisfactionLevel: number; // 0-100
  burnoutRisk: number; // 0-100 (inverso)
}

export interface HarmonyTrend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  change: number; // porcentaje de cambio
  period: string;
}

// 🔄 Reportes de evolución
export interface EvolutionReport {
  id: string;
  timestamp: Date;
  version: string;
  changes: EvolutionChange[];
  impact: EvolutionImpact;
  metrics: EvolutionMetrics;
  recommendations: string[];
  nextEvolutionPrediction?: Date;
}

export interface EvolutionChange {
  area: string;
  description: string;
  type: ChangeType;
  impact: ImpactLevel;
  philosophyAlignment: number; // 0-100
}

export enum ChangeType {
  IMPROVEMENT = 'improvement',
  OPTIMIZATION = 'optimization',
  FEATURE_ADD = 'feature_add',
  REFACTOR = 'refactor',
  BUG_FIX = 'bug_fix',
  PHILOSOPHY_ENHANCEMENT = 'philosophy_enhancement'
}

export interface EvolutionImpact {
  systemHealth: {
    before: number;
    after: number;
    improvement: number;
  };
  philosophyAlignment: {
    before: number;
    after: number;
    improvement: number;
  };
  teamHarmony: {
    before: number;
    after: number;
    improvement: number;
  };
  productivity: {
    before: number;
    after: number;
    improvement: number;
  };
}

export interface EvolutionMetrics {
  evolutionSpeed: number; // velocidad de evolución
  adaptabilityScore: number; // capacidad de adaptación
  learningRate: number; // tasa de aprendizaje
  stabilityScore: number; // estabilidad del sistema
  innovationIndex: number; // índice de innovación
}

// 🌟 Configuración del sistema cósmico
export interface CosmicConfig {
  evolutionInterval: number; // minutos entre evoluciones
  predictionHorizon: number; // días hacia el futuro para predicciones
  harmonyAnalysisInterval: number; // minutos entre análisis de armonía
  missionAssignmentInterval: number; // minutos entre asignaciones de misiones
  philosophyWeight: number; // 0-1 peso de la filosofía en decisiones
  autoEvolutionEnabled: boolean;
  debugMode: boolean;
}

// 📈 Métricas del sistema
export interface SystemMetrics {
  uptime: number; // milisegundos
  evolutionsCount: number;
  predictionsCount: number;
  missionsCount: number;
  harmonyAnalysesCount: number;
  averageHarmony: number;
  averagePhilosophyAlignment: number;
  lastUpdate: Date;
}

/**
 * 🛡️ Guardian System Types
 * Tipos para el sistema de guardians especializados
 */

export type GuardianType =
  | 'architecture'
  | 'ux'
  | 'performance'
  | 'philosophy'
  | 'security'
  | 'accessibility'
  | 'testing'
  | 'documentation';

export interface AnalysisReport {
  id: string;
  guardianType: GuardianType;
  timestamp: Date;
  summary: string;
  recommendations: Recommendation[];
  metrics: Record<string, number>;
  philosophyAlignment?: PhilosophyAlignment;
  metadata: {
    version: string;
    duration: number;
    confidence: number;
    philosophyEnriched?: boolean;
    enrichmentTimestamp?: string;
    guardianWisdom?: string;
    [key: string]: any;
  };
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  timeline: string;
  resources?: string[];
  // Philosophy-enhanced properties
  philosophyContext?: string;
  ayniScore?: number;
  bienComunImpact?: number;
  priority?: number;
  bienComunRank?: number;
}

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface PhilosophyAlignment {
  overall: number; // 0-1 score
  principles: {
    bienComun: number;
    ayni: number;
    cooperacion: number;
    metanoia: number;
    neguentropia: number;
  };
  strengths: string[];
  opportunities: string[];
}

export type CoomUnityPrinciple =
  | 'bienComun'
  | 'ayni'
  | 'cooperacion'
  | 'metanoia'
  | 'neguentropia'
  | 'vocacion'
  | 'economia_sagrada';
