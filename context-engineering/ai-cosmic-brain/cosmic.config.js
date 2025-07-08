"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCosmicConfig = exports.validateCosmicConfig = exports.getCosmicConfig = exports.CRITICAL_PROJECT_CONFIG = exports.CREATIVE_PROJECT_CONFIG = exports.LARGE_TEAM_CONFIG = exports.SMALL_TEAM_CONFIG = exports.TESTING_COSMIC_CONFIG = exports.PRODUCTION_COSMIC_CONFIG = exports.DEVELOPMENT_COSMIC_CONFIG = exports.DEFAULT_COSMIC_CONFIG = void 0;
exports.DEFAULT_COSMIC_CONFIG = {
    evolutionInterval: 60,
    predictionHorizon: 14,
    harmonyAnalysisInterval: 30,
    missionAssignmentInterval: 120,
    philosophyWeight: 0.7,
    autoEvolutionEnabled: true,
    debugMode: false
};
exports.DEVELOPMENT_COSMIC_CONFIG = {
    ...exports.DEFAULT_COSMIC_CONFIG,
    evolutionInterval: 10,
    harmonyAnalysisInterval: 5,
    missionAssignmentInterval: 15,
    debugMode: true
};
exports.PRODUCTION_COSMIC_CONFIG = {
    ...exports.DEFAULT_COSMIC_CONFIG,
    evolutionInterval: 240,
    harmonyAnalysisInterval: 60,
    missionAssignmentInterval: 480,
    debugMode: false
};
exports.TESTING_COSMIC_CONFIG = {
    ...exports.DEFAULT_COSMIC_CONFIG,
    evolutionInterval: 1,
    harmonyAnalysisInterval: 1,
    missionAssignmentInterval: 1,
    predictionHorizon: 1,
    autoEvolutionEnabled: false,
    debugMode: true
};
exports.SMALL_TEAM_CONFIG = {
    ...exports.DEFAULT_COSMIC_CONFIG,
    evolutionInterval: 30,
    harmonyAnalysisInterval: 15,
    missionAssignmentInterval: 60,
    philosophyWeight: 0.8
};
exports.LARGE_TEAM_CONFIG = {
    ...exports.DEFAULT_COSMIC_CONFIG,
    evolutionInterval: 180,
    harmonyAnalysisInterval: 45,
    missionAssignmentInterval: 360,
    philosophyWeight: 0.6
};
exports.CREATIVE_PROJECT_CONFIG = {
    ...exports.DEFAULT_COSMIC_CONFIG,
    evolutionInterval: 45,
    harmonyAnalysisInterval: 20,
    missionAssignmentInterval: 90,
    philosophyWeight: 0.9,
    predictionHorizon: 7
};
exports.CRITICAL_PROJECT_CONFIG = {
    ...exports.DEFAULT_COSMIC_CONFIG,
    evolutionInterval: 480,
    harmonyAnalysisInterval: 120,
    missionAssignmentInterval: 720,
    philosophyWeight: 0.5,
    predictionHorizon: 30,
    autoEvolutionEnabled: false
};
function getCosmicConfig(environment = 'default') {
    switch (environment.toLowerCase()) {
        case 'development':
        case 'dev':
            return exports.DEVELOPMENT_COSMIC_CONFIG;
        case 'production':
        case 'prod':
            return exports.PRODUCTION_COSMIC_CONFIG;
        case 'testing':
        case 'test':
            return exports.TESTING_COSMIC_CONFIG;
        case 'small-team':
            return exports.SMALL_TEAM_CONFIG;
        case 'large-team':
            return exports.LARGE_TEAM_CONFIG;
        case 'creative':
            return exports.CREATIVE_PROJECT_CONFIG;
        case 'critical':
            return exports.CRITICAL_PROJECT_CONFIG;
        default:
            return exports.DEFAULT_COSMIC_CONFIG;
    }
}
exports.getCosmicConfig = getCosmicConfig;
function validateCosmicConfig(config) {
    const errors = [];
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
exports.validateCosmicConfig = validateCosmicConfig;
function createCosmicConfig(baseConfig, overrides) {
    const errors = validateCosmicConfig(overrides);
    if (errors.length > 0) {
        throw new Error(`Configuración inválida: ${errors.join(', ')}`);
    }
    return { ...baseConfig, ...overrides };
}
exports.createCosmicConfig = createCosmicConfig;
//# sourceMappingURL=cosmic.config.js.map