/**
 * 🌌 Philosophy Components Index
 *
 * Exportaciones centralizadas de todos los componentes relacionados
 * con la alineación filosófica CoomÜnity en el AI Cosmic Brain Dashboard.
 *
 * Componentes incluidos:
 * - PhilosophyAlignmentTracker: Tracker principal de alineación
 * - PhilosophyTrendAnalysis: Análisis de tendencias históricas
 * - PhilosophyAlerts: Sistema de alertas filosóficas
 *
 * Filosofía aplicada:
 * - Bien Común: Organización que beneficia todo el equipo de desarrollo
 * - Neguentropía: Orden y estructura clara en las exportaciones
 * - Simplicidad: Importación centralizada y fácil acceso
 */

// ============================================================================
// 🎯 Main Philosophy Components
// ============================================================================

export { default as PhilosophyAlignmentTracker } from './PhilosophyAlignmentTracker';
export { default as PhilosophyTrendAnalysis } from './PhilosophyTrendAnalysis';
export { default as PhilosophyAlerts } from './PhilosophyAlerts';

// ============================================================================
// 🔄 Re-exports for Convenience
// ============================================================================

// Re-export the main tracker as the default philosophy component
export { PhilosophyAlignmentTracker as default } from './PhilosophyAlignmentTracker';

// ============================================================================
// 📦 Bundle Export for Easy Integration
// ============================================================================

import PhilosophyAlignmentTracker from './PhilosophyAlignmentTracker';
import PhilosophyTrendAnalysis from './PhilosophyTrendAnalysis';
import PhilosophyAlerts from './PhilosophyAlerts';

/**
 * Bundle completo de componentes de filosofía para importación conveniente
 */
export const PhilosophyComponents = {
  AlignmentTracker: PhilosophyAlignmentTracker,
  TrendAnalysis: PhilosophyTrendAnalysis,
  Alerts: PhilosophyAlerts
};

/**
 * Configuración por defecto para componentes de filosofía
 */
export const defaultPhilosophyConfig = {
  alignmentTracker: {
    expandedByDefault: false,
    enableRealTimeUpdates: true,
    readOnly: false
  },
  trendAnalysis: {
    defaultTimeRange: '24h' as const,
    defaultPrinciples: ['bienComun', 'ayni', 'cooperacion']
  },
  alerts: {
    maxAlerts: 10,
    criticalOnly: false
  }
};

/**
 * Utilidades para trabajar con componentes de filosofía
 */
export const philosophyUtils = {
  /**
   * Calcula la alineación general a partir de métricas individuales
   */
  calculateOverallAlignment: (metrics: any) => {
    const weights = {
      bienComun: 0.25,
      ayni: 0.20,
      cooperacion: 0.15,
      economiaSagrada: 0.15,
      metanoia: 0.10,
      neguentropia: 0.10,
      vocacion: 0.05
    };

    return Object.entries(weights).reduce((total, [key, weight]) => {
      const metric = metrics[key];
      return total + (metric?.score || 0) * weight;
    }, 0);
  },

  /**
   * Determina el nivel de alineación basado en el score
   */
  getAlignmentLevel: (score: number) => {
    if (score >= 0.9) return 'exemplary';
    if (score >= 0.8) return 'excellent';
    if (score >= 0.7) return 'good';
    if (score >= 0.5) return 'basic';
    return 'needs_improvement';
  },

  /**
   * Obtiene el color apropiado para un nivel de alineación
   */
  getAlignmentColor: (score: number) => {
    if (score >= 0.8) return '#4caf50'; // Verde
    if (score >= 0.7) return '#8bc34a'; // Verde claro
    if (score >= 0.5) return '#ff9800'; // Naranja
    if (score >= 0.3) return '#ff5722'; // Naranja rojizo
    return '#f44336'; // Rojo
  }
};
