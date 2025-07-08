/// <reference types="node" />
import { EventEmitter } from 'events';
import { SystemHealthMetrics, GuardianType, PhilosophyPrinciple } from '../types';
export interface ScheduleConfig {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    priority: number;
    timezone: string;
    type: 'interval' | 'cron' | 'event_driven' | 'adaptive' | 'conditional';
    interval?: {
        minutes: number;
        maxExecutions?: number;
    };
    cron?: {
        expression: string;
        allowConcurrent: boolean;
    };
    eventDriven?: {
        triggerEvents: string[];
        debounceMs: number;
        cooldownMs: number;
    };
    adaptive?: {
        baseInterval: number;
        minInterval: number;
        maxInterval: number;
        adaptationFactor: number;
        learningPeriod: number;
    };
    conditional?: {
        conditions: ScheduleCondition[];
        evaluationInterval: number;
        requireAllConditions: boolean;
    };
}
export interface ScheduleCondition {
    id: string;
    type: 'system_health' | 'philosophy_score' | 'guardian_performance' | 'time_range' | 'file_changes' | 'custom';
    operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains' | 'matches';
    value: any;
    weight: number;
    systemHealth?: {
        metric: keyof SystemHealthMetrics;
        threshold: number;
    };
    philosophyScore?: {
        principle?: PhilosophyPrinciple;
        overall?: boolean;
        threshold: number;
    };
    guardianPerformance?: {
        guardianType: GuardianType;
        metric: 'success_rate' | 'average_score' | 'execution_time';
        threshold: number;
    };
    timeRange?: {
        startHour: number;
        endHour: number;
        daysOfWeek: number[];
    };
    fileChanges?: {
        patterns: string[];
        sinceMinutes: number;
        changeType: 'any' | 'add' | 'modify' | 'delete';
    };
    custom?: {
        evaluator: string;
        parameters: Record<string, any>;
    };
}
export interface ScheduledExecution {
    id: string;
    scheduleId: string;
    pipelineId: string;
    scheduledTime: Date;
    actualTime?: Date;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    executionTime?: number;
    result?: any;
    reason?: string;
    metadata: {
        triggerType: string;
        conditions?: Record<string, boolean>;
        adaptiveScore?: number;
    };
}
export interface SchedulerStats {
    totalSchedules: number;
    activeSchedules: number;
    totalExecutions: number;
    successfulExecutions: number;
    skippedExecutions: number;
    averageExecutionTime: number;
    adaptiveAdjustments: number;
    conditionEvaluations: number;
    typeDistribution: Record<string, number>;
    performanceByType: Record<string, {
        executions: number;
        successRate: number;
        averageLatency: number;
    }>;
}
export interface AdaptiveLearning {
    scheduleId: string;
    executionHistory: Array<{
        timestamp: Date;
        executionTime: number;
        success: boolean;
        systemLoad: number;
        philosophyScore: number;
    }>;
    patterns: {
        optimalTimes: number[];
        systemLoadCorrelation: number;
        philosophyCorrelation: number;
        seasonalPatterns: Record<string, number>;
    };
    recommendations: {
        suggestedInterval: number;
        optimalTimeWindows: Array<{
            start: number;
            end: number;
        }>;
        avoidancePatterns: string[];
    };
}
export declare class IntelligentScheduler extends EventEmitter {
    private schedules;
    private cronJobs;
    private intervalTimers;
    private executionHistory;
    private adaptiveLearning;
    private stats;
    private isRunning;
    constructor();
    start(): void;
    stop(): void;
    createSchedule(config: ScheduleConfig, pipelineId: string): string;
    private startSchedule;
    private startIntervalSchedule;
    private startCronSchedule;
    private startAdaptiveSchedule;
    private executeScheduledPipeline;
    private startConditionalEvaluator;
    private evaluateConditions;
    private evaluateCondition;
    private evaluateSystemHealthCondition;
    private evaluatePhilosophyCondition;
    private evaluateGuardianPerformanceCondition;
    private evaluateTimeRangeCondition;
    private evaluateFileChangesCondition;
    private evaluateCustomCondition;
    private startAdaptiveLearning;
    private performAdaptiveLearningAnalysis;
    private analyzeExecutionPatterns;
    private generateRecommendations;
    private compareValues;
    private calculateCorrelation;
    private calculateAverageSuccessfulInterval;
    private calculateAdaptiveScore;
    private calculateRecentSuccessRate;
    private getCurrentSystemLoadFactor;
    private getCurrentPhilosophyFactor;
    private calculateAdaptiveInterval;
    private updateAdaptiveLearning;
    private initializeAdaptiveLearning;
    private validateScheduleConfig;
    private updatePerformanceStats;
    private setupEventHandlers;
    private handleFileChangeEvent;
    private handleAnalysisCompletedEvent;
    private handlePhilosophyDegradedEvent;
    private stopSchedule;
    private initializeStats;
    getStats(): SchedulerStats;
    getSchedules(): ScheduleConfig[];
    getExecutionHistory(scheduleId?: string): ScheduledExecution[];
    getAdaptiveLearning(scheduleId: string): AdaptiveLearning | undefined;
    updateSchedule(scheduleId: string, updates: Partial<ScheduleConfig>): boolean;
    deleteSchedule(scheduleId: string): boolean;
    pauseSchedule(scheduleId: string): boolean;
    resumeSchedule(scheduleId: string): boolean;
}
export default IntelligentScheduler;
