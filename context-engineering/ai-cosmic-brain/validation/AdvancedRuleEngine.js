"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedRuleEngine = void 0;
const events_1 = require("events");
const ArchitectureGuardian_1 = require("../guardians/ArchitectureGuardian");
const UXGuardian_1 = require("../guardians/UXGuardian");
const PerformanceGuardian_1 = require("../guardians/PerformanceGuardian");
const PhilosophyGuardian_1 = require("../guardians/PhilosophyGuardian");
class AdvancedRuleEngine extends events_1.EventEmitter {
    constructor(cosmicBrain, config) {
        super();
        this.isProcessing = false;
        this.cosmicBrain = cosmicBrain;
        this.config = config;
        this.guardians = new Map();
        this.activePipelines = new Map();
        this.executionQueue = [];
        this.stats = this.initializeStats();
        this.initializeGuardians();
        this.setupEventHandlers();
    }
    initializeGuardians() {
        if (this.config.enabledGuardians.includes('architecture')) {
            this.guardians.set('architecture', new ArchitectureGuardian_1.ArchitectureGuardian());
        }
        if (this.config.enabledGuardians.includes('ux')) {
            this.guardians.set('ux', new UXGuardian_1.UXGuardian());
        }
        if (this.config.enabledGuardians.includes('performance')) {
            this.guardians.set('performance', new PerformanceGuardian_1.PerformanceGuardian());
        }
        if (this.config.enabledGuardians.includes('philosophy')) {
            this.guardians.set('philosophy', new PhilosophyGuardian_1.PhilosophyGuardian());
        }
        this.emit('guardians:initialized', {
            guardians: Array.from(this.guardians.keys()),
            timestamp: new Date()
        });
    }
    setupEventHandlers() {
        this.cosmicBrain.on('analysis:completed', this.handleAnalysisCompleted.bind(this));
        this.cosmicBrain.on('evolution:triggered', this.handleEvolutionTriggered.bind(this));
        setInterval(() => {
            if (!this.isProcessing && this.executionQueue.length > 0) {
                this.processExecutionQueue();
            }
        }, 1000);
    }
    async createValidationPipeline(pipeline) {
        const pipelineId = `pipeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newPipeline = {
            id: pipelineId,
            ...pipeline
        };
        await this.validatePipelineRules(newPipeline);
        this.activePipelines.set(pipelineId, newPipeline);
        if (newPipeline.schedule && this.config.enableScheduling) {
            this.schedulePipeline(newPipeline);
        }
        this.emit('pipeline:created', {
            pipelineId,
            pipeline: newPipeline,
            timestamp: new Date()
        });
        return pipelineId;
    }
    async validatePipelineRules(pipeline) {
        for (const rule of pipeline.rules) {
            if (!this.guardians.has(rule.guardianType)) {
                throw new Error(`Guardian '${rule.guardianType}' no está habilitado`);
            }
            const guardian = this.guardians.get(rule.guardianType);
            if (guardian && typeof guardian.validateRuleConfig === 'function') {
                await guardian.validateRuleConfig(rule.config);
            }
            if (rule.guardianType === 'philosophy') {
                this.validatePhilosophyRule(rule);
            }
        }
    }
    validatePhilosophyRule(rule) {
        const requiredPrinciples = [
            'bien_comun', 'ayni', 'cooperacion', 'economia_sagrada',
            'metanoia', 'negentropia', 'vocacion'
        ];
        const ruleConfig = rule.config;
        if (ruleConfig.principles) {
            for (const principle of ruleConfig.principles) {
                if (!requiredPrinciples.includes(principle)) {
                    throw new Error(`Principio de filosofía inválido: ${principle}`);
                }
            }
        }
    }
    async executePipeline(pipelineId, context) {
        const pipeline = this.activePipelines.get(pipelineId);
        if (!pipeline) {
            throw new Error(`Pipeline '${pipelineId}' no encontrado`);
        }
        if (!pipeline.enabled) {
            throw new Error(`Pipeline '${pipelineId}' está deshabilitado`);
        }
        const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const execution = {
            id: executionId,
            pipelineId,
            status: 'pending',
            startTime: new Date(),
            context: { ...pipeline.context, ...context },
            results: [],
            metadata: {
                priority: pipeline.priority,
                guardianCount: pipeline.guardians.length,
                ruleCount: pipeline.rules.length
            }
        };
        this.addToExecutionQueue(execution);
        this.emit('execution:queued', {
            executionId,
            pipelineId,
            queuePosition: this.executionQueue.length,
            timestamp: new Date()
        });
        return executionId;
    }
    addToExecutionQueue(execution) {
        const priority = execution.metadata?.priority || 0;
        let insertIndex = 0;
        for (let i = 0; i < this.executionQueue.length; i++) {
            const queuedPriority = this.executionQueue[i].metadata?.priority || 0;
            if (priority > queuedPriority) {
                insertIndex = i;
                break;
            }
            insertIndex = i + 1;
        }
        this.executionQueue.splice(insertIndex, 0, execution);
    }
    async processExecutionQueue() {
        if (this.isProcessing || this.executionQueue.length === 0) {
            return;
        }
        this.isProcessing = true;
        const concurrentLimit = this.config.maxConcurrentRules;
        const activeExecutions = [];
        try {
            while (this.executionQueue.length > 0 && activeExecutions.length < concurrentLimit) {
                const execution = this.executionQueue.shift();
                const executionPromise = this.executeValidation(execution);
                activeExecutions.push(executionPromise);
            }
            await Promise.allSettled(activeExecutions);
        }
        finally {
            this.isProcessing = false;
        }
    }
    async executeValidation(execution) {
        const pipeline = this.activePipelines.get(execution.pipelineId);
        if (!pipeline) {
            execution.status = 'failed';
            execution.error = `Pipeline '${execution.pipelineId}' no encontrado`;
            return;
        }
        execution.status = 'running';
        this.emit('execution:started', { execution, timestamp: new Date() });
        try {
            for (const guardianType of pipeline.guardians) {
                const guardian = this.guardians.get(guardianType);
                if (!guardian)
                    continue;
                const guardianRules = pipeline.rules.filter(r => r.guardianType === guardianType);
                for (const rule of guardianRules) {
                    const result = await this.executeRule(rule, execution.context, guardian);
                    execution.results.push(result);
                    if (this.config.enableAutoFix && result.score < this.config.autoFixThreshold) {
                        await this.attemptAutoFix(result, execution.context);
                    }
                }
            }
            execution.finalScore = this.calculateFinalScore(execution.results);
            execution.philosophyAlignment = await this.calculatePhilosophyAlignment(execution.results);
            execution.status = 'completed';
            execution.endTime = new Date();
            this.updateStats(execution);
            this.emit('execution:completed', { execution, timestamp: new Date() });
        }
        catch (error) {
            execution.status = 'failed';
            execution.error = error instanceof Error ? error.message : 'Error desconocido';
            execution.endTime = new Date();
            this.emit('execution:failed', { execution, error, timestamp: new Date() });
        }
    }
    async executeRule(rule, context, guardian) {
        const startTime = Date.now();
        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout en ejecución de regla')), this.config.defaultTimeout);
            });
            const executionPromise = guardian.executeRule(rule, context);
            const result = await Promise.race([executionPromise, timeoutPromise]);
            return {
                ...result,
                executionTime: Date.now() - startTime,
                timestamp: new Date()
            };
        }
        catch (error) {
            return {
                ruleId: rule.id,
                guardianType: rule.guardianType,
                status: 'failed',
                score: 0,
                message: error instanceof Error ? error.message : 'Error en ejecución',
                executionTime: Date.now() - startTime,
                timestamp: new Date()
            };
        }
    }
    async attemptAutoFix(result, context) {
        if (!result.autoFixActions || result.autoFixActions.length === 0) {
            return;
        }
        for (const action of result.autoFixActions) {
            if (action.riskLevel === 'low' && !action.requiresApproval) {
                try {
                    await this.applyAutoFix(action, context);
                    this.emit('autofix:applied', {
                        action,
                        result,
                        context,
                        timestamp: new Date()
                    });
                    this.stats.autoFixesApplied++;
                }
                catch (error) {
                    this.emit('autofix:failed', {
                        action,
                        error,
                        timestamp: new Date()
                    });
                }
            }
        }
    }
    async applyAutoFix(action, context) {
        if (this.config.backupBeforeFix) {
            action.backup = await this.createBackup(action.targetPath);
        }
        switch (action.type) {
            case 'file_modification':
                await this.applyFileModification(action);
                break;
            case 'dependency_update':
                await this.applyDependencyUpdate(action);
                break;
            case 'config_change':
                await this.applyConfigChange(action);
                break;
            case 'code_generation':
                await this.applyCodeGeneration(action);
                break;
        }
    }
    calculateFinalScore(results) {
        if (results.length === 0)
            return 0;
        let totalScore = 0;
        let totalWeight = 0;
        for (const result of results) {
            const weight = this.config.guardianWeights[result.guardianType] || 1;
            totalScore += result.score * weight;
            totalWeight += weight;
        }
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }
    async calculatePhilosophyAlignment(results) {
        const philosophyResults = results.filter(r => r.guardianType === 'philosophy');
        if (philosophyResults.length === 0)
            return 0;
        let totalAlignment = 0;
        let totalWeight = 0;
        for (const result of philosophyResults) {
            if (result.philosophyMetrics) {
                for (const [principle, score] of Object.entries(result.philosophyMetrics)) {
                    const weight = this.config.philosophyWeights[principle] || 1;
                    totalAlignment += score * weight;
                    totalWeight += weight;
                }
            }
        }
        return totalWeight > 0 ? totalAlignment / totalWeight : 0;
    }
    updateStats(execution) {
        this.stats.totalExecutions++;
        if (execution.status === 'completed') {
            this.stats.successRate = (this.stats.successRate * (this.stats.totalExecutions - 1) + 1) / this.stats.totalExecutions;
        }
        const executionTime = execution.endTime.getTime() - execution.startTime.getTime();
        this.stats.averageExecutionTime = (this.stats.averageExecutionTime * (this.stats.totalExecutions - 1) + executionTime) / this.stats.totalExecutions;
        if (execution.philosophyAlignment) {
            this.stats.philosophyScore = (this.stats.philosophyScore * (this.stats.totalExecutions - 1) + execution.philosophyAlignment) / this.stats.totalExecutions;
        }
        for (const result of execution.results) {
            if (!this.stats.guardianPerformance[result.guardianType]) {
                this.stats.guardianPerformance[result.guardianType] = {
                    executions: 0,
                    successRate: 0,
                    averageScore: 0
                };
            }
            const guardianStats = this.stats.guardianPerformance[result.guardianType];
            guardianStats.executions++;
            if (result.status === 'passed') {
                guardianStats.successRate = (guardianStats.successRate * (guardianStats.executions - 1) + 1) / guardianStats.executions;
            }
            guardianStats.averageScore = (guardianStats.averageScore * (guardianStats.executions - 1) + result.score) / guardianStats.executions;
        }
    }
    async handleAnalysisCompleted(data) {
        if (this.config.adaptiveScheduling) {
            await this.triggerAdaptiveValidations(data.report);
        }
    }
    async handleEvolutionTriggered(data) {
        await this.executeCriticalValidations(data.metrics);
    }
    async triggerAdaptiveValidations(report) {
        for (const [pipelineId, pipeline] of this.activePipelines) {
            if (pipeline.enabled && this.shouldTriggerPipeline(pipeline, report)) {
                await this.executePipeline(pipelineId);
            }
        }
    }
    async executeCriticalValidations(metrics) {
        const criticalPipelines = Array.from(this.activePipelines.values())
            .filter(p => p.enabled && p.priority >= 8)
            .sort((a, b) => b.priority - a.priority);
        for (const pipeline of criticalPipelines) {
            await this.executePipeline(pipeline.id);
        }
    }
    shouldTriggerPipeline(pipeline, report) {
        if (report.overallScore < 0.7 && pipeline.guardians.includes('architecture')) {
            return true;
        }
        if (report.philosophyAlignment < 0.8 && pipeline.guardians.includes('philosophy')) {
            return true;
        }
        return false;
    }
    async createBackup(filePath) {
        return `backup_${Date.now()}_${filePath.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
    async applyFileModification(action) {
    }
    async applyDependencyUpdate(action) {
    }
    async applyConfigChange(action) {
    }
    async applyCodeGeneration(action) {
    }
    schedulePipeline(pipeline) {
    }
    initializeStats() {
        return {
            totalExecutions: 0,
            successRate: 0,
            averageExecutionTime: 0,
            autoFixesApplied: 0,
            philosophyScore: 0,
            guardianPerformance: {}
        };
    }
    getStats() {
        return { ...this.stats };
    }
    getActivePipelines() {
        return Array.from(this.activePipelines.values());
    }
    pausePipeline(pipelineId) {
        const pipeline = this.activePipelines.get(pipelineId);
        if (pipeline) {
            pipeline.enabled = false;
            this.emit('pipeline:paused', { pipelineId, timestamp: new Date() });
            return true;
        }
        return false;
    }
    resumePipeline(pipelineId) {
        const pipeline = this.activePipelines.get(pipelineId);
        if (pipeline) {
            pipeline.enabled = true;
            this.emit('pipeline:resumed', { pipelineId, timestamp: new Date() });
            return true;
        }
        return false;
    }
    deletePipeline(pipelineId) {
        if (this.activePipelines.delete(pipelineId)) {
            this.emit('pipeline:deleted', { pipelineId, timestamp: new Date() });
            return true;
        }
        return false;
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.emit('config:updated', { config: this.config, timestamp: new Date() });
    }
}
exports.AdvancedRuleEngine = AdvancedRuleEngine;
exports.default = AdvancedRuleEngine;
//# sourceMappingURL=AdvancedRuleEngine.js.map