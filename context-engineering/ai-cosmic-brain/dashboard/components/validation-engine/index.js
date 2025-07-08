"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHILOSOPHY_MESSAGES = exports.VALIDATION_CONSTANTS = exports.validationUtils = exports.defaultValidationConfig = exports.ValidationScheduler = exports.ValidationResults = exports.ValidationRuleManager = exports.AutomatedValidationEngine = void 0;
var AutomatedValidationEngine_1 = require("../AutomatedValidationEngine");
Object.defineProperty(exports, "AutomatedValidationEngine", { enumerable: true, get: function () { return AutomatedValidationEngine_1.AutomatedValidationEngine; } });
var ValidationRuleManager_1 = require("../ValidationRuleManager");
Object.defineProperty(exports, "ValidationRuleManager", { enumerable: true, get: function () { return ValidationRuleManager_1.ValidationRuleManager; } });
var ValidationResults_1 = require("../ValidationResults");
Object.defineProperty(exports, "ValidationResults", { enumerable: true, get: function () { return ValidationResults_1.ValidationResults; } });
var ValidationScheduler_1 = require("../ValidationScheduler");
Object.defineProperty(exports, "ValidationScheduler", { enumerable: true, get: function () { return ValidationScheduler_1.ValidationScheduler; } });
exports.defaultValidationConfig = {
    defaultIntervals: {
        philosophy: 1800000,
        architecture: 3600000,
        ux: 2700000,
        performance: 900000
    },
    defaultRetryPolicy: {
        maxRetries: 3,
        backoffMultiplier: 2,
        maxBackoffTime: 300000
    },
    notificationConfig: {
        criticalErrors: true,
        warnings: false,
        successfulRuns: false,
        scheduleChanges: true
    },
    systemLimits: {
        maxConcurrentValidations: 5,
        maxValidationDuration: 1800000,
        maxRulesPerSchedule: 20,
        maxSchedulesPerUser: 10
    }
};
exports.validationUtils = {
    calculateNextRun: (scheduleType, scheduleValue, timezone) => {
        const now = new Date();
        switch (scheduleType) {
            case 'interval':
                return new Date(now.getTime() + scheduleValue);
            case 'daily':
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const [hours, minutes] = scheduleValue.split(':');
                tomorrow.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                return tomorrow;
            case 'weekly':
                const nextWeek = new Date(now);
                nextWeek.setDate(nextWeek.getDate() + 7);
                return nextWeek;
            case 'monthly':
                const nextMonth = new Date(now);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                return nextMonth;
            default:
                return new Date(now.getTime() + exports.defaultValidationConfig.defaultIntervals.philosophy);
        }
    },
    formatDuration: (duration) => {
        if (duration < 1000)
            return `${duration}ms`;
        if (duration < 60000)
            return `${(duration / 1000).toFixed(1)}s`;
        return `${(duration / 60000).toFixed(1)}m`;
    },
    calculateSuccessRate: (totalRuns, successfulRuns) => {
        if (totalRuns === 0)
            return 0;
        return (successfulRuns / totalRuns) * 100;
    },
    calculateValidationPriority: (errors, warnings, lastRun) => {
        if (errors > 5)
            return 'critical';
        if (errors > 0)
            return 'high';
        if (warnings > 10)
            return 'medium';
        return 'low';
    },
    generateValidationSummary: (executions) => {
        const total = executions.length;
        const successful = executions.filter(e => e.result?.isValid).length;
        const failed = executions.filter(e => e.result?.errors?.length > 0).length;
        const warnings = executions.filter(e => e.result?.warnings?.length > 0).length;
        const totalDuration = executions.reduce((sum, e) => sum + (e.duration || 0), 0);
        const avgDuration = total > 0 ? totalDuration / total : 0;
        const successRate = total > 0 ? (successful / total) * 100 : 0;
        return {
            total,
            successful,
            failed,
            warnings,
            avgDuration,
            successRate
        };
    }
};
exports.VALIDATION_CONSTANTS = {
    VALIDATION_STATES: {
        PENDING: 'pending',
        RUNNING: 'running',
        COMPLETED: 'completed',
        FAILED: 'failed',
        CANCELLED: 'cancelled'
    },
    SCHEDULE_TYPES: {
        INTERVAL: 'interval',
        CRON: 'cron',
        DAILY: 'daily',
        WEEKLY: 'weekly',
        MONTHLY: 'monthly',
        TRIGGER: 'trigger'
    },
    PRIORITIES: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high',
        CRITICAL: 'critical'
    },
    GUARDIAN_COLORS: {
        philosophy: '#9C27B0',
        architecture: '#2196F3',
        ux: '#FF9800',
        performance: '#4CAF50'
    }
};
exports.PHILOSOPHY_MESSAGES = {
    bienComun: {
        title: "Bien Común en Validación",
        description: "Las validaciones automáticas benefician a todo el equipo, asegurando calidad compartida."
    },
    ayni: {
        title: "Ayni en Automatización",
        description: "Balance entre validación automática y revisión manual, respetando el flujo natural."
    },
    neguentropia: {
        title: "Neguentropía en Código",
        description: "Orden consciente a través de validaciones continuas que previenen el caos técnico."
    },
    metanoia: {
        title: "Metanöia en Desarrollo",
        description: "Transformación continua del código a través de feedback automático y consciente."
    }
};
//# sourceMappingURL=index.js.map