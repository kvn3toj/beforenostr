import { PatternPrediction, Mission, HarmonyMetrics, EvolutionReport } from '../types';
export interface ICosmicBrain {
    selfImprove(): Promise<EvolutionReport>;
    evaluateEvolution(): Promise<EvolutionReport>;
    predictPatterns(): Promise<PatternPrediction[]>;
    validatePredictions(): Promise<PatternPrediction[]>;
    assignMissions(): Promise<Mission[]>;
    monitorMissions(): Promise<Mission[]>;
    analyzeTeamHarmony(): Promise<HarmonyMetrics>;
    suggestHarmonyImprovements(): Promise<string[]>;
    getCosmicState(): Promise<CosmicState>;
    resetCosmic(): Promise<void>;
}
export interface CosmicState {
    lastEvolution: Date;
    activePatterns: PatternPrediction[];
    activeMissions: Mission[];
    currentHarmony: HarmonyMetrics;
    systemHealth: number;
    philosophyAlignment: number;
}
