/// <reference types="node" />
import { EventEmitter } from 'events';
import { ValidationResult, RuleContext, PhilosophyPrinciple } from '../types';
export interface PhilosophyRule {
    id: string;
    name: string;
    principle: PhilosophyPrinciple;
    description: string;
    weight: number;
    criteria: {
        codePatterns: string[];
        antiPatterns: string[];
        semanticKeywords: string[];
        contextualFactors: string[];
    };
    validation: {
        minScore: number;
        severity: 'low' | 'medium' | 'high' | 'critical';
        autoFixable: boolean;
        dependencies: string[];
    };
    metrics: {
        implementationLevel: 'exemplary' | 'excellent' | 'good' | 'basic' | 'needs_improvement';
        impactScope: 'global' | 'module' | 'component' | 'function';
        alignmentStrength: number;
    };
}
export interface PhilosophyValidationResult extends ValidationResult {
    principleBreakdown: Record<PhilosophyPrinciple, {
        score: number;
        level: string;
        violations: string[];
        recommendations: string[];
        exemplaryPatterns: string[];
    }>;
    overallAlignment: {
        score: number;
        level: string;
        strongestPrinciple: PhilosophyPrinciple;
        weakestPrinciple: PhilosophyPrinciple;
        balanceScore: number;
    };
    contextualAnalysis: {
        codebaseMaturity: number;
        philosophicalEvolution: number;
        antiPatternDensity: number;
        goodPracticeAdoption: number;
    };
    actionableInsights: {
        priorityActions: Array<{
            principle: PhilosophyPrinciple;
            action: string;
            impact: 'high' | 'medium' | 'low';
            effort: 'low' | 'medium' | 'high';
            timeline: string;
        }>;
        philosophicalGuidance: string[];
        implementationSuggestions: string[];
        longTermVision: string;
    };
}
export declare class PhilosophyDrivenValidator extends EventEmitter {
    private rules;
    private principleWeights;
    private validationHistory;
    constructor();
    private initializePhilosophyRules;
    validatePhilosophyAlignment(context: RuleContext): Promise<PhilosophyValidationResult>;
    private evaluatePrinciple;
    private evaluateRule;
    private findPatterns;
    private analyzeContextualFactors;
    private generateRecommendationsForRule;
    private calculateOverallAlignment;
    private performContextualAnalysis;
    private generateActionableInsights;
    private determineImplementationLevel;
    private generateValidationMessage;
    private assessCodebaseMaturity;
    private assessPhilosophicalEvolution;
    private calculateAntiPatternDensity;
    private calculateGoodPracticeAdoption;
    addPhilosophyRule(rule: PhilosophyRule): void;
    removePhilosophyRule(ruleId: string): boolean;
    getRulesByPrinciple(principle: PhilosophyPrinciple): PhilosophyRule[];
    getValidationStats(): any;
    updatePrincipleWeights(weights: Partial<Record<PhilosophyPrinciple, number>>): void;
    getValidationHistory(limit?: number): PhilosophyValidationResult[];
    private validatePhilosophyRule;
}
export default PhilosophyDrivenValidator;
