/**
 * 🤝 AI COSMIC BRAIN - CROSS-GUARDIAN COORDINATOR
 * ===============================================
 *
 * Sistema de coordinación entre guardians para validaciones complejas
 * que requieren colaboración y sincronización entre múltiples guardians.
 *
 * Filosofía CoomÜnity:
 * - Bien Común: Coordinación que beneficie a todo el ecosistema
 * - Ayni: Reciprocidad y balance entre guardians
 * - Cooperación: Trabajo conjunto sobre competencia individual
 */

import { EventEmitter } from 'events';
import {
  ValidationRule,
  ValidationResult,
  RuleContext,
  GuardianType,
  PhilosophyPrinciple,
  SystemHealthMetrics
} from '../types';

export interface CoordinationTask {
  id: string;
  name: string;
  description: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'pipeline' | 'consensus';
  priority: number;

  // Guardians involucrados
  guardians: Array<{
    type: GuardianType;
    role: 'primary' | 'secondary' | 'validator' | 'observer';
    weight: number;
    dependencies: string[];
  }>;

  // Configuración de coordinación
  coordination: {
    timeout: number;
    retryAttempts: number;
    failureThreshold: number;
    requireConsensus: boolean;
    consensusThreshold: number;
    allowPartialSuccess: boolean;
  };

  // Reglas específicas por guardian
  guardianRules: Record<GuardianType, ValidationRule[]>;

  // Criterios de éxito
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

  // Resultados por guardian
  guardianResults: Map<GuardianType, {
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    results: ValidationResult[];
    executionTime: number;
    dependencies: string[];
    consensusVote?: 'approve' | 'reject' | 'abstain';
  }>;

  // Métricas de coordinación
  coordinationMetrics: {
    totalExecutionTime: number;
    guardianSynchronization: number;
    consensusReached: boolean;
    philosophyAlignment: number;
    overallScore: number;
    communicationLatency: number;
  };

  // Análisis de dependencias
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

export class CrossGuardianCoordinator extends EventEmitter {
  private tasks: Map<string, CoordinationTask>;
  private executions: Map<string, CoordinationExecution>;
  private messageQueue: GuardianCommunication[];
  private consensusVotings: Map<string, ConsensusVoting>;
  private guardianConnections: Map<GuardianType, any>;
  private stats: CoordinationStats;
  private isCoordinating: boolean = false;

  constructor() {
    super();
    this.tasks = new Map();
    this.executions = new Map();
    this.messageQueue = [];
    this.consensusVotings = new Map();
    this.guardianConnections = new Map();
    this.stats = this.initializeStats();

    this.setupMessageProcessor();
    this.setupEventHandlers();
  }

  /**
   * 🚀 Crear tarea de coordinación
   */
  async createCoordinationTask(task: CoordinationTask): Promise<string> {
    // Validar configuración de la tarea
    this.validateCoordinationTask(task);

    // Analizar dependencias
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

  /**
   * ▶️ Ejecutar tarea de coordinación
   */
  async executeCoordinationTask(
    taskId: string,
    context: RuleContext,
    triggeredBy: string = 'manual'
  ): Promise<string> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Tarea de coordinación '${taskId}' no encontrada`);
    }

    const executionId = `coord_exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const execution: CoordinationExecution = {
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

    // Inicializar resultados de guardians
    for (const guardian of task.guardians) {
      execution.guardianResults.set(guardian.type, {
        status: 'pending',
        results: [],
        executionTime: 0,
        dependencies: guardian.dependencies
      });
    }

    this.executions.set(executionId, execution);

    // Ejecutar según el tipo de coordinación
    await this.performCoordination(execution, task);

    return executionId;
  }

  /**
   * 🎭 Realizar coordinación según el tipo
   */
  private async performCoordination(
    execution: CoordinationExecution,
    task: CoordinationTask
  ): Promise<void> {
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

      // Evaluar criterios de éxito
      const success = await this.evaluateSuccessCriteria(execution, task);

      if (success) {
        execution.status = 'completed';
        this.stats.completedTasks++;
      } else if (task.coordination.allowPartialSuccess) {
        execution.status = 'partial_success';
        this.stats.partialSuccessTasks++;
      } else {
        execution.status = 'failed';
        this.stats.failedTasks++;
      }

    } catch (error) {
      execution.status = 'failed';
      this.stats.failedTasks++;

      this.emit('coordination:failed', {
        executionId: execution.id,
        error,
        timestamp: new Date()
      });
    } finally {
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

  /**
   * 📋 Coordinación secuencial
   */
  private async performSequentialCoordination(
    execution: CoordinationExecution,
    task: CoordinationTask
  ): Promise<void> {
    execution.status = 'coordinating';

    // Ordenar guardians por dependencias
    const orderedGuardians = this.resolveDependencyOrder(task.guardians);

    for (const guardian of orderedGuardians) {
      // Verificar dependencias
      const dependenciesMet = await this.checkDependencies(guardian, execution);
      if (!dependenciesMet) {
        const guardianResult = execution.guardianResults.get(guardian.type)!;
        guardianResult.status = 'skipped';
        continue;
      }

      // Ejecutar guardian
      await this.executeGuardian(guardian, execution, task);

      // Verificar si debe continuar
      const shouldContinue = await this.shouldContinueSequence(guardian, execution, task);
      if (!shouldContinue) {
        break;
      }
    }
  }

  /**
   * 🔄 Coordinación paralela
   */
  private async performParallelCoordination(
    execution: CoordinationExecution,
    task: CoordinationTask
  ): Promise<void> {
    execution.status = 'coordinating';

    // Ejecutar todos los guardians en paralelo
    const guardianPromises = task.guardians.map(guardian =>
      this.executeGuardian(guardian, execution, task)
    );

    // Esperar a que terminen todos (o fallen)
    await Promise.allSettled(guardianPromises);

    // Sincronizar resultados
    await this.synchronizeResults(execution, task);
  }

  /**
   * ❓ Coordinación condicional
   */
  private async performConditionalCoordination(
    execution: CoordinationExecution,
    task: CoordinationTask
  ): Promise<void> {
    execution.status = 'coordinating';

    // Ejecutar guardians primarios primero
    const primaryGuardians = task.guardians.filter(g => g.role === 'primary');
    for (const guardian of primaryGuardians) {
      await this.executeGuardian(guardian, execution, task);
    }

    // Evaluar condiciones para guardians secundarios
    for (const guardian of task.guardians.filter(g => g.role === 'secondary')) {
      const shouldExecute = await this.evaluateConditionalExecution(guardian, execution, task);
      if (shouldExecute) {
        await this.executeGuardian(guardian, execution, task);
      } else {
        const guardianResult = execution.guardianResults.get(guardian.type)!;
        guardianResult.status = 'skipped';
      }
    }
  }

  /**
   * 🏭 Coordinación pipeline
   */
  private async performPipelineCoordination(
    execution: CoordinationExecution,
    task: CoordinationTask
  ): Promise<void> {
    execution.status = 'coordinating';

    // Crear pipeline de transformación de datos
    let pipelineData: any = execution.metadata.context;

    const orderedGuardians = this.resolveDependencyOrder(task.guardians);

    for (const guardian of orderedGuardians) {
      // Ejecutar guardian con datos del pipeline
      const result = await this.executeGuardianWithPipelineData(guardian, pipelineData, execution, task);

      // Transformar datos para el siguiente guardian
      pipelineData = this.transformPipelineData(pipelineData, result, guardian);

      // Verificar si el pipeline debe continuar
      if (!this.shouldContinuePipeline(result, guardian, task)) {
        break;
      }
    }
  }

  /**
   * 🗳️ Coordinación por consenso
   */
  private async performConsensusCoordination(
    execution: CoordinationExecution,
    task: CoordinationTask
  ): Promise<void> {
    execution.status = 'coordinating';

    // Ejecutar todos los guardians para obtener sus análisis
    const guardianPromises = task.guardians.map(guardian =>
      this.executeGuardian(guardian, execution, task)
    );

    await Promise.allSettled(guardianPromises);

    // Crear votación de consenso
    const votingId = await this.createConsensusVoting(execution, task);

    // Recopilar votos de los guardians
    await this.collectConsensusVotes(votingId, execution, task);

    // Evaluar consenso
    const consensus = await this.evaluateConsensus(votingId, execution, task);
    execution.coordinationMetrics.consensusReached = consensus.reached;

    if (!consensus.reached && task.coordination.requireConsensus) {
      throw new Error('Consenso requerido no alcanzado');
    }
  }

  /**
   * 🔧 Ejecutar guardian individual
   */
  private async executeGuardian(
    guardianConfig: any,
    execution: CoordinationExecution,
    task: CoordinationTask
  ): Promise<void> {
    const guardianResult = execution.guardianResults.get(guardianConfig.type)!;
    guardianResult.status = 'running';

    const startTime = Date.now();

    try {
      // Obtener reglas específicas para este guardian
      const rules = task.guardianRules[guardianConfig.type] || [];

      // Ejecutar cada regla
      for (const rule of rules) {
        const result = await this.executeGuardianRule(guardianConfig.type, rule, execution.metadata.context);
        guardianResult.results.push(result);
      }

      guardianResult.status = 'completed';
      guardianResult.executionTime = Date.now() - startTime;

      // Enviar notificación a otros guardians si es necesario
      await this.notifyGuardianCompletion(guardianConfig, execution, task);

    } catch (error) {
      guardianResult.status = 'failed';
      guardianResult.executionTime = Date.now() - startTime;

      this.emit('guardian:execution_failed', {
        guardianType: guardianConfig.type,
        executionId: execution.id,
        error,
        timestamp: new Date()
      });

      // Decidir si debe fallar toda la coordinación
      if (task.successCriteria.criticalGuardians.includes(guardianConfig.type)) {
        throw error;
      }
    }
  }

  /**
   * 📏 Ejecutar regla de guardian
   */
  private async executeGuardianRule(
    guardianType: GuardianType,
    rule: ValidationRule,
    context: RuleContext
  ): Promise<ValidationResult> {
    const guardian = this.guardianConnections.get(guardianType);
    if (!guardian) {
      throw new Error(`Guardian '${guardianType}' no está conectado`);
    }

    // Simular ejecución de regla
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ruleId: rule.id,
          guardianType,
          status: Math.random() > 0.2 ? 'passed' : 'failed',
          score: Math.random() * 0.4 + 0.6, // 0.6 - 1.0
          message: `Regla ${rule.name} ejecutada por ${guardianType}`,
          executionTime: Math.random() * 1000 + 500,
          timestamp: new Date(),
          philosophyMetrics: this.generatePhilosophyMetrics()
        });
      }, Math.random() * 1000 + 200);
    });
  }

  /**
   * 🗳️ Crear votación de consenso
   */
  private async createConsensusVoting(
    execution: CoordinationExecution,
    task: CoordinationTask
  ): Promise<string> {
    const votingId = `consensus_${execution.id}_${Date.now()}`;

    const voting: ConsensusVoting = {
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

  /**
   * 📊 Recopilar votos de consenso
   */
  private async collectConsensusVotes(
    votingId: string,
    execution: CoordinationExecution,
    task: CoordinationTask
  ): Promise<void> {
    const voting = this.consensusVotings.get(votingId);
    if (!voting) return;

    // Solicitar votos a todos los guardians participantes
    for (const guardianConfig of task.guardians) {
      const guardianResult = execution.guardianResults.get(guardianConfig.type);
      if (guardianResult && guardianResult.status === 'completed') {

        // Simular voto del guardian basado en sus resultados
        const vote = this.simulateGuardianVote(guardianConfig.type, guardianResult);

        voting.votes.set(guardianConfig.type, {
          option: vote.option,
          confidence: vote.confidence,
          reasoning: vote.reasoning,
          timestamp: new Date()
        });

        // Actualizar resultado del guardian
        guardianResult.consensusVote = vote.option as any;
      }
    }
  }

  /**
   * ⚖️ Evaluar consenso
   */
  private async evaluateConsensus(
    votingId: string,
    execution: CoordinationExecution,
    task: CoordinationTask
  ): Promise<{ reached: boolean; result?: any }> {
    const voting = this.consensusVotings.get(votingId);
    if (!voting) return { reached: false };

    voting.status = 'closed';

    // Contar votos ponderados
    const voteCount: Record<string, number> = {};
    let totalWeight = 0;

    for (const guardianConfig of task.guardians) {
      const vote = voting.votes.get(guardianConfig.type);
      if (vote) {
        voteCount[vote.option] = (voteCount[vote.option] || 0) + guardianConfig.weight;
        totalWeight += guardianConfig.weight;
      }
    }

    // Encontrar opción ganadora
    const winner = Object.entries(voteCount)
      .sort(([,a], [,b]) => b - a)[0];

    if (!winner) return { reached: false };

    const [winningOption, winningWeight] = winner;
    const winningPercentage = winningWeight / totalWeight;

    // Verificar si se alcanzó el umbral de consenso
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

  /**
   * ✅ Evaluar criterios de éxito
   */
  private async evaluateSuccessCriteria(
    execution: CoordinationExecution,
    task: CoordinationTask
  ): Promise<boolean> {
    const criteria = task.successCriteria;

    // Verificar guardians críticos
    for (const criticalGuardian of criteria.criticalGuardians) {
      const result = execution.guardianResults.get(criticalGuardian);
      if (!result || result.status !== 'completed') {
        return false;
      }
    }

    // Verificar mínimo de guardians exitosos
    const successfulGuardians = Array.from(execution.guardianResults.values())
      .filter(r => r.status === 'completed').length;

    if (successfulGuardians < criteria.minGuardianSuccess) {
      return false;
    }

    // Calcular y verificar score general
    const overallScore = this.calculateOverallScore(execution, task);
    execution.coordinationMetrics.overallScore = overallScore;

    if (overallScore < criteria.overallScoreThreshold) {
      return false;
    }

    // Calcular y verificar alineación filosófica
    const philosophyAlignment = this.calculatePhilosophyAlignment(execution);
    execution.coordinationMetrics.philosophyAlignment = philosophyAlignment;

    if (philosophyAlignment < criteria.requiredPhilosophyAlignment) {
      return false;
    }

    return true;
  }

  /**
   * 📊 Calcular score general
   */
  private calculateOverallScore(
    execution: CoordinationExecution,
    task: CoordinationTask
  ): number {
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

  /**
   * 🧘 Calcular alineación filosófica
   */
  private calculatePhilosophyAlignment(execution: CoordinationExecution): number {
    const philosophyResults: Record<PhilosophyPrinciple, number[]> = {
      bien_comun: [],
      ayni: [],
      cooperacion: [],
      economia_sagrada: [],
      metanoia: [],
      negentropia: [],
      vocacion: []
    };

    // Recopilar métricas filosóficas de todos los guardians
    for (const result of execution.guardianResults.values()) {
      for (const validationResult of result.results) {
        if (validationResult.philosophyMetrics) {
          for (const [principle, score] of Object.entries(validationResult.philosophyMetrics)) {
            philosophyResults[principle as PhilosophyPrinciple].push(score);
          }
        }
      }
    }

    // Calcular promedio ponderado
    const weights: Record<PhilosophyPrinciple, number> = {
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
        const weight = weights[principle as PhilosophyPrinciple];
        totalAlignment += avgScore * weight;
        totalWeight += weight;
      }
    }

    return totalWeight > 0 ? totalAlignment / totalWeight : 0;
  }

  // Métodos auxiliares

  private validateCoordinationTask(task: CoordinationTask): void {
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

  private analyzeDependencies(task: CoordinationTask): any {
    const resolved: string[] = [];
    const pending: string[] = [];
    const failed: string[] = [];
    const circularDependencies: string[][] = [];

    // Análisis simple de dependencias
    for (const guardian of task.guardians) {
      for (const dep of guardian.dependencies) {
        if (task.guardians.some(g => g.type === dep)) {
          resolved.push(dep);
        } else {
          pending.push(dep);
        }
      }
    }

    return { resolved, pending, failed, circularDependencies };
  }

  private resolveDependencyOrder(guardians: any[]): any[] {
    // Ordenamiento topológico simple
    const ordered: any[] = [];
    const visited = new Set<string>();

    const visit = (guardian: any) => {
      if (visited.has(guardian.type)) return;

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

  private async checkDependencies(guardian: any, execution: CoordinationExecution): Promise<boolean> {
    for (const dep of guardian.dependencies) {
      const depResult = execution.guardianResults.get(dep as GuardianType);
      if (!depResult || depResult.status !== 'completed') {
        return false;
      }
    }
    return true;
  }

  private async shouldContinueSequence(guardian: any, execution: CoordinationExecution, task: CoordinationTask): Promise<boolean> {
    const result = execution.guardianResults.get(guardian.type);

    // Continuar si el guardian tuvo éxito o si no es crítico
    return result?.status === 'completed' || !task.successCriteria.criticalGuardians.includes(guardian.type);
  }

  private async synchronizeResults(execution: CoordinationExecution, task: CoordinationTask): Promise<void> {
    // Calcular sincronización entre guardians
    const completionTimes = Array.from(execution.guardianResults.values())
      .filter(r => r.status === 'completed')
      .map(r => r.executionTime);

    if (completionTimes.length > 1) {
      const avgTime = completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length;
      const variance = completionTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / completionTimes.length;
      execution.coordinationMetrics.guardianSynchronization = 1 / (1 + variance / 1000); // Normalizar
    } else {
      execution.coordinationMetrics.guardianSynchronization = 1;
    }
  }

  private async evaluateConditionalExecution(guardian: any, execution: CoordinationExecution, task: CoordinationTask): Promise<boolean> {
    // Evaluar condiciones basadas en resultados de guardians primarios
    const primaryResults = Array.from(execution.guardianResults.entries())
      .filter(([type, result]) => {
        const guardianConfig = task.guardians.find(g => g.type === type);
        return guardianConfig?.role === 'primary' && result.status === 'completed';
      });

    // Lógica simple: ejecutar si al menos un guardian primario tuvo éxito
    return primaryResults.length > 0;
  }

  private async executeGuardianWithPipelineData(guardian: any, pipelineData: any, execution: CoordinationExecution, task: CoordinationTask): Promise<any> {
    // Ejecutar guardian con datos del pipeline
    await this.executeGuardian(guardian, execution, task);

    // Retornar resultados para transformación
    return execution.guardianResults.get(guardian.type);
  }

  private transformPipelineData(currentData: any, guardianResult: any, guardian: any): any {
    // Transformar datos basado en los resultados del guardian
    return {
      ...currentData,
      [`${guardian.type}_results`]: guardianResult?.results || [],
      [`${guardian.type}_score`]: guardianResult?.results.reduce((sum: number, r: any) => sum + r.score, 0) / (guardianResult?.results.length || 1)
    };
  }

  private shouldContinuePipeline(result: any, guardian: any, task: CoordinationTask): boolean {
    // Continuar pipeline si el guardian no es crítico o tuvo éxito
    return !task.successCriteria.criticalGuardians.includes(guardian.type) ||
           result?.status === 'completed';
  }

  private async notifyGuardianCompletion(guardianConfig: any, execution: CoordinationExecution, task: CoordinationTask): Promise<void> {
    // Enviar notificación a otros guardians que dependen de este
    const dependentGuardians = task.guardians.filter(g =>
      g.dependencies.includes(guardianConfig.type)
    );

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

  private simulateGuardianVote(guardianType: GuardianType, guardianResult: any): any {
    const avgScore = guardianResult.results.reduce((sum: number, r: any) => sum + r.score, 0) / guardianResult.results.length;

    return {
      option: avgScore > 0.7 ? 'approve' : avgScore > 0.4 ? 'abstain' : 'reject',
      confidence: avgScore,
      reasoning: `Basado en score promedio de ${avgScore.toFixed(2)}`
    };
  }

  private generatePhilosophyMetrics(): Record<PhilosophyPrinciple, number> {
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

  private async sendMessage(message: GuardianCommunication): Promise<void> {
    this.messageQueue.push(message);
    this.stats.communicationVolume++;

    this.emit('message:sent', {
      message,
      timestamp: new Date()
    });
  }

  private setupMessageProcessor(): void {
    setInterval(() => {
      this.processMessageQueue();
    }, 100); // Procesar mensajes cada 100ms
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;
      this.processMessage(message);
    }
  }

  private processMessage(message: GuardianCommunication): void {
    // Procesar mensaje según su tipo
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

  private handleRequest(message: GuardianCommunication): void {
    // Manejar solicitud entre guardians
    this.emit('message:request_processed', { message, timestamp: new Date() });
  }

  private handleResponse(message: GuardianCommunication): void {
    // Manejar respuesta entre guardians
    this.emit('message:response_processed', { message, timestamp: new Date() });
  }

  private handleNotification(message: GuardianCommunication): void {
    // Manejar notificación entre guardians
    this.emit('message:notification_processed', { message, timestamp: new Date() });
  }

  private handleConsensusVote(message: GuardianCommunication): void {
    // Manejar voto de consenso
    this.emit('message:consensus_vote_processed', { message, timestamp: new Date() });
  }

  private handleDependencyUpdate(message: GuardianCommunication): void {
    // Manejar actualización de dependencia
    this.emit('message:dependency_update_processed', { message, timestamp: new Date() });
  }

  private setupEventHandlers(): void {
    // Configurar manejadores de eventos del sistema
    this.on('system:guardian_connected', (data) => {
      this.guardianConnections.set(data.guardianType, data.guardian);
    });

    this.on('system:guardian_disconnected', (data) => {
      this.guardianConnections.delete(data.guardianType);
    });
  }

  private async updateStats(execution: CoordinationExecution, task: CoordinationTask): Promise<void> {
    // Actualizar estadísticas generales
    this.stats.averageExecutionTime =
      (this.stats.averageExecutionTime * (this.stats.totalTasks - 1) + execution.coordinationMetrics.totalExecutionTime) / this.stats.totalTasks;

    this.stats.averageGuardianSynchronization =
      (this.stats.averageGuardianSynchronization * (this.stats.totalTasks - 1) + execution.coordinationMetrics.guardianSynchronization) / this.stats.totalTasks;

    if (execution.coordinationMetrics.consensusReached) {
      this.stats.consensusSuccessRate =
        (this.stats.consensusSuccessRate * (this.stats.totalTasks - 1) + 1) / this.stats.totalTasks;
    } else {
      this.stats.consensusSuccessRate =
        (this.stats.consensusSuccessRate * (this.stats.totalTasks - 1)) / this.stats.totalTasks;
    }

    // Actualizar estadísticas por guardian
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
      } else {
        guardianStats.successRate =
          (guardianStats.successRate * (guardianStats.tasksParticipated - 1)) / guardianStats.tasksParticipated;
      }

      if (result.consensusVote) {
        guardianStats.consensusParticipation++;
      }
    }

    // Actualizar estadísticas de patrones de coordinación
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
    } else {
      patternStats.successRate =
        (patternStats.successRate * (patternStats.usage - 1)) / patternStats.usage;
    }

    patternStats.averageTime =
      (patternStats.averageTime * (patternStats.usage - 1) + execution.coordinationMetrics.totalExecutionTime) / patternStats.usage;
  }

  private initializeStats(): CoordinationStats {
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

  // Métodos públicos de gestión

  /**
   * 📊 Obtener estadísticas
   */
  getStats(): CoordinationStats {
    return { ...this.stats };
  }

  /**
   * 📋 Obtener tareas
   */
  getTasks(): CoordinationTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * 📈 Obtener historial de ejecuciones
   */
  getExecutionHistory(taskId?: string): CoordinationExecution[] {
    const executions = Array.from(this.executions.values());
    return taskId ? executions.filter(e => e.taskId === taskId) : executions;
  }

  /**
   * 🗳️ Obtener votaciones de consenso
   */
  getConsensusVotings(): ConsensusVoting[] {
    return Array.from(this.consensusVotings.values());
  }

  /**
   * 📬 Obtener cola de mensajes
   */
  getMessageQueue(): GuardianCommunication[] {
    return [...this.messageQueue];
  }

  /**
   * 🔌 Conectar guardian
   */
  connectGuardian(guardianType: GuardianType, guardian: any): void {
    this.guardianConnections.set(guardianType, guardian);

    this.emit('system:guardian_connected', {
      guardianType,
      guardian,
      timestamp: new Date()
    });
  }

  /**
   * 🔌 Desconectar guardian
   */
  disconnectGuardian(guardianType: GuardianType): void {
    this.guardianConnections.delete(guardianType);

    this.emit('system:guardian_disconnected', {
      guardianType,
      timestamp: new Date()
    });
  }

  /**
   * 🗑️ Eliminar tarea
   */
  deleteTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    this.tasks.delete(taskId);

    // Limpiar ejecuciones relacionadas
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

  /**
   * ⏸️ Pausar coordinación
   */
  pauseCoordination(): void {
    this.isCoordinating = false;
    this.emit('coordination:paused', { timestamp: new Date() });
  }

  /**
   * ▶️ Reanudar coordinación
   */
  resumeCoordination(): void {
    this.isCoordinating = true;
    this.emit('coordination:resumed', { timestamp: new Date() });
  }
}

export default CrossGuardianCoordinator;
