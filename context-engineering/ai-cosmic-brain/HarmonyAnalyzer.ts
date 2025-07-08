/**
 * 📊 HarmonyAnalyzer - Sistema de Análisis de Armonía del Equipo
 *
 * Mide la aplicación de principios Ayni, evalúa alineación con el Bien Común
 * y detecta patrones de burnout y estrés tempranamente.
 *
 * Filosofía CoomÜnity: Monitorea la salud del ecosistema humano,
 * asegurando que el desarrollo tecnológico vaya de la mano con
 * el bienestar y crecimiento de las personas.
 */

import {
  HarmonyMetrics,
  CollaborationMetrics,
  PhilosophyMetrics,
  TechnicalMetrics,
  CommunicationMetrics,
  WellbeingMetrics,
  HarmonyTrend,
  CosmicConfig
} from './types';

export interface TeamActivity {
  memberId: string;
  timestamp: Date;
  type: 'commit' | 'review' | 'comment' | 'merge' | 'issue' | 'meeting';
  impact: number; // 0-100
  collaborators: string[];
  philosophyAlignment: number;
}

export interface WellbeingIndicator {
  memberId: string;
  timestamp: Date;
  workHours: number;
  stressLevel: number; // 0-100
  satisfactionLevel: number; // 0-100
  communicationTone: 'positive' | 'neutral' | 'negative';
  responseTime: number; // minutes
}

export interface AyniContribution {
  giverId: string;
  receiverId: string;
  type: 'knowledge' | 'code' | 'review' | 'support' | 'mentoring';
  value: number; // 0-100
  timestamp: Date;
  philosophyAlignment: number;
}

export class HarmonyAnalyzer {
  private config: CosmicConfig;
  private harmonyHistory: HarmonyMetrics[] = [];
  private teamActivities: TeamActivity[] = [];
  private wellbeingData: WellbeingIndicator[] = [];
  private ayniContributions: AyniContribution[] = [];

  constructor(config: CosmicConfig) {
    this.config = config;
  }

  /**
   * 📊 Analiza la armonía completa del equipo
   */
  async analyzeTeamHarmony(): Promise<HarmonyMetrics> {
    this.log('📊 Analizando armonía del equipo...');

    try {
      // Analizar diferentes dimensiones de armonía
      const collaboration = await this.analyzeCollaboration();
      const philosophy = await this.analyzePhilosophy();
      const technical = await this.analyzeTechnical();
      const communication = await this.analyzeCommunication();
      const wellbeing = await this.analyzeWellbeing();

      // Calcular armonía general
      const overall = this.calculateOverallHarmony(
        collaboration, philosophy, technical, communication, wellbeing
      );

      // Analizar tendencias
      const trends = await this.analyzeTrends();

      const harmony: HarmonyMetrics = {
        overall,
        collaboration,
        philosophy,
        technical,
        communication,
        wellbeing,
        timestamp: new Date(),
        trends
      };

      // Guardar en historial
      this.harmonyHistory.push(harmony);

      this.log(`✅ Armonía del equipo: ${overall}/100`);
      return harmony;

    } catch (error) {
      this.log(`❌ Error analizando armonía: ${error.message}`);
      throw error;
    }
  }

  /**
   * 🤝 Analiza métricas de colaboración y Ayni
   */
  private async analyzeCollaboration(): Promise<CollaborationMetrics> {
    const ayniScore = this.calculateAyniScore();
    const pairProgramming = this.analyzePairProgramming();
    const codeReviews = this.analyzeCodeReviews();
    const knowledgeSharing = this.analyzeKnowledgeSharing();
    const conflictResolution = this.analyzeConflictResolution();

    return {
      ayniScore,
      pairProgramming,
      codeReviews,
      knowledgeSharing,
      conflictResolution
    };
  }

  /**
   * 🌟 Analiza alineación filosófica con principios CoomÜnity
   */
  private async analyzePhilosophy(): Promise<PhilosophyMetrics> {
    const bienComunAlignment = this.calculateBienComunAlignment();
    const cooperationOverCompetition = this.analyzeCooperationLevel();
    const sustainabilityFocus = this.analyzeSustainabilityFocus();
    const transparencyLevel = this.analyzeTransparency();
    const inclusivityScore = this.analyzeInclusivity();

    return {
      bienComunAlignment,
      cooperationOverCompetition,
      sustainabilityFocus,
      transparencyLevel,
      inclusivityScore
    };
  }

  /**
   * 🔧 Analiza métricas técnicas del equipo
   */
  private async analyzeTechnical(): Promise<TechnicalMetrics> {
    // Implementación básica - expandir con métricas reales
    return {
      codeQuality: 85,
      testCoverage: 78,
      architectureCompliance: 90,
      performanceScore: 82,
      securityScore: 88
    };
  }

  /**
   * 💬 Analiza calidad de comunicación
   */
  private async analyzeCommunication(): Promise<CommunicationMetrics> {
    const clarityScore = this.analyzeCommunicationClarity();
    const responsivenessScore = this.analyzeResponsiveness();
    const empathyLevel = this.analyzeEmpathy();
    const feedbackQuality = this.analyzeFeedbackQuality();

    return {
      clarityScore,
      responsivenessScore,
      empathyLevel,
      feedbackQuality
    };
  }

  /**
   * 🧘 Analiza bienestar del equipo
   */
  private async analyzeWellbeing(): Promise<WellbeingMetrics> {
    const workLifeBalance = this.analyzeWorkLifeBalance();
    const stressLevel = this.analyzeStressLevel();
    const satisfactionLevel = this.analyzeSatisfactionLevel();
    const burnoutRisk = this.analyzeBurnoutRisk();

    return {
      workLifeBalance,
      stressLevel,
      satisfactionLevel,
      burnoutRisk
    };
  }

  /**
   * 🔮 Detecta patrones de burnout tempranamente
   */
  async detectBurnoutPatterns(): Promise<{
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    affectedMembers: string[];
    indicators: string[];
    recommendations: string[];
  }> {
    this.log('🔮 Detectando patrones de burnout...');

    const burnoutIndicators: string[] = [];
    const affectedMembers: string[] = [];

    // Analizar patrones de trabajo excesivo
    const overworkPattern = this.detectOverworkPattern();
    if (overworkPattern.detected) {
      burnoutIndicators.push('Patrón de trabajo excesivo detectado');
      affectedMembers.push(...overworkPattern.members);
    }

    // Analizar disminución en calidad de comunicación
    const communicationDecline = this.detectCommunicationDecline();
    if (communicationDecline.detected) {
      burnoutIndicators.push('Declive en calidad de comunicación');
      affectedMembers.push(...communicationDecline.members);
    }

    // Analizar patrones de aislamiento
    const isolationPattern = this.detectIsolationPattern();
    if (isolationPattern.detected) {
      burnoutIndicators.push('Patrones de aislamiento social');
      affectedMembers.push(...isolationPattern.members);
    }

    // Calcular nivel de riesgo
    const riskLevel = this.calculateBurnoutRisk(burnoutIndicators.length, affectedMembers.length);

    // Generar recomendaciones
    const recommendations = this.generateBurnoutRecommendations(riskLevel, burnoutIndicators);

    return {
      riskLevel,
      affectedMembers: [...new Set(affectedMembers)],
      indicators: burnoutIndicators,
      recommendations
    };
  }

  /**
   * 📈 Sugiere mejoras para incrementar armonía
   */
  async suggestHarmonyImprovements(): Promise<string[]> {
    const harmony = await this.analyzeTeamHarmony();
    const suggestions: string[] = [];

    // Sugerencias basadas en colaboración
    if (harmony.collaboration.ayniScore < 80) {
      suggestions.push('🤝 Implementar sesiones de pair programming para mejorar reciprocidad');
      suggestions.push('📝 Crear sistema de reconocimiento mutuo de contribuciones');
    }

    // Sugerencias basadas en filosofía
    if (harmony.philosophy.bienComunAlignment < 85) {
      suggestions.push('🌟 Realizar workshops sobre filosofía CoomÜnity');
      suggestions.push('📚 Integrar principios del Bien Común en decisiones técnicas');
    }

    // Sugerencias basadas en bienestar
    if (harmony.wellbeing.stressLevel > 60) {
      suggestions.push('🧘 Implementar pausas de mindfulness durante el día');
      suggestions.push('⚖️ Revisar distribución de carga de trabajo');
    }

    // Sugerencias basadas en comunicación
    if (harmony.communication.clarityScore < 75) {
      suggestions.push('💬 Establecer protocolos de comunicación más claros');
      suggestions.push('📋 Usar templates para documentación y reportes');
    }

    return suggestions;
  }

  // 🔧 Métodos privados de cálculo

  private calculateAyniScore(): number {
    // Calcular reciprocidad en contribuciones
    const recentContributions = this.ayniContributions.filter(
      c => c.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentContributions.length === 0) return 100; // Sin datos, asumir perfecto

    // Calcular balance de dar y recibir por miembro
    const memberBalances = new Map<string, { given: number; received: number }>();

    for (const contribution of recentContributions) {
      // Actualizar quien da
      const giverBalance = memberBalances.get(contribution.giverId) || { given: 0, received: 0 };
      giverBalance.given += contribution.value;
      memberBalances.set(contribution.giverId, giverBalance);

      // Actualizar quien recibe
      const receiverBalance = memberBalances.get(contribution.receiverId) || { given: 0, received: 0 };
      receiverBalance.received += contribution.value;
      memberBalances.set(contribution.receiverId, receiverBalance);
    }

    // Calcular score de balance
    let totalBalance = 0;
    let memberCount = 0;

    for (const [_, balance] of memberBalances) {
      const total = balance.given + balance.received;
      if (total > 0) {
        const balanceRatio = Math.min(balance.given, balance.received) / Math.max(balance.given, balance.received);
        totalBalance += balanceRatio * 100;
        memberCount++;
      }
    }

    return memberCount > 0 ? totalBalance / memberCount : 100;
  }

  private analyzePairProgramming(): number {
    // Analizar actividades de pair programming
    const pairActivities = this.teamActivities.filter(
      a => a.collaborators.length > 0 && a.type === 'commit'
    );

    const totalActivities = this.teamActivities.filter(a => a.type === 'commit').length;

    return totalActivities > 0 ? (pairActivities.length / totalActivities) * 100 : 50;
  }

  private analyzeCodeReviews(): number {
    const reviewActivities = this.teamActivities.filter(a => a.type === 'review');
    const totalCommits = this.teamActivities.filter(a => a.type === 'commit').length;

    return totalCommits > 0 ? Math.min(100, (reviewActivities.length / totalCommits) * 100) : 75;
  }

  private analyzeKnowledgeSharing(): number {
    const sharingContributions = this.ayniContributions.filter(
      c => c.type === 'knowledge' || c.type === 'mentoring'
    );

    // Heurística: más contribuciones de conocimiento = mejor sharing
    return Math.min(100, sharingContributions.length * 10);
  }

  private analyzeConflictResolution(): number {
    // Analizar tiempo de resolución de issues y conflictos
    // Por ahora, valor base alto asumiendo buena resolución
    return 85;
  }

  private calculateBienComunAlignment(): number {
    // Calcular alineación con Bien Común basado en actividades
    const recentActivities = this.teamActivities.filter(
      a => a.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentActivities.length === 0) return 100;

    const totalAlignment = recentActivities.reduce((sum, activity) =>
      sum + activity.philosophyAlignment, 0
    );

    return totalAlignment / recentActivities.length;
  }

  private analyzeCooperationLevel(): number {
    // Analizar nivel de cooperación vs competición
    const collaborativeActivities = this.teamActivities.filter(
      a => a.collaborators.length > 0
    );

    const totalActivities = this.teamActivities.length;

    return totalActivities > 0 ? (collaborativeActivities.length / totalActivities) * 100 : 85;
  }

  private analyzeSustainabilityFocus(): number {
    // Heurística basada en patrones de trabajo sostenible
    const avgWorkHours = this.calculateAverageWorkHours();

    if (avgWorkHours <= 8) return 100;
    if (avgWorkHours <= 9) return 85;
    if (avgWorkHours <= 10) return 70;
    return 50;
  }

  private analyzeTransparency(): number {
    // Analizar transparencia en comunicación
    const recentComments = this.teamActivities.filter(
      a => a.type === 'comment' && a.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    // Más comentarios y comunicación = mayor transparencia
    return Math.min(100, recentComments.length * 5);
  }

  private analyzeInclusivity(): number {
    // Analizar inclusividad basada en participación equilibrada
    const memberParticipation = new Map<string, number>();

    for (const activity of this.teamActivities) {
      const current = memberParticipation.get(activity.memberId) || 0;
      memberParticipation.set(activity.memberId, current + 1);
    }

    // Calcular coeficiente de variación (menor = más equilibrado)
    const participations = Array.from(memberParticipation.values());
    if (participations.length === 0) return 100;

    const mean = participations.reduce((a, b) => a + b, 0) / participations.length;
    const variance = participations.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / participations.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? stdDev / mean : 0;

    // Convertir coeficiente de variación a score (0 = perfecto, >1 = muy desequilibrado)
    return Math.max(0, 100 - (cv * 100));
  }

  private analyzeCommunicationClarity(): number {
    // Analizar claridad basada en indicadores de wellbeing
    const recentIndicators = this.wellbeingData.filter(
      w => w.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentIndicators.length === 0) return 80;

    const positiveComm = recentIndicators.filter(w => w.communicationTone === 'positive').length;
    const totalComm = recentIndicators.length;

    return (positiveComm / totalComm) * 100;
  }

  private analyzeResponsiveness(): number {
    // Analizar tiempo de respuesta promedio
    const avgResponseTime = this.wellbeingData.reduce((sum, w) => sum + w.responseTime, 0) /
                           Math.max(1, this.wellbeingData.length);

    // Convertir tiempo de respuesta a score (menos tiempo = mejor score)
    if (avgResponseTime <= 60) return 100; // 1 hora o menos
    if (avgResponseTime <= 240) return 85; // 4 horas o menos
    if (avgResponseTime <= 480) return 70; // 8 horas o menos
    return 50;
  }

  private analyzeEmpathy(): number {
    // Analizar empatía basada en tipo de contribuciones
    const empathyContributions = this.ayniContributions.filter(
      c => c.type === 'support' || c.type === 'mentoring'
    );

    return Math.min(100, empathyContributions.length * 15);
  }

  private analyzeFeedbackQuality(): number {
    // Analizar calidad del feedback en code reviews
    const reviewActivities = this.teamActivities.filter(a => a.type === 'review');

    if (reviewActivities.length === 0) return 75;

    const avgImpact = reviewActivities.reduce((sum, r) => sum + r.impact, 0) / reviewActivities.length;
    return avgImpact;
  }

  private analyzeWorkLifeBalance(): number {
    const avgWorkHours = this.calculateAverageWorkHours();

    if (avgWorkHours <= 8) return 100;
    if (avgWorkHours <= 9) return 85;
    if (avgWorkHours <= 10) return 70;
    if (avgWorkHours <= 11) return 55;
    return 40;
  }

  private analyzeStressLevel(): number {
    const recentIndicators = this.wellbeingData.filter(
      w => w.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentIndicators.length === 0) return 20; // Bajo estrés por defecto

    const avgStress = recentIndicators.reduce((sum, w) => sum + w.stressLevel, 0) / recentIndicators.length;
    return avgStress;
  }

  private analyzeSatisfactionLevel(): number {
    const recentIndicators = this.wellbeingData.filter(
      w => w.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (recentIndicators.length === 0) return 85; // Satisfacción alta por defecto

    const avgSatisfaction = recentIndicators.reduce((sum, w) => sum + w.satisfactionLevel, 0) / recentIndicators.length;
    return avgSatisfaction;
  }

  private analyzeBurnoutRisk(): number {
    const stressLevel = this.analyzeStressLevel();
    const workLifeBalance = this.analyzeWorkLifeBalance();
    const satisfactionLevel = this.analyzeSatisfactionLevel();

    // Combinar factores para calcular riesgo de burnout
    const riskFactors = [
      stressLevel * 0.4,           // 40% peso al estrés
      (100 - workLifeBalance) * 0.3, // 30% peso al balance (invertido)
      (100 - satisfactionLevel) * 0.3 // 30% peso a la satisfacción (invertido)
    ];

    return riskFactors.reduce((sum, factor) => sum + factor, 0);
  }

  private calculateOverallHarmony(
    collaboration: CollaborationMetrics,
    philosophy: PhilosophyMetrics,
    technical: TechnicalMetrics,
    communication: CommunicationMetrics,
    wellbeing: WellbeingMetrics
  ): number {
    // Calcular promedio ponderado
    const weights = {
      philosophy: 0.3,     // 30% - Mayor peso a filosofía
      collaboration: 0.25, // 25% - Colaboración es clave
      wellbeing: 0.2,      // 20% - Bienestar es fundamental
      communication: 0.15, // 15% - Comunicación importante
      technical: 0.1       // 10% - Técnico es base pero no todo
    };

    const philosophyAvg = (philosophy.bienComunAlignment + philosophy.cooperationOverCompetition +
                          philosophy.sustainabilityFocus + philosophy.transparencyLevel +
                          philosophy.inclusivityScore) / 5;

    const collaborationAvg = (collaboration.ayniScore + collaboration.pairProgramming +
                             collaboration.codeReviews + collaboration.knowledgeSharing +
                             collaboration.conflictResolution) / 5;

    const technicalAvg = (technical.codeQuality + technical.testCoverage +
                         technical.architectureCompliance + technical.performanceScore +
                         technical.securityScore) / 5;

    const communicationAvg = (communication.clarityScore + communication.responsivenessScore +
                             communication.empathyLevel + communication.feedbackQuality) / 4;

    const wellbeingAvg = (wellbeing.workLifeBalance + (100 - wellbeing.stressLevel) +
                         wellbeing.satisfactionLevel + (100 - wellbeing.burnoutRisk)) / 4;

    const overall = (
      philosophyAvg * weights.philosophy +
      collaborationAvg * weights.collaboration +
      technicalAvg * weights.technical +
      communicationAvg * weights.communication +
      wellbeingAvg * weights.wellbeing
    );

    return Math.round(overall);
  }

  private async analyzeTrends(): Promise<HarmonyTrend[]> {
    if (this.harmonyHistory.length < 2) return [];

    const trends: HarmonyTrend[] = [];
    const recent = this.harmonyHistory[this.harmonyHistory.length - 1];
    const previous = this.harmonyHistory[this.harmonyHistory.length - 2];

    // Analizar tendencia general
    const overallChange = recent.overall - previous.overall;
    trends.push({
      metric: 'overall',
      direction: overallChange > 2 ? 'up' : overallChange < -2 ? 'down' : 'stable',
      change: Math.abs(overallChange),
      period: 'last_analysis'
    });

    // Analizar tendencia de Ayni
    const ayniChange = recent.collaboration.ayniScore - previous.collaboration.ayniScore;
    trends.push({
      metric: 'ayniScore',
      direction: ayniChange > 2 ? 'up' : ayniChange < -2 ? 'down' : 'stable',
      change: Math.abs(ayniChange),
      period: 'last_analysis'
    });

    return trends;
  }

  // Métodos de detección de burnout

  private detectOverworkPattern(): { detected: boolean; members: string[] } {
    const overworkedMembers: string[] = [];
    const avgWorkHours = this.calculateAverageWorkHours();

    // Detectar miembros con trabajo excesivo
    const memberHours = new Map<string, number[]>();

    for (const indicator of this.wellbeingData) {
      const hours = memberHours.get(indicator.memberId) || [];
      hours.push(indicator.workHours);
      memberHours.set(indicator.memberId, hours);
    }

    for (const [memberId, hours] of memberHours) {
      const avgHours = hours.reduce((a, b) => a + b, 0) / hours.length;
      if (avgHours > 10) { // Más de 10 horas promedio
        overworkedMembers.push(memberId);
      }
    }

    return {
      detected: overworkedMembers.length > 0,
      members: overworkedMembers
    };
  }

  private detectCommunicationDecline(): { detected: boolean; members: string[] } {
    // Detectar declive en comunicación
    const membersWithDecline: string[] = [];

    // Análisis básico - expandir con lógica más sofisticada
    const negativeComm = this.wellbeingData.filter(w => w.communicationTone === 'negative');

    for (const indicator of negativeComm) {
      if (!membersWithDecline.includes(indicator.memberId)) {
        membersWithDecline.push(indicator.memberId);
      }
    }

    return {
      detected: membersWithDecline.length > 0,
      members: membersWithDecline
    };
  }

  private detectIsolationPattern(): { detected: boolean; members: string[] } {
    // Detectar patrones de aislamiento
    const isolatedMembers: string[] = [];

    // Analizar participación en actividades colaborativas
    const memberCollaboration = new Map<string, number>();

    for (const activity of this.teamActivities) {
      const collabCount = memberCollaboration.get(activity.memberId) || 0;
      memberCollaboration.set(activity.memberId, collabCount + activity.collaborators.length);
    }

    const avgCollaboration = Array.from(memberCollaboration.values()).reduce((a, b) => a + b, 0) /
                            Math.max(1, memberCollaboration.size);

    for (const [memberId, collabCount] of memberCollaboration) {
      if (collabCount < avgCollaboration * 0.5) { // Menos del 50% del promedio
        isolatedMembers.push(memberId);
      }
    }

    return {
      detected: isolatedMembers.length > 0,
      members: isolatedMembers
    };
  }

  private calculateBurnoutRisk(indicatorCount: number, affectedCount: number): 'low' | 'medium' | 'high' | 'critical' {
    if (indicatorCount >= 3 || affectedCount >= 3) return 'critical';
    if (indicatorCount >= 2 || affectedCount >= 2) return 'high';
    if (indicatorCount >= 1 || affectedCount >= 1) return 'medium';
    return 'low';
  }

  private generateBurnoutRecommendations(riskLevel: string, indicators: string[]): string[] {
    const recommendations: string[] = [];

    switch (riskLevel) {
      case 'critical':
        recommendations.push('🚨 Intervención inmediata requerida');
        recommendations.push('🏥 Considerar tiempo de descanso para miembros afectados');
        recommendations.push('👥 Redistribuir carga de trabajo urgentemente');
        break;
      case 'high':
        recommendations.push('⚠️ Monitoreo cercano requerido');
        recommendations.push('🧘 Implementar sesiones de bienestar');
        recommendations.push('📊 Revisar métricas de carga de trabajo');
        break;
      case 'medium':
        recommendations.push('👀 Mantener observación');
        recommendations.push('💬 Facilitar conversaciones de check-in');
        break;
      default:
        recommendations.push('✅ Continuar con prácticas actuales');
    }

    return recommendations;
  }

  private calculateAverageWorkHours(): number {
    if (this.wellbeingData.length === 0) return 8; // Default

    const totalHours = this.wellbeingData.reduce((sum, w) => sum + w.workHours, 0);
    return totalHours / this.wellbeingData.length;
  }

  private log(message: string): void {
    if (this.config.debugMode) {
      console.log(`[HarmonyAnalyzer] ${message}`);
    }
  }
}
