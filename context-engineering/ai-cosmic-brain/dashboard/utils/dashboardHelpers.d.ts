export declare function getHealthScoreColor(score: number): string;
export declare function getCriticalStatusColor(criticalCount: number): string;
export declare function getGuardianThemeColor(guardianType: string): string;
export declare function formatScoreAsPercentage(score: number, decimals?: number): string;
export declare function formatPhilosophyScore(score: number): string;
export declare function formatTimeMetric(milliseconds: number): string;
export declare function formatFileSize(bytes: number): string;
interface GuardianStatusData {
    score: number;
    criticalIssues: number;
    lastAnalysis: Date | null;
}
interface SystemHealthStatus {
    status: 'excellent' | 'good' | 'warning' | 'critical';
    score: number;
    message: string;
}
export declare function calculateOverallHealthStatus(guardians: GuardianStatusData[]): SystemHealthStatus;
export declare function isGuardianHealthy(guardian: GuardianStatusData): boolean;
export declare function formatRelativeTime(date: Date | null): string;
export declare function getFormattedTimestamp(date?: Date): string;
export declare function formatTimeUntilNextUpdate(seconds: number): string;
export declare function evaluatePhilosophyPrincipleAlignment(principleScore: number, principleName: string): {
    level: string;
    message: string;
    color: string;
};
export declare function calculateAyniBalance(contributionMetrics: {
    given: number;
    received: number;
}): {
    balance: number;
    status: string;
    recommendation: string;
};
export declare function groupRecommendationsBySeverity(recommendations: Array<{
    severity: string;
}>): Record<string, number>;
export declare function calculateTrend(currentValue: number, previousValue: number): {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    isSignificant: boolean;
};
export declare function validateDashboardData(data: any): {
    isValid: boolean;
    errors: string[];
};
export declare function getGuardianDisplayName(guardianType: string): string;
export declare function calculateTrendDirection(trendData: any): 'up' | 'down' | 'stable';
declare const _default: {
    getHealthScoreColor: typeof getHealthScoreColor;
    getCriticalStatusColor: typeof getCriticalStatusColor;
    getGuardianThemeColor: typeof getGuardianThemeColor;
    formatScoreAsPercentage: typeof formatScoreAsPercentage;
    formatPhilosophyScore: typeof formatPhilosophyScore;
    formatTimeMetric: typeof formatTimeMetric;
    formatFileSize: typeof formatFileSize;
    formatRelativeTime: typeof formatRelativeTime;
    getFormattedTimestamp: typeof getFormattedTimestamp;
    formatTimeUntilNextUpdate: typeof formatTimeUntilNextUpdate;
    calculateOverallHealthStatus: typeof calculateOverallHealthStatus;
    isGuardianHealthy: typeof isGuardianHealthy;
    evaluatePhilosophyPrincipleAlignment: typeof evaluatePhilosophyPrincipleAlignment;
    calculateAyniBalance: typeof calculateAyniBalance;
    groupRecommendationsBySeverity: typeof groupRecommendationsBySeverity;
    calculateTrend: typeof calculateTrend;
    validateDashboardData: typeof validateDashboardData;
    getGuardianDisplayName: typeof getGuardianDisplayName;
    calculateTrendDirection: typeof calculateTrendDirection;
};
export default _default;
