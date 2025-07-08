/**
 * 🛠️ AI COSMIC BRAIN - AUTO-FIX ENGINE
 * ====================================
 *
 * Motor de auto-corrección inteligente que aplica fixes automáticos
 * con capacidades de backup, rollback y validación de seguridad.
 *
 * Filosofía CoomÜnity:
 * - Bien Común: Fixes que mejoren la calidad para todos
 * - Ayni: Balance entre automatización y seguridad
 * - Neguentropía: Orden consciente en las correcciones
 */

import { EventEmitter } from 'events';
import * as fs from 'fs/promises';
import * as path from 'path';
import { execSync } from 'child_process';
import {
  AutoFixAction,
  ValidationResult,
  RuleContext,
  GuardianType,
  PhilosophyPrinciple
} from '../types';

export interface AutoFixConfig {
  // Configuración de seguridad
  enableAutoFix: boolean;
  riskThreshold: 'low' | 'medium' | 'high';
  requireApprovalForRisk: ('medium' | 'high')[];
  maxAutoFixesPerSession: number;

  // Configuración de backup
  enableBackups: boolean;
  backupDirectory: string;
  backupRetentionDays: number;
  compressBackups: boolean;

  // Configuración de rollback
  enableRollback: boolean;
  rollbackTimeout: number; // minutos
  autoRollbackOnFailure: boolean;

  // Configuración de validación
  validateAfterFix: boolean;
  validationTimeout: number;
  requiredValidationScore: number;

  // Configuración de filosofía
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

export class AutoFixEngine extends EventEmitter {
  private config: AutoFixConfig;
  private executionHistory: Map<string, AutoFixExecution>;
  private backupRegistry: Map<string, BackupMetadata>;
  private pendingApprovals: Map<string, AutoFixExecution>;
  private stats: AutoFixStats;
  private sessionFixCount: number = 0;

  constructor(config: AutoFixConfig) {
    super();
    this.config = config;
    this.executionHistory = new Map();
    this.backupRegistry = new Map();
    this.pendingApprovals = new Map();
    this.stats = this.initializeStats();

    this.setupCleanupScheduler();
  }

  /**
   * 🚀 Ejecutar auto-fix
   */
  async executeAutoFix(
    action: AutoFixAction,
    context: RuleContext,
    guardianType: GuardianType
  ): Promise<string> {
    // Verificar límites de sesión
    if (this.sessionFixCount >= this.config.maxAutoFixesPerSession) {
      throw new Error(`Límite de auto-fixes por sesión alcanzado: ${this.config.maxAutoFixesPerSession}`);
    }

    // Verificar si está habilitado
    if (!this.config.enableAutoFix) {
      throw new Error('Auto-fix está deshabilitado');
    }

    // Verificar nivel de riesgo
    if (!this.isRiskAcceptable(action.riskLevel)) {
      throw new Error(`Nivel de riesgo '${action.riskLevel}' no aceptable`);
    }

    const executionId = `autofix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const execution: AutoFixExecution = {
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

    // Verificar si requiere aprobación
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

    // Ejecutar inmediatamente
    await this.performAutoFix(execution, context);
    return executionId;
  }

  /**
   * ✅ Aprobar auto-fix pendiente
   */
  async approveAutoFix(executionId: string, context: RuleContext): Promise<void> {
    const execution = this.pendingApprovals.get(executionId);
    if (!execution) {
      throw new Error(`Auto-fix '${executionId}' no encontrado en aprobaciones pendientes`);
    }

    this.pendingApprovals.delete(executionId);
    await this.performAutoFix(execution, context);
  }

  /**
   * ❌ Rechazar auto-fix pendiente
   */
  rejectAutoFix(executionId: string, reason: string): void {
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

  /**
   * 🔧 Realizar auto-fix
   */
  private async performAutoFix(execution: AutoFixExecution, context: RuleContext): Promise<void> {
    execution.status = 'running';

    this.emit('autofix:started', {
      executionId: execution.id,
      action: execution.action,
      timestamp: new Date()
    });

    try {
      // Crear backup si está habilitado
      if (this.config.enableBackups) {
        execution.backup = await this.createBackup(execution.action, context);
      }

      // Aplicar el fix según el tipo
      await this.applyFix(execution.action, context);

      // Validar después del fix si está habilitado
      if (this.config.validateAfterFix) {
        execution.validationResult = await this.validateAfterFix(execution.action, context);

        // Verificar si la validación pasó
        if (!this.isValidationSuccessful(execution.validationResult)) {
          throw new Error(`Validación post-fix falló: score ${execution.validationResult.score}`);
        }
      }

      // Verificar impacto filosófico
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

      // Actualizar estadísticas de filosofía
      if (execution.metadata.philosophyImpact) {
        this.updatePhilosophyStats(execution.metadata.philosophyImpact);
      }

      this.emit('autofix:completed', {
        executionId: execution.id,
        action: execution.action,
        validationResult: execution.validationResult,
        timestamp: new Date()
      });

      // Programar rollback automático si está habilitado
      if (this.config.enableRollback && this.config.rollbackTimeout > 0) {
        this.scheduleAutoRollback(execution);
      }

    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.rollbackReason = error instanceof Error ? error.message : 'Error desconocido';
      this.stats.failedFixes++;

      // Auto-rollback en caso de falla si está habilitado
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

  /**
   * 💾 Crear backup
   */
  private async createBackup(action: AutoFixAction, context: RuleContext): Promise<BackupMetadata> {
    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const targetPath = path.resolve(context.projectPath, action.targetPath);
    const backupFileName = `${backupId}_${path.basename(action.targetPath)}`;
    const backupPath = path.join(this.config.backupDirectory, backupFileName);

    // Asegurar que el directorio de backup existe
    await fs.mkdir(this.config.backupDirectory, { recursive: true });

    // Leer archivo original
    const originalContent = await fs.readFile(targetPath);

    // Crear checksum
    const crypto = require('crypto');
    const checksum = crypto.createHash('sha256').update(originalContent).digest('hex');

    // Guardar backup
    if (this.config.compressBackups) {
      const zlib = require('zlib');
      const compressed = zlib.gzipSync(originalContent);
      await fs.writeFile(`${backupPath}.gz`, compressed);
    } else {
      await fs.writeFile(backupPath, originalContent);
    }

    const backup: BackupMetadata = {
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

  /**
   * 🔧 Aplicar fix según el tipo
   */
  private async applyFix(action: AutoFixAction, context: RuleContext): Promise<void> {
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

  /**
   * 📝 Aplicar modificación de archivo
   */
  private async applyFileModification(action: AutoFixAction, targetPath: string): Promise<void> {
    const changes = action.changes;

    if (changes.type === 'replace') {
      await fs.writeFile(targetPath, changes.content);
    } else if (changes.type === 'patch') {
      let content = await fs.readFile(targetPath, 'utf-8');

      for (const patch of changes.patches) {
        content = content.replace(patch.search, patch.replace);
      }

      await fs.writeFile(targetPath, content);
    } else if (changes.type === 'insert') {
      let content = await fs.readFile(targetPath, 'utf-8');
      const lines = content.split('\n');

      lines.splice(changes.lineNumber, 0, changes.content);

      await fs.writeFile(targetPath, lines.join('\n'));
    }
  }

  /**
   * 📦 Aplicar actualización de dependencias
   */
  private async applyDependencyUpdate(action: AutoFixAction, context: RuleContext): Promise<void> {
    const changes = action.changes;
    const packageJsonPath = path.join(context.projectPath, 'package.json');

    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

    if (changes.add) {
      for (const [dep, version] of Object.entries(changes.add)) {
        if (changes.dev) {
          packageJson.devDependencies = packageJson.devDependencies || {};
          packageJson.devDependencies[dep] = version;
        } else {
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

    // Ejecutar npm install si se especifica
    if (changes.runInstall) {
      execSync('npm install', { cwd: context.projectPath });
    }
  }

  /**
   * ⚙️ Aplicar cambio de configuración
   */
  private async applyConfigChange(action: AutoFixAction, targetPath: string): Promise<void> {
    const changes = action.changes;

    if (targetPath.endsWith('.json')) {
      const config = JSON.parse(await fs.readFile(targetPath, 'utf-8'));

      for (const [key, value] of Object.entries(changes)) {
        this.setNestedProperty(config, key, value);
      }

      await fs.writeFile(targetPath, JSON.stringify(config, null, 2));
    } else if (targetPath.endsWith('.env')) {
      let content = await fs.readFile(targetPath, 'utf-8');

      for (const [key, value] of Object.entries(changes)) {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        const newLine = `${key}=${value}`;

        if (regex.test(content)) {
          content = content.replace(regex, newLine);
        } else {
          content += `\n${newLine}`;
        }
      }

      await fs.writeFile(targetPath, content);
    }
  }

  /**
   * 🏗️ Aplicar generación de código
   */
  private async applyCodeGeneration(action: AutoFixAction, targetPath: string, context: RuleContext): Promise<void> {
    const changes = action.changes;

    if (changes.template) {
      // Generar código desde template
      let code = changes.template;

      // Reemplazar variables
      if (changes.variables) {
        for (const [key, value] of Object.entries(changes.variables)) {
          code = code.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        }
      }

      await fs.writeFile(targetPath, code);
    } else if (changes.append) {
      // Agregar código al final del archivo
      const existingContent = await fs.readFile(targetPath, 'utf-8');
      const newContent = existingContent + '\n' + changes.append;
      await fs.writeFile(targetPath, newContent);
    }
  }

  /**
   * ✅ Validar después del fix
   */
  private async validateAfterFix(action: AutoFixAction, context: RuleContext): Promise<ValidationResult> {
    // Simular validación (en implementación real, ejecutaría validaciones reales)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ruleId: `validation_${action.id}`,
          guardianType: 'architecture' as GuardianType,
          status: 'passed',
          score: 0.85,
          message: 'Validación post-fix exitosa',
          executionTime: 500,
          timestamp: new Date()
        });
      }, this.config.validationTimeout);
    });
  }

  /**
   * 🔄 Realizar rollback
   */
  async performRollback(executionId: string, reason: string): Promise<void> {
    const execution = this.executionHistory.get(executionId);
    if (!execution) {
      throw new Error(`Ejecución '${executionId}' no encontrada`);
    }

    if (!execution.backup) {
      throw new Error(`No hay backup disponible para '${executionId}'`);
    }

    try {
      // Restaurar desde backup
      let backupContent: Buffer;

      if (this.config.compressBackups && execution.backup.backupPath.endsWith('.gz')) {
        const zlib = require('zlib');
        const compressedContent = await fs.readFile(execution.backup.backupPath);
        backupContent = zlib.gunzipSync(compressedContent);
      } else {
        backupContent = await fs.readFile(execution.backup.backupPath);
      }

      // Verificar checksum
      const crypto = require('crypto');
      const checksum = crypto.createHash('sha256').update(backupContent).digest('hex');

      if (checksum !== execution.backup.checksum) {
        throw new Error('Checksum del backup no coincide');
      }

      // Restaurar archivo
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

    } catch (error) {
      this.emit('rollback:failed', {
        executionId,
        error,
        timestamp: new Date()
      });

      throw error;
    }
  }

  /**
   * ⏰ Programar auto-rollback
   */
  private scheduleAutoRollback(execution: AutoFixExecution): void {
    setTimeout(async () => {
      if (execution.status === 'completed') {
        try {
          await this.performRollback(execution.id, 'Auto-rollback programado');
        } catch (error) {
          this.emit('auto-rollback:failed', {
            executionId: execution.id,
            error,
            timestamp: new Date()
          });
        }
      }
    }, this.config.rollbackTimeout * 60 * 1000);
  }

  /**
   * 🧘 Calcular impacto filosófico
   */
  private async calculatePhilosophyImpact(
    action: AutoFixAction,
    context: RuleContext
  ): Promise<Record<PhilosophyPrinciple, number>> {
    // Simular cálculo de impacto filosófico
    const impact: Record<PhilosophyPrinciple, number> = {
      bien_comun: 0.1,
      ayni: 0.05,
      cooperacion: 0.08,
      economia_sagrada: 0.03,
      metanoia: 0.12,
      negentropia: 0.15,
      vocacion: 0.07
    };

    // Ajustar según el tipo de acción
    if (action.type === 'code_generation') {
      impact.metanoia += 0.1;
      impact.negentropia += 0.1;
    } else if (action.type === 'dependency_update') {
      impact.bien_comun += 0.1;
      impact.cooperacion += 0.05;
    }

    return impact;
  }

  /**
   * 📊 Calcular score filosófico general
   */
  private calculateOverallPhilosophyScore(impact: Record<PhilosophyPrinciple, number>): number {
    const weights: Record<PhilosophyPrinciple, number> = {
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
      totalScore += value * weights[principle as PhilosophyPrinciple];
    }

    return totalScore;
  }

  /**
   * 📈 Actualizar estadísticas de filosofía
   */
  private updatePhilosophyStats(impact: Record<PhilosophyPrinciple, number>): void {
    for (const [principle, value] of Object.entries(impact)) {
      this.stats.philosophyImprovements[principle as PhilosophyPrinciple] =
        (this.stats.philosophyImprovements[principle as PhilosophyPrinciple] || 0) + value;
    }
  }

  // Métodos auxiliares

  private isRiskAcceptable(riskLevel: string): boolean {
    const acceptableLevels = ['low'];
    if (this.config.riskThreshold === 'medium') {
      acceptableLevels.push('medium');
    } else if (this.config.riskThreshold === 'high') {
      acceptableLevels.push('medium', 'high');
    }
    return acceptableLevels.includes(riskLevel);
  }

  private requiresApproval(action: AutoFixAction): boolean {
    return this.config.requireApprovalForRisk.includes(action.riskLevel as any) || action.requiresApproval;
  }

  private isValidationSuccessful(result: ValidationResult): boolean {
    return result.status === 'passed' && result.score >= this.config.requiredValidationScore;
  }

  private setNestedProperty(obj: any, path: string, value: any): void {
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

  private setupCleanupScheduler(): void {
    // Limpiar backups antiguos cada día
    setInterval(async () => {
      await this.cleanupOldBackups();
    }, 24 * 60 * 60 * 1000);
  }

  private async cleanupOldBackups(): Promise<void> {
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
        } catch (error) {
          this.emit('backup:cleanup_failed', {
            backupId,
            error,
            timestamp: new Date()
          });
        }
      }
    }
  }

  private initializeStats(): AutoFixStats {
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

  // Métodos públicos de gestión

  /**
   * 📊 Obtener estadísticas
   */
  getStats(): AutoFixStats {
    return { ...this.stats };
  }

  /**
   * 📋 Obtener historial de ejecuciones
   */
  getExecutionHistory(): AutoFixExecution[] {
    return Array.from(this.executionHistory.values());
  }

  /**
   * ⏳ Obtener aprobaciones pendientes
   */
  getPendingApprovals(): AutoFixExecution[] {
    return Array.from(this.pendingApprovals.values());
  }

  /**
   * 💾 Obtener registro de backups
   */
  getBackupRegistry(): BackupMetadata[] {
    return Array.from(this.backupRegistry.values());
  }

  /**
   * 🔄 Actualizar configuración
   */
  updateConfig(newConfig: Partial<AutoFixConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('config:updated', { config: this.config, timestamp: new Date() });
  }

  /**
   * 🧹 Limpiar historial
   */
  clearHistory(olderThanDays?: number): void {
    if (olderThanDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      for (const [id, execution] of this.executionHistory) {
        if (execution.startTime < cutoffDate) {
          this.executionHistory.delete(id);
        }
      }
    } else {
      this.executionHistory.clear();
    }

    this.emit('history:cleared', { timestamp: new Date() });
  }
}

export default AutoFixEngine;
