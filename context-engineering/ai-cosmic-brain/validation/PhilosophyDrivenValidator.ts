/**
 * 🧘 AI COSMIC BRAIN - PHILOSOPHY-DRIVEN VALIDATOR
 * ===============================================
 *
 * Validador especializado en principios filosóficos de CoomÜnity
 * que evalúa alineación con los 7 principios fundamentales.
 *
 * Filosofía CoomÜnity:
 * - Bien Común (25%): Priorizar el beneficio colectivo
 * - Ayni (20%): Reciprocidad y equilibrio
 * - Cooperación (15%): Colaboración sobre competencia
 * - Economía Sagrada (15%): Valor real vs artificial
 * - Metanöia (10%): Transformación consciente
 * - Neguentropía (10%): Orden consciente
 * - Vocación (5%): Propósito auténtico
 */

import { EventEmitter } from 'events';
import {
  ValidationResult,
  RuleContext,
  PhilosophyPrinciple,
  GuardianType
} from '../types';

export interface PhilosophyRule {
  id: string;
  name: string;
  principle: PhilosophyPrinciple;
  description: string;
  weight: number;

  // Criterios de evaluación
  criteria: {
    codePatterns: string[];
    antiPatterns: string[];
    semanticKeywords: string[];
    contextualFactors: string[];
  };

  // Configuración de validación
  validation: {
    minScore: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    autoFixable: boolean;
    dependencies: string[];
  };

  // Métricas específicas del principio
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

export class PhilosophyDrivenValidator extends EventEmitter {
  private rules: Map<string, PhilosophyRule>;
  private principleWeights: Record<PhilosophyPrinciple, number>;
  private validationHistory: PhilosophyValidationResult[];

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

  /**
   * 🏗️ Inicializar reglas filosóficas fundamentales
   */
  private initializePhilosophyRules(): void {
    // Reglas para Bien Común
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

    // Reglas para Ayni (Reciprocidad)
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

    // Reglas para Cooperación
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

    // Reglas para Economía Sagrada
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

    // Reglas para Metanöia
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

    // Reglas para Neguentropía
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

    // Reglas para Vocación
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

  /**
   * ✅ Validar alineación filosófica
   */
  async validatePhilosophyAlignment(context: RuleContext): Promise<PhilosophyValidationResult> {
    const startTime = Date.now();

    // Inicializar resultado
    const result: PhilosophyValidationResult = {
      ruleId: 'philosophy_validation',
      guardianType: 'philosophy' as GuardianType,
      status: 'passed',
      score: 0,
      message: '',
      executionTime: 0,
      timestamp: new Date(),
      principleBreakdown: {} as any,
      overallAlignment: {} as any,
      contextualAnalysis: {} as any,
      actionableInsights: {} as any,
      philosophyMetrics: {}
    };

    try {
      // Evaluar cada principio
      for (const principle of Object.keys(this.principleWeights) as PhilosophyPrinciple[]) {
        result.principleBreakdown[principle] = await this.evaluatePrinciple(principle, context);
      }

      // Calcular alineación general
      result.overallAlignment = this.calculateOverallAlignment(result.principleBreakdown);

      // Análisis contextual
      result.contextualAnalysis = await this.performContextualAnalysis(context, result.principleBreakdown);

      // Generar insights accionables
      result.actionableInsights = this.generateActionableInsights(result.principleBreakdown, result.overallAlignment);

      // Establecer score y status final
      result.score = result.overallAlignment.score;
      result.status = result.score >= 0.7 ? 'passed' : result.score >= 0.5 ? 'warning' : 'failed';
      result.message = this.generateValidationMessage(result);

      // Métricas filosóficas para compatibilidad
      result.philosophyMetrics = Object.fromEntries(
        Object.entries(result.principleBreakdown).map(([principle, data]) => [principle, data.score])
      ) as Record<PhilosophyPrinciple, number>;

    } catch (error) {
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

  /**
   * 🧘 Evaluar principio específico
   */
  private async evaluatePrinciple(
    principle: PhilosophyPrinciple,
    context: RuleContext
  ): Promise<any> {
    const principleRules = Array.from(this.rules.values())
      .filter(rule => rule.principle === principle);

    const evaluationResults = {
      score: 0,
      level: 'needs_improvement',
      violations: [] as string[],
      recommendations: [] as string[],
      exemplaryPatterns: [] as string[]
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

  /**
   * 📏 Evaluar regla específica
   */
  private async evaluateRule(rule: PhilosophyRule, context: RuleContext): Promise<any> {
    const result = {
      score: 0,
      violations: [] as string[],
      recommendations: [] as string[],
      exemplaryPatterns: [] as string[]
    };

    // Analizar patrones positivos
    const positiveMatches = this.findPatterns(context.content, rule.criteria.codePatterns);
    const positiveScore = Math.min(positiveMatches.length * 0.1, 0.6);

    // Analizar anti-patrones
    const negativeMatches = this.findPatterns(context.content, rule.criteria.antiPatterns);
    const negativeScore = Math.max(-negativeMatches.length * 0.15, -0.4);

    // Analizar palabras clave semánticas
    const semanticMatches = this.findPatterns(context.content, rule.criteria.semanticKeywords);
    const semanticScore = Math.min(semanticMatches.length * 0.2, 0.3);

    // Análisis contextual
    const contextualScore = await this.analyzeContextualFactors(rule, context);

    // Score final
    result.score = Math.max(0, Math.min(1, positiveScore + semanticScore + contextualScore + negativeScore));

    // Generar violaciones
    if (negativeMatches.length > 0) {
      result.violations.push(`Anti-patrones detectados para ${rule.principle}: ${negativeMatches.join(', ')}`);
    }

    if (result.score < rule.validation.minScore) {
      result.violations.push(`Score insuficiente para ${rule.name}: ${result.score.toFixed(2)} < ${rule.validation.minScore}`);
    }

    // Generar recomendaciones
    if (result.score < 0.8) {
      result.recommendations.push(...this.generateRecommendationsForRule(rule, result.score));
    }

    // Identificar patrones ejemplares
    if (positiveMatches.length > 0) {
      result.exemplaryPatterns.push(...positiveMatches.slice(0, 3));
    }

    return result;
  }

  /**
   * 🔍 Encontrar patrones en el contenido
   */
  private findPatterns(content: string, patterns: string[]): string[] {
    const found: string[] = [];
    const contentLower = content.toLowerCase();

    for (const pattern of patterns) {
      if (contentLower.includes(pattern.toLowerCase())) {
        found.push(pattern);
      }
    }

    return found;
  }

  /**
   * 🌍 Analizar factores contextuales
   */
  private async analyzeContextualFactors(rule: PhilosophyRule, context: RuleContext): Promise<number> {
    let contextualScore = 0;

    // Analizar tipo de archivo
    if (context.filePath.includes('component') || context.filePath.includes('page')) {
      contextualScore += 0.1; // Componentes UI tienen mayor impacto en filosofía
    }

    // Analizar tamaño del archivo
    const lines = context.content.split('\n').length;
    if (lines > 100 && lines < 500) {
      contextualScore += 0.05; // Tamaño moderado es bueno
    }

    // Analizar comentarios filosóficos
    const philosophyComments = this.findPatterns(context.content, [
      'filosofía', 'philosophy', 'bien común', 'ayni', 'cooperación'
    ]);
    contextualScore += Math.min(philosophyComments.length * 0.1, 0.2);

    return Math.min(contextualScore, 0.3);
  }

  /**
   * 💡 Generar recomendaciones para regla
   */
  private generateRecommendationsForRule(rule: PhilosophyRule, score: number): string[] {
    const recommendations: string[] = [];

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

  /**
   * 📊 Calcular alineación general
   */
  private calculateOverallAlignment(principleBreakdown: any): any {
    let weightedScore = 0;
    let strongestPrinciple: PhilosophyPrinciple = 'bien_comun';
    let weakestPrinciple: PhilosophyPrinciple = 'bien_comun';
    let maxScore = 0;
    let minScore = 1;

    // Calcular score ponderado
    for (const [principle, data] of Object.entries(principleBreakdown) as [PhilosophyPrinciple, any][]) {
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

    // Calcular balance (qué tan equilibrados están los principios)
    const scores = Object.values(principleBreakdown).map((data: any) => data.score);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
    const balanceScore = Math.max(0, 1 - variance); // Menor varianza = mejor balance

    return {
      score: weightedScore,
      level: this.determineImplementationLevel(weightedScore),
      strongestPrinciple,
      weakestPrinciple,
      balanceScore
    };
  }

  /**
   * 🔬 Realizar análisis contextual
   */
  private async performContextualAnalysis(context: RuleContext, principleBreakdown: any): Promise<any> {
    // Madurez del codebase
    const codebaseMaturity = this.assessCodebaseMaturity(context);

    // Evolución filosófica
    const philosophicalEvolution = this.assessPhilosophicalEvolution();

    // Densidad de anti-patrones
    const antiPatternDensity = this.calculateAntiPatternDensity(principleBreakdown);

    // Adopción de buenas prácticas
    const goodPracticeAdoption = this.calculateGoodPracticeAdoption(principleBreakdown);

    return {
      codebaseMaturity,
      philosophicalEvolution,
      antiPatternDensity,
      goodPracticeAdoption
    };
  }

  /**
   * 💡 Generar insights accionables
   */
  private generateActionableInsights(principleBreakdown: any, overallAlignment: any): any {
    const priorityActions: any[] = [];
    const philosophicalGuidance: string[] = [];
    const implementationSuggestions: string[] = [];

    // Generar acciones prioritarias basadas en principios más débiles
    const sortedPrinciples = Object.entries(principleBreakdown)
      .sort(([,a], [,b]) => (a as any).score - (b as any).score)
      .slice(0, 3);

    for (const [principle, data] of sortedPrinciples) {
      priorityActions.push({
        principle: principle as PhilosophyPrinciple,
        action: `Mejorar implementación de ${principle}`,
        impact: (data as any).score < 0.3 ? 'high' : (data as any).score < 0.6 ? 'medium' : 'low',
        effort: 'medium',
        timeline: (data as any).score < 0.3 ? 'inmediato' : '1-2 semanas'
      });
    }

    // Guía filosófica general
    if (overallAlignment.score < 0.5) {
      philosophicalGuidance.push('Reflexionar sobre cómo el código sirve al bien común');
      philosophicalGuidance.push('Buscar equilibrio y reciprocidad en las implementaciones');
      philosophicalGuidance.push('Priorizar cooperación sobre competencia en el diseño');
    }

    // Sugerencias de implementación
    implementationSuggestions.push('Agregar comentarios que expliquen la alineación filosófica');
    implementationSuggestions.push('Revisar nomenclatura para reflejar valores de CoomÜnity');
    implementationSuggestions.push('Implementar métricas de impacto en bien común');

    // Visión a largo plazo
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

  // Métodos auxiliares

  private determineImplementationLevel(score: number): string {
    if (score >= 0.9) return 'exemplary';
    if (score >= 0.8) return 'excellent';
    if (score >= 0.7) return 'good';
    if (score >= 0.5) return 'basic';
    return 'needs_improvement';
  }

  private generateValidationMessage(result: PhilosophyValidationResult): string {
    const level = result.overallAlignment.level;
    const score = (result.overallAlignment.score * 100).toFixed(1);

    return `Alineación filosófica: ${level} (${score}%). ` +
           `Principio más fuerte: ${result.overallAlignment.strongestPrinciple}. ` +
           `Principio a mejorar: ${result.overallAlignment.weakestPrinciple}.`;
  }

  private assessCodebaseMaturity(context: RuleContext): number {
    // Análisis simple de madurez basado en estructura y comentarios
    const lines = context.content.split('\n');
    const commentLines = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('*')).length;
    const commentRatio = commentLines / lines.length;

    return Math.min(commentRatio * 2 + 0.3, 1.0);
  }

  private assessPhilosophicalEvolution(): number {
    // Analizar evolución basada en historial de validaciones
    if (this.validationHistory.length < 2) return 0.5;

    const recent = this.validationHistory.slice(-5);
    const trend = recent.length > 1
      ? (recent[recent.length - 1].score - recent[0].score) / (recent.length - 1)
      : 0;

    return Math.max(0, Math.min(1, 0.5 + trend));
  }

  private calculateAntiPatternDensity(principleBreakdown: any): number {
    let totalViolations = 0;
    let totalPrinciples = 0;

    for (const data of Object.values(principleBreakdown) as any[]) {
      totalViolations += data.violations.length;
      totalPrinciples++;
    }

    return totalPrinciples > 0 ? Math.min(totalViolations / totalPrinciples / 5, 1) : 0;
  }

  private calculateGoodPracticeAdoption(principleBreakdown: any): number {
    let totalExemplary = 0;
    let totalPrinciples = 0;

    for (const data of Object.values(principleBreakdown) as any[]) {
      totalExemplary += data.exemplaryPatterns.length;
      totalPrinciples++;
    }

    return totalPrinciples > 0 ? Math.min(totalExemplary / totalPrinciples / 3, 1) : 0;
  }

  // Métodos públicos de gestión

  /**
   * ➕ Agregar regla filosófica
   */
  addPhilosophyRule(rule: PhilosophyRule): void {
    this.validatePhilosophyRule(rule);
    this.rules.set(rule.id, rule);

    this.emit('rule:added', {
      ruleId: rule.id,
      principle: rule.principle,
      timestamp: new Date()
    });
  }

  /**
   * 🗑️ Eliminar regla filosófica
   */
  removePhilosophyRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId);
    if (!rule) return false;

    this.rules.delete(ruleId);

    this.emit('rule:removed', {
      ruleId,
      principle: rule.principle,
      timestamp: new Date()
    });

    return true;
  }

  /**
   * 📋 Obtener reglas por principio
   */
  getRulesByPrinciple(principle: PhilosophyPrinciple): PhilosophyRule[] {
    return Array.from(this.rules.values())
      .filter(rule => rule.principle === principle);
  }

  /**
   * 📊 Obtener estadísticas de validación
   */
  getValidationStats(): any {
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

      if (secondAvg > firstAvg + 0.05) trend = 'improving';
      else if (secondAvg < firstAvg - 0.05) trend = 'declining';
    }

    // Performance por principio
    const principlePerformance: Record<string, number> = {};
    for (const principle of Object.keys(this.principleWeights)) {
      const scores = recent.map(result =>
        result.principleBreakdown[principle as PhilosophyPrinciple]?.score || 0
      );
      principlePerformance[principle] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    return {
      totalValidations: this.validationHistory.length,
      averageScore,
      trend,
      principlePerformance
    };
  }

  /**
   * ⚙️ Actualizar pesos de principios
   */
  updatePrincipleWeights(weights: Partial<Record<PhilosophyPrinciple, number>>): void {
    // Validar que los pesos sumen 1
    const totalWeight = Object.values({...this.principleWeights, ...weights})
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

  /**
   * 📈 Obtener historial de validaciones
   */
  getValidationHistory(limit?: number): PhilosophyValidationResult[] {
    return limit
      ? this.validationHistory.slice(-limit)
      : [...this.validationHistory];
  }

  private validatePhilosophyRule(rule: PhilosophyRule): void {
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

export default PhilosophyDrivenValidator;
