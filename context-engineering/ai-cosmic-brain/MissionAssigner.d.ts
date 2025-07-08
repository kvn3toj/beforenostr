import { Mission, MissionCategory, CosmicConfig, HarmonyMetrics, PatternPrediction, ImpactLevel } from './types';
export interface ProjectGap {
    id: string;
    area: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    impact: ImpactLevel;
    evidence: string[];
    suggestedSolutions: string[];
    philosophyAlignment: number;
    technicalDebt: number;
    urgency: number;
}
export interface Opportunity {
    id: string;
    name: string;
    description: string;
    category: MissionCategory;
    potentialValue: number;
    implementationComplexity: number;
    philosophyBenefit: number;
    technicalBenefit: number;
    teamGrowthPotential: number;
    estimatedEffort: number;
    dependencies: string[];
}
export interface TeamMember {
    id: string;
    name: string;
    skills: string[];
    currentWorkload: number;
    preferences: string[];
    growthAreas: string[];
    ayniContributions: number;
    philosophyAlignment: number;
    availability: number;
}
export interface MissionAssignmentContext {
    gaps: ProjectGap[];
    opportunities: Opportunity[];
    teamMembers: TeamMember[];
    harmony: HarmonyMetrics;
    predictions: PatternPrediction[];
    projectPriorities: string[];
    timeConstraints: {
        sprint: number;
        release: number;
        milestone: number;
    };
}
export interface AssignmentStrategy {
    prioritizePhilosophy: boolean;
    balanceWorkload: boolean;
    focusOnGrowth: boolean;
    considerAyni: boolean;
    respectPreferences: boolean;
}
export declare class MissionAssigner {
    private config;
    private assignmentHistory;
    private completedMissions;
    constructor(config: CosmicConfig);
    assignMissions(context: MissionAssignmentContext, strategy?: AssignmentStrategy): Promise<Mission[]>;
    identifyProjectGaps(context: MissionAssignmentContext): Promise<ProjectGap[]>;
    identifyOpportunities(context: MissionAssignmentContext): Promise<Opportunity[]>;
    updateMissionProgress(missionId: string, progress: number, notes?: string): Promise<Mission | null>;
    getMissionStats(): {
        total: number;
        assigned: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        averageCompletion: number;
        philosophyAlignment: number;
    };
    private generateCandidateMissions;
    private createMissionsFromGap;
    private createMissionFromOpportunity;
    private createMissionsFromPrediction;
    private prioritizeMissions;
    private calculateMissionScore;
    private assignResources;
    private findBestCandidate;
    private calculateCandidateScore;
    private optimizeForTeamBalance;
    private establishSchedule;
    private validateAssignments;
    private identifyTechnicalGaps;
    private identifyProcessGaps;
    private identifyPhilosophyGaps;
    private identifyCollaborationGaps;
    private identifyDocumentationGaps;
    private identifyTechnicalOpportunities;
    private identifyGrowthOpportunities;
    private identifyPhilosophyOpportunities;
    private identifyPredictionOpportunities;
    private severityToPriority;
    private valueToPriority;
    private impactToPriority;
    private areaToCategory;
    private patternCategoryToMissionCategory;
    private estimateEffortFromSeverity;
    private estimateEffortFromConfidence;
    private getPriorityWeight;
    private extractPhilosophyScore;
    private calculateHarmonyImpact;
    private calculateUrgency;
    private calculateSkillsMatch;
    private extractRequiredSkills;
    private calculateGrowthPotential;
    private calculateAyniBalance;
    private estimateWorkloadImpact;
    private updateAyniScore;
    private extractAssignedMember;
    private calculateDueDate;
    private isAssignmentValid;
    private generateId;
    private log;
}
