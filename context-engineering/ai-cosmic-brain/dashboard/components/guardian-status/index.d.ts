export { GuardianStatusMonitor } from '../GuardianStatusMonitor';
export { GuardianCard } from '../GuardianCard';
export { GuardianActivityTimeline } from '../GuardianActivityTimeline';
export { GuardianHealthIndicator } from '../GuardianHealthIndicator';
export type { GuardianType, SystemHealthMetrics } from '../../types';
export declare const defaultGuardianConfigs: {
    philosophy: {
        name: string;
        icon: string;
        color: string;
        description: string;
    };
    architecture: {
        name: string;
        icon: string;
        color: string;
        description: string;
    };
    ux: {
        name: string;
        icon: string;
        color: string;
        description: string;
    };
    performance: {
        name: string;
        icon: string;
        color: string;
        description: string;
    };
};
export declare const defaultGuardianMonitorConfig: {
    refreshInterval: number;
    maxActivities: number;
    compactMode: boolean;
    showTrends: boolean;
    autoRefresh: boolean;
    alertThresholds: {
        critical: number;
        warning: number;
        good: number;
        excellent: number;
    };
};
export declare const guardianStatusUtils: {
    getHealthColor: (score: number) => string;
    getHealthLabel: (score: number) => string;
    formatTimestamp: (timestamp: Date) => string;
    calculateSystemTrend: (guardianData: any[]) => {
        direction: 'up' | 'down' | 'stable';
        percentage: number;
    };
};
