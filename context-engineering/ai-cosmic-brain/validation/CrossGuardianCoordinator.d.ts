/// <reference types="node" />
import { EventEmitter } from 'events';
import { ValidationRule, ValidationResult, RuleContext, GuardianType } from '../types';
export interface CoordinationTask {
    id: string;
    name: string;
    description: string;
    type: 'sequential' | 'parallel' | 'conditional' | 'pipeline' | 'consensus';
    priority: number;
    guardians: Array<{
        type: GuardianType;
        role: 'primary' | 'secondary' | 'validator' | 'observer';
        weight: number;
        dependencies: string[];
    }>;
    coordination: {
        timeout: number;
        retryAttempts: number;
        failureThreshold: number;
        requireConsensus: boolean;
        consensusThreshold: number;
        allowPartialSuccess: boolean;
    };
    guardianRules: Record<GuardianType, ValidationRule[]>;
    successCriteria: {
        minGuardianSuccess: number;
        requiredPhilosophyAlignment: number;
        overallScoreThreshold: number;
        criticalGuardians: GuardianType[];
    };
}
export interface CoordinationExecution {
    id: string;
    taskId: string;
    status: 'pending' | 'initializing' | 'coordinating' | 'validating' | 'completed' | 'failed' | 'partial_success';
    startTime: Date;
    endTime?: Date;
    guardianResults: Map<GuardianType, {
        status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
        results: ValidationResult[];
        executionTime: number;
        dependencies: string[];
        consensusVote?: 'approve' | 'reject' | 'abstain';
    }>;
    coordinationMetrics: {
        totalExecutionTime: number;
        guardianSynchronization: number;
        consensusReached: boolean;
        philosophyAlignment: number;
        overallScore: number;
        communicationLatency: number;
    };
    dependencyAnalysis: {
        resolved: string[];
        pending: string[];
        failed: string[];
        circularDependencies: string[][];
    };
    metadata: {
        context: RuleContext;
        triggeredBy: string;
        coordinationPattern: string;
        retryCount: number;
    };
}
export interface GuardianCommunication {
    id: string;
    from: GuardianType;
    to: GuardianType | 'all';
    type: 'request' | 'response' | 'notification' | 'consensus_vote' | 'dependency_update';
    timestamp: Date;
    payload: any;
    priority: 'low' | 'medium' | 'high' | 'critical';
    requiresResponse: boolean;
    responseTimeout?: number;
}
export interface ConsensusVoting {
    taskId: string;
    question: string;
    options: string[];
    votes: Map<GuardianType, {
        option: string;
        confidence: number;
        reasoning: string;
        timestamp: Date;
    }>;
    result?: {
        winner: string;
        confidence: number;
        unanimity: boolean;
        dissenting: GuardianType[];
    };
    deadline: Date;
    status: 'open' | 'closed' | 'expired';
}
export interface CoordinationStats {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    partialSuccessTasks: number;
    averageExecutionTime: number;
    averageGuardianSynchronization: number;
    consensusSuccessRate: number;
    communicationVolume: number;
    dependencyResolutionRate: number;
    guardianPerformance: Record<GuardianType, {
        tasksParticipated: number;
        successRate: number;
        averageScore: number;
        communicationLatency: number;
        consensusParticipation: number;
    }>;
    coordinationPatterns: Record<string, {
        usage: number;
        successRate: number;
        averageTime: number;
    }>;
}
export declare class CrossGuardianCoordinator extends EventEmitter {
    private tasks;
    private executions;
    private messageQueue;
    private consensusVotings;
    private guardianConnections;
    private stats;
    private isCoordinating;
    constructor();
    createCoordinationTask(task: CoordinationTask): Promise<string>;
    executeCoordinationTask(taskId: string, context: RuleContext, triggeredBy?: string): Promise<string>;
    private performCoordination;
    private performSequentialCoordination;
    private performParallelCoordination;
    private performConditionalCoordination;
    private performPipelineCoordination;
    private performConsensusCoordination;
    private executeGuardian;
    private executeGuardianRule;
    private createConsensusVoting;
    private collectConsensusVotes;
    private evaluateConsensus;
    private evaluateSuccessCriteria;
    private calculateOverallScore;
    private calculatePhilosophyAlignment;
    private validateCoordinationTask;
    private analyzeDependencies;
    private resolveDependencyOrder;
    private checkDependencies;
    private shouldContinueSequence;
    private synchronizeResults;
    private evaluateConditionalExecution;
    private executeGuardianWithPipelineData;
    private transformPipelineData;
    private shouldContinuePipeline;
    private notifyGuardianCompletion;
    private simulateGuardianVote;
    private generatePhilosophyMetrics;
    private sendMessage;
    private setupMessageProcessor;
    private processMessageQueue;
    private processMessage;
    private handleRequest;
    private handleResponse;
    private handleNotification;
    private handleConsensusVote;
    private handleDependencyUpdate;
    private setupEventHandlers;
    private updateStats;
    private initializeStats;
    getStats(): CoordinationStats;
    getTasks(): CoordinationTask[];
    getExecutionHistory(taskId?: string): CoordinationExecution[];
    getConsensusVotings(): ConsensusVoting[];
    getMessageQueue(): GuardianCommunication[];
    connectGuardian(guardianType: GuardianType, guardian: any): void;
    disconnectGuardian(guardianType: GuardianType): void;
    deleteTask(taskId: string): boolean;
    pauseCoordination(): void;
    resumeCoordination(): void;
}
export default CrossGuardianCoordinator;
