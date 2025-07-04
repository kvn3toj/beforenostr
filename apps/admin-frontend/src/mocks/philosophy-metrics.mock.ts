/**
 * =============================================================================
 * MOCKS DE MÉTRICAS FILOSÓFICAS - GAMIFIER ADMIN
 * =============================================================================
 * Datos mock realistas para desarrollo independiente del backend.
 * Permite a MIRA, ARIA y ZENO desarrollar la UI sin esperar la implementación
 * completa del backend de ATLAS.
 *
 * Basado en las mejores prácticas de: https://www.robinwieruch.de/react-mock-data/
 * Guardianes responsables: MIRA (admin-frontend), ARIA (UI/UX), ZENO (experiencia)
 * =============================================================================
 */

import {
  HambreMetric,
  IEAReciprocidad,
  PhilosophyDashboardConfig,
  PhilosophyMetricsState
} from '@coomunity/shared-types';

/**
 * Mock data para la métrica HambrE
 * Simula diferentes estados del "impulso evolutivo" de la comunidad
 */
export const mockHambreBasic: HambreMetric = {
  level: 'medio',
  value: 55,
  updatedAt: new Date().toISOString(),
  metadata: {
    source: 'manual',
    notes: 'Ajuste realizado después de la sesión de planificación semanal',
    updatedBy: 'gamifier-admin-001'
  }
};

export const mockHambreBajo: HambreMetric = {
  level: 'bajo',
  value: 25,
  updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
  metadata: {
    source: 'auto',
    notes: 'Detectada baja participación en actividades comunitarias',
    updatedBy: 'system-ai'
  }
};

export const mockHambreAlto: HambreMetric = {
  level: 'alto',
  value: 85,
  updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutos atrás
  metadata: {
    source: 'ai',
    notes: 'Alto nivel de engagement detectado en nuevos retos',
    updatedBy: 'nira-ai-system'
  }
};

/**
 * Mock data para el Índice de Equilibrio de Reciprocidad (IEA)
 * Simula el balance entre dar y recibir en el ecosistema
 */
export const mockIEABasic: IEAReciprocidad = {
  dar: 70,
  recibir: 60,
  ponderacion: 0.8,
  updatedAt: new Date().toISOString(),
  indiceCalculado: 0.93, // (70/60) * 0.8 ≈ 0.93
  metadata: {
    period: 'weekly',
    periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    periodEnd: new Date().toISOString(),
    calculationDetails: {
      darComponents: ['contribuciones_contenido', 'ayuda_comunidad', 'participacion_retos'],
      recibirComponents: ['consumo_contenido', 'uso_herramientas', 'beneficios_recibidos'],
      algorithm: 'weighted_reciprocity_v2.1'
    }
  }
};

export const mockIEADesequilibrado: IEAReciprocidad = {
  dar: 30,
  recibir: 90,
  ponderacion: 1.0,
  updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hora atrás
  indiceCalculado: 0.33, // (30/90) * 1.0 = 0.33
  metadata: {
    period: 'daily',
    periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    periodEnd: new Date().toISOString(),
    calculationDetails: {
      darComponents: ['contribuciones_minimas'],
      recibirComponents: ['alto_consumo_recursos', 'uso_excesivo_herramientas'],
      algorithm: 'weighted_reciprocity_v2.1'
    }
  }
};

/**
 * Mock de configuración del dashboard filosófico
 */
export const mockPhilosophyConfig: PhilosophyDashboardConfig = {
  hambre: {
    enabled: true,
    displayMode: 'both',
    thresholds: {
      low: 33,
      medium: 66,
      high: 100
    }
  },
  iea: {
    enabled: true,
    displayMode: 'both',
    targetRange: {
      min: 0.8,
      max: 1.2
    }
  },
  general: {
    refreshInterval: 15, // 15 minutos
    showHistory: true,
    historyRetentionDays: 30
  }
};

/**
 * Mock del estado completo del dashboard
 */
export const mockPhilosophyState: PhilosophyMetricsState = {
  hambre: mockHambreBasic,
  iea: mockIEABasic,
  config: mockPhilosophyConfig,
  lastSync: new Date().toISOString()
};

/**
 * Array de datos históricos para testing de gráficos
 */
export const mockHambreHistory: HambreMetric[] = [
  {
    level: 'bajo',
    value: 20,
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'auto' }
  },
  {
    level: 'bajo',
    value: 35,
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'manual' }
  },
  {
    level: 'medio',
    value: 45,
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'auto' }
  },
  {
    level: 'medio',
    value: 55,
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'ai' }
  },
  {
    level: 'medio',
    value: 62,
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'manual' }
  },
  {
    level: 'alto',
    value: 70,
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'auto' }
  },
  {
    level: 'alto',
    value: 75,
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'ai' }
  }
];

/**
 * Simulador de API fake para desarrollo
 * Basado en el patrón de Robin Wieruch: https://www.robinwieruch.de/javascript-fake-api/
 */
export const mockPhilosophyAPI = {
  /**
   * Simula la obtención de métricas actuales
   */
  async getMetrics(): Promise<PhilosophyMetricsState> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPhilosophyState;
  },

  /**
   * Simula la actualización de HambrE
   */
  async updateHambre(newValue: number): Promise<HambreMetric> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let level: 'bajo' | 'medio' | 'alto' = 'medio';
    if (newValue <= 33) level = 'bajo';
    else if (newValue >= 67) level = 'alto';

    return {
      level,
      value: newValue,
      updatedAt: new Date().toISOString(),
      metadata: {
        source: 'manual',
        notes: `Actualización manual del valor a ${newValue}`,
        updatedBy: 'current-gamifier'
      }
    };
  },

  /**
   * Simula la actualización de IEA
   */
  async updateIEA(dar: number, recibir: number, ponderacion: number): Promise<IEAReciprocidad> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const indiceCalculado = (dar / recibir) * ponderacion;

    return {
      dar,
      recibir,
      ponderacion,
      indiceCalculado,
      updatedAt: new Date().toISOString(),
      metadata: {
        period: 'custom',
        periodStart: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        periodEnd: new Date().toISOString(),
        calculationDetails: {
          darComponents: ['manual_adjustment'],
          recibirComponents: ['manual_adjustment'],
          algorithm: 'manual_calculation'
        }
      }
    };
  },

  /**
   * Simula obtener historial de métricas
   */
  async getHambreHistory(): Promise<HambreMetric[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockHambreHistory;
  }
};
