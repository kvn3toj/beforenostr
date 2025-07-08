/**
 * ⏰ AI COSMIC BRAIN - INTELLIGENT SCHEDULER
 * ==========================================
 *
 * Sistema de programación inteligente para validaciones automáticas
 * que aprende de patrones y se adapta a las condiciones del sistema.
 *
 * Filosofía CoomÜnity:
 * - Bien Común: Programación que optimice recursos para todos
 * - Ayni: Balance entre automatización y necesidades humanas
 * - Neguentropía: Orden temporal consciente en las validaciones
 */

import { EventEmitter } from 'events';
import { CronJob } from 'cron';
import {
  ValidationPipeline,
  SystemHealthMetrics,
  AnalysisReport,
  GuardianType,
  PhilosophyPrinciple
} from '../types';

export interface ScheduleConfig {
  id: string;
  name: string;
  description: string;

  // Configuración básica
  enabled: boolean;
  priority: number;
  timezone: string;

  // Tipos de programación
  type: 'interval' | 'cron' | 'event_driven' | 'adaptive' | 'conditional';

  // Configuración específica por tipo
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

  // Configuración específica
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
    evaluator: string; // función personalizada
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
    optimalTimeWindows: Array<{ start: number; end: number }>;
    avoidancePatterns: string[];
  };
}

export class IntelligentScheduler extends EventEmitter {
  private schedules: Map<string, ScheduleConfig>;
  private cronJobs: Map<string, CronJob>;
  private intervalTimers: Map<string, NodeJS.Timeout>;
  private executionHistory: Map<string, ScheduledExecution>;
  private adaptiveLearning: Map<string, AdaptiveLearning>;
  private stats: SchedulerStats;
  private isRunning: boolean = false;

  constructor() {
    super();
    this.schedules = new Map();
    this.cronJobs = new Map();
    this.intervalTimers = new Map();
    this.executionHistory = new Map();
    this.adaptiveLearning = new Map();
    this.stats = this.initializeStats();

    this.setupEventHandlers();
  }

  /**
   * 🚀 Iniciar el scheduler
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    // Iniciar todos los schedules activos
    for (const [scheduleId, config] of this.schedules) {
      if (config.enabled) {
        this.startSchedule(scheduleId);
      }
    }

    // Iniciar evaluador de condiciones
    this.startConditionalEvaluator();

    // Iniciar sistema adaptativo
    this.startAdaptiveLearning();

    this.emit('scheduler:started', { timestamp: new Date() });
  }

  /**
   * ⏹️ Detener el scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    // Detener todos los cron jobs
    for (const [scheduleId, cronJob] of this.cronJobs) {
      cronJob.stop();
    }
    this.cronJobs.clear();

    // Detener todos los timers de intervalo
    for (const [scheduleId, timer] of this.intervalTimers) {
      clearInterval(timer);
    }
    this.intervalTimers.clear();

    this.emit('scheduler:stopped', { timestamp: new Date() });
  }

  /**
   * 📅 Crear schedule
   */
  createSchedule(
    config: ScheduleConfig,
    pipelineId: string
  ): string {
    // Validar configuración
    this.validateScheduleConfig(config);

    this.schedules.set(config.id, config);
    this.stats.totalSchedules++;
    this.stats.typeDistribution[config.type] = (this.stats.typeDistribution[config.type] || 0) + 1;

    // Inicializar aprendizaje adaptativo si es necesario
    if (config.type === 'adaptive') {
      this.initializeAdaptiveLearning(config.id);
    }

    // Iniciar si el scheduler está corriendo y el schedule está habilitado
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

  /**
   * ▶️ Iniciar schedule específico
   */
  private startSchedule(scheduleId: string): void {
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
      // event_driven y conditional se manejan en evaluadores separados
    }
  }

  /**
   * ⏱️ Iniciar schedule de intervalo
   */
  private startIntervalSchedule(scheduleId: string, config: ScheduleConfig): void {
    if (!config.interval) return;

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

  /**
   * 🕐 Iniciar schedule cron
   */
  private startCronSchedule(scheduleId: string, config: ScheduleConfig): void {
    if (!config.cron) return;

    const cronJob = new CronJob(
      config.cron.expression,
      async () => {
        await this.executeScheduledPipeline(scheduleId, 'cron');
      },
      null,
      true,
      config.timezone
    );

    this.cronJobs.set(scheduleId, cronJob);
  }

  /**
   * 🧠 Iniciar schedule adaptativo
   */
  private startAdaptiveSchedule(scheduleId: string, config: ScheduleConfig): void {
    if (!config.adaptive) return;

    const adaptiveConfig = config.adaptive;
    let currentInterval = adaptiveConfig.baseInterval;

    const scheduleNext = () => {
      const timer = setTimeout(async () => {
        const startTime = Date.now();
        await this.executeScheduledPipeline(scheduleId, 'adaptive');
        const executionTime = Date.now() - startTime;

        // Actualizar aprendizaje adaptativo
        await this.updateAdaptiveLearning(scheduleId, executionTime);

        // Calcular nuevo intervalo
        currentInterval = await this.calculateAdaptiveInterval(scheduleId, currentInterval, adaptiveConfig);

        // Programar siguiente ejecución
        scheduleNext();
      }, currentInterval * 60 * 1000);

      this.intervalTimers.set(scheduleId, timer);
    };

    scheduleNext();
  }

  /**
   * 🎯 Ejecutar pipeline programado
   */
  private async executeScheduledPipeline(
    scheduleId: string,
    triggerType: string
  ): Promise<void> {
    const config = this.schedules.get(scheduleId);
    if (!config) return;

    const executionId = `sched_exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const execution: ScheduledExecution = {
      id: executionId,
      scheduleId,
      pipelineId: '', // Se obtendría del registro de pipelines
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

      // Aquí se ejecutaría el pipeline real
      // await this.pipelineEngine.executePipeline(execution.pipelineId);

      execution.status = 'completed';
      execution.executionTime = Date.now() - execution.actualTime.getTime();

      this.stats.totalExecutions++;
      this.stats.successfulExecutions++;
      this.updatePerformanceStats(config.type, execution.executionTime, true);

      this.emit('execution:completed', {
        execution,
        timestamp: new Date()
      });

    } catch (error) {
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

  /**
   * 🔍 Iniciar evaluador de condiciones
   */
  private startConditionalEvaluator(): void {
    setInterval(async () => {
      for (const [scheduleId, config] of this.schedules) {
        if (config.type === 'conditional' && config.enabled) {
          const shouldExecute = await this.evaluateConditions(config);

          if (shouldExecute) {
            await this.executeScheduledPipeline(scheduleId, 'conditional');
          }
        }
      }
    }, 30000); // Evaluar cada 30 segundos
  }

  /**
   * ✅ Evaluar condiciones
   */
  private async evaluateConditions(config: ScheduleConfig): Promise<boolean> {
    if (!config.conditional) return false;

    const conditions = config.conditional.conditions;
    const results: boolean[] = [];

    for (const condition of conditions) {
      const result = await this.evaluateCondition(condition);
      results.push(result);
    }

    // Aplicar lógica AND/OR según configuración
    if (config.conditional.requireAllConditions) {
      return results.every(r => r);
    } else {
      return results.some(r => r);
    }
  }

  /**
   * 🧪 Evaluar condición individual
   */
  private async evaluateCondition(condition: ScheduleCondition): Promise<boolean> {
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

  /**
   * 🏥 Evaluar condición de salud del sistema
   */
  private async evaluateSystemHealthCondition(condition: ScheduleCondition): Promise<boolean> {
    if (!condition.systemHealth) return false;

    // Simular obtención de métricas del sistema
    const systemMetrics: SystemHealthMetrics = {
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

  /**
   * 🧘 Evaluar condición de score filosófico
   */
  private async evaluatePhilosophyCondition(condition: ScheduleCondition): Promise<boolean> {
    if (!condition.philosophyScore) return false;

    // Simular obtención de scores filosóficos
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

    let scoreValue: number;
    if (condition.philosophyScore.overall) {
      scoreValue = philosophyScores.overall;
    } else if (condition.philosophyScore.principle) {
      scoreValue = philosophyScores[condition.philosophyScore.principle];
    } else {
      return false;
    }

    return this.compareValues(scoreValue, condition.operator, condition.philosophyScore.threshold);
  }

  /**
   * 👮 Evaluar condición de rendimiento de guardian
   */
  private async evaluateGuardianPerformanceCondition(condition: ScheduleCondition): Promise<boolean> {
    if (!condition.guardianPerformance) return false;

    // Simular obtención de métricas de guardians
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
    if (metricValue === undefined) return false;

    return this.compareValues(metricValue, condition.operator, threshold);
  }

  /**
   * ⏰ Evaluar condición de rango de tiempo
   */
  private evaluateTimeRangeCondition(condition: ScheduleCondition): boolean {
    if (!condition.timeRange) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    const { startHour, endHour, daysOfWeek } = condition.timeRange;

    // Verificar día de la semana
    if (!daysOfWeek.includes(currentDay)) {
      return false;
    }

    // Verificar hora
    if (startHour <= endHour) {
      return currentHour >= startHour && currentHour <= endHour;
    } else {
      // Rango que cruza medianoche
      return currentHour >= startHour || currentHour <= endHour;
    }
  }

  /**
   * 📁 Evaluar condición de cambios en archivos
   */
  private async evaluateFileChangesCondition(condition: ScheduleCondition): Promise<boolean> {
    if (!condition.fileChanges) return false;

    // Simular detección de cambios en archivos
    // En implementación real, usaría fs.watch o git diff
    const recentChanges = {
      modified: ['src/components/UPlay.tsx', 'src/pages/Dashboard.tsx'],
      added: ['src/components/NewFeature.tsx'],
      deleted: []
    };

    const { patterns, sinceMinutes, changeType } = condition.fileChanges;

    // Filtrar cambios por patrón
    let relevantChanges: string[] = [];

    if (changeType === 'any' || changeType === 'modify') {
      relevantChanges.push(...recentChanges.modified);
    }
    if (changeType === 'any' || changeType === 'add') {
      relevantChanges.push(...recentChanges.added);
    }
    if (changeType === 'any' || changeType === 'delete') {
      relevantChanges.push(...recentChanges.deleted);
    }

    // Verificar si algún cambio coincide con los patrones
    return patterns.some(pattern =>
      relevantChanges.some(file =>
        file.includes(pattern) || file.match(new RegExp(pattern))
      )
    );
  }

  /**
   * 🔧 Evaluar condición personalizada
   */
  private async evaluateCustomCondition(condition: ScheduleCondition): Promise<boolean> {
    if (!condition.custom) return false;

    try {
      // En implementación real, ejecutaría la función personalizada
      // const evaluator = eval(condition.custom.evaluator);
      // return await evaluator(condition.custom.parameters);

      // Simulación
      return Math.random() > 0.5;
    } catch (error) {
      this.emit('condition:evaluation_failed', {
        condition,
        error,
        timestamp: new Date()
      });
      return false;
    }
  }

  /**
   * 🧠 Iniciar sistema de aprendizaje adaptativo
   */
  private startAdaptiveLearning(): void {
    setInterval(() => {
      this.performAdaptiveLearningAnalysis();
    }, 60 * 60 * 1000); // Cada hora
  }

  /**
   * 📊 Realizar análisis de aprendizaje adaptativo
   */
  private performAdaptiveLearningAnalysis(): void {
    for (const [scheduleId, learning] of this.adaptiveLearning) {
      this.analyzeExecutionPatterns(scheduleId, learning);
      this.generateRecommendations(scheduleId, learning);
    }
  }

  /**
   * 📈 Analizar patrones de ejecución
   */
  private analyzeExecutionPatterns(scheduleId: string, learning: AdaptiveLearning): void {
    const history = learning.executionHistory;
    if (history.length < 10) return; // Necesita más datos

    // Analizar tiempos óptimos
    const successfulExecutions = history.filter(h => h.success);
    const optimalTimes = successfulExecutions
      .map(h => h.timestamp.getHours())
      .reduce((acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

    learning.patterns.optimalTimes = Object.entries(optimalTimes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    // Analizar correlación con carga del sistema
    const systemLoadCorrelation = this.calculateCorrelation(
      history.map(h => h.systemLoad),
      history.map(h => h.success ? 1 : 0)
    );
    learning.patterns.systemLoadCorrelation = systemLoadCorrelation;

    // Analizar correlación con score filosófico
    const philosophyCorrelation = this.calculateCorrelation(
      history.map(h => h.philosophyScore),
      history.map(h => h.success ? 1 : 0)
    );
    learning.patterns.philosophyCorrelation = philosophyCorrelation;
  }

  /**
   * 💡 Generar recomendaciones
   */
  private generateRecommendations(scheduleId: string, learning: AdaptiveLearning): void {
    const patterns = learning.patterns;

    // Sugerir intervalo basado en éxito histórico
    const avgSuccessfulInterval = this.calculateAverageSuccessfulInterval(learning);
    learning.recommendations.suggestedInterval = avgSuccessfulInterval;

    // Sugerir ventanas de tiempo óptimas
    learning.recommendations.optimalTimeWindows = patterns.optimalTimes.map(hour => ({
      start: hour,
      end: (hour + 2) % 24
    }));

    // Identificar patrones a evitar
    const avoidancePatterns: string[] = [];
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

  // Métodos auxiliares

  private compareValues(value: any, operator: string, threshold: any): boolean {
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

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

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

  private calculateAverageSuccessfulInterval(learning: AdaptiveLearning): number {
    const successfulExecutions = learning.executionHistory.filter(h => h.success);
    if (successfulExecutions.length < 2) return 60; // Default 1 hour

    const intervals: number[] = [];
    for (let i = 1; i < successfulExecutions.length; i++) {
      const interval = successfulExecutions[i].timestamp.getTime() - successfulExecutions[i-1].timestamp.getTime();
      intervals.push(interval / (1000 * 60)); // Convert to minutes
    }

    return intervals.reduce((a, b) => a + b, 0) / intervals.length;
  }

  private async calculateAdaptiveScore(scheduleId: string): Promise<number> {
    const learning = this.adaptiveLearning.get(scheduleId);
    if (!learning) return 0.5;

    // Combinar múltiples factores para calcular score adaptativo
    const recentSuccessRate = this.calculateRecentSuccessRate(learning);
    const systemLoadFactor = await this.getCurrentSystemLoadFactor();
    const philosophyFactor = await this.getCurrentPhilosophyFactor();

    return (recentSuccessRate * 0.5) + (systemLoadFactor * 0.3) + (philosophyFactor * 0.2);
  }

  private calculateRecentSuccessRate(learning: AdaptiveLearning): number {
    const recentExecutions = learning.executionHistory.slice(-10);
    if (recentExecutions.length === 0) return 0.5;

    const successCount = recentExecutions.filter(h => h.success).length;
    return successCount / recentExecutions.length;
  }

  private async getCurrentSystemLoadFactor(): Promise<number> {
    // Simular factor de carga del sistema
    return 0.7;
  }

  private async getCurrentPhilosophyFactor(): Promise<number> {
    // Simular factor filosófico actual
    return 0.8;
  }

  private async calculateAdaptiveInterval(
    scheduleId: string,
    currentInterval: number,
    config: any
  ): Promise<number> {
    const learning = this.adaptiveLearning.get(scheduleId);
    if (!learning) return currentInterval;

    const adaptiveScore = await this.calculateAdaptiveScore(scheduleId);
    const adaptationFactor = config.adaptationFactor;

    let newInterval = currentInterval;

    if (adaptiveScore > 0.8) {
      // Alto éxito, reducir intervalo
      newInterval = Math.max(config.minInterval, currentInterval * (1 - adaptationFactor));
    } else if (adaptiveScore < 0.4) {
      // Bajo éxito, aumentar intervalo
      newInterval = Math.min(config.maxInterval, currentInterval * (1 + adaptationFactor));
    }

    return newInterval;
  }

  private async updateAdaptiveLearning(scheduleId: string, executionTime: number): Promise<void> {
    const learning = this.adaptiveLearning.get(scheduleId);
    if (!learning) return;

    const systemLoad = await this.getCurrentSystemLoadFactor();
    const philosophyScore = await this.getCurrentPhilosophyFactor();

    learning.executionHistory.push({
      timestamp: new Date(),
      executionTime,
      success: executionTime < 5000, // Considerar éxito si toma menos de 5 segundos
      systemLoad,
      philosophyScore
    });

    // Mantener solo los últimos 100 registros
    if (learning.executionHistory.length > 100) {
      learning.executionHistory = learning.executionHistory.slice(-100);
    }

    this.stats.adaptiveAdjustments++;
  }

  private initializeAdaptiveLearning(scheduleId: string): void {
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

  private validateScheduleConfig(config: ScheduleConfig): void {
    if (!config.id || !config.name) {
      throw new Error('Schedule debe tener id y name');
    }

    if (this.schedules.has(config.id)) {
      throw new Error(`Schedule con id '${config.id}' ya existe`);
    }

    // Validar configuración específica por tipo
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

  private updatePerformanceStats(type: string, executionTime: number, success: boolean): void {
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
    } else {
      stats.successRate = (stats.successRate * (stats.executions - 1)) / stats.executions;
    }
  }

  private setupEventHandlers(): void {
    // Manejar eventos del sistema para programación event-driven
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

  private async handleFileChangeEvent(data: any): Promise<void> {
    for (const [scheduleId, config] of this.schedules) {
      if (config.type === 'event_driven' &&
          config.eventDriven?.triggerEvents.includes('file_changed') &&
          config.enabled) {

        await this.executeScheduledPipeline(scheduleId, 'event_driven');
      }
    }
  }

  private async handleAnalysisCompletedEvent(data: any): Promise<void> {
    for (const [scheduleId, config] of this.schedules) {
      if (config.type === 'event_driven' &&
          config.eventDriven?.triggerEvents.includes('analysis_completed') &&
          config.enabled) {

        await this.executeScheduledPipeline(scheduleId, 'event_driven');
      }
    }
  }

  private async handlePhilosophyDegradedEvent(data: any): Promise<void> {
    for (const [scheduleId, config] of this.schedules) {
      if (config.type === 'event_driven' &&
          config.eventDriven?.triggerEvents.includes('philosophy_degraded') &&
          config.enabled) {

        await this.executeScheduledPipeline(scheduleId, 'event_driven');
      }
    }
  }

  private stopSchedule(scheduleId: string): void {
    // Detener cron job si existe
    const cronJob = this.cronJobs.get(scheduleId);
    if (cronJob) {
      cronJob.stop();
      this.cronJobs.delete(scheduleId);
    }

    // Detener timer de intervalo si existe
    const timer = this.intervalTimers.get(scheduleId);
    if (timer) {
      clearInterval(timer);
      this.intervalTimers.delete(scheduleId);
    }

    this.stats.activeSchedules = Math.max(0, this.stats.activeSchedules - 1);
  }

  private initializeStats(): SchedulerStats {
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

  // Métodos públicos de gestión

  /**
   * 📊 Obtener estadísticas
   */
  getStats(): SchedulerStats {
    return { ...this.stats };
  }

  /**
   * 📋 Obtener schedules
   */
  getSchedules(): ScheduleConfig[] {
    return Array.from(this.schedules.values());
  }

  /**
   * 📈 Obtener historial de ejecuciones
   */
  getExecutionHistory(scheduleId?: string): ScheduledExecution[] {
    const executions = Array.from(this.executionHistory.values());
    return scheduleId ? executions.filter(e => e.scheduleId === scheduleId) : executions;
  }

  /**
   * 🧠 Obtener datos de aprendizaje adaptativo
   */
  getAdaptiveLearning(scheduleId: string): AdaptiveLearning | undefined {
    return this.adaptiveLearning.get(scheduleId);
  }

  /**
   * ⚙️ Actualizar schedule
   */
  updateSchedule(scheduleId: string, updates: Partial<ScheduleConfig>): boolean {
    const config = this.schedules.get(scheduleId);
    if (!config) return false;

    const updatedConfig = { ...config, ...updates };
    this.validateScheduleConfig(updatedConfig);

    // Detener schedule actual
    this.stopSchedule(scheduleId);

    // Actualizar configuración
    this.schedules.set(scheduleId, updatedConfig);

    // Reiniciar si está habilitado
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

  /**
   * 🗑️ Eliminar schedule
   */
  deleteSchedule(scheduleId: string): boolean {
    const config = this.schedules.get(scheduleId);
    if (!config) return false;

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

  /**
   * ⏸️ Pausar schedule
   */
  pauseSchedule(scheduleId: string): boolean {
    const config = this.schedules.get(scheduleId);
    if (!config) return false;

    config.enabled = false;
    this.stopSchedule(scheduleId);

    this.emit('schedule:paused', {
      scheduleId,
      timestamp: new Date()
    });

    return true;
  }

  /**
   * ▶️ Reanudar schedule
   */
  resumeSchedule(scheduleId: string): boolean {
    const config = this.schedules.get(scheduleId);
    if (!config) return false;

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

export default IntelligentScheduler;
