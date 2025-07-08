/**
 * 🛠️ Dashboard Helper Functions
 *
 * Colección de funciones utilitarias para el AI Cosmic Brain Dashboard.
 * Implementa principios de código mantenible con nombres descriptivos
 * que explican claramente el propósito de cada función.
 *
 * Filosofía aplicada:
 * - Bien Común: Funciones reutilizables que benefician todo el sistema
 * - Neguentropía: Orden y claridad en la organización del código
 * - KISS: Keep It Simple and Stupid - funciones pequeñas y enfocadas
 */

import { PhilosophyAlignment } from '../../types';

// ============================================================================
// 🎨 Color and Theme Utilities
// ============================================================================

/**
 * Obtiene el color apropiado para un score de salud del sistema
 */
export function getHealthScoreColor(score: number): string {
  if (score >= 0.9) return '#4caf50'; // Verde excelente
  if (score >= 0.75) return '#8bc34a'; // Verde bueno
  if (score >= 0.6) return '#ffeb3b'; // Amarillo aceptable
  if (score >= 0.4) return '#ff9800'; // Naranja atención
  return '#f44336'; // Rojo crítico
}

/**
 * Obtiene el color para indicadores de estado crítico
 */
export function getCriticalStatusColor(criticalCount: number): string {
  if (criticalCount === 0) return '#4caf50'; // Verde - sin problemas
  if (criticalCount <= 2) return '#ff9800'; // Naranja - algunos problemas
  return '#f44336'; // Rojo - muchos problemas críticos
}

/**
 * Obtiene colores específicos para cada tipo de guardian
 */
export function getGuardianThemeColor(guardianType: string): string {
  const guardianColors = {
    philosophy: '#9c27b0', // Púrpura para filosofía
    architecture: '#2196f3', // Azul para arquitectura
    ux: '#ff5722', // Naranja rojizo para UX
    performance: '#4caf50', // Verde para performance
    default: '#757575' // Gris para desconocido
  };

  return guardianColors[guardianType as keyof typeof guardianColors] || guardianColors.default;
}

// ============================================================================
// 📊 Score and Metrics Formatting
// ============================================================================

/**
 * Formatea un score numérico como porcentaje legible
 */
export function formatScoreAsPercentage(score: number, decimals: number = 1): string {
  const percentage = (score * 100).toFixed(decimals);
  return `${percentage}%`;
}

/**
 * Formatea la alineación filosófica con contexto CoomÜnity
 */
export function formatPhilosophyScore(score: number): string {
  const percentage = formatScoreAsPercentage(score);

  if (score >= 0.9) return `${percentage} - Excelente alineación CoomÜnity`;
  if (score >= 0.75) return `${percentage} - Buena alineación con principios`;
  if (score >= 0.6) return `${percentage} - Alineación aceptable`;
  if (score >= 0.4) return `${percentage} - Requiere mejora filosófica`;
  return `${percentage} - Desalineación crítica`;
}

/**
 * Formatea métricas de tiempo de manera legible
 */
export function formatTimeMetric(milliseconds: number): string {
  if (milliseconds < 1000) return `${milliseconds.toFixed(0)}ms`;
  if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
  if (milliseconds < 3600000) return `${(milliseconds / 60000).toFixed(1)}m`;
  return `${(milliseconds / 3600000).toFixed(1)}h`;
}

/**
 * Formatea tamaños de archivos de manera legible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ============================================================================
// 🔍 Status and Health Calculations
// ============================================================================

interface GuardianStatusData {
  score: number;
  criticalIssues: number;
  lastAnalysis: Date | null;
}

interface SystemHealthStatus {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  score: number;
  message: string;
}

/**
 * Calcula el estado general de salud del sistema basado en todos los guardians
 */
export function calculateOverallHealthStatus(guardians: GuardianStatusData[]): SystemHealthStatus {
  if (guardians.length === 0) {
    return {
      status: 'critical',
      score: 0,
      message: 'No hay guardians activos'
    };
  }

  // Calcular score promedio
  const totalScore = guardians.reduce((sum, guardian) => sum + guardian.score, 0);
  const averageScore = totalScore / guardians.length;

  // Contar problemas críticos totales
  const totalCriticalIssues = guardians.reduce((sum, guardian) => sum + guardian.criticalIssues, 0);

  // Determinar estado basado en score y problemas críticos
  let status: SystemHealthStatus['status'];
  let message: string;

  if (totalCriticalIssues > 5) {
    status = 'critical';
    message = `${totalCriticalIssues} problemas críticos requieren atención inmediata`;
  } else if (totalCriticalIssues > 2) {
    status = 'warning';
    message = `${totalCriticalIssues} problemas críticos detectados`;
  } else if (averageScore >= 0.9) {
    status = 'excellent';
    message = 'Sistema funcionando de manera excelente';
  } else if (averageScore >= 0.7) {
    status = 'good';
    message = 'Sistema funcionando correctamente';
  } else if (averageScore >= 0.5) {
    status = 'warning';
    message = 'Sistema requiere atención';
  } else {
    status = 'critical';
    message = 'Sistema en estado crítico';
  }

  return {
    status,
    score: averageScore,
    message
  };
}

/**
 * Determina si un guardian está saludable basado en múltiples factores
 */
export function isGuardianHealthy(guardian: GuardianStatusData): boolean {
  // Un guardian es saludable si:
  // 1. Tiene un score decente (>= 0.6)
  // 2. No tiene problemas críticos
  // 3. Ha realizado análisis recientemente (últimas 24 horas)

  const hasDecentScore = guardian.score >= 0.6;
  const hasNoCriticalIssues = guardian.criticalIssues === 0;

  const hasRecentAnalysis = guardian.lastAnalysis
    ? (Date.now() - guardian.lastAnalysis.getTime()) < (24 * 60 * 60 * 1000)
    : false;

  return hasDecentScore && hasNoCriticalIssues && hasRecentAnalysis;
}

// ============================================================================
// 📅 Time and Date Utilities
// ============================================================================

/**
 * Formatea una fecha de manera relativa y legible
 */
export function formatRelativeTime(date: Date | null): string {
  if (!date) return 'Nunca';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'Hace menos de 1 minuto';
  if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `Hace ${diffWeeks} semana${diffWeeks > 1 ? 's' : ''}`;

  return date.toLocaleDateString();
}

/**
 * Obtiene un timestamp formateado para logs y reportes
 */
export function getFormattedTimestamp(date: Date = new Date()): string {
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Calcula el tiempo restante hasta la próxima actualización
 */
export function formatTimeUntilNextUpdate(seconds: number): string {
  if (seconds <= 0) return 'Actualizando...';
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

// ============================================================================
// 🎯 Philosophy-Specific Utilities
// ============================================================================

/**
 * Evalúa el nivel de alineación con principios específicos de CoomÜnity
 */
export function evaluatePhilosophyPrincipleAlignment(
  principleScore: number,
  principleName: string
): { level: string; message: string; color: string } {
  if (principleScore >= 0.9) {
    return {
      level: 'Excelente',
      message: `${principleName} está perfectamente alineado`,
      color: '#4caf50'
    };
  }

  if (principleScore >= 0.75) {
    return {
      level: 'Bueno',
      message: `${principleName} está bien implementado`,
      color: '#8bc34a'
    };
  }

  if (principleScore >= 0.6) {
    return {
      level: 'Aceptable',
      message: `${principleName} necesita algunas mejoras`,
      color: '#ffeb3b'
    };
  }

  if (principleScore >= 0.4) {
    return {
      level: 'Deficiente',
      message: `${principleName} requiere atención prioritaria`,
      color: '#ff9800'
    };
  }

  return {
    level: 'Crítico',
    message: `${principleName} está severamente desalineado`,
    color: '#f44336'
  };
}

/**
 * Calcula un índice de balance Ayni (reciprocidad)
 */
export function calculateAyniBalance(
  contributionMetrics: { given: number; received: number }
): { balance: number; status: string; recommendation: string } {
  const { given, received } = contributionMetrics;

  if (given === 0 && received === 0) {
    return {
      balance: 0,
      status: 'Sin actividad',
      recommendation: 'Iniciar participación en la comunidad'
    };
  }

  const ratio = given / (received + 1); // +1 para evitar división por cero

  if (ratio >= 0.8 && ratio <= 1.2) {
    return {
      balance: 1,
      status: 'Balance perfecto',
      recommendation: 'Mantener el equilibrio actual'
    };
  }

  if (ratio > 1.2) {
    return {
      balance: ratio,
      status: 'Dando más de lo que recibe',
      recommendation: 'Considerar recibir más apoyo de la comunidad'
    };
  }

  return {
    balance: ratio,
    status: 'Recibiendo más de lo que da',
    recommendation: 'Incrementar contribuciones a la comunidad'
  };
}

// ============================================================================
// 🔧 Utility Functions for Data Processing
// ============================================================================

/**
 * Agrupa recomendaciones por severidad para visualización
 */
export function groupRecommendationsBySeverity(recommendations: Array<{ severity: string }>) {
  return recommendations.reduce((groups, rec) => {
    const severity = rec.severity;
    if (!groups[severity]) {
      groups[severity] = 0;
    }
    groups[severity]++;
    return groups;
  }, {} as Record<string, number>);
}

/**
 * Calcula tendencias basadas en datos históricos
 */
export function calculateTrend(
  currentValue: number,
  previousValue: number
): { direction: 'up' | 'down' | 'stable'; percentage: number; isSignificant: boolean } {
  if (previousValue === 0) {
    return { direction: 'stable', percentage: 0, isSignificant: false };
  }

  const change = currentValue - previousValue;
  const percentage = Math.abs((change / previousValue) * 100);
  const isSignificant = percentage >= 5; // Cambio significativo si es >= 5%

  let direction: 'up' | 'down' | 'stable';
  if (Math.abs(change) < 0.01) {
    direction = 'stable';
  } else if (change > 0) {
    direction = 'up';
  } else {
    direction = 'down';
  }

  return { direction, percentage, isSignificant };
}

/**
 * Valida que los datos del dashboard estén completos y sean válidos
 */
export function validateDashboardData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data) {
    errors.push('No se proporcionaron datos');
    return { isValid: false, errors };
  }

  if (typeof data.overallScore !== 'number' || data.overallScore < 0 || data.overallScore > 1) {
    errors.push('Score general inválido (debe ser entre 0 y 1)');
  }

  if (typeof data.guardiansActive !== 'number' || data.guardiansActive < 0) {
    errors.push('Número de guardians activos inválido');
  }

  if (typeof data.criticalIssues !== 'number' || data.criticalIssues < 0) {
    errors.push('Número de problemas críticos inválido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================================================
// 🛡️ Guardian-Specific Utilities
// ============================================================================

/**
 * Obtiene el nombre legible de un guardian
 */
export function getGuardianDisplayName(guardianType: string): string {
  switch (guardianType) {
    case 'philosophy':
      return 'Guardian Filosófico';
    case 'architecture':
      return 'Guardian de Arquitectura';
    case 'performance':
      return 'Guardian de Performance';
    case 'ux':
      return 'Guardian UX/UI';
    default:
      return 'Guardian Desconocido';
  }
}

/**
 * Calcula la dirección de tendencia basada en datos de trend
 */
export function calculateTrendDirection(trendData: any): 'up' | 'down' | 'stable' {
  if (!trendData || typeof trendData.percentage !== 'number') {
    return 'stable';
  }

  const threshold = 5; // 5% threshold for significant change

  if (Math.abs(trendData.percentage) < threshold) {
    return 'stable';
  }

  return trendData.percentage > 0 ? 'up' : 'down';
}

export default {
  // Color utilities
  getHealthScoreColor,
  getCriticalStatusColor,
  getGuardianThemeColor,

  // Formatting utilities
  formatScoreAsPercentage,
  formatPhilosophyScore,
  formatTimeMetric,
  formatFileSize,
  formatRelativeTime,
  getFormattedTimestamp,
  formatTimeUntilNextUpdate,

  // Health calculations
  calculateOverallHealthStatus,
  isGuardianHealthy,

  // Philosophy utilities
  evaluatePhilosophyPrincipleAlignment,
  calculateAyniBalance,

  // Data processing
  groupRecommendationsBySeverity,
  calculateTrend,
  validateDashboardData,

  // Guardian utilities
  getGuardianDisplayName,
  calculateTrendDirection
};
