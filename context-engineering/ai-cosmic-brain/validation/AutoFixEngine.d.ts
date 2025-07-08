/// <reference types="node" />
import { EventEmitter } from 'events';
import { AutoFixAction, ValidationResult, RuleContext, GuardianType, PhilosophyPrinciple } from '../types';
export interface AutoFixConfig {
    enableAutoFix: boolean;
    riskThreshold: 'low' | 'medium' | 'high';
    requireApprovalForRisk: ('medium' | 'high')[];
    maxAutoFixesPerSession: number;
    enableBackups: boolean;
    backupDirectory: string;
    backupRetentionDays: number;
    compressBackups: boolean;
    enableRollback: boolean;
    rollbackTimeout: number;
    autoRollbackOnFailure: boolean;
    validateAfterFix: boolean;
    validationTimeout: number;
    requiredValidationScore: number;
    philosophyValidation: boolean;
    requiredPhilosophyAlignment: number;
}
export interface BackupMetadata {
    id: string;
    timestamp: Date;
    filePath: string;
    backupPath: string;
    checksum: string;
    size: number;
    reason: string;
    autoFixId: string;
}
export interface AutoFixExecution {
    id: string;
    action: AutoFixAction;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back';
    startTime: Date;
    endTime?: Date;
    backup?: BackupMetadata;
    validationResult?: ValidationResult;
    rollbackReason?: string;
    metadata: {
        guardianType: GuardianType;
        riskLevel: string;
        approvalRequired: boolean;
        philosophyImpact?: Record<PhilosophyPrinciple, number>;
    };
}
export interface AutoFixStats {
    totalExecutions: number;
    successfulFixes: number;
    failedFixes: number;
    rolledBackFixes: number;
    averageExecutionTime: number;
    riskLevelDistribution: Record<string, number>;
    guardianTypeDistribution: Record<GuardianType, number>;
    philosophyImprovements: Record<PhilosophyPrinciple, number>;
}
export declare class AutoFixEngine extends EventEmitter {
    private config;
    private executionHistory;
    private backupRegistry;
    private pendingApprovals;
    private stats;
    private sessionFixCount;
    constructor(config: AutoFixConfig);
    executeAutoFix(action: AutoFixAction, context: RuleContext, guardianType: GuardianType): Promise<string>;
    approveAutoFix(executionId: string, context: RuleContext): Promise<void>;
    rejectAutoFix(executionId: string, reason: string): void;
    private performAutoFix;
    private createBackup;
    private applyFix;
    private applyFileModification;
    private applyDependencyUpdate;
    private applyConfigChange;
    private applyCodeGeneration;
    private validateAfterFix;
    performRollback(executionId: string, reason: string): Promise<void>;
    private scheduleAutoRollback;
    private calculatePhilosophyImpact;
    private calculateOverallPhilosophyScore;
    private updatePhilosophyStats;
    private isRiskAcceptable;
    private requiresApproval;
    private isValidationSuccessful;
    private setNestedProperty;
    private setupCleanupScheduler;
    private cleanupOldBackups;
    private initializeStats;
    getStats(): AutoFixStats;
    getExecutionHistory(): AutoFixExecution[];
    getPendingApprovals(): AutoFixExecution[];
    getBackupRegistry(): BackupMetadata[];
    updateConfig(newConfig: Partial<AutoFixConfig>): void;
    clearHistory(olderThanDays?: number): void;
}
export default AutoFixEngine;
