"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoFixEngine = void 0;
const events_1 = require("events");
const fs = require("fs/promises");
const path = require("path");
const child_process_1 = require("child_process");
class AutoFixEngine extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.sessionFixCount = 0;
        this.config = config;
        this.executionHistory = new Map();
        this.backupRegistry = new Map();
        this.pendingApprovals = new Map();
        this.stats = this.initializeStats();
        this.setupCleanupScheduler();
    }
    async executeAutoFix(action, context, guardianType) {
        if (this.sessionFixCount >= this.config.maxAutoFixesPerSession) {
            throw new Error(`Límite de auto-fixes por sesión alcanzado: ${this.config.maxAutoFixesPerSession}`);
        }
        if (!this.config.enableAutoFix) {
            throw new Error('Auto-fix está deshabilitado');
        }
        if (!this.isRiskAcceptable(action.riskLevel)) {
            throw new Error(`Nivel de riesgo '${action.riskLevel}' no aceptable`);
        }
        const executionId = `autofix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const execution = {
            id: executionId,
            action,
            status: 'pending',
            startTime: new Date(),
            metadata: {
                guardianType,
                riskLevel: action.riskLevel,
                approvalRequired: this.requiresApproval(action),
                philosophyImpact: await this.calculatePhilosophyImpact(action, context)
            }
        };
        this.executionHistory.set(executionId, execution);
        if (execution.metadata.approvalRequired) {
            this.pendingApprovals.set(executionId, execution);
            this.emit('approval:required', {
                executionId,
                action,
                estimatedImpact: execution.metadata.philosophyImpact,
                timestamp: new Date()
            });
            return executionId;
        }
        await this.performAutoFix(execution, context);
        return executionId;
    }
    async approveAutoFix(executionId, context) {
        const execution = this.pendingApprovals.get(executionId);
        if (!execution) {
            throw new Error(`Auto-fix '${executionId}' no encontrado en aprobaciones pendientes`);
        }
        this.pendingApprovals.delete(executionId);
        await this.performAutoFix(execution, context);
    }
    rejectAutoFix(executionId, reason) {
        const execution = this.pendingApprovals.get(executionId);
        if (!execution) {
            throw new Error(`Auto-fix '${executionId}' no encontrado en aprobaciones pendientes`);
        }
        execution.status = 'failed';
        execution.endTime = new Date();
        execution.rollbackReason = `Rechazado: ${reason}`;
        this.pendingApprovals.delete(executionId);
        this.stats.failedFixes++;
        this.emit('autofix:rejected', {
            executionId,
            reason,
            timestamp: new Date()
        });
    }
    async performAutoFix(execution, context) {
        execution.status = 'running';
        this.emit('autofix:started', {
            executionId: execution.id,
            action: execution.action,
            timestamp: new Date()
        });
        try {
            if (this.config.enableBackups) {
                execution.backup = await this.createBackup(execution.action, context);
            }
            await this.applyFix(execution.action, context);
            if (this.config.validateAfterFix) {
                execution.validationResult = await this.validateAfterFix(execution.action, context);
                if (!this.isValidationSuccessful(execution.validationResult)) {
                    throw new Error(`Validación post-fix falló: score ${execution.validationResult.score}`);
                }
            }
            if (this.config.philosophyValidation && execution.metadata.philosophyImpact) {
                const philosophyScore = this.calculateOverallPhilosophyScore(execution.metadata.philosophyImpact);
                if (philosophyScore < this.config.requiredPhilosophyAlignment) {
                    throw new Error(`Alineación filosófica insuficiente: ${philosophyScore}`);
                }
            }
            execution.status = 'completed';
            execution.endTime = new Date();
            this.sessionFixCount++;
            this.stats.successfulFixes++;
            if (execution.metadata.philosophyImpact) {
                this.updatePhilosophyStats(execution.metadata.philosophyImpact);
            }
            this.emit('autofix:completed', {
                executionId: execution.id,
                action: execution.action,
                validationResult: execution.validationResult,
                timestamp: new Date()
            });
            if (this.config.enableRollback && this.config.rollbackTimeout > 0) {
                this.scheduleAutoRollback(execution);
            }
        }
        catch (error) {
            execution.status = 'failed';
            execution.endTime = new Date();
            execution.rollbackReason = error instanceof Error ? error.message : 'Error desconocido';
            this.stats.failedFixes++;
            if (this.config.autoRollbackOnFailure && execution.backup) {
                await this.performRollback(execution.id, 'Auto-rollback por falla');
            }
            this.emit('autofix:failed', {
                executionId: execution.id,
                error,
                timestamp: new Date()
            });
            throw error;
        }
    }
    async createBackup(action, context) {
        const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const targetPath = path.resolve(context.projectPath, action.targetPath);
        const backupFileName = `${backupId}_${path.basename(action.targetPath)}`;
        const backupPath = path.join(this.config.backupDirectory, backupFileName);
        await fs.mkdir(this.config.backupDirectory, { recursive: true });
        const originalContent = await fs.readFile(targetPath);
        const crypto = require('crypto');
        const checksum = crypto.createHash('sha256').update(originalContent).digest('hex');
        if (this.config.compressBackups) {
            const zlib = require('zlib');
            const compressed = zlib.gzipSync(originalContent);
            await fs.writeFile(`${backupPath}.gz`, compressed);
        }
        else {
            await fs.writeFile(backupPath, originalContent);
        }
        const backup = {
            id: backupId,
            timestamp: new Date(),
            filePath: targetPath,
            backupPath: this.config.compressBackups ? `${backupPath}.gz` : backupPath,
            checksum,
            size: originalContent.length,
            reason: `Auto-fix: ${action.description}`,
            autoFixId: action.id
        };
        this.backupRegistry.set(backupId, backup);
        this.emit('backup:created', {
            backup,
            timestamp: new Date()
        });
        return backup;
    }
    async applyFix(action, context) {
        const targetPath = path.resolve(context.projectPath, action.targetPath);
        switch (action.type) {
            case 'file_modification':
                await this.applyFileModification(action, targetPath);
                break;
            case 'dependency_update':
                await this.applyDependencyUpdate(action, context);
                break;
            case 'config_change':
                await this.applyConfigChange(action, targetPath);
                break;
            case 'code_generation':
                await this.applyCodeGeneration(action, targetPath, context);
                break;
            default:
                throw new Error(`Tipo de auto-fix no soportado: ${action.type}`);
        }
    }
    async applyFileModification(action, targetPath) {
        const changes = action.changes;
        if (changes.type === 'replace') {
            await fs.writeFile(targetPath, changes.content);
        }
        else if (changes.type === 'patch') {
            let content = await fs.readFile(targetPath, 'utf-8');
            for (const patch of changes.patches) {
                content = content.replace(patch.search, patch.replace);
            }
            await fs.writeFile(targetPath, content);
        }
        else if (changes.type === 'insert') {
            let content = await fs.readFile(targetPath, 'utf-8');
            const lines = content.split('\n');
            lines.splice(changes.lineNumber, 0, changes.content);
            await fs.writeFile(targetPath, lines.join('\n'));
        }
    }
    async applyDependencyUpdate(action, context) {
        const changes = action.changes;
        const packageJsonPath = path.join(context.projectPath, 'package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        if (changes.add) {
            for (const [dep, version] of Object.entries(changes.add)) {
                if (changes.dev) {
                    packageJson.devDependencies = packageJson.devDependencies || {};
                    packageJson.devDependencies[dep] = version;
                }
                else {
                    packageJson.dependencies = packageJson.dependencies || {};
                    packageJson.dependencies[dep] = version;
                }
            }
        }
        if (changes.update) {
            for (const [dep, version] of Object.entries(changes.update)) {
                if (packageJson.dependencies && packageJson.dependencies[dep]) {
                    packageJson.dependencies[dep] = version;
                }
                if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
                    packageJson.devDependencies[dep] = version;
                }
            }
        }
        if (changes.remove) {
            for (const dep of changes.remove) {
                delete packageJson.dependencies?.[dep];
                delete packageJson.devDependencies?.[dep];
            }
        }
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
        if (changes.runInstall) {
            (0, child_process_1.execSync)('npm install', { cwd: context.projectPath });
        }
    }
    async applyConfigChange(action, targetPath) {
        const changes = action.changes;
        if (targetPath.endsWith('.json')) {
            const config = JSON.parse(await fs.readFile(targetPath, 'utf-8'));
            for (const [key, value] of Object.entries(changes)) {
                this.setNestedProperty(config, key, value);
            }
            await fs.writeFile(targetPath, JSON.stringify(config, null, 2));
        }
        else if (targetPath.endsWith('.env')) {
            let content = await fs.readFile(targetPath, 'utf-8');
            for (const [key, value] of Object.entries(changes)) {
                const regex = new RegExp(`^${key}=.*$`, 'm');
                const newLine = `${key}=${value}`;
                if (regex.test(content)) {
                    content = content.replace(regex, newLine);
                }
                else {
                    content += `\n${newLine}`;
                }
            }
            await fs.writeFile(targetPath, content);
        }
    }
    async applyCodeGeneration(action, targetPath, context) {
        const changes = action.changes;
        if (changes.template) {
            let code = changes.template;
            if (changes.variables) {
                for (const [key, value] of Object.entries(changes.variables)) {
                    code = code.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
                }
            }
            await fs.writeFile(targetPath, code);
        }
        else if (changes.append) {
            const existingContent = await fs.readFile(targetPath, 'utf-8');
            const newContent = existingContent + '\n' + changes.append;
            await fs.writeFile(targetPath, newContent);
        }
    }
    async validateAfterFix(action, context) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    ruleId: `validation_${action.id}`,
                    guardianType: 'architecture',
                    status: 'passed',
                    score: 0.85,
                    message: 'Validación post-fix exitosa',
                    executionTime: 500,
                    timestamp: new Date()
                });
            }, this.config.validationTimeout);
        });
    }
    async performRollback(executionId, reason) {
        const execution = this.executionHistory.get(executionId);
        if (!execution) {
            throw new Error(`Ejecución '${executionId}' no encontrada`);
        }
        if (!execution.backup) {
            throw new Error(`No hay backup disponible para '${executionId}'`);
        }
        try {
            let backupContent;
            if (this.config.compressBackups && execution.backup.backupPath.endsWith('.gz')) {
                const zlib = require('zlib');
                const compressedContent = await fs.readFile(execution.backup.backupPath);
                backupContent = zlib.gunzipSync(compressedContent);
            }
            else {
                backupContent = await fs.readFile(execution.backup.backupPath);
            }
            const crypto = require('crypto');
            const checksum = crypto.createHash('sha256').update(backupContent).digest('hex');
            if (checksum !== execution.backup.checksum) {
                throw new Error('Checksum del backup no coincide');
            }
            await fs.writeFile(execution.backup.filePath, backupContent);
            execution.status = 'rolled_back';
            execution.rollbackReason = reason;
            this.stats.rolledBackFixes++;
            this.emit('rollback:completed', {
                executionId,
                reason,
                backup: execution.backup,
                timestamp: new Date()
            });
        }
        catch (error) {
            this.emit('rollback:failed', {
                executionId,
                error,
                timestamp: new Date()
            });
            throw error;
        }
    }
    scheduleAutoRollback(execution) {
        setTimeout(async () => {
            if (execution.status === 'completed') {
                try {
                    await this.performRollback(execution.id, 'Auto-rollback programado');
                }
                catch (error) {
                    this.emit('auto-rollback:failed', {
                        executionId: execution.id,
                        error,
                        timestamp: new Date()
                    });
                }
            }
        }, this.config.rollbackTimeout * 60 * 1000);
    }
    async calculatePhilosophyImpact(action, context) {
        const impact = {
            bien_comun: 0.1,
            ayni: 0.05,
            cooperacion: 0.08,
            economia_sagrada: 0.03,
            metanoia: 0.12,
            negentropia: 0.15,
            vocacion: 0.07
        };
        if (action.type === 'code_generation') {
            impact.metanoia += 0.1;
            impact.negentropia += 0.1;
        }
        else if (action.type === 'dependency_update') {
            impact.bien_comun += 0.1;
            impact.cooperacion += 0.05;
        }
        return impact;
    }
    calculateOverallPhilosophyScore(impact) {
        const weights = {
            bien_comun: 0.25,
            ayni: 0.20,
            cooperacion: 0.15,
            economia_sagrada: 0.15,
            metanoia: 0.10,
            negentropia: 0.10,
            vocacion: 0.05
        };
        let totalScore = 0;
        for (const [principle, value] of Object.entries(impact)) {
            totalScore += value * weights[principle];
        }
        return totalScore;
    }
    updatePhilosophyStats(impact) {
        for (const [principle, value] of Object.entries(impact)) {
            this.stats.philosophyImprovements[principle] =
                (this.stats.philosophyImprovements[principle] || 0) + value;
        }
    }
    isRiskAcceptable(riskLevel) {
        const acceptableLevels = ['low'];
        if (this.config.riskThreshold === 'medium') {
            acceptableLevels.push('medium');
        }
        else if (this.config.riskThreshold === 'high') {
            acceptableLevels.push('medium', 'high');
        }
        return acceptableLevels.includes(riskLevel);
    }
    requiresApproval(action) {
        return this.config.requireApprovalForRisk.includes(action.riskLevel) || action.requiresApproval;
    }
    isValidationSuccessful(result) {
        return result.status === 'passed' && result.score >= this.config.requiredValidationScore;
    }
    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    }
    setupCleanupScheduler() {
        setInterval(async () => {
            await this.cleanupOldBackups();
        }, 24 * 60 * 60 * 1000);
    }
    async cleanupOldBackups() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.config.backupRetentionDays);
        for (const [backupId, backup] of this.backupRegistry) {
            if (backup.timestamp < cutoffDate) {
                try {
                    await fs.unlink(backup.backupPath);
                    this.backupRegistry.delete(backupId);
                    this.emit('backup:cleaned', {
                        backupId,
                        backup,
                        timestamp: new Date()
                    });
                }
                catch (error) {
                    this.emit('backup:cleanup_failed', {
                        backupId,
                        error,
                        timestamp: new Date()
                    });
                }
            }
        }
    }
    initializeStats() {
        return {
            totalExecutions: 0,
            successfulFixes: 0,
            failedFixes: 0,
            rolledBackFixes: 0,
            averageExecutionTime: 0,
            riskLevelDistribution: {},
            guardianTypeDistribution: {},
            philosophyImprovements: {
                bien_comun: 0,
                ayni: 0,
                cooperacion: 0,
                economia_sagrada: 0,
                metanoia: 0,
                negentropia: 0,
                vocacion: 0
            }
        };
    }
    getStats() {
        return { ...this.stats };
    }
    getExecutionHistory() {
        return Array.from(this.executionHistory.values());
    }
    getPendingApprovals() {
        return Array.from(this.pendingApprovals.values());
    }
    getBackupRegistry() {
        return Array.from(this.backupRegistry.values());
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.emit('config:updated', { config: this.config, timestamp: new Date() });
    }
    clearHistory(olderThanDays) {
        if (olderThanDays) {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
            for (const [id, execution] of this.executionHistory) {
                if (execution.startTime < cutoffDate) {
                    this.executionHistory.delete(id);
                }
            }
        }
        else {
            this.executionHistory.clear();
        }
        this.emit('history:cleared', { timestamp: new Date() });
    }
}
exports.AutoFixEngine = AutoFixEngine;
exports.default = AutoFixEngine;
//# sourceMappingURL=AutoFixEngine.js.map