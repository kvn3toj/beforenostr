"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrossGuardianCoordinator = void 0;
const events_1 = require("events");
class CrossGuardianCoordinator extends events_1.EventEmitter {
    constructor() {
        super();
        this.isCoordinating = false;
        this.tasks = new Map();
        this.executions = new Map();
        this.messageQueue = [];
        this.consensusVotings = new Map();
        this.guardianConnections = new Map();
        this.stats = this.initializeStats();
        this.setupMessageProcessor();
        this.setupEventHandlers();
    }
    async createCoordinationTask(task) {
        this.validateCoordinationTask(task);
        const dependencyAnalysis = this.analyzeDependencies(task);
        if (dependencyAnalysis.circularDependencies.length > 0) {
            throw new Error(`Dependencias circulares detectadas: ${dependencyAnalysis.circularDependencies}`);
        }
        this.tasks.set(task.id, task);
        this.stats.totalTasks++;
        this.emit('task:created', {
            taskId: task.id,
            task,
            dependencyAnalysis,
            timestamp: new Date()
        });
        return task.id;
    }
    async executeCoordinationTask(taskId, context, triggeredBy = 'manual') {
        const task = this.tasks.get(taskId);
        if (!task) {
            throw new Error(`Tarea de coordinación '${taskId}' no encontrada`);
        }
        const executionId = `coord_exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const execution = {
            id: executionId,
            taskId,
            status: 'pending',
            startTime: new Date(),
            guardianResults: new Map(),
            coordinationMetrics: {
                totalExecutionTime: 0,
                guardianSynchronization: 0,
                consensusReached: false,
                philosophyAlignment: 0,
                overallScore: 0,
                communicationLatency: 0
            },
            dependencyAnalysis: this.analyzeDependencies(task),
            metadata: {
                context,
                triggeredBy,
                coordinationPattern: task.type,
                retryCount: 0
            }
        };
        for (const guardian of task.guardians) {
            execution.guardianResults.set(guardian.type, {
                status: 'pending',
                results: [],
                executionTime: 0,
                dependencies: guardian.dependencies
            });
        }
        this.executions.set(executionId, execution);
        await this.performCoordination(execution, task);
        return executionId;
    }
    async performCoordination(execution, task) {
        execution.status = 'initializing';
        this.emit('coordination:started', {
            executionId: execution.id,
            taskId: task.id,
            type: task.type,
            timestamp: new Date()
        });
        try {
            switch (task.type) {
                case 'sequential':
                    await this.performSequentialCoordination(execution, task);
                    break;
                case 'parallel':
                    await this.performParallelCoordination(execution, task);
                    break;
                case 'conditional':
                    await this.performConditionalCoordination(execution, task);
                    break;
                case 'pipeline':
                    await this.performPipelineCoordination(execution, task);
                    break;
                case 'consensus':
                    await this.performConsensusCoordination(execution, task);
                    break;
            }
            const success = await this.evaluateSuccessCriteria(execution, task);
            if (success) {
                execution.status = 'completed';
                this.stats.completedTasks++;
            }
            else if (task.coordination.allowPartialSuccess) {
                execution.status = 'partial_success';
                this.stats.partialSuccessTasks++;
            }
            else {
                execution.status = 'failed';
                this.stats.failedTasks++;
            }
        }
        catch (error) {
            execution.status = 'failed';
            this.stats.failedTasks++;
            this.emit('coordination:failed', {
                executionId: execution.id,
                error,
                timestamp: new Date()
            });
        }
        finally {
            execution.endTime = new Date();
            execution.coordinationMetrics.totalExecutionTime =
                execution.endTime.getTime() - execution.startTime.getTime();
            await this.updateStats(execution, task);
            this.emit('coordination:completed', {
                execution,
                timestamp: new Date()
            });
        }
    }
    async performSequentialCoordination(execution, task) {
        execution.status = 'coordinating';
        const orderedGuardians = this.resolveDependencyOrder(task.guardians);
        for (const guardian of orderedGuardians) {
            const dependenciesMet = await this.checkDependencies(guardian, execution);
            if (!dependenciesMet) {
                const guardianResult = execution.guardianResults.get(guardian.type);
                guardianResult.status = 'skipped';
                continue;
            }
            await this.executeGuardian(guardian, execution, task);
            const shouldContinue = await this.shouldContinueSequence(guardian, execution, task);
            if (!shouldContinue) {
                break;
            }
        }
    }
    async performParallelCoordination(execution, task) {
        execution.status = 'coordinating';
        const guardianPromises = task.guardians.map(guardian => this.executeGuardian(guardian, execution, task));
        await Promise.allSettled(guardianPromises);
        await this.synchronizeResults(execution, task);
    }
    async performConditionalCoordination(execution, task) {
        execution.status = 'coordinating';
        const primaryGuardians = task.guardians.filter(g => g.role === 'primary');
        for (const guardian of primaryGuardians) {
            await this.executeGuardian(guardian, execution, task);
        }
        for (const guardian of task.guardians.filter(g => g.role === 'secondary')) {
            const shouldExecute = await this.evaluateConditionalExecution(guardian, execution, task);
            if (shouldExecute) {
                await this.executeGuardian(guardian, execution, task);
            }
            else {
                const guardianResult = execution.guardianResults.get(guardian.type);
                guardianResult.status = 'skipped';
            }
        }
    }
    async performPipelineCoordination(execution, task) {
        execution.status = 'coordinating';
        let pipelineData = execution.metadata.context;
        const orderedGuardians = this.resolveDependencyOrder(task.guardians);
        for (const guardian of orderedGuardians) {
            const result = await this.executeGuardianWithPipelineData(guardian, pipelineData, execution, task);
            pipelineData = this.transformPipelineData(pipelineData, result, guardian);
            if (!this.shouldContinuePipeline(result, guardian, task)) {
                break;
            }
        }
    }
    async performConsensusCoordination(execution, task) {
        execution.status = 'coordinating';
        const guardianPromises = task.guardians.map(guardian => this.executeGuardian(guardian, execution, task));
        await Promise.allSettled(guardianPromises);
        const votingId = await this.createConsensusVoting(execution, task);
        await this.collectConsensusVotes(votingId, execution, task);
        const consensus = await this.evaluateConsensus(votingId, execution, task);
        execution.coordinationMetrics.consensusReached = consensus.reached;
        if (!consensus.reached && task.coordination.requireConsensus) {
            throw new Error('Consenso requerido no alcanzado');
        }
    }
    async executeGuardian(guardianConfig, execution, task) {
        const guardianResult = execution.guardianResults.get(guardianConfig.type);
        guardianResult.status = 'running';
        const startTime = Date.now();
        try {
            const rules = task.guardianRules[guardianConfig.type] || [];
            for (const rule of rules) {
                const result = await this.executeGuardianRule(guardianConfig.type, rule, execution.metadata.context);
                guardianResult.results.push(result);
            }
            guardianResult.status = 'completed';
            guardianResult.executionTime = Date.now() - startTime;
            await this.notifyGuardianCompletion(guardianConfig, execution, task);
        }
        catch (error) {
            guardianResult.status = 'failed';
            guardianResult.executionTime = Date.now() - startTime;
            this.emit('guardian:execution_failed', {
                guardianType: guardianConfig.type,
                executionId: execution.id,
                error,
                timestamp: new Date()
            });
            if (task.successCriteria.criticalGuardians.includes(guardianConfig.type)) {
                throw error;
            }
        }
    }
    async executeGuardianRule(guardianType, rule, context) {
        const guardian = this.guardianConnections.get(guardianType);
        if (!guardian) {
            throw new Error(`Guardian '${guardianType}' no está conectado`);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    ruleId: rule.id,
                    guardianType,
                    status: Math.random() > 0.2 ? 'passed' : 'failed',
                    score: Math.random() * 0.4 + 0.6,
                    message: `Regla ${rule.name} ejecutada por ${guardianType}`,
                    executionTime: Math.random() * 1000 + 500,
                    timestamp: new Date(),
                    philosophyMetrics: this.generatePhilosophyMetrics()
                });
            }, Math.random() * 1000 + 200);
        });
    }
    async createConsensusVoting(execution, task) {
        const votingId = `consensus_${execution.id}_${Date.now()}`;
        const voting = {
            taskId: task.id,
            question: `¿Aprueba los resultados de la tarea '${task.name}'?`,
            options: ['approve', 'reject', 'abstain'],
            votes: new Map(),
            deadline: new Date(Date.now() + task.coordination.timeout),
            status: 'open'
        };
        this.consensusVotings.set(votingId, voting);
        this.emit('consensus:voting_created', {
            votingId,
            voting,
            timestamp: new Date()
        });
        return votingId;
    }
    async collectConsensusVotes(votingId, execution, task) {
        const voting = this.consensusVotings.get(votingId);
        if (!voting)
            return;
        for (const guardianConfig of task.guardians) {
            const guardianResult = execution.guardianResults.get(guardianConfig.type);
            if (guardianResult && guardianResult.status === 'completed') {
                const vote = this.simulateGuardianVote(guardianConfig.type, guardianResult);
                voting.votes.set(guardianConfig.type, {
                    option: vote.option,
                    confidence: vote.confidence,
                    reasoning: vote.reasoning,
                    timestamp: new Date()
                });
                guardianResult.consensusVote = vote.option;
            }
        }
    }
    async evaluateConsensus(votingId, execution, task) {
        const voting = this.consensusVotings.get(votingId);
        if (!voting)
            return { reached: false };
        voting.status = 'closed';
        const voteCount = {};
        let totalWeight = 0;
        for (const guardianConfig of task.guardians) {
            const vote = voting.votes.get(guardianConfig.type);
            if (vote) {
                voteCount[vote.option] = (voteCount[vote.option] || 0) + guardianConfig.weight;
                totalWeight += guardianConfig.weight;
            }
        }
        const winner = Object.entries(voteCount)
            .sort(([, a], [, b]) => b - a)[0];
        if (!winner)
            return { reached: false };
        const [winningOption, winningWeight] = winner;
        const winningPercentage = winningWeight / totalWeight;
        const consensusReached = winningPercentage >= task.coordination.consensusThreshold;
        if (consensusReached) {
            voting.result = {
                winner: winningOption,
                confidence: winningPercentage,
                unanimity: winningPercentage === 1.0,
                dissenting: Array.from(voting.votes.entries())
                    .filter(([, vote]) => vote.option !== winningOption)
                    .map(([guardianType]) => guardianType)
            };
        }
        this.emit('consensus:evaluated', {
            votingId,
            result: voting.result,
            consensusReached,
            timestamp: new Date()
        });
        return { reached: consensusReached, result: voting.result };
    }
    async evaluateSuccessCriteria(execution, task) {
        const criteria = task.successCriteria;
        for (const criticalGuardian of criteria.criticalGuardians) {
            const result = execution.guardianResults.get(criticalGuardian);
            if (!result || result.status !== 'completed') {
                return false;
            }
        }
        const successfulGuardians = Array.from(execution.guardianResults.values())
            .filter(r => r.status === 'completed').length;
        if (successfulGuardians < criteria.minGuardianSuccess) {
            return false;
        }
        const overallScore = this.calculateOverallScore(execution, task);
        execution.coordinationMetrics.overallScore = overallScore;
        if (overallScore < criteria.overallScoreThreshold) {
            return false;
        }
        const philosophyAlignment = this.calculatePhilosophyAlignment(execution);
        execution.coordinationMetrics.philosophyAlignment = philosophyAlignment;
        if (philosophyAlignment < criteria.requiredPhilosophyAlignment) {
            return false;
        }
        return true;
    }
    calculateOverallScore(execution, task) {
        let totalScore = 0;
        let totalWeight = 0;
        for (const guardianConfig of task.guardians) {
            const result = execution.guardianResults.get(guardianConfig.type);
            if (result && result.status === 'completed') {
                const guardianScore = result.results.reduce((sum, r) => sum + r.score, 0) / result.results.length;
                totalScore += guardianScore * guardianConfig.weight;
                totalWeight += guardianConfig.weight;
            }
        }
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }
    calculatePhilosophyAlignment(execution) {
        const philosophyResults = {
            bien_comun: [],
            ayni: [],
            cooperacion: [],
            economia_sagrada: [],
            metanoia: [],
            negentropia: [],
            vocacion: []
        };
        for (const result of execution.guardianResults.values()) {
            for (const validationResult of result.results) {
                if (validationResult.philosophyMetrics) {
                    for (const [principle, score] of Object.entries(validationResult.philosophyMetrics)) {
                        philosophyResults[principle].push(score);
                    }
                }
            }
        }
        const weights = {
            bien_comun: 0.25,
            ayni: 0.20,
            cooperacion: 0.15,
            economia_sagrada: 0.15,
            metanoia: 0.10,
            negentropia: 0.10,
            vocacion: 0.05
        };
        let totalAlignment = 0;
        let totalWeight = 0;
        for (const [principle, scores] of Object.entries(philosophyResults)) {
            if (scores.length > 0) {
                const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
                const weight = weights[principle];
                totalAlignment += avgScore * weight;
                totalWeight += weight;
            }
        }
        return totalWeight > 0 ? totalAlignment / totalWeight : 0;
    }
    validateCoordinationTask(task) {
        if (!task.id || !task.name) {
            throw new Error('Tarea debe tener id y name');
        }
        if (task.guardians.length === 0) {
            throw new Error('Tarea debe tener al menos un guardian');
        }
        if (this.tasks.has(task.id)) {
            throw new Error(`Tarea con id '${task.id}' ya existe`);
        }
    }
    analyzeDependencies(task) {
        const resolved = [];
        const pending = [];
        const failed = [];
        const circularDependencies = [];
        for (const guardian of task.guardians) {
            for (const dep of guardian.dependencies) {
                if (task.guardians.some(g => g.type === dep)) {
                    resolved.push(dep);
                }
                else {
                    pending.push(dep);
                }
            }
        }
        return { resolved, pending, failed, circularDependencies };
    }
    resolveDependencyOrder(guardians) {
        const ordered = [];
        const visited = new Set();
        const visit = (guardian) => {
            if (visited.has(guardian.type))
                return;
            for (const dep of guardian.dependencies) {
                const depGuardian = guardians.find(g => g.type === dep);
                if (depGuardian && !visited.has(dep)) {
                    visit(depGuardian);
                }
            }
            visited.add(guardian.type);
            ordered.push(guardian);
        };
        for (const guardian of guardians) {
            visit(guardian);
        }
        return ordered;
    }
    async checkDependencies(guardian, execution) {
        for (const dep of guardian.dependencies) {
            const depResult = execution.guardianResults.get(dep);
            if (!depResult || depResult.status !== 'completed') {
                return false;
            }
        }
        return true;
    }
    async shouldContinueSequence(guardian, execution, task) {
        const result = execution.guardianResults.get(guardian.type);
        return result?.status === 'completed' || !task.successCriteria.criticalGuardians.includes(guardian.type);
    }
    async synchronizeResults(execution, task) {
        const completionTimes = Array.from(execution.guardianResults.values())
            .filter(r => r.status === 'completed')
            .map(r => r.executionTime);
        if (completionTimes.length > 1) {
            const avgTime = completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length;
            const variance = completionTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / completionTimes.length;
            execution.coordinationMetrics.guardianSynchronization = 1 / (1 + variance / 1000);
        }
        else {
            execution.coordinationMetrics.guardianSynchronization = 1;
        }
    }
    async evaluateConditionalExecution(guardian, execution, task) {
        const primaryResults = Array.from(execution.guardianResults.entries())
            .filter(([type, result]) => {
            const guardianConfig = task.guardians.find(g => g.type === type);
            return guardianConfig?.role === 'primary' && result.status === 'completed';
        });
        return primaryResults.length > 0;
    }
    async executeGuardianWithPipelineData(guardian, pipelineData, execution, task) {
        await this.executeGuardian(guardian, execution, task);
        return execution.guardianResults.get(guardian.type);
    }
    transformPipelineData(currentData, guardianResult, guardian) {
        return {
            ...currentData,
            [`${guardian.type}_results`]: guardianResult?.results || [],
            [`${guardian.type}_score`]: guardianResult?.results.reduce((sum, r) => sum + r.score, 0) / (guardianResult?.results.length || 1)
        };
    }
    shouldContinuePipeline(result, guardian, task) {
        return !task.successCriteria.criticalGuardians.includes(guardian.type) ||
            result?.status === 'completed';
    }
    async notifyGuardianCompletion(guardianConfig, execution, task) {
        const dependentGuardians = task.guardians.filter(g => g.dependencies.includes(guardianConfig.type));
        for (const dependent of dependentGuardians) {
            await this.sendMessage({
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                from: guardianConfig.type,
                to: dependent.type,
                type: 'dependency_update',
                timestamp: new Date(),
                payload: {
                    completedGuardian: guardianConfig.type,
                    executionId: execution.id,
                    status: 'completed'
                },
                priority: 'medium',
                requiresResponse: false
            });
        }
    }
    simulateGuardianVote(guardianType, guardianResult) {
        const avgScore = guardianResult.results.reduce((sum, r) => sum + r.score, 0) / guardianResult.results.length;
        return {
            option: avgScore > 0.7 ? 'approve' : avgScore > 0.4 ? 'abstain' : 'reject',
            confidence: avgScore,
            reasoning: `Basado en score promedio de ${avgScore.toFixed(2)}`
        };
    }
    generatePhilosophyMetrics() {
        return {
            bien_comun: Math.random() * 0.3 + 0.7,
            ayni: Math.random() * 0.3 + 0.7,
            cooperacion: Math.random() * 0.3 + 0.7,
            economia_sagrada: Math.random() * 0.3 + 0.7,
            metanoia: Math.random() * 0.3 + 0.7,
            negentropia: Math.random() * 0.3 + 0.7,
            vocacion: Math.random() * 0.3 + 0.7
        };
    }
    async sendMessage(message) {
        this.messageQueue.push(message);
        this.stats.communicationVolume++;
        this.emit('message:sent', {
            message,
            timestamp: new Date()
        });
    }
    setupMessageProcessor() {
        setInterval(() => {
            this.processMessageQueue();
        }, 100);
    }
    processMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.processMessage(message);
        }
    }
    processMessage(message) {
        switch (message.type) {
            case 'request':
                this.handleRequest(message);
                break;
            case 'response':
                this.handleResponse(message);
                break;
            case 'notification':
                this.handleNotification(message);
                break;
            case 'consensus_vote':
                this.handleConsensusVote(message);
                break;
            case 'dependency_update':
                this.handleDependencyUpdate(message);
                break;
        }
    }
    handleRequest(message) {
        this.emit('message:request_processed', { message, timestamp: new Date() });
    }
    handleResponse(message) {
        this.emit('message:response_processed', { message, timestamp: new Date() });
    }
    handleNotification(message) {
        this.emit('message:notification_processed', { message, timestamp: new Date() });
    }
    handleConsensusVote(message) {
        this.emit('message:consensus_vote_processed', { message, timestamp: new Date() });
    }
    handleDependencyUpdate(message) {
        this.emit('message:dependency_update_processed', { message, timestamp: new Date() });
    }
    setupEventHandlers() {
        this.on('system:guardian_connected', (data) => {
            this.guardianConnections.set(data.guardianType, data.guardian);
        });
        this.on('system:guardian_disconnected', (data) => {
            this.guardianConnections.delete(data.guardianType);
        });
    }
    async updateStats(execution, task) {
        this.stats.averageExecutionTime =
            (this.stats.averageExecutionTime * (this.stats.totalTasks - 1) + execution.coordinationMetrics.totalExecutionTime) / this.stats.totalTasks;
        this.stats.averageGuardianSynchronization =
            (this.stats.averageGuardianSynchronization * (this.stats.totalTasks - 1) + execution.coordinationMetrics.guardianSynchronization) / this.stats.totalTasks;
        if (execution.coordinationMetrics.consensusReached) {
            this.stats.consensusSuccessRate =
                (this.stats.consensusSuccessRate * (this.stats.totalTasks - 1) + 1) / this.stats.totalTasks;
        }
        else {
            this.stats.consensusSuccessRate =
                (this.stats.consensusSuccessRate * (this.stats.totalTasks - 1)) / this.stats.totalTasks;
        }
        for (const [guardianType, result] of execution.guardianResults) {
            if (!this.stats.guardianPerformance[guardianType]) {
                this.stats.guardianPerformance[guardianType] = {
                    tasksParticipated: 0,
                    successRate: 0,
                    averageScore: 0,
                    communicationLatency: 0,
                    consensusParticipation: 0
                };
            }
            const guardianStats = this.stats.guardianPerformance[guardianType];
            guardianStats.tasksParticipated++;
            if (result.status === 'completed') {
                guardianStats.successRate =
                    (guardianStats.successRate * (guardianStats.tasksParticipated - 1) + 1) / guardianStats.tasksParticipated;
                const avgScore = result.results.reduce((sum, r) => sum + r.score, 0) / result.results.length;
                guardianStats.averageScore =
                    (guardianStats.averageScore * (guardianStats.tasksParticipated - 1) + avgScore) / guardianStats.tasksParticipated;
            }
            else {
                guardianStats.successRate =
                    (guardianStats.successRate * (guardianStats.tasksParticipated - 1)) / guardianStats.tasksParticipated;
            }
            if (result.consensusVote) {
                guardianStats.consensusParticipation++;
            }
        }
        if (!this.stats.coordinationPatterns[task.type]) {
            this.stats.coordinationPatterns[task.type] = {
                usage: 0,
                successRate: 0,
                averageTime: 0
            };
        }
        const patternStats = this.stats.coordinationPatterns[task.type];
        patternStats.usage++;
        if (execution.status === 'completed') {
            patternStats.successRate =
                (patternStats.successRate * (patternStats.usage - 1) + 1) / patternStats.usage;
        }
        else {
            patternStats.successRate =
                (patternStats.successRate * (patternStats.usage - 1)) / patternStats.usage;
        }
        patternStats.averageTime =
            (patternStats.averageTime * (patternStats.usage - 1) + execution.coordinationMetrics.totalExecutionTime) / patternStats.usage;
    }
    initializeStats() {
        return {
            totalTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            partialSuccessTasks: 0,
            averageExecutionTime: 0,
            averageGuardianSynchronization: 0,
            consensusSuccessRate: 0,
            communicationVolume: 0,
            dependencyResolutionRate: 0,
            guardianPerformance: {},
            coordinationPatterns: {}
        };
    }
    getStats() {
        return { ...this.stats };
    }
    getTasks() {
        return Array.from(this.tasks.values());
    }
    getExecutionHistory(taskId) {
        const executions = Array.from(this.executions.values());
        return taskId ? executions.filter(e => e.taskId === taskId) : executions;
    }
    getConsensusVotings() {
        return Array.from(this.consensusVotings.values());
    }
    getMessageQueue() {
        return [...this.messageQueue];
    }
    connectGuardian(guardianType, guardian) {
        this.guardianConnections.set(guardianType, guardian);
        this.emit('system:guardian_connected', {
            guardianType,
            guardian,
            timestamp: new Date()
        });
    }
    disconnectGuardian(guardianType) {
        this.guardianConnections.delete(guardianType);
        this.emit('system:guardian_disconnected', {
            guardianType,
            timestamp: new Date()
        });
    }
    deleteTask(taskId) {
        const task = this.tasks.get(taskId);
        if (!task)
            return false;
        this.tasks.delete(taskId);
        for (const [execId, execution] of this.executions) {
            if (execution.taskId === taskId) {
                this.executions.delete(execId);
            }
        }
        this.emit('task:deleted', {
            taskId,
            timestamp: new Date()
        });
        return true;
    }
    pauseCoordination() {
        this.isCoordinating = false;
        this.emit('coordination:paused', { timestamp: new Date() });
    }
    resumeCoordination() {
        this.isCoordinating = true;
        this.emit('coordination:resumed', { timestamp: new Date() });
    }
}
exports.CrossGuardianCoordinator = CrossGuardianCoordinator;
exports.default = CrossGuardianCoordinator;
//# sourceMappingURL=CrossGuardianCoordinator.js.map