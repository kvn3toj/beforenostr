export declare const DEFAULT_COSMIC_CONFIG: CosmicConfig;
export declare const DEVELOPMENT_COSMIC_CONFIG: CosmicConfig;
export declare const PRODUCTION_COSMIC_CONFIG: CosmicConfig;
export declare const TESTING_COSMIC_CONFIG: CosmicConfig;
export declare const SMALL_TEAM_CONFIG: CosmicConfig;
export declare const LARGE_TEAM_CONFIG: CosmicConfig;
export declare const CREATIVE_PROJECT_CONFIG: CosmicConfig;
export declare const CRITICAL_PROJECT_CONFIG: CosmicConfig;
export declare function getCosmicConfig(environment?: string): CosmicConfig;
export declare function validateCosmicConfig(config: Partial<CosmicConfig>): string[];
export declare function createCosmicConfig(baseConfig: CosmicConfig, overrides: Partial<CosmicConfig>): CosmicConfig;
export interface CosmicConfig {
    evolutionInterval: number;
    predictionHorizon: number;
    harmonyAnalysisInterval: number;
    missionAssignmentInterval: number;
    philosophyWeight: number;
    autoEvolutionEnabled: boolean;
    debugMode: boolean;
}
