import { PatternPrediction, ImpactLevel, CosmicConfig, HarmonyMetrics } from './types';
export interface CodebaseAnalysis {
    fileCount: number;
    linesOfCode: number;
    complexity: number;
    testCoverage: number;
    dependencies: string[];
    architecturePatterns: string[];
    recentChanges: ChangeAnalysis[];
}
export interface ChangeAnalysis {
    file: string;
    type: 'addition' | 'modification' | 'deletion';
    size: number;
    frequency: number;
    impact: ImpactLevel;
    philosophyAlignment: number;
}
export interface TrendAnalysis {
    metric: string;
    values: number[];
    trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    velocity: number;
    acceleration: number;
    confidence: number;
}
export interface PredictionContext {
    codebase: CodebaseAnalysis;
    harmony: HarmonyMetrics;
    trends: TrendAnalysis[];
    historicalPatterns: PatternPrediction[];
    teamSize: number;
    projectPhase: 'inception' | 'development' | 'maintenance' | 'evolution';
}
export declare class PatternPredictor {
    private config;
    private predictionHistory;
    private validatedPredictions;
    constructor(config: CosmicConfig);
    predictEmergingPatterns(context: PredictionContext): Promise<PatternPrediction[]>;
    private predictArchitecturalPatterns;
    private predictCollaborationPatterns;
    private predictPhilosophyPatterns;
    private predictTechnicalPatterns;
    private predictProcessPatterns;
    private predictUIUXPatterns;
    validatePredictions(currentContext: PredictionContext): Promise<PatternPrediction[]>;
    getPredictionAccuracy(): number;
    getPredictionStats(): {
        total: number;
        validated: number;
        rejected: number;
        pending: number;
        accuracy: number;
    };
    private applyQualityFilters;
    private sortByRelevance;
    private calculateRelevanceScore;
    private getImpactWeight;
    private findTrend;
    private calculateEmergenceDate;
    private calculateImpact;
    private checkIfPredictionRealized;
    private checkTechnicalPrediction;
    private checkCollaborationPrediction;
    private checkPhilosophyPrediction;
    private isPredictionExpired;
    private calculatePredictionAccuracy;
    private generateId;
    private log;
}
