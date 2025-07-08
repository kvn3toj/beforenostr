import { HarmonyMetrics, CosmicConfig } from './types';
export interface TeamActivity {
    memberId: string;
    timestamp: Date;
    type: 'commit' | 'review' | 'comment' | 'merge' | 'issue' | 'meeting';
    impact: number;
    collaborators: string[];
    philosophyAlignment: number;
}
export interface WellbeingIndicator {
    memberId: string;
    timestamp: Date;
    workHours: number;
    stressLevel: number;
    satisfactionLevel: number;
    communicationTone: 'positive' | 'neutral' | 'negative';
    responseTime: number;
}
export interface AyniContribution {
    giverId: string;
    receiverId: string;
    type: 'knowledge' | 'code' | 'review' | 'support' | 'mentoring';
    value: number;
    timestamp: Date;
    philosophyAlignment: number;
}
export declare class HarmonyAnalyzer {
    private config;
    private harmonyHistory;
    private teamActivities;
    private wellbeingData;
    private ayniContributions;
    constructor(config: CosmicConfig);
    analyzeTeamHarmony(): Promise<HarmonyMetrics>;
    private analyzeCollaboration;
    private analyzePhilosophy;
    private analyzeTechnical;
    private analyzeCommunication;
    private analyzeWellbeing;
    detectBurnoutPatterns(): Promise<{
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
        affectedMembers: string[];
        indicators: string[];
        recommendations: string[];
    }>;
    suggestHarmonyImprovements(): Promise<string[]>;
    private calculateAyniScore;
    private analyzePairProgramming;
    private analyzeCodeReviews;
    private analyzeKnowledgeSharing;
    private analyzeConflictResolution;
    private calculateBienComunAlignment;
    private analyzeCooperationLevel;
    private analyzeSustainabilityFocus;
    private analyzeTransparency;
    private analyzeInclusivity;
    private analyzeCommunicationClarity;
    private analyzeResponsiveness;
    private analyzeEmpathy;
    private analyzeFeedbackQuality;
    private analyzeWorkLifeBalance;
    private analyzeStressLevel;
    private analyzeSatisfactionLevel;
    private analyzeBurnoutRisk;
    private calculateOverallHarmony;
    private analyzeTrends;
    private detectOverworkPattern;
    private detectCommunicationDecline;
    private detectIsolationPattern;
    private calculateBurnoutRisk;
    private generateBurnoutRecommendations;
    private calculateAverageWorkHours;
    private log;
}
