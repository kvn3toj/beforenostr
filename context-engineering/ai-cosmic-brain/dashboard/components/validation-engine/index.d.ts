export { AutomatedValidationEngine } from '../AutomatedValidationEngine';
export { ValidationRuleManager } from '../ValidationRuleManager';
export { ValidationResults } from '../ValidationResults';
export { ValidationScheduler } from '../ValidationScheduler';
export type { GuardianType } from '../../types';
export declare const defaultValidationConfig: {
    defaultIntervals: {
        philosophy: number;
        architecture: number;
        ux: number;
        performance: number;
    };
    defaultRetryPolicy: {
        maxRetries: number;
        backoffMultiplier: number;
        maxBackoffTime: number;
    };
    notificationConfig: {
        criticalErrors: boolean;
        warnings: boolean;
        successfulRuns: boolean;
        scheduleChanges: boolean;
    };
    systemLimits: {
        maxConcurrentValidations: number;
        maxValidationDuration: number;
        maxRulesPerSchedule: number;
        maxSchedulesPerUser: number;
    };
};
export declare const validationUtils: {
    calculateNextRun: (scheduleType: string, scheduleValue: string | number, timezone?: string) => Date;
    formatDuration: (duration: number) => string;
    calculateSuccessRate: (totalRuns: number, successfulRuns: number) => number;
    calculateValidationPriority: (errors: number, warnings: number, lastRun?: Date) => 'low' | 'medium' | 'high' | 'critical';
    generateValidationSummary: (executions: any[]) => {
        total: number;
        successful: number;
        failed: number;
        warnings: number;
        avgDuration: number;
        successRate: number;
    };
};
export declare const VALIDATION_CONSTANTS: {
    VALIDATION_STATES: {
        readonly PENDING: "pending";
        readonly RUNNING: "running";
        readonly COMPLETED: "completed";
        readonly FAILED: "failed";
        readonly CANCELLED: "cancelled";
    };
    SCHEDULE_TYPES: {
        readonly INTERVAL: "interval";
        readonly CRON: "cron";
        readonly DAILY: "daily";
        readonly WEEKLY: "weekly";
        readonly MONTHLY: "monthly";
        readonly TRIGGER: "trigger";
    };
    PRIORITIES: {
        readonly LOW: "low";
        readonly MEDIUM: "medium";
        readonly HIGH: "high";
        readonly CRITICAL: "critical";
    };
    GUARDIAN_COLORS: {
        readonly philosophy: "#9C27B0";
        readonly architecture: "#2196F3";
        readonly ux: "#FF9800";
        readonly performance: "#4CAF50";
    };
};
export declare const PHILOSOPHY_MESSAGES: {
    bienComun: {
        title: string;
        description: string;
    };
    ayni: {
        title: string;
        description: string;
    };
    neguentropia: {
        title: string;
        description: string;
    };
    metanoia: {
        title: string;
        description: string;
    };
};
