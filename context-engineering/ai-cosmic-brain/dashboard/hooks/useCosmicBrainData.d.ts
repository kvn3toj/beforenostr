import { CosmicBrain } from '../../CosmicBrain';
import { AnalysisReport, PhilosophyAlignment } from '../../types';
interface SystemHealthMetrics {
    overallScore: number;
    guardiansActive: number;
    totalRecommendations: number;
    criticalIssues: number;
    lastEvolution: Date | null;
    philosophyAlignment: number;
}
interface GuardianReportsCollection {
    philosophy?: AnalysisReport;
    architecture?: AnalysisReport;
    ux?: AnalysisReport;
    performance?: AnalysisReport;
}
interface UseCosmicBrainDataReturn {
    guardianReports: GuardianReportsCollection;
    philosophyAlignment: PhilosophyAlignment | null;
    systemHealthMetrics: SystemHealthMetrics;
    isDataLoading: boolean;
    dataError: string | null;
    refreshData: () => Promise<void>;
    pauseAutoRefresh: () => void;
    resumeAutoRefresh: () => void;
    lastUpdateTimestamp: Date | null;
    nextUpdateIn: number;
    isAutoRefreshActive: boolean;
}
export declare const useCosmicBrainData: (cosmicBrain: CosmicBrain, refreshIntervalMs?: number) => UseCosmicBrainDataReturn;
export default useCosmicBrainData;
