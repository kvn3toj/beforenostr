/// <reference types="node" />
import { EventEmitter } from 'events';
import { CosmicBrain } from '../CosmicBrain';
import { ValidationRule, GuardianType, PhilosophyPrinciple } from '../types';
export interface RuleEngineConfig {
    maxConcurrentRules: number;
    defaultTimeout: number;
    retryAttempts: number;
    retryDelay: number;
    enabledGuardians: GuardianType[];
    guardianWeights: Record<GuardianType, number>;
    philosophyThresholds: Record<PhilosophyPrinciple, number>;
    philosophyWeights: Record<PhilosophyPrinciple, number>;
    enableAutoFix: boolean;
    autoFixThreshold: number;
    backupBeforeFix: boolean;
    enableScheduling: boolean;
    defaultSchedule: string;
    adaptiveScheduling: boolean;
}
export interface RuleContext {
    projectPath: string;
    targetFiles: string[];
    excludePatterns: string[];
    environment: 'development' | 'staging' | 'production';
    metadata: Record<string, any>;
}
export interface ValidationPipeline {
    id: string;
    name: string;
    description: string;
    rules: ValidationRule[];
    guardians: GuardianType[];
    context: RuleContext;
    schedule?: string;
    enabled: boolean;
    priority: number;
}
export interface AutoFixAction {
    id: string;
    type: 'file_modification' | 'dependency_update' | 'config_change' | 'code_generation';
    description: string;
    targetPath: string;
    changes: any;
    backup?: string;
    rollbackInstructions: string;
    riskLevel: 'low' | 'medium' | 'high';
    requiresApproval: boolean;
}
export interface ExecutionStats {
    totalExecutions: number;
    successRate: number;
    averageExecutionTime: number;
    autoFixesApplied: number;
    philosophyScore: number;
    guardianPerformance: Record<GuardianType, {
        executions: number;
        successRate: number;
        averageScore: number;
    }>;
}
export declare class AdvancedRuleEngine extends EventEmitter {
    private cosmicBrain;
    private config;
    private guardians;
    private activePipelines;
    private executionQueue;
    private isProcessing;
    private stats;
    constructor(cosmicBrain: CosmicBrain, config: RuleEngineConfig);
    private initializeGuardians;
    private setupEventHandlers;
    createValidationPipeline(pipeline: Omit<ValidationPipeline, 'id'>): Promise<string>;
    private validatePipelineRules;
    private validatePhilosophyRule;
    executePipeline(pipelineId: string, context?: Partial<RuleContext>): Promise<string>;
    private addToExecutionQueue;
    private processExecutionQueue;
    private executeValidation;
    private executeRule;
    private attemptAutoFix;
    private applyAutoFix;
    private calculateFinalScore;
    private calculatePhilosophyAlignment;
    private updateStats;
    private handleAnalysisCompleted;
    private handleEvolutionTriggered;
    private triggerAdaptiveValidations;
    private executeCriticalValidations;
    private shouldTriggerPipeline;
    private createBackup;
    private applyFileModification;
    private applyDependencyUpdate;
    private applyConfigChange;
    private applyCodeGeneration;
    private schedulePipeline;
    private initializeStats;
    getStats(): ExecutionStats;
    getActivePipelines(): ValidationPipeline[];
    pausePipeline(pipelineId: string): boolean;
    resumePipeline(pipelineId: string): boolean;
    deletePipeline(pipelineId: string): boolean;
    updateConfig(newConfig: Partial<RuleEngineConfig>): void;
}
export default AdvancedRuleEngine;
