/**
 * 🛡️ Guardian Status Monitor Components
 *
 * Sistema completo de monitoreo de estado y actividad para los guardians
 * del AI Cosmic Brain. Proporciona visibilidad completa sobre el estado
 * operacional de todos los guardians.
 *
 * Filosofía aplicada:
 * - Bien Común: Monitoreo transparente para beneficio del equipo
 * - Neguentropía: Organización clara del estado del sistema
 * - Ayni: Balance entre información y usabilidad
 */

// Exportar componentes principales
export { GuardianStatusMonitor } from '../GuardianStatusMonitor';
export { GuardianCard } from '../GuardianCard';
export { GuardianActivityTimeline } from '../GuardianActivityTimeline';
export { GuardianHealthIndicator } from '../GuardianHealthIndicator';

// Tipos disponibles desde el archivo principal de tipos
export type { GuardianType, SystemHealthMetrics } from '../../types';

// Configuraciones por defecto
export const defaultGuardianConfigs = {
  philosophy: {
    name: 'Philosophy Guardian',
    icon: 'Psychology',
    color: '#9C27B0',
    description: 'Monitors CoomÜnity philosophy alignment'
  },
  architecture: {
    name: 'Architecture Guardian',
    icon: 'Architecture',
    color: '#2196F3',
    description: 'Monitors system architecture and design patterns'
  },
  ux: {
    name: 'UX Guardian',
    icon: 'Visibility',
    color: '#FF9800',
    description: 'Monitors user experience and accessibility'
  },
  performance: {
    name: 'Performance Guardian',
    icon: 'Speed',
    color: '#4CAF50',
    description: 'Monitors system performance and optimization'
  }
};

// Configuración por defecto del monitor
export const defaultGuardianMonitorConfig = {
  refreshInterval: 30000, // 30 segundos
  maxActivities: 50,
  compactMode: false,
  showTrends: true,
  autoRefresh: true,
  alertThresholds: {
    critical: 60,
    warning: 75,
    good: 85,
    excellent: 90
  }
};

// Utilidades helper
export const guardianStatusUtils = {
  /**
   * Calcula el color basado en el score de salud
   */
  getHealthColor: (score: number): string => {
    if (score >= 90) return '#4CAF50';
    if (score >= 80) return '#8BC34A';
    if (score >= 70) return '#FFC107';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  },

  /**
   * Obtiene la etiqueta de salud basada en el score
   */
  getHealthLabel: (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Poor';
    return 'Critical';
  },

  /**
   * Formatea un timestamp para mostrar
   */
  formatTimestamp: (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  },

  /**
   * Calcula la tendencia general del sistema
   */
  calculateSystemTrend: (guardianData: any[]): {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  } => {
    if (!guardianData.length) return { direction: 'stable', percentage: 0 };

    const avgTrend = guardianData.reduce((sum, g) => sum + (g.trend || 0), 0) / guardianData.length;

    return {
      direction: avgTrend > 2 ? 'up' : avgTrend < -2 ? 'down' : 'stable',
      percentage: Math.abs(avgTrend)
    };
  }
};
