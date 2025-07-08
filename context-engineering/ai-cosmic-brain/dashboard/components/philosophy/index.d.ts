export { default as PhilosophyAlignmentTracker } from './PhilosophyAlignmentTracker';
export { default as PhilosophyTrendAnalysis } from './PhilosophyTrendAnalysis';
export { default as PhilosophyAlerts } from './PhilosophyAlerts';
export { PhilosophyAlignmentTracker as default } from './PhilosophyAlignmentTracker';
export declare const PhilosophyComponents: {
    AlignmentTracker: any;
    TrendAnalysis: any;
    Alerts: any;
};
export declare const defaultPhilosophyConfig: {
    alignmentTracker: {
        expandedByDefault: boolean;
        enableRealTimeUpdates: boolean;
        readOnly: boolean;
    };
    trendAnalysis: {
        defaultTimeRange: "24h";
        defaultPrinciples: string[];
    };
    alerts: {
        maxAlerts: number;
        criticalOnly: boolean;
    };
};
export declare const philosophyUtils: {
    calculateOverallAlignment: (metrics: any) => number;
    getAlignmentLevel: (score: number) => "excellent" | "good" | "basic" | "exemplary" | "needs_improvement";
    getAlignmentColor: (score: number) => "#4caf50" | "#8bc34a" | "#ff9800" | "#ff5722" | "#f44336";
};
