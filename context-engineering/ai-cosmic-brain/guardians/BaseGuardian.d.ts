import { CosmicConfig } from '../cosmic.config';
import { AnalysisReport, GuardianType, Recommendation, PhilosophyAlignment } from '../types';
export declare abstract class BaseGuardian {
    protected config: CosmicConfig;
    protected guardianType: GuardianType;
    protected name: string;
    protected description: string;
    protected lastAnalysis: Date | null;
    protected analysisHistory: AnalysisReport[];
    constructor(guardianType: GuardianType, name: string, description: string, config: CosmicConfig);
    abstract performSpecializedAnalysis(): Promise<AnalysisReport>;
    analyze(): Promise<AnalysisReport>;
    protected enrichWithPhilosophy(report: AnalysisReport): Promise<AnalysisReport>;
    protected applyBienComunFilter(report: AnalysisReport): AnalysisReport;
    protected calculatePhilosophyAlignment(report: AnalysisReport): PhilosophyAlignment;
    protected addPhilosophyContext(recommendation: Recommendation): string;
    protected calculateAyniScore(recommendation: Recommendation): number;
    protected calculateBienComunImpact(recommendation: Recommendation): number;
    getMetrics(): {
        guardianType: GuardianType;
        name: string;
        totalAnalyses: number;
        lastAnalysis: Date;
        averageRecommendations: number;
        philosophyAlignment: number;
        uptime: number;
    };
    protected getGuardianWisdom(): string;
    private calculatePrincipleScore;
    private identifyPhilosophyStrengths;
    private identifyPhilosophyOpportunities;
    private getAveragePhilosophyAlignment;
    private generateBienComunSummary;
    protected log(message: string, level?: 'info' | 'warn' | 'error'): void;
    getStatus(): {
        name: string;
        type: GuardianType;
        isActive: boolean;
        lastAnalysis: Date;
        analysisCount: number;
        description: string;
        philosophyAlignment: number;
    };
    cleanHistory(keepLast?: number): void;
}
export default BaseGuardian;
