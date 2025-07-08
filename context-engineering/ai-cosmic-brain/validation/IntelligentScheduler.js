"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligentScheduler = void 0;
const events_1 = require("events");
const cron_1 = require("cron");
class IntelligentScheduler extends events_1.EventEmitter {
    constructor() {
        super();
        this.isRunning = false;
        this.schedules = new Map();
        this.cronJobs = new Map();
        this.intervalTimers = new Map();
        this.executionHistory = new Map();
        this.adaptiveLearning = new Map();
        this.stats = this.initializeStats();
        this.setupEventHandlers();
    }
    start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        for (const [scheduleId, config] of this.schedules) {
            if (config.enabled) {
                this.startSchedule(scheduleId);
            }
        }
        this.startConditionalEvaluator();
        this.startAdaptiveLearning();
        this.emit('scheduler:started', { timestamp: new Date() });
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        for (const [scheduleId, cronJob] of this.cronJobs) {
            cronJob.stop();
        }
        this.cronJobs.clear();
        for (const [scheduleId, timer] of this.intervalTimers) {
            clearInterval(timer);
        }
        this.intervalTimers.clear();
        this.emit('scheduler:stopped', { timestamp: new Date() });
    }
    createSchedule(config, pipelineId) {
        this.validateScheduleConfig(config);
        this.schedules.set(config.id, config);
        this.stats.totalSchedules++;
        this.stats.typeDistribution[config.type] = (this.stats.typeDistribution[config.type] || 0) + 1;
        if (config.type === 'adaptive') {
            this.initializeAdaptiveLearning(config.id);
        }
        if (this.isRunning && config.enabled) {
            this.startSchedule(config.id);
            this.stats.activeSchedules++;
        }
        this.emit('schedule:created', {
            scheduleId: config.id,
            pipelineId,
            config,
            timestamp: new Date()
        });
        return config.id;
    }
    startSchedule(scheduleId) {
        const config = this.schedules.get(scheduleId);
        if (!config || !config.enabled) {
            return;
        }
        switch (config.type) {
            case 'interval':
                this.startIntervalSchedule(scheduleId, config);
                break;
            case 'cron':
                this.startCronSchedule(scheduleId, config);
                break;
            case 'adaptive':
                this.startAdaptiveSchedule(scheduleId, config);
                break;
        }
    }
    startIntervalSchedule(scheduleId, config) {
        if (!config.interval)
            return;
        let executionCount = 0;
        const maxExecutions = config.interval.maxExecutions || Infinity;
        const timer = setInterval(async () => {
            if (executionCount >= maxExecutions) {
                this.stopSchedule(scheduleId);
                return;
            }
            await this.executeScheduledPipeline(scheduleId, 'interval');
            executionCount++;
        }, config.interval.minutes * 60 * 1000);
        this.intervalTimers.set(scheduleId, timer);
    }
    startCronSchedule(scheduleId, config) {
        if (!config.cron)
            return;
        const cronJob = new cron_1.CronJob(config.cron.expression, async () => {
            await this.executeScheduledPipeline(scheduleId, 'cron');
        }, null, true, config.timezone);
        this.cronJobs.set(scheduleId, cronJob);
    }
    startAdaptiveSchedule(scheduleId, config) {
        if (!config.adaptive)
            return;
        const adaptiveConfig = config.adaptive;
        let currentInterval = adaptiveConfig.baseInterval;
        const scheduleNext = () => {
            const timer = setTimeout(async () => {
                const startTime = Date.now();
                await this.executeScheduledPipeline(scheduleId, 'adaptive');
                const executionTime = Date.now() - startTime;
                await this.updateAdaptiveLearning(scheduleId, executionTime);
                currentInterval = await this.calculateAdaptiveInterval(scheduleId, currentInterval, adaptiveConfig);
                scheduleNext();
            }, currentInterval * 60 * 1000);
            this.intervalTimers.set(scheduleId, timer);
        };
        scheduleNext();
    }
    async executeScheduledPipeline(scheduleId, triggerType) {
        const config = this.schedules.get(scheduleId);
        if (!config)
            return;
        const executionId = `sched_exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const execution = {
            id: executionId,
            scheduleId,
            pipelineId: '',
            scheduledTime: new Date(),
            status: 'pending',
            metadata: {
                triggerType,
                adaptiveScore: await this.calculateAdaptiveScore(scheduleId)
            }
        };
        this.executionHistory.set(executionId, execution);
        try {
            execution.status = 'running';
            execution.actualTime = new Date();
            execution.status = 'completed';
            execution.executionTime = Date.now() - execution.actualTime.getTime();
            this.stats.totalExecutions++;
            this.stats.successfulExecutions++;
            this.updatePerformanceStats(config.type, execution.executionTime, true);
            this.emit('execution:completed', {
                execution,
                timestamp: new Date()
            });
        }
        catch (error) {
            execution.status = 'failed';
            execution.reason = error instanceof Error ? error.message : 'Error desconocido';
            this.updatePerformanceStats(config.type, 0, false);
            this.emit('execution:failed', {
                execution,
                error,
                timestamp: new Date()
            });
        }
    }
    startConditionalEvaluator() {
        setInterval(async () => {
            for (const [scheduleId, config] of this.schedules) {
                if (config.type === 'conditional' && config.enabled) {
                    const shouldExecute = await this.evaluateConditions(config);
                    if (shouldExecute) {
                        await this.executeScheduledPipeline(scheduleId, 'conditional');
                    }
                }
            }
        }, 30000);
    }
    async evaluateConditions(config) {
        if (!config.conditional)
            return false;
        const conditions = config.conditional.conditions;
        const results = [];
        for (const condition of conditions) {
            const result = await this.evaluateCondition(condition);
            results.push(result);
        }
        if (config.conditional.requireAllConditions) {
            return results.every(r => r);
        }
        else {
            return results.some(r => r);
        }
    }
    async evaluateCondition(condition) {
        switch (condition.type) {
            case 'system_health':
                return this.evaluateSystemHealthCondition(condition);
            case 'philosophy_score':
                return this.evaluatePhilosophyCondition(condition);
            case 'guardian_performance':
                return this.evaluateGuardianPerformanceCondition(condition);
            case 'time_range':
                return this.evaluateTimeRangeCondition(condition);
            case 'file_changes':
                return this.evaluateFileChangesCondition(condition);
            case 'custom':
                return this.evaluateCustomCondition(condition);
            default:
                return false;
        }
    }
    async evaluateSystemHealthCondition(condition) {
        if (!condition.systemHealth)
            return false;
        const systemMetrics = {
            overallScore: 0.85,
            lastEvolution: new Date(),
            activeGuardians: 4,
            completedAnalyses: 150,
            averageExecutionTime: 2500,
            errorRate: 0.02,
            philosophyAlignment: 0.78
        };
        const metricValue = systemMetrics[condition.systemHealth.metric];
        const threshold = condition.systemHealth.threshold;
        return this.compareValues(metricValue, condition.operator, threshold);
    }
    async evaluatePhilosophyCondition(condition) {
        if (!condition.philosophyScore)
            return false;
        const philosophyScores = {
            overall: 0.82,
            bien_comun: 0.85,
            ayni: 0.78,
            cooperacion: 0.80,
            economia_sagrada: 0.75,
            metanoia: 0.88,
            negentropia: 0.90,
            vocacion: 0.72
        };
        let scoreValue;
        if (condition.philosophyScore.overall) {
            scoreValue = philosophyScores.overall;
        }
        else if (condition.philosophyScore.principle) {
            scoreValue = philosophyScores[condition.philosophyScore.principle];
        }
        else {
            return false;
        }
        return this.compareValues(scoreValue, condition.operator, condition.philosophyScore.threshold);
    }
    async evaluateGuardianPerformanceCondition(condition) {
        if (!condition.guardianPerformance)
            return false;
        const guardianMetrics = {
            architecture: { success_rate: 0.92, average_score: 0.85, execution_time: 1200 },
            ux: { success_rate: 0.88, average_score: 0.82, execution_time: 1500 },
            performance: { success_rate: 0.95, average_score: 0.90, execution_time: 800 },
            philosophy: { success_rate: 0.87, average_score: 0.79, execution_time: 2000 }
        };
        const guardianType = condition.guardianPerformance.guardianType;
        const metric = condition.guardianPerformance.metric;
        const threshold = condition.guardianPerformance.threshold;
        const metricValue = guardianMetrics[guardianType]?.[metric];
        if (metricValue === undefined)
            return false;
        return this.compareValues(metricValue, condition.operator, threshold);
    }
    evaluateTimeRangeCondition(condition) {
        if (!condition.timeRange)
            return false;
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay();
        const { startHour, endHour, daysOfWeek } = condition.timeRange;
        if (!daysOfWeek.includes(currentDay)) {
            return false;
        }
        if (startHour <= endHour) {
            return currentHour >= startHour && currentHour <= endHour;
        }
        else {
            return currentHour >= startHour || currentHour <= endHour;
        }
    }
    async evaluateFileChangesCondition(condition) {
        if (!condition.fileChanges)
            return false;
        const recentChanges = {
            modified: ['src/components/UPlay.tsx', 'src/pages/Dashboard.tsx'],
            added: ['src/components/NewFeature.tsx'],
            deleted: []
        };
        const { patterns, sinceMinutes, changeType } = condition.fileChanges;
        let relevantChanges = [];
        if (changeType === 'any' || changeType === 'modify') {
            relevantChanges.push(...recentChanges.modified);
        }
        if (changeType === 'any' || changeType === 'add') {
            relevantChanges.push(...recentChanges.added);
        }
        if (changeType === 'any' || changeType === 'delete') {
            relevantChanges.push(...recentChanges.deleted);
        }
        return patterns.some(pattern => relevantChanges.some(file => file.includes(pattern) || file.match(new RegExp(pattern))));
    }
    async evaluateCustomCondition(condition) {
        if (!condition.custom)
            return false;
        try {
            return Math.random() > 0.5;
        }
        catch (error) {
            this.emit('condition:evaluation_failed', {
                condition,
                error,
                timestamp: new Date()
            });
            return false;
        }
    }
    startAdaptiveLearning() {
        setInterval(() => {
            this.performAdaptiveLearningAnalysis();
        }, 60 * 60 * 1000);
    }
    performAdaptiveLearningAnalysis() {
        for (const [scheduleId, learning] of this.adaptiveLearning) {
            this.analyzeExecutionPatterns(scheduleId, learning);
            this.generateRecommendations(scheduleId, learning);
        }
    }
    analyzeExecutionPatterns(scheduleId, learning) {
        const history = learning.executionHistory;
        if (history.length < 10)
            return;
        const successfulExecutions = history.filter(h => h.success);
        const optimalTimes = successfulExecutions
            .map(h => h.timestamp.getHours())
            .reduce((acc, hour) => {
            acc[hour] = (acc[hour] || 0) + 1;
            return acc;
        }, {});
        learning.patterns.optimalTimes = Object.entries(optimalTimes)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([hour]) => parseInt(hour));
        const systemLoadCorrelation = this.calculateCorrelation(history.map(h => h.systemLoad), history.map(h => h.success ? 1 : 0));
        learning.patterns.systemLoadCorrelation = systemLoadCorrelation;
        const philosophyCorrelation = this.calculateCorrelation(history.map(h => h.philosophyScore), history.map(h => h.success ? 1 : 0));
        learning.patterns.philosophyCorrelation = philosophyCorrelation;
    }
    generateRecommendations(scheduleId, learning) {
        const patterns = learning.patterns;
        const avgSuccessfulInterval = this.calculateAverageSuccessfulInterval(learning);
        learning.recommendations.suggestedInterval = avgSuccessfulInterval;
        learning.recommendations.optimalTimeWindows = patterns.optimalTimes.map(hour => ({
            start: hour,
            end: (hour + 2) % 24
        }));
        const avoidancePatterns = [];
        if (patterns.systemLoadCorrelation < -0.5) {
            avoidancePatterns.push('high_system_load');
        }
        if (patterns.philosophyCorrelation < -0.3) {
            avoidancePatterns.push('low_philosophy_score');
        }
        learning.recommendations.avoidancePatterns = avoidancePatterns;
        this.emit('adaptive:recommendations_updated', {
            scheduleId,
            recommendations: learning.recommendations,
            timestamp: new Date()
        });
    }
    compareValues(value, operator, threshold) {
        switch (operator) {
            case 'gt': return value > threshold;
            case 'lt': return value < threshold;
            case 'eq': return value === threshold;
            case 'gte': return value >= threshold;
            case 'lte': return value <= threshold;
            case 'contains': return String(value).includes(String(threshold));
            case 'matches': return new RegExp(threshold).test(String(value));
            default: return false;
        }
    }
    calculateCorrelation(x, y) {
        if (x.length !== y.length || x.length === 0)
            return 0;
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        return denominator === 0 ? 0 : numerator / denominator;
    }
    calculateAverageSuccessfulInterval(learning) {
        const successfulExecutions = learning.executionHistory.filter(h => h.success);
        if (successfulExecutions.length < 2)
            return 60;
        const intervals = [];
        for (let i = 1; i < successfulExecutions.length; i++) {
            const interval = successfulExecutions[i].timestamp.getTime() - successfulExecutions[i - 1].timestamp.getTime();
            intervals.push(interval / (1000 * 60));
        }
        return intervals.reduce((a, b) => a + b, 0) / intervals.length;
    }
    async calculateAdaptiveScore(scheduleId) {
        const learning = this.adaptiveLearning.get(scheduleId);
        if (!learning)
            return 0.5;
        const recentSuccessRate = this.calculateRecentSuccessRate(learning);
        const systemLoadFactor = await this.getCurrentSystemLoadFactor();
        const philosophyFactor = await this.getCurrentPhilosophyFactor();
        return (recentSuccessRate * 0.5) + (systemLoadFactor * 0.3) + (philosophyFactor * 0.2);
    }
    calculateRecentSuccessRate(learning) {
        const recentExecutions = learning.executionHistory.slice(-10);
        if (recentExecutions.length === 0)
            return 0.5;
        const successCount = recentExecutions.filter(h => h.success).length;
        return successCount / recentExecutions.length;
    }
    async getCurrentSystemLoadFactor() {
        return 0.7;
    }
    async getCurrentPhilosophyFactor() {
        return 0.8;
    }
    async calculateAdaptiveInterval(scheduleId, currentInterval, config) {
        const learning = this.adaptiveLearning.get(scheduleId);
        if (!learning)
            return currentInterval;
        const adaptiveScore = await this.calculateAdaptiveScore(scheduleId);
        const adaptationFactor = config.adaptationFactor;
        let newInterval = currentInterval;
        if (adaptiveScore > 0.8) {
            newInterval = Math.max(config.minInterval, currentInterval * (1 - adaptationFactor));
        }
        else if (adaptiveScore < 0.4) {
            newInterval = Math.min(config.maxInterval, currentInterval * (1 + adaptationFactor));
        }
        return newInterval;
    }
    async updateAdaptiveLearning(scheduleId, executionTime) {
        const learning = this.adaptiveLearning.get(scheduleId);
        if (!learning)
            return;
        const systemLoad = await this.getCurrentSystemLoadFactor();
        const philosophyScore = await this.getCurrentPhilosophyFactor();
        learning.executionHistory.push({
            timestamp: new Date(),
            executionTime,
            success: executionTime < 5000,
            systemLoad,
            philosophyScore
        });
        if (learning.executionHistory.length > 100) {
            learning.executionHistory = learning.executionHistory.slice(-100);
        }
        this.stats.adaptiveAdjustments++;
    }
    initializeAdaptiveLearning(scheduleId) {
        this.adaptiveLearning.set(scheduleId, {
            scheduleId,
            executionHistory: [],
            patterns: {
                optimalTimes: [],
                systemLoadCorrelation: 0,
                philosophyCorrelation: 0,
                seasonalPatterns: {}
            },
            recommendations: {
                suggestedInterval: 60,
                optimalTimeWindows: [],
                avoidancePatterns: []
            }
        });
    }
    validateScheduleConfig(config) {
        if (!config.id || !config.name) {
            throw new Error('Schedule debe tener id y name');
        }
        if (this.schedules.has(config.id)) {
            throw new Error(`Schedule con id '${config.id}' ya existe`);
        }
        switch (config.type) {
            case 'interval':
                if (!config.interval || config.interval.minutes <= 0) {
                    throw new Error('Configuración de intervalo inválida');
                }
                break;
            case 'cron':
                if (!config.cron || !config.cron.expression) {
                    throw new Error('Expresión cron requerida');
                }
                break;
            case 'adaptive':
                if (!config.adaptive || config.adaptive.baseInterval <= 0) {
                    throw new Error('Configuración adaptativa inválida');
                }
                break;
            case 'conditional':
                if (!config.conditional || !config.conditional.conditions.length) {
                    throw new Error('Condiciones requeridas para schedule condicional');
                }
                break;
        }
    }
    updatePerformanceStats(type, executionTime, success) {
        if (!this.stats.performanceByType[type]) {
            this.stats.performanceByType[type] = {
                executions: 0,
                successRate: 0,
                averageLatency: 0
            };
        }
        const stats = this.stats.performanceByType[type];
        stats.executions++;
        if (success) {
            stats.successRate = (stats.successRate * (stats.executions - 1) + 1) / stats.executions;
            stats.averageLatency = (stats.averageLatency * (stats.executions - 1) + executionTime) / stats.executions;
        }
        else {
            stats.successRate = (stats.successRate * (stats.executions - 1)) / stats.executions;
        }
    }
    setupEventHandlers() {
        this.on('system:file_changed', (data) => {
            this.handleFileChangeEvent(data);
        });
        this.on('system:analysis_completed', (data) => {
            this.handleAnalysisCompletedEvent(data);
        });
        this.on('system:philosophy_degraded', (data) => {
            this.handlePhilosophyDegradedEvent(data);
        });
    }
    async handleFileChangeEvent(data) {
        for (const [scheduleId, config] of this.schedules) {
            if (config.type === 'event_driven' &&
                config.eventDriven?.triggerEvents.includes('file_changed') &&
                config.enabled) {
                await this.executeScheduledPipeline(scheduleId, 'event_driven');
            }
        }
    }
    async handleAnalysisCompletedEvent(data) {
        for (const [scheduleId, config] of this.schedules) {
            if (config.type === 'event_driven' &&
                config.eventDriven?.triggerEvents.includes('analysis_completed') &&
                config.enabled) {
                await this.executeScheduledPipeline(scheduleId, 'event_driven');
            }
        }
    }
    async handlePhilosophyDegradedEvent(data) {
        for (const [scheduleId, config] of this.schedules) {
            if (config.type === 'event_driven' &&
                config.eventDriven?.triggerEvents.includes('philosophy_degraded') &&
                config.enabled) {
                await this.executeScheduledPipeline(scheduleId, 'event_driven');
            }
        }
    }
    stopSchedule(scheduleId) {
        const cronJob = this.cronJobs.get(scheduleId);
        if (cronJob) {
            cronJob.stop();
            this.cronJobs.delete(scheduleId);
        }
        const timer = this.intervalTimers.get(scheduleId);
        if (timer) {
            clearInterval(timer);
            this.intervalTimers.delete(scheduleId);
        }
        this.stats.activeSchedules = Math.max(0, this.stats.activeSchedules - 1);
    }
    initializeStats() {
        return {
            totalSchedules: 0,
            activeSchedules: 0,
            totalExecutions: 0,
            successfulExecutions: 0,
            skippedExecutions: 0,
            averageExecutionTime: 0,
            adaptiveAdjustments: 0,
            conditionEvaluations: 0,
            typeDistribution: {},
            performanceByType: {}
        };
    }
    getStats() {
        return { ...this.stats };
    }
    getSchedules() {
        return Array.from(this.schedules.values());
    }
    getExecutionHistory(scheduleId) {
        const executions = Array.from(this.executionHistory.values());
        return scheduleId ? executions.filter(e => e.scheduleId === scheduleId) : executions;
    }
    getAdaptiveLearning(scheduleId) {
        return this.adaptiveLearning.get(scheduleId);
    }
    updateSchedule(scheduleId, updates) {
        const config = this.schedules.get(scheduleId);
        if (!config)
            return false;
        const updatedConfig = { ...config, ...updates };
        this.validateScheduleConfig(updatedConfig);
        this.stopSchedule(scheduleId);
        this.schedules.set(scheduleId, updatedConfig);
        if (this.isRunning && updatedConfig.enabled) {
            this.startSchedule(scheduleId);
        }
        this.emit('schedule:updated', {
            scheduleId,
            config: updatedConfig,
            timestamp: new Date()
        });
        return true;
    }
    deleteSchedule(scheduleId) {
        const config = this.schedules.get(scheduleId);
        if (!config)
            return false;
        this.stopSchedule(scheduleId);
        this.schedules.delete(scheduleId);
        this.adaptiveLearning.delete(scheduleId);
        this.stats.totalSchedules = Math.max(0, this.stats.totalSchedules - 1);
        this.stats.typeDistribution[config.type] = Math.max(0, this.stats.typeDistribution[config.type] - 1);
        this.emit('schedule:deleted', {
            scheduleId,
            timestamp: new Date()
        });
        return true;
    }
    pauseSchedule(scheduleId) {
        const config = this.schedules.get(scheduleId);
        if (!config)
            return false;
        config.enabled = false;
        this.stopSchedule(scheduleId);
        this.emit('schedule:paused', {
            scheduleId,
            timestamp: new Date()
        });
        return true;
    }
    resumeSchedule(scheduleId) {
        const config = this.schedules.get(scheduleId);
        if (!config)
            return false;
        config.enabled = true;
        if (this.isRunning) {
            this.startSchedule(scheduleId);
            this.stats.activeSchedules++;
        }
        this.emit('schedule:resumed', {
            scheduleId,
            timestamp: new Date()
        });
        return true;
    }
}
exports.IntelligentScheduler = IntelligentScheduler;
exports.default = IntelligentScheduler;
//# sourceMappingURL=IntelligentScheduler.js.map