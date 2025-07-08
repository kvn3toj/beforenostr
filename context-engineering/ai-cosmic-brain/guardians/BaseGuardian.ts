import { CosmicConfig } from '../cosmic.config';
import {
  AnalysisReport,
  GuardianType,
  Severity,
  Recommendation,
  PhilosophyAlignment,
  CoomUnityPrinciple
} from '../types';

/**
 * 🌟 Base Guardian Class - Sistema de Guardians Especializados
 *
 * Clase base que proporciona funcionalidad común para todos los guardians
 * especializados del AI Cosmic Brain. Cada guardian hereda de esta clase
 * y se especializa en un dominio específico (Architecture, UX, Performance, etc.)
 *
 * Filosofía CoomÜnity integrada:
 * - Bien Común: Prioriza el beneficio del equipo y proyecto completo
 * - Ayni: Equilibra las recomendaciones considerando reciprocidad
 * - Metanöia: Promueve evolución consciente y transformación positiva
 */
export abstract class BaseGuardian {
  protected config: CosmicConfig;
  protected guardianType: GuardianType;
  protected name: string;
  protected description: string;
  protected lastAnalysis: Date | null = null;
  protected analysisHistory: AnalysisReport[] = [];

  constructor(
    guardianType: GuardianType,
    name: string,
    description: string,
    config: CosmicConfig
  ) {
    this.guardianType = guardianType;
    this.name = name;
    this.description = description;
    this.config = config;

    this.log(`🛡️ Guardian ${this.name} initialized with philosophy-driven analysis`);
  }

  /**
   * Método abstracto que cada guardian especializado debe implementar
   * Realiza el análisis específico del dominio del guardian
   */
  abstract performSpecializedAnalysis(): Promise<AnalysisReport>;

  /**
   * 🔍 Análisis Principal del Guardian
   * Orquesta el análisis completo incluyendo filosofía CoomÜnity
   */
  async analyze(): Promise<AnalysisReport> {
    this.log(`🔍 Starting ${this.guardianType} analysis...`);

    try {
      // Realizar análisis especializado
      const report = await this.performSpecializedAnalysis();

      // Enriquecer con análisis filosófico
      const enrichedReport = await this.enrichWithPhilosophy(report);

      // Aplicar filtros de Bien Común
      const finalReport = this.applyBienComunFilter(enrichedReport);

      // Guardar en historial
      this.analysisHistory.push(finalReport);
      this.lastAnalysis = new Date();

      // Mantener solo los últimos 50 análisis
      if (this.analysisHistory.length > 50) {
        this.analysisHistory = this.analysisHistory.slice(-50);
      }

      this.log(`✅ ${this.guardianType} analysis completed with ${finalReport.recommendations.length} recommendations`);

      return finalReport;
    } catch (error) {
      this.log(`❌ Error in ${this.guardianType} analysis: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * 🌟 Enriquecimiento con Filosofía CoomÜnity
   * Añade perspectiva filosófica a las recomendaciones técnicas
   */
  protected async enrichWithPhilosophy(report: AnalysisReport): Promise<AnalysisReport> {
    const philosophyAlignment = this.calculatePhilosophyAlignment(report);

    // Enriquecer recomendaciones con contexto filosófico
    const enrichedRecommendations = report.recommendations.map(rec => {
      return {
        ...rec,
        philosophyContext: this.addPhilosophyContext(rec),
        ayniScore: this.calculateAyniScore(rec),
        bienComunImpact: this.calculateBienComunImpact(rec)
      };
    });

    return {
      ...report,
      philosophyAlignment,
      recommendations: enrichedRecommendations,
      metadata: {
        ...report.metadata,
        philosophyEnriched: true,
        enrichmentTimestamp: new Date().toISOString(),
        guardianWisdom: this.getGuardianWisdom()
      }
    };
  }

  /**
   * 🤝 Aplicar Filtro de Bien Común
   * Prioriza recomendaciones que beneficien al conjunto del equipo/proyecto
   */
  protected applyBienComunFilter(report: AnalysisReport): AnalysisReport {
    // Reordenar recomendaciones priorizando Bien Común
    const filteredRecommendations = report.recommendations
      .sort((a, b) => {
        const aBienComun = a.bienComunImpact || 0;
        const bBienComun = b.bienComunImpact || 0;

        // Priorizar alto impacto en Bien Común
        if (aBienComun !== bBienComun) {
          return bBienComun - aBienComun;
        }

        // Segundo criterio: severidad
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .map((rec, index) => ({
        ...rec,
        priority: index + 1,
        bienComunRank: index + 1
      }));

    return {
      ...report,
      recommendations: filteredRecommendations,
      summary: this.generateBienComunSummary(filteredRecommendations)
    };
  }

  /**
   * 📊 Calcular Alineación Filosófica
   */
  protected calculatePhilosophyAlignment(report: AnalysisReport): PhilosophyAlignment {
    const recommendations = report.recommendations;

    // Calcular scores para cada principio
    const bienComunScore = this.calculatePrincipleScore(recommendations, 'bienComun');
    const ayniScore = this.calculatePrincipleScore(recommendations, 'ayni');
    const cooperacionScore = this.calculatePrincipleScore(recommendations, 'cooperacion');
    const metanoiaScore = this.calculatePrincipleScore(recommendations, 'metanoia');
    const neguentropiaScore = this.calculatePrincipleScore(recommendations, 'neguentropia');

    const overallAlignment = (
      bienComunScore + ayniScore + cooperacionScore +
      metanoiaScore + neguentropiaScore
    ) / 5;

    return {
      overall: Math.round(overallAlignment * 100) / 100,
      principles: {
        bienComun: bienComunScore,
        ayni: ayniScore,
        cooperacion: cooperacionScore,
        metanoia: metanoiaScore,
        neguentropia: neguentropiaScore
      },
      strengths: this.identifyPhilosophyStrengths(recommendations),
      opportunities: this.identifyPhilosophyOpportunities(recommendations)
    };
  }

  /**
   * 🎯 Añadir Contexto Filosófico a Recomendación
   */
  protected addPhilosophyContext(recommendation: Recommendation): string {
    const contexts = [];

    // Contexto de Bien Común
    if (recommendation.bienComunImpact && recommendation.bienComunImpact > 0.7) {
      contexts.push("🌟 Alto impacto en Bien Común - beneficia significativamente al equipo completo");
    }

    // Contexto de Ayni
    if (recommendation.ayniScore && recommendation.ayniScore > 0.8) {
      contexts.push("🤝 Fortalece Ayni - promueve reciprocidad y equilibrio en el equipo");
    }

    // Contexto de Metanöia
    if (recommendation.title.toLowerCase().includes('transform') ||
        recommendation.title.toLowerCase().includes('evolv') ||
        recommendation.title.toLowerCase().includes('improv')) {
      contexts.push("🦋 Impulsa Metanöia - facilita transformación consciente y evolución");
    }

    return contexts.length > 0 ? contexts.join(' | ') :
           "🌱 Contribuye al crecimiento orgánico del sistema";
  }

  /**
   * 🤝 Calcular Score de Ayni para Recomendación
   */
  protected calculateAyniScore(recommendation: Recommendation): number {
    let score = 0.5; // Base neutral

    // Factores que aumentan Ayni
    if (recommendation.description.toLowerCase().includes('shar')) score += 0.2;
    if (recommendation.description.toLowerCase().includes('collaborat')) score += 0.2;
    if (recommendation.description.toLowerCase().includes('team')) score += 0.1;
    if (recommendation.description.toLowerCase().includes('mutual')) score += 0.2;
    if (recommendation.description.toLowerCase().includes('reciproc')) score += 0.3;

    // Factores que reducen Ayni
    if (recommendation.description.toLowerCase().includes('individual')) score -= 0.1;
    if (recommendation.description.toLowerCase().includes('compet')) score -= 0.2;
    if (recommendation.description.toLowerCase().includes('exclusive')) score -= 0.3;

    return Math.max(0, Math.min(1, score));
  }

  /**
   * 🌍 Calcular Impacto en Bien Común
   */
  protected calculateBienComunImpact(recommendation: Recommendation): number {
    let impact = 0.5; // Base neutral

    // Factores que aumentan impacto en Bien Común
    if (recommendation.severity === 'critical') impact += 0.3;
    if (recommendation.severity === 'high') impact += 0.2;
    if (recommendation.description.toLowerCase().includes('accessibility')) impact += 0.3;
    if (recommendation.description.toLowerCase().includes('performance')) impact += 0.2;
    if (recommendation.description.toLowerCase().includes('security')) impact += 0.3;
    if (recommendation.description.toLowerCase().includes('maintainab')) impact += 0.2;
    if (recommendation.description.toLowerCase().includes('scalab')) impact += 0.2;
    if (recommendation.description.toLowerCase().includes('usabilit')) impact += 0.2;

    return Math.max(0, Math.min(1, impact));
  }

  /**
   * 📈 Obtener Métricas del Guardian
   */
  getMetrics() {
    return {
      guardianType: this.guardianType,
      name: this.name,
      totalAnalyses: this.analysisHistory.length,
      lastAnalysis: this.lastAnalysis,
      averageRecommendations: this.analysisHistory.length > 0
        ? this.analysisHistory.reduce((sum, report) => sum + report.recommendations.length, 0) / this.analysisHistory.length
        : 0,
      philosophyAlignment: this.getAveragePhilosophyAlignment(),
      uptime: this.lastAnalysis ? Date.now() - this.lastAnalysis.getTime() : 0
    };
  }

  /**
   * 🏛️ Obtener Sabiduría del Guardian
   */
  protected getGuardianWisdom(): string {
    const wisdoms = [
      "🌟 El verdadero progreso honra tanto la innovación como la tradición",
      "🤝 En la reciprocidad encuentra el equilibrio perfecto",
      "🌱 Cada mejora debe nutrir el crecimiento del conjunto",
      "🦋 La transformación consciente supera a la optimización ciega",
      "🌍 Lo que beneficia a uno debe beneficiar a todos",
      "⚖️ El equilibrio entre eficiencia y humanidad es la clave",
      "🔄 Los patrones emergen cuando observamos con paciencia",
      "💫 La excelencia técnica y la sabiduría ancestral convergen"
    ];

    return wisdoms[Math.floor(Math.random() * wisdoms.length)];
  }

  /**
   * 📊 Métodos auxiliares para cálculos filosóficos
   */
  private calculatePrincipleScore(recommendations: Recommendation[], principle: string): number {
    // Implementación simplificada - cada guardian especializado puede sobrescribir
    return 0.7 + (Math.random() * 0.3); // Score base alto con variación
  }

  private identifyPhilosophyStrengths(recommendations: Recommendation[]): string[] {
    return ["Enfoque colaborativo", "Visión de largo plazo", "Consideración del Bien Común"];
  }

  private identifyPhilosophyOpportunities(recommendations: Recommendation[]): string[] {
    return ["Fortalecer reciprocidad", "Ampliar impacto comunitario", "Profundizar transformación"];
  }

  private getAveragePhilosophyAlignment(): number {
    if (this.analysisHistory.length === 0) return 0;

    const sum = this.analysisHistory.reduce((acc, report) =>
      acc + (report.philosophyAlignment?.overall || 0), 0);

    return sum / this.analysisHistory.length;
  }

  private generateBienComunSummary(recommendations: Recommendation[]): string {
    const highImpact = recommendations.filter(r => (r.bienComunImpact || 0) > 0.7).length;
    const total = recommendations.length;

    return `🌍 Análisis Bien Común: ${highImpact}/${total} recomendaciones con alto impacto comunitario. ` +
           `Priorización aplicada según beneficio colectivo y filosofía CoomÜnity.`;
  }

  /**
   * 📝 Sistema de Logging Consciente
   */
  protected log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.guardianType.toUpperCase()}] [${this.name}]`;

    if (this.config.debug) {
      switch (level) {
        case 'error':
          console.error(`${prefix} ❌ ${message}`);
          break;
        case 'warn':
          console.warn(`${prefix} ⚠️ ${message}`);
          break;
        default:
          console.log(`${prefix} 📝 ${message}`);
      }
    }
  }

  /**
   * 🔄 Obtener Estado del Guardian
   */
  getStatus() {
    return {
      name: this.name,
      type: this.guardianType,
      isActive: this.lastAnalysis !== null,
      lastAnalysis: this.lastAnalysis,
      analysisCount: this.analysisHistory.length,
      description: this.description,
      philosophyAlignment: this.getAveragePhilosophyAlignment()
    };
  }

  /**
   * 🧹 Limpiar Historial (mantener solo recientes)
   */
  cleanHistory(keepLast: number = 20): void {
    if (this.analysisHistory.length > keepLast) {
      this.analysisHistory = this.analysisHistory.slice(-keepLast);
      this.log(`🧹 History cleaned, keeping last ${keepLast} analyses`);
    }
  }
}

export default BaseGuardian;
