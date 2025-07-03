/**
 * =============================================================================
 * ÍNDICE PRINCIPAL - TIPOS COMPARTIDOS COOMUNITY
 * =============================================================================
 * Punto de entrada único para todos los tipos compartidos entre
 * backend y frontends de CoomÜnity.
 *
 * Guardián principal: COSMOS (El Tejedor de Sistemas)
 * =============================================================================
 */

// Exportar todas las métricas filosóficas
export * from './philosophy-metrics';

// Re-exportar tipos específicos para conveniencia
export type {
  HambreLevel,
  HambreMetric,
  IEAReciprocidad,
  PhilosophyDashboardConfig,
  PhilosophyMetricsState
} from './philosophy-metrics';

export * from './task.dto';
