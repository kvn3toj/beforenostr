export interface PatternPrediction {
    id: string;
    name: string;
    description: string;
    confidence: number;
    emergenceDate: Date;
    predictedDate: Date;
    category: PatternCategory;
    impact: ImpactLevel;
    philosophyAlignment: number;
    evidence: string[];
    suggestedActions: string[];
    status: PredictionStatus;
}
export declare enum PatternCategory {
    ARCHITECTURE = "architecture",
    UI_UX = "ui_ux",
    COLLABORATION = "collaboration",
    PHILOSOPHY = "philosophy",
    TECHNICAL = "technical",
    PROCESS = "process"
}
export declare enum ImpactLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum PredictionStatus {
    PENDING = "pending",
    VALIDATED = "validated",
    REJECTED = "rejected",
    EVOLVED = "evolved"
}
export interface Mission {
    id: string;
    title: string;
    description: string;
    priority: MissionPriority;
    category: MissionCategory;
    assignedDate: Date;
    dueDate?: Date;
    progress: number;
    status: MissionStatus;
    philosophyBenefit: string;
    technicalBenefit: string;
    requirements: string[];
    deliverables: string[];
    dependencies: string[];
    estimatedEffort: number;
    actualEffort?: number;
    tags: string[];
}
export declare enum MissionPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent",
    CRITICAL = "critical"
}
export declare enum MissionCategory {
    ARCHITECTURE = "architecture",
    FEATURE = "feature",
    REFACTOR = "refactor",
    DOCUMENTATION = "documentation",
    TESTING = "testing",
    PHILOSOPHY = "philosophy",
    PROCESS = "process"
}
export declare enum MissionStatus {
    ASSIGNED = "assigned",
    IN_PROGRESS = "in_progress",
    BLOCKED = "blocked",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export interface HarmonyMetrics {
    overall: number;
    collaboration: CollaborationMetrics;
    philosophy: PhilosophyMetrics;
    technical: TechnicalMetrics;
    communication: CommunicationMetrics;
    wellbeing: WellbeingMetrics;
    timestamp: Date;
    trends: HarmonyTrend[];
}
export interface CollaborationMetrics {
    ayniScore: number;
    pairProgramming: number;
    codeReviews: number;
    knowledgeSharing: number;
    conflictResolution: number;
}
export interface PhilosophyMetrics {
    bienComunAlignment: number;
    cooperationOverCompetition: number;
    sustainabilityFocus: number;
    transparencyLevel: number;
    inclusivityScore: number;
}
export interface TechnicalMetrics {
    codeQuality: number;
    testCoverage: number;
    architectureCompliance: number;
    performanceScore: number;
    securityScore: number;
}
export interface CommunicationMetrics {
    clarityScore: number;
    responsivenessScore: number;
    empathyLevel: number;
    feedbackQuality: number;
}
export interface WellbeingMetrics {
    workLifeBalance: number;
    stressLevel: number;
    satisfactionLevel: number;
    burnoutRisk: number;
}
export interface HarmonyTrend {
    metric: string;
    direction: 'up' | 'down' | 'stable';
    change: number;
    period: string;
}
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
    philosophyAlignment: number;
}
export declare enum ChangeType {
    IMPROVEMENT = "improvement",
    OPTIMIZATION = "optimization",
    FEATURE_ADD = "feature_add",
    REFACTOR = "refactor",
    BUG_FIX = "bug_fix",
    PHILOSOPHY_ENHANCEMENT = "philosophy_enhancement"
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
    evolutionSpeed: number;
    adaptabilityScore: number;
    learningRate: number;
    stabilityScore: number;
    innovationIndex: number;
}
export interface CosmicConfig {
    evolutionInterval: number;
    predictionHorizon: number;
    harmonyAnalysisInterval: number;
    missionAssignmentInterval: number;
    philosophyWeight: number;
    autoEvolutionEnabled: boolean;
    debugMode: boolean;
}
export interface SystemMetrics {
    uptime: number;
    evolutionsCount: number;
    predictionsCount: number;
    missionsCount: number;
    harmonyAnalysesCount: number;
    averageHarmony: number;
    averagePhilosophyAlignment: number;
    lastUpdate: Date;
}
export type GuardianType = 'architecture' | 'ux' | 'performance' | 'philosophy' | 'security' | 'accessibility' | 'testing' | 'documentation';
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
    philosophyContext?: string;
    ayniScore?: number;
    bienComunImpact?: number;
    priority?: number;
    bienComunRank?: number;
}
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export interface PhilosophyAlignment {
    overall: number;
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
export type CoomUnityPrinciple = 'bienComun' | 'ayni' | 'cooperacion' | 'metanoia' | 'neguentropia' | 'vocacion' | 'economia_sagrada';
