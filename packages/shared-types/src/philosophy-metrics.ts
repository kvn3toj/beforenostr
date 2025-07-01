/**
 * =============================================================================
 * MÉTRICAS FILOSÓFICAS DE COOMUNITY
 * =============================================================================
 * Tipos compartidos para las métricas que representan los valores fundamentales
 * de CoomÜnity: HambrE (impulso evolutivo) e IEA (Índice de Equilibrio de Reciprocidad)
 *
 * Guardianes responsables: COSMOS (arquitectura), ATLAS (backend), MIRA (admin-frontend)
 * =============================================================================
 */

/**
 * MÉTRICA: HambrE
 * Representa el impulso evolutivo y motivacional de la comunidad.
 * Es el "motor primigenio" que impulsa la existencia y evolución de CoomÜnity.
 */
export type HambreLevel = 'bajo' | 'medio' | 'alto';

export interface HambreMetric {
  /** Estado cualitativo del nivel de HambrE */
  level: HambreLevel;

  /** Valor cuantitativo (0-100) para medición precisa */
  value: number;

  /** Marca temporal de la última actualización */
  updatedAt: string; // ISO date

  /** Metadatos adicionales para contexto */
  metadata?: {
    /** Fuente que generó la métrica */
    source?: 'manual' | 'auto' | 'ai';

    /** Comentarios del Gamifier sobre el ajuste */
    notes?: string;

    /** ID del Gamifier que realizó el cambio */
    updatedBy?: string;
  };
}

/**
 * MÉTRICA: Índice de Equilibrio de Reciprocidad (IEA)
 * Mide el balance entre dar y recibir en el ecosistema CoomÜnity.
 * Objetivo: mantener un valor cercano a 1.0 para salud óptima del ecosistema.
 */
export interface IEAReciprocidad {
  /** Valor de contribución/dar al ecosistema (0-100) */
  dar: number;

  /** Valor de recepción/consumo del ecosistema (0-100) */
  recibir: number;

  /** Peso relativo para el cálculo final (0-1) */
  ponderacion: number;

  /** Marca temporal de la última actualización */
  updatedAt: string; // ISO date

  /** Valor calculado del índice (dar/recibir * ponderacion) */
  indiceCalculado?: number;

  /** Metadatos para contexto y trazabilidad */
  metadata?: {
    /** Período de tiempo que abarca el cálculo */
    period?: 'daily' | 'weekly' | 'monthly' | 'custom';

    /** Fecha de inicio del período */
    periodStart?: string;

    /** Fecha de fin del período */
    periodEnd?: string;

    /** Detalles del cálculo para transparencia */
    calculationDetails?: {
      darComponents: string[];
      recibirComponents: string[];
      algorithm: string;
    };
  };
}

/**
 * Configuración global para el tablero filosófico del Gamifier Admin
 */
export interface PhilosophyDashboardConfig {
  /** Configuración de HambrE */
  hambre: {
    enabled: boolean;
    displayMode: 'slider' | 'gauge' | 'both';
    thresholds: {
      low: number;    // 0-33
      medium: number; // 34-66
      high: number;   // 67-100
    };
  };

  /** Configuración de IEA */
  iea: {
    enabled: boolean;
    displayMode: 'card' | 'chart' | 'both';
    targetRange: {
      min: number; // Valor mínimo saludable
      max: number; // Valor máximo saludable
    };
  };

  /** Configuración general del dashboard */
  general: {
    /** Frecuencia de actualización automática (minutos) */
    refreshInterval: number;

    /** Mostrar métricas históricas */
    showHistory: boolean;

    /** Período de retención de datos históricos (días) */
    historyRetentionDays: number;
  };
}

/**
 * Estado completo del dashboard filosófico
 */
export interface PhilosophyMetricsState {
  hambre: HambreMetric;
  iea: IEAReciprocidad;
  config: PhilosophyDashboardConfig;
  lastSync: string; // ISO date
}
