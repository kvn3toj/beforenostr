/**
 * 🔍 Automated Validation Engine Components
 *
 * Motor completo de validación automática para el AI Cosmic Brain.
 * Proporciona capacidades de validación inteligente, programación automática
 * y análisis continuo de calidad del código.
 *
 * Filosofía aplicada:
 * - Bien Común: Validación automática para beneficio del equipo
 * - Neguentropía: Orden y calidad continua del sistema
 * - Ayni: Balance entre automatización y control manual
 * - Metanöia: Transformación continua a través de la validación
 */

// Exportar componentes principales
export { AutomatedValidationEngine } from '../AutomatedValidationEngine';
export { ValidationRuleManager } from '../ValidationRuleManager';
export { ValidationResults } from '../ValidationResults';
export { ValidationScheduler } from '../ValidationScheduler';

// Exportar tipos específicos
export type { GuardianType } from '../../types';

// Configuraciones por defecto
export const defaultValidationConfig = {
  // Configuración de intervalos por defecto
  defaultIntervals: {
    philosophy: 1800000, // 30 minutos
    architecture: 3600000, // 1 hora
    ux: 2700000, // 45 minutos
    performance: 900000 // 15 minutos
  },

  // Política de reintentos por defecto
  defaultRetryPolicy: {
    maxRetries: 3,
    backoffMultiplier: 2,
    maxBackoffTime: 300000 // 5 minutos
  },

  // Configuración de notificaciones
  notificationConfig: {
    criticalErrors: true,
    warnings: false,
    successfulRuns: false,
    scheduleChanges: true
  },

  // Límites del sistema
  systemLimits: {
    maxConcurrentValidations: 5,
    maxValidationDuration: 1800000, // 30 minutos
    maxRulesPerSchedule: 20,
    maxSchedulesPerUser: 10
  }
};

// Utilidades para validación
export const validationUtils = {
  /**
   * Calcula la próxima ejecución basada en la configuración de programación
   */
  calculateNextRun: (scheduleType: string, scheduleValue: string | number, timezone?: string): Date => {
    const now = new Date();

    switch (scheduleType) {
      case 'interval':
        return new Date(now.getTime() + (scheduleValue as number));

      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const [hours, minutes] = (scheduleValue as string).split(':');
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
        return new Date(now.getTime() + defaultValidationConfig.defaultIntervals.philosophy);
    }
  },

  /**
   * Formatea la duración en un formato legible
   */
  formatDuration: (duration: number): string => {
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
  },

  /**
   * Calcula la tasa de éxito de las validaciones
   */
  calculateSuccessRate: (totalRuns: number, successfulRuns: number): number => {
    if (totalRuns === 0) return 0;
    return (successfulRuns / totalRuns) * 100;
  },

  /**
   * Determina la prioridad de una validación basada en sus resultados
   */
  calculateValidationPriority: (errors: number, warnings: number, lastRun?: Date): 'low' | 'medium' | 'high' | 'critical' => {
    if (errors > 5) return 'critical';
    if (errors > 0) return 'high';
    if (warnings > 10) return 'medium';
    return 'low';
  },

  /**
   * Genera un resumen de los resultados de validación
   */
  generateValidationSummary: (executions: any[]): {
    total: number;
    successful: number;
    failed: number;
    warnings: number;
    avgDuration: number;
    successRate: number;
  } => {
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

// Constantes para el motor de validación
export const VALIDATION_CONSTANTS = {
  // Estados de validación
  VALIDATION_STATES: {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
  } as const,

  // Tipos de programación
  SCHEDULE_TYPES: {
    INTERVAL: 'interval',
    CRON: 'cron',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    TRIGGER: 'trigger'
  } as const,

  // Prioridades
  PRIORITIES: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  } as const,

  // Colores por guardian
  GUARDIAN_COLORS: {
    philosophy: '#9C27B0',
    architecture: '#2196F3',
    ux: '#FF9800',
    performance: '#4CAF50'
  } as const
};

// Mensajes de filosofía CoomÜnity para el motor de validación
export const PHILOSOPHY_MESSAGES = {
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
