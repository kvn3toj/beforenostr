"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhilosophyDrivenValidator = void 0;
const events_1 = require("events");
class PhilosophyDrivenValidator extends events_1.EventEmitter {
    constructor() {
        super();
        this.rules = new Map();
        this.principleWeights = {
            bien_comun: 0.25,
            ayni: 0.20,
            cooperacion: 0.15,
            economia_sagrada: 0.15,
            metanoia: 0.10,
            negentropia: 0.10,
            vocacion: 0.05
        };
        this.validationHistory = [];
        this.initializePhilosophyRules();
    }
    initializePhilosophyRules() {
        this.addPhilosophyRule({
            id: 'bien_comun_001',
            name: 'Priorización del Beneficio Colectivo',
            principle: 'bien_comun',
            description: 'El código debe priorizar el beneficio de toda la comunidad',
            weight: 1.0,
            criteria: {
                codePatterns: [
                    'shared', 'common', 'collective', 'community', 'public',
                    'accessibility', 'inclusive', 'universal', 'global'
                ],
                antiPatterns: [
                    'private', 'exclusive', 'restricted', 'limited', 'individual',
                    'selfish', 'proprietary', 'closed'
                ],
                semanticKeywords: [
                    'bien común', 'beneficio colectivo', 'interés general',
                    'comunidad', 'compartido', 'público'
                ],
                contextualFactors: [
                    'accesibilidad', 'inclusión', 'transparencia', 'apertura'
                ]
            },
            validation: {
                minScore: 0.7,
                severity: 'critical',
                autoFixable: false,
                dependencies: []
            },
            metrics: {
                implementationLevel: 'good',
                impactScope: 'global',
                alignmentStrength: 0.8
            }
        });
        this.addPhilosophyRule({
            id: 'ayni_001',
            name: 'Reciprocidad y Equilibrio',
            principle: 'ayni',
            description: 'El código debe mantener equilibrio y reciprocidad',
            weight: 1.0,
            criteria: {
                codePatterns: [
                    'balance', 'reciprocal', 'mutual', 'exchange', 'give',
                    'receive', 'equilibrium', 'symmetry', 'fair'
                ],
                antiPatterns: [
                    'imbalance', 'one-way', 'take', 'exploit', 'unfair',
                    'asymmetric', 'selfish', 'greedy'
                ],
                semanticKeywords: [
                    'ayni', 'reciprocidad', 'equilibrio', 'intercambio',
                    'dar y recibir', 'balance'
                ],
                contextualFactors: [
                    'justicia', 'equidad', 'mutualidad', 'correspondencia'
                ]
            },
            validation: {
                minScore: 0.7,
                severity: 'high',
                autoFixable: true,
                dependencies: []
            },
            metrics: {
                implementationLevel: 'good',
                impactScope: 'module',
                alignmentStrength: 0.75
            }
        });
        this.addPhilosophyRule({
            id: 'cooperacion_001',
            name: 'Cooperación sobre Competencia',
            principle: 'cooperacion',
            description: 'El código debe fomentar cooperación sobre competencia',
            weight: 1.0,
            criteria: {
                codePatterns: [
                    'collaborate', 'cooperate', 'team', 'together', 'shared',
                    'collective', 'joint', 'partnership', 'alliance'
                ],
                antiPatterns: [
                    'compete', 'rival', 'conflict', 'fight', 'battle',
                    'dominate', 'win-lose', 'zero-sum'
                ],
                semanticKeywords: [
                    'cooperación', 'colaboración', 'trabajo en equipo',
                    'alianza', 'partnership', 'sinergia'
                ],
                contextualFactors: [
                    'integración', 'complementariedad', 'apoyo mutuo'
                ]
            },
            validation: {
                minScore: 0.6,
                severity: 'medium',
                autoFixable: true,
                dependencies: []
            },
            metrics: {
                implementationLevel: 'good',
                impactScope: 'component',
                alignmentStrength: 0.7
            }
        });
        this.addPhilosophyRule({
            id: 'economia_sagrada_001',
            name: 'Valor Real vs Artificial',
            principle: 'economia_sagrada',
            description: 'El código debe crear valor real, no artificial',
            weight: 1.0,
            criteria: {
                codePatterns: [
                    'value', 'meaningful', 'authentic', 'real', 'genuine',
                    'substantial', 'purposeful', 'sacred', 'worthy'
                ],
                antiPatterns: [
                    'artificial', 'fake', 'superficial', 'meaningless',
                    'wasteful', 'bloated', 'unnecessary', 'vanity'
                ],
                semanticKeywords: [
                    'economía sagrada', 'valor real', 'auténtico',
                    'significativo', 'propósito', 'sustancia'
                ],
                contextualFactors: [
                    'sostenibilidad', 'eficiencia', 'utilidad real'
                ]
            },
            validation: {
                minScore: 0.6,
                severity: 'medium',
                autoFixable: false,
                dependencies: []
            },
            metrics: {
                implementationLevel: 'good',
                impactScope: 'function',
                alignmentStrength: 0.65
            }
        });
        this.addPhilosophyRule({
            id: 'metanoia_001',
            name: 'Transformación Consciente',
            principle: 'metanoia',
            description: 'El código debe facilitar transformación consciente',
            weight: 1.0,
            criteria: {
                codePatterns: [
                    'transform', 'evolve', 'improve', 'upgrade', 'enhance',
                    'conscious', 'mindful', 'intentional', 'deliberate'
                ],
                antiPatterns: [
                    'static', 'rigid', 'unchanging', 'stagnant',
                    'unconscious', 'automatic', 'mindless'
                ],
                semanticKeywords: [
                    'metanöia', 'transformación', 'evolución consciente',
                    'mejora continua', 'cambio intencional'
                ],
                contextualFactors: [
                    'adaptabilidad', 'flexibilidad', 'crecimiento'
                ]
            },
            validation: {
                minScore: 0.5,
                severity: 'low',
                autoFixable: true,
                dependencies: []
            },
            metrics: {
                implementationLevel: 'basic',
                impactScope: 'component',
                alignmentStrength: 0.6
            }
        });
        this.addPhilosophyRule({
            id: 'negentropia_001',
            name: 'Orden Consciente',
            principle: 'negentropia',
            description: 'El código debe crear orden consciente y estructura',
            weight: 1.0,
            criteria: {
                codePatterns: [
                    'organized', 'structured', 'ordered', 'systematic',
                    'coherent', 'clear', 'logical', 'consistent'
                ],
                antiPatterns: [
                    'chaotic', 'messy', 'disorganized', 'random',
                    'inconsistent', 'confusing', 'cluttered'
                ],
                semanticKeywords: [
                    'neguentropía', 'orden consciente', 'estructura',
                    'organización', 'coherencia', 'claridad'
                ],
                contextualFactors: [
                    'mantenibilidad', 'legibilidad', 'comprensibilidad'
                ]
            },
            validation: {
                minScore: 0.5,
                severity: 'low',
                autoFixable: true,
                dependencies: []
            },
            metrics: {
                implementationLevel: 'basic',
                impactScope: 'module',
                alignmentStrength: 0.55
            }
        });
        this.addPhilosophyRule({
            id: 'vocacion_001',
            name: 'Propósito Auténtico',
            principle: 'vocacion',
            description: 'El código debe expresar propósito auténtico',
            weight: 1.0,
            criteria: {
                codePatterns: [
                    'purpose', 'mission', 'calling', 'authentic', 'genuine',
                    'meaningful', 'intentional', 'passionate'
                ],
                antiPatterns: [
                    'purposeless', 'meaningless', 'aimless', 'random',
                    'superficial', 'forced', 'artificial'
                ],
                semanticKeywords: [
                    'vocación', 'propósito', 'misión', 'llamado',
                    'autenticidad', 'pasión', 'intención'
                ],
                contextualFactors: [
                    'alineación', 'coherencia', 'integridad'
                ]
            },
            validation: {
                minScore: 0.4,
                severity: 'low',
                autoFixable: false,
                dependencies: []
            },
            metrics: {
                implementationLevel: 'basic',
                impactScope: 'global',
                alignmentStrength: 0.5
            }
        });
    }
    async validatePhilosophyAlignment(context) {
        const startTime = Date.now();
        const result = {
            ruleId: 'philosophy_validation',
            guardianType: 'philosophy',
            status: 'passed',
            score: 0,
            message: '',
            executionTime: 0,
            timestamp: new Date(),
            principleBreakdown: {},
            overallAlignment: {},
            contextualAnalysis: {},
            actionableInsights: {},
            philosophyMetrics: {}
        };
        try {
            for (const principle of Object.keys(this.principleWeights)) {
                result.principleBreakdown[principle] = await this.evaluatePrinciple(principle, context);
            }
            result.overallAlignment = this.calculateOverallAlignment(result.principleBreakdown);
            result.contextualAnalysis = await this.performContextualAnalysis(context, result.principleBreakdown);
            result.actionableInsights = this.generateActionableInsights(result.principleBreakdown, result.overallAlignment);
            result.score = result.overallAlignment.score;
            result.status = result.score >= 0.7 ? 'passed' : result.score >= 0.5 ? 'warning' : 'failed';
            result.message = this.generateValidationMessage(result);
            result.philosophyMetrics = Object.fromEntries(Object.entries(result.principleBreakdown).map(([principle, data]) => [principle, data.score]));
        }
        catch (error) {
            result.status = 'failed';
            result.score = 0;
            result.message = `Error en validación filosófica: ${error instanceof Error ? error.message : 'Error desconocido'}`;
        }
        result.executionTime = Date.now() - startTime;
        this.validationHistory.push(result);
        this.emit('philosophy:validation_completed', {
            result,
            timestamp: new Date()
        });
        return result;
    }
    async evaluatePrinciple(principle, context) {
        const principleRules = Array.from(this.rules.values())
            .filter(rule => rule.principle === principle);
        const evaluationResults = {
            score: 0,
            level: 'needs_improvement',
            violations: [],
            recommendations: [],
            exemplaryPatterns: []
        };
        let totalScore = 0;
        let totalWeight = 0;
        for (const rule of principleRules) {
            const ruleResult = await this.evaluateRule(rule, context);
            totalScore += ruleResult.score * rule.weight;
            totalWeight += rule.weight;
            if (ruleResult.violations.length > 0) {
                evaluationResults.violations.push(...ruleResult.violations);
            }
            if (ruleResult.recommendations.length > 0) {
                evaluationResults.recommendations.push(...ruleResult.recommendations);
            }
            if (ruleResult.exemplaryPatterns.length > 0) {
                evaluationResults.exemplaryPatterns.push(...ruleResult.exemplaryPatterns);
            }
        }
        evaluationResults.score = totalWeight > 0 ? totalScore / totalWeight : 0;
        evaluationResults.level = this.determineImplementationLevel(evaluationResults.score);
        return evaluationResults;
    }
    async evaluateRule(rule, context) {
        const result = {
            score: 0,
            violations: [],
            recommendations: [],
            exemplaryPatterns: []
        };
        const positiveMatches = this.findPatterns(context.content, rule.criteria.codePatterns);
        const positiveScore = Math.min(positiveMatches.length * 0.1, 0.6);
        const negativeMatches = this.findPatterns(context.content, rule.criteria.antiPatterns);
        const negativeScore = Math.max(-negativeMatches.length * 0.15, -0.4);
        const semanticMatches = this.findPatterns(context.content, rule.criteria.semanticKeywords);
        const semanticScore = Math.min(semanticMatches.length * 0.2, 0.3);
        const contextualScore = await this.analyzeContextualFactors(rule, context);
        result.score = Math.max(0, Math.min(1, positiveScore + semanticScore + contextualScore + negativeScore));
        if (negativeMatches.length > 0) {
            result.violations.push(`Anti-patrones detectados para ${rule.principle}: ${negativeMatches.join(', ')}`);
        }
        if (result.score < rule.validation.minScore) {
            result.violations.push(`Score insuficiente para ${rule.name}: ${result.score.toFixed(2)} < ${rule.validation.minScore}`);
        }
        if (result.score < 0.8) {
            result.recommendations.push(...this.generateRecommendationsForRule(rule, result.score));
        }
        if (positiveMatches.length > 0) {
            result.exemplaryPatterns.push(...positiveMatches.slice(0, 3));
        }
        return result;
    }
    findPatterns(content, patterns) {
        const found = [];
        const contentLower = content.toLowerCase();
        for (const pattern of patterns) {
            if (contentLower.includes(pattern.toLowerCase())) {
                found.push(pattern);
            }
        }
        return found;
    }
    async analyzeContextualFactors(rule, context) {
        let contextualScore = 0;
        if (context.filePath.includes('component') || context.filePath.includes('page')) {
            contextualScore += 0.1;
        }
        const lines = context.content.split('\n').length;
        if (lines > 100 && lines < 500) {
            contextualScore += 0.05;
        }
        const philosophyComments = this.findPatterns(context.content, [
            'filosofía', 'philosophy', 'bien común', 'ayni', 'cooperación'
        ]);
        contextualScore += Math.min(philosophyComments.length * 0.1, 0.2);
        return Math.min(contextualScore, 0.3);
    }
    generateRecommendationsForRule(rule, score) {
        const recommendations = [];
        switch (rule.principle) {
            case 'bien_comun':
                if (score < 0.5) {
                    recommendations.push('Considerar cómo este código beneficia a toda la comunidad');
                    recommendations.push('Agregar accesibilidad y características inclusivas');
                    recommendations.push('Documentar el impacto positivo en el bien común');
                }
                break;
            case 'ayni':
                if (score < 0.5) {
                    recommendations.push('Implementar patrones de intercambio equilibrado');
                    recommendations.push('Asegurar reciprocidad en las interacciones');
                    recommendations.push('Balancear dar y recibir en las funcionalidades');
                }
                break;
            case 'cooperacion':
                if (score < 0.5) {
                    recommendations.push('Fomentar colaboración sobre competencia');
                    recommendations.push('Implementar características de trabajo en equipo');
                    recommendations.push('Evitar patrones competitivos destructivos');
                }
                break;
            case 'economia_sagrada':
                if (score < 0.5) {
                    recommendations.push('Enfocar en crear valor real y significativo');
                    recommendations.push('Eliminar funcionalidades superficiales o artificiales');
                    recommendations.push('Optimizar para eficiencia y utilidad genuina');
                }
                break;
            case 'metanoia':
                if (score < 0.5) {
                    recommendations.push('Facilitar transformación y crecimiento consciente');
                    recommendations.push('Implementar características de evolución progresiva');
                    recommendations.push('Agregar capacidades de mejora continua');
                }
                break;
            case 'negentropia':
                if (score < 0.5) {
                    recommendations.push('Mejorar organización y estructura del código');
                    recommendations.push('Aumentar claridad y coherencia');
                    recommendations.push('Implementar patrones de orden consciente');
                }
                break;
            case 'vocacion':
                if (score < 0.5) {
                    recommendations.push('Alinear el código con el propósito auténtico');
                    recommendations.push('Expresar la misión y visión más claramente');
                    recommendations.push('Conectar funcionalidades con la vocación del proyecto');
                }
                break;
        }
        return recommendations;
    }
    calculateOverallAlignment(principleBreakdown) {
        let weightedScore = 0;
        let strongestPrinciple = 'bien_comun';
        let weakestPrinciple = 'bien_comun';
        let maxScore = 0;
        let minScore = 1;
        for (const [principle, data] of Object.entries(principleBreakdown)) {
            const weight = this.principleWeights[principle];
            weightedScore += data.score * weight;
            if (data.score > maxScore) {
                maxScore = data.score;
                strongestPrinciple = principle;
            }
            if (data.score < minScore) {
                minScore = data.score;
                weakestPrinciple = principle;
            }
        }
        const scores = Object.values(principleBreakdown).map((data) => data.score);
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
        const balanceScore = Math.max(0, 1 - variance);
        return {
            score: weightedScore,
            level: this.determineImplementationLevel(weightedScore),
            strongestPrinciple,
            weakestPrinciple,
            balanceScore
        };
    }
    async performContextualAnalysis(context, principleBreakdown) {
        const codebaseMaturity = this.assessCodebaseMaturity(context);
        const philosophicalEvolution = this.assessPhilosophicalEvolution();
        const antiPatternDensity = this.calculateAntiPatternDensity(principleBreakdown);
        const goodPracticeAdoption = this.calculateGoodPracticeAdoption(principleBreakdown);
        return {
            codebaseMaturity,
            philosophicalEvolution,
            antiPatternDensity,
            goodPracticeAdoption
        };
    }
    generateActionableInsights(principleBreakdown, overallAlignment) {
        const priorityActions = [];
        const philosophicalGuidance = [];
        const implementationSuggestions = [];
        const sortedPrinciples = Object.entries(principleBreakdown)
            .sort(([, a], [, b]) => a.score - b.score)
            .slice(0, 3);
        for (const [principle, data] of sortedPrinciples) {
            priorityActions.push({
                principle: principle,
                action: `Mejorar implementación de ${principle}`,
                impact: data.score < 0.3 ? 'high' : data.score < 0.6 ? 'medium' : 'low',
                effort: 'medium',
                timeline: data.score < 0.3 ? 'inmediato' : '1-2 semanas'
            });
        }
        if (overallAlignment.score < 0.5) {
            philosophicalGuidance.push('Reflexionar sobre cómo el código sirve al bien común');
            philosophicalGuidance.push('Buscar equilibrio y reciprocidad en las implementaciones');
            philosophicalGuidance.push('Priorizar cooperación sobre competencia en el diseño');
        }
        implementationSuggestions.push('Agregar comentarios que expliquen la alineación filosófica');
        implementationSuggestions.push('Revisar nomenclatura para reflejar valores de CoomÜnity');
        implementationSuggestions.push('Implementar métricas de impacto en bien común');
        const longTermVision = overallAlignment.score > 0.8
            ? 'Continuar siendo un ejemplo de implementación filosófica consciente'
            : 'Evolucionar hacia una implementación que encarne plenamente los principios de CoomÜnity';
        return {
            priorityActions,
            philosophicalGuidance,
            implementationSuggestions,
            longTermVision
        };
    }
    determineImplementationLevel(score) {
        if (score >= 0.9)
            return 'exemplary';
        if (score >= 0.8)
            return 'excellent';
        if (score >= 0.7)
            return 'good';
        if (score >= 0.5)
            return 'basic';
        return 'needs_improvement';
    }
    generateValidationMessage(result) {
        const level = result.overallAlignment.level;
        const score = (result.overallAlignment.score * 100).toFixed(1);
        return `Alineación filosófica: ${level} (${score}%). ` +
            `Principio más fuerte: ${result.overallAlignment.strongestPrinciple}. ` +
            `Principio a mejorar: ${result.overallAlignment.weakestPrinciple}.`;
    }
    assessCodebaseMaturity(context) {
        const lines = context.content.split('\n');
        const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('*')).length;
        const commentRatio = commentLines / lines.length;
        return Math.min(commentRatio * 2 + 0.3, 1.0);
    }
    assessPhilosophicalEvolution() {
        if (this.validationHistory.length < 2)
            return 0.5;
        const recent = this.validationHistory.slice(-5);
        const trend = recent.length > 1
            ? (recent[recent.length - 1].score - recent[0].score) / (recent.length - 1)
            : 0;
        return Math.max(0, Math.min(1, 0.5 + trend));
    }
    calculateAntiPatternDensity(principleBreakdown) {
        let totalViolations = 0;
        let totalPrinciples = 0;
        for (const data of Object.values(principleBreakdown)) {
            totalViolations += data.violations.length;
            totalPrinciples++;
        }
        return totalPrinciples > 0 ? Math.min(totalViolations / totalPrinciples / 5, 1) : 0;
    }
    calculateGoodPracticeAdoption(principleBreakdown) {
        let totalExemplary = 0;
        let totalPrinciples = 0;
        for (const data of Object.values(principleBreakdown)) {
            totalExemplary += data.exemplaryPatterns.length;
            totalPrinciples++;
        }
        return totalPrinciples > 0 ? Math.min(totalExemplary / totalPrinciples / 3, 1) : 0;
    }
    addPhilosophyRule(rule) {
        this.validatePhilosophyRule(rule);
        this.rules.set(rule.id, rule);
        this.emit('rule:added', {
            ruleId: rule.id,
            principle: rule.principle,
            timestamp: new Date()
        });
    }
    removePhilosophyRule(ruleId) {
        const rule = this.rules.get(ruleId);
        if (!rule)
            return false;
        this.rules.delete(ruleId);
        this.emit('rule:removed', {
            ruleId,
            principle: rule.principle,
            timestamp: new Date()
        });
        return true;
    }
    getRulesByPrinciple(principle) {
        return Array.from(this.rules.values())
            .filter(rule => rule.principle === principle);
    }
    getValidationStats() {
        if (this.validationHistory.length === 0) {
            return {
                totalValidations: 0,
                averageScore: 0,
                trend: 'stable',
                principlePerformance: {}
            };
        }
        const recent = this.validationHistory.slice(-10);
        const averageScore = recent.reduce((sum, result) => sum + result.score, 0) / recent.length;
        let trend = 'stable';
        if (recent.length > 1) {
            const firstHalf = recent.slice(0, Math.floor(recent.length / 2));
            const secondHalf = recent.slice(Math.floor(recent.length / 2));
            const firstAvg = firstHalf.reduce((sum, result) => sum + result.score, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum, result) => sum + result.score, 0) / secondHalf.length;
            if (secondAvg > firstAvg + 0.05)
                trend = 'improving';
            else if (secondAvg < firstAvg - 0.05)
                trend = 'declining';
        }
        const principlePerformance = {};
        for (const principle of Object.keys(this.principleWeights)) {
            const scores = recent.map(result => result.principleBreakdown[principle]?.score || 0);
            principlePerformance[principle] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        }
        return {
            totalValidations: this.validationHistory.length,
            averageScore,
            trend,
            principlePerformance
        };
    }
    updatePrincipleWeights(weights) {
        const totalWeight = Object.values({ ...this.principleWeights, ...weights })
            .reduce((sum, weight) => sum + weight, 0);
        if (Math.abs(totalWeight - 1.0) > 0.01) {
            throw new Error('Los pesos de principios deben sumar 1.0');
        }
        Object.assign(this.principleWeights, weights);
        this.emit('weights:updated', {
            weights: this.principleWeights,
            timestamp: new Date()
        });
    }
    getValidationHistory(limit) {
        return limit
            ? this.validationHistory.slice(-limit)
            : [...this.validationHistory];
    }
    validatePhilosophyRule(rule) {
        if (!rule.id || !rule.name || !rule.principle) {
            throw new Error('Regla debe tener id, name y principle');
        }
        if (this.rules.has(rule.id)) {
            throw new Error(`Regla con id '${rule.id}' ya existe`);
        }
        if (!Object.keys(this.principleWeights).includes(rule.principle)) {
            throw new Error(`Principio '${rule.principle}' no es válido`);
        }
    }
}
exports.PhilosophyDrivenValidator = PhilosophyDrivenValidator;
exports.default = PhilosophyDrivenValidator;
//# sourceMappingURL=PhilosophyDrivenValidator.js.map