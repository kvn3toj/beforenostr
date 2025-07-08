/// <reference types="node" />
import { EventEmitter } from 'events';
import { ValidationPipeline, ValidationResult, RuleContext, PhilosophyPrinciple } from '../types';
export interface IntegrationConfig {
    ruleEngine: {
        enabled: boolean;
        maxConcurrentRules: number;
        timeoutMs: number;
        retryAttempts: number;
    };
    autoFix: {
        enabled: boolean;
        maxConcurrentFixes: number;
        backupEnabled: boolean;
        rollbackEnabled: boolean;
        safetyChecks: boolean;
    };
    scheduler: {
        enabled: boolean;
        defaultInterval: number;
        maxSchedules: number;
        adaptiveLearning: boolean;
    };
    coordinator: {
        enabled: boolean;
        maxConcurrentTasks: number;
        consensusEnabled: boolean;
        crossValidation: boolean;
    };
    philosophy: {
        enabled: boolean;
        strictMode: boolean;
        principleWeights: Record<PhilosophyPrinciple, number>;
        minAlignmentScore: number;
    };
    integration: {
        pipelineMode: 'sequential' | 'parallel' | 'adaptive';
        errorHandling: 'strict' | 'tolerant' | 'adaptive';
        resultAggregation: 'weighted' | 'consensus' | 'best_of';
        performanceOptimization: boolean;
        realTimeUpdates: boolean;
    };
}
export interface IntegratedValidationResult {
    id: string;
    timestamp: Date;
    overallStatus: 'passed' | 'warning' | 'failed' | 'error';
    overallScore: number;
    componentResults: {
        ruleEngine?: ValidationResult[];
        autoFix?: any[];
        scheduler?: any[];
        coordinator?: any[];
        philosophy?: any;
    };
    integrationMetrics: {
        totalExecutionTime: number;
        componentSynchronization: number;
        dataConsistency: number;
        performanceScore: number;
        reliabilityScore: number;
    };
    aggregatedAnalysis: {
        criticalIssues: string[];
        recommendations: string[];
        philosophyAlignment: number;
        systemHealth: number;
        improvementOpportunities: Array<{
            component: string;
            issue: string;
            impact: 'high' | 'medium' | 'low';
            effort: 'low' | 'medium' | 'high';
            priority: number;
        }>;
    };
    coordinationInsights: {
        componentInteractions: Record<string, number>;
        bottlenecks: string[];
        optimizationSuggestions: string[];
        emergentPatterns: string[];
    };
}
export interface SystemIntegrationStats {
    totalValidations: number;
    successfulValidations: number;
    averageExecutionTime: number;
    averageScore: number;
    componentPerformance: Record<string, {
        executions: number;
        successRate: number;
        averageTime: number;
        averageScore: number;
        reliability: number;
    }>;
    integrationEfficiency: {
        synchronizationScore: number;
        dataConsistencyScore: number;
        resourceUtilization: number;
        scalabilityMetric: number;
    };
    trends: {
        scoreImprovement: number;
        performanceImprovement: number;
        reliabilityImprovement: number;
        philosophyAlignment: number;
    };
}
export declare class ValidationIntegrationEngine extends EventEmitter {
    private config;
    private ruleEngine;
    private autoFixEngine;
    private scheduler;
    private coordinator;
    private philosophyValidator;
    private validationHistory;
    private stats;
    private isRunning;
    private activePipelines;
    constructor(config: IntegrationConfig);
    private initializeComponents;
    start(): Promise<void>;
    stop(): Promise<void>;
    executeIntegratedValidation(context: RuleContext, pipelineConfig?: Partial<ValidationPipeline>): Promise<IntegratedValidationResult>;
    private executeSequentialValidation;
    private executeParallelValidation;
    private executeAdaptiveValidation;
    private executePhilosophyFirstStrategy;
    private executePerformanceOptimizedStrategy;
    private executeComprehensiveStrategy;
    private aggregateResults;
    private analyzeCoordination;
    private calculateIntegrationMetrics;
    private determineOverallStatus;
    private executeRuleEngineValidation;
    private executeCoordinationValidation;
    private executeAutoFixValidation;
    private shouldRunCoordination;
    private shouldRunAutoFix;
    private determineAdaptiveStrategy;
    private executePhilosophyFocusedRules;
    private executeCriticalRules;
    private executeQuickPhilosophyCheck;
    private performDeepCorrelationAnalysis;
    private performCrossComponentValidation;
    private calculateWeightedScore;
    private calculateSystemHealth;
    private generateImprovementOpportunities;
    private extractScore;
    private calculateCorrelation;
    private identifyBottlenecks;
    private generateOptimizationSuggestions;
    private detectEmergentPatterns;
    private calculateSynchronization;
    private calculateDataConsistency;
    private calculatePerformanceScore;
    private calculateReliabilityScore;
    private setupIntegrationHandlers;
    private setupRuleEngineHandlers;
    private setupAutoFixHandlers;
    private setupSchedulerHandlers;
    private setupCoordinatorHandlers;
    private setupPhilosophyHandlers;
    private handleComponentCompletion;
    private handleComponentFailure;
    private waitForActivePipelines;
    private getEnabledComponents;
    private updateStats;
    private initializeStats;
    getStats(): SystemIntegrationStats;
    getValidationHistory(limit?: number): IntegratedValidationResult[];
    updateConfig(updates: Partial<IntegrationConfig>): void;
    getStatus(): any;
    createCustomPipeline(name: string, components: string[], config: any): Promise<string>;
}
export default ValidationIntegrationEngine;
