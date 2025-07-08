/**
 * 🌌 Configuración del Sistema IA Cósmica
 *
 * Define los parámetros operacionales del CosmicBrain para auto-evolución,
 * predicción de patrones y análisis de armonía del equipo.
 *
 * Filosofía CoomÜnity: Los valores por defecto priorizan el Bien Común,
 * la colaboración armoniosa y la evolución sostenible del sistema.
 */

// Removed import - using local interface definition

export const DEFAULT_COSMIC_CONFIG: CosmicConfig = {
  // 🔄 Intervalos de evolución (en minutos)
  evolutionInterval: 60, // 1 hora - permite evolución constante sin ser intrusivo

  // 🔮 Horizonte de predicción (en días)
  predictionHorizon: 14, // 2 semanas - balance entre planificación y adaptabilidad

  // 📊 Análisis de armonía (en minutos)
  harmonyAnalysisInterval: 30, // 30 minutos - monitoreo frecuente del bienestar del equipo

  // 🎯 Asignación de misiones (en minutos)
  missionAssignmentInterval: 120, // 2 horas - tiempo suficiente para completar tareas

  // 🌟 Peso de la filosofía en decisiones (0-1)
  philosophyWeight: 0.7, // 70% - prioriza fuertemente la filosofía CoomÜnity

  // 🤖 Auto-evolución habilitada
  autoEvolutionEnabled: true, // Sistema vivo que se mejora continuamente

  // 🐛 Modo debug
  debugMode: false // Deshabilitado por defecto para producción
};

/**
 * 🎯 Configuración para desarrollo
 * Intervalos más frecuentes para testing y debugging
 */
export const DEVELOPMENT_COSMIC_CONFIG: CosmicConfig = {
  ...DEFAULT_COSMIC_CONFIG,
  evolutionInterval: 10, // 10 minutos - evolución rápida para desarrollo
  harmonyAnalysisInterval: 5, // 5 minutos - monitoreo frecuente
  missionAssignmentInterval: 15, // 15 minutos - asignaciones rápidas
  debugMode: true // Logs detallados para desarrollo
};

/**
 * 🏭 Configuración para producción
 * Intervalos optimizados para estabilidad y rendimiento
 */
export const PRODUCTION_COSMIC_CONFIG: CosmicConfig = {
  ...DEFAULT_COSMIC_CONFIG,
  evolutionInterval: 240, // 4 horas - evolución más conservadora
  harmonyAnalysisInterval: 60, // 1 hora - monitoreo balanceado
  missionAssignmentInterval: 480, // 8 horas - asignaciones planificadas
  debugMode: false // Sin logs de debug en producción
};

/**
 * 🧪 Configuración para testing
 * Intervalos mínimos para pruebas automatizadas
 */
export const TESTING_COSMIC_CONFIG: CosmicConfig = {
  ...DEFAULT_COSMIC_CONFIG,
  evolutionInterval: 1, // 1 minuto - evolución inmediata para tests
  harmonyAnalysisInterval: 1, // 1 minuto - análisis inmediato
  missionAssignmentInterval: 1, // 1 minuto - asignación inmediata
  predictionHorizon: 1, // 1 día - predicciones a corto plazo para tests
  autoEvolutionEnabled: false, // Evolución manual en tests
  debugMode: true // Logs completos para debugging de tests
};

/**
 * 🌱 Configuración para equipo pequeño (1-3 desarrolladores)
 */
export const SMALL_TEAM_CONFIG: CosmicConfig = {
  ...DEFAULT_COSMIC_CONFIG,
  evolutionInterval: 30, // 30 minutos - evolución ágil
  harmonyAnalysisInterval: 15, // 15 minutos - monitoreo cercano
  missionAssignmentInterval: 60, // 1 hora - asignaciones frecuentes
  philosophyWeight: 0.8 // 80% - mayor peso a filosofía en equipos pequeños
};

/**
 * 🏢 Configuración para equipo grande (10+ desarrolladores)
 */
export const LARGE_TEAM_CONFIG: CosmicConfig = {
  ...DEFAULT_COSMIC_CONFIG,
  evolutionInterval: 180, // 3 horas - evolución más estable
  harmonyAnalysisInterval: 45, // 45 minutos - análisis balanceado
  missionAssignmentInterval: 360, // 6 horas - asignaciones planificadas
  philosophyWeight: 0.6 // 60% - balance con consideraciones técnicas
};

/**
 * 🎨 Configuración para proyectos creativos
 * Enfocada en innovación y experimentación
 */
export const CREATIVE_PROJECT_CONFIG: CosmicConfig = {
  ...DEFAULT_COSMIC_CONFIG,
  evolutionInterval: 45, // 45 minutos - evolución creativa frecuente
  harmonyAnalysisInterval: 20, // 20 minutos - monitoreo del flow creativo
  missionAssignmentInterval: 90, // 1.5 horas - tiempo para exploración
  philosophyWeight: 0.9, // 90% - máxima prioridad a la filosofía creativa
  predictionHorizon: 7 // 1 semana - predicciones ágiles para creatividad
};

/**
 * 🛡️ Configuración para proyectos críticos
 * Enfocada en estabilidad y confiabilidad
 */
export const CRITICAL_PROJECT_CONFIG: CosmicConfig = {
  ...DEFAULT_COSMIC_CONFIG,
  evolutionInterval: 480, // 8 horas - evolución muy conservadora
  harmonyAnalysisInterval: 120, // 2 horas - monitoreo estable
  missionAssignmentInterval: 720, // 12 horas - asignaciones muy planificadas
  philosophyWeight: 0.5, // 50% - balance con consideraciones de seguridad
  predictionHorizon: 30, // 1 mes - predicciones a largo plazo
  autoEvolutionEnabled: false // Evolución manual para máximo control
};

/**
 * 🌟 Función para obtener configuración según el entorno
 */
export function getCosmicConfig(environment: string = 'default'): CosmicConfig {
  switch (environment.toLowerCase()) {
    case 'development':
    case 'dev':
      return DEVELOPMENT_COSMIC_CONFIG;

    case 'production':
    case 'prod':
      return PRODUCTION_COSMIC_CONFIG;

    case 'testing':
    case 'test':
      return TESTING_COSMIC_CONFIG;

    case 'small-team':
      return SMALL_TEAM_CONFIG;

    case 'large-team':
      return LARGE_TEAM_CONFIG;

    case 'creative':
      return CREATIVE_PROJECT_CONFIG;

    case 'critical':
      return CRITICAL_PROJECT_CONFIG;

    default:
      return DEFAULT_COSMIC_CONFIG;
  }
}

/**
 * 🔧 Función para validar configuración personalizada
 */
export function validateCosmicConfig(config: Partial<CosmicConfig>): string[] {
  const errors: string[] = [];

  if (config.evolutionInterval !== undefined && config.evolutionInterval < 1) {
    errors.push('evolutionInterval debe ser al menos 1 minuto');
  }

  if (config.predictionHorizon !== undefined && config.predictionHorizon < 1) {
    errors.push('predictionHorizon debe ser al menos 1 día');
  }

  if (config.harmonyAnalysisInterval !== undefined && config.harmonyAnalysisInterval < 1) {
    errors.push('harmonyAnalysisInterval debe ser al menos 1 minuto');
  }

  if (config.missionAssignmentInterval !== undefined && config.missionAssignmentInterval < 1) {
    errors.push('missionAssignmentInterval debe ser al menos 1 minuto');
  }

  if (config.philosophyWeight !== undefined && (config.philosophyWeight < 0 || config.philosophyWeight > 1)) {
    errors.push('philosophyWeight debe estar entre 0 y 1');
  }

  return errors;
}

/**
 * 🌈 Función para crear configuración personalizada con validación
 */
export function createCosmicConfig(baseConfig: CosmicConfig, overrides: Partial<CosmicConfig>): CosmicConfig {
  const errors = validateCosmicConfig(overrides);
  if (errors.length > 0) {
    throw new Error(`Configuración inválida: ${errors.join(', ')}`);
  }

  return { ...baseConfig, ...overrides };
}

/**
 * 🌌 Cosmic Brain Configuration Interface
 */
export interface CosmicConfig {
  evolutionInterval: number; // minutes
  predictionHorizon: number; // days
  harmonyAnalysisInterval: number; // minutes
  missionAssignmentInterval: number; // minutes
  philosophyWeight: number; // 0-1, how much philosophy influences decisions
  autoEvolutionEnabled: boolean;
  debugMode: boolean;
}
