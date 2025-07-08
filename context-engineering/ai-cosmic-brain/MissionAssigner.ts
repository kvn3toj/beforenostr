/**
 * 🎯 MissionAssigner - Sistema de Auto-Asignación de Misiones
 *
 * Identifica gaps y oportunidades en el proyecto, y asigna misiones automáticamente
 * basado en análisis de prioridades, consideraciones técnicas y principios filosóficos.
 *
 * Filosofía CoomÜnity: Balancea las necesidades técnicas con el Bien Común,
 * asegurando que cada misión contribuya a la evolución armoniosa del sistema
 * y al crecimiento del equipo a través del Ayni (reciprocidad).
 */

import {
  Mission,
  MissionPriority,
  MissionCategory,
  MissionStatus,
  CosmicConfig,
  HarmonyMetrics,
  PatternPrediction,
  ImpactLevel
} from './types';

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
  currentWorkload: number; // 0-100
  preferences: string[];
  growthAreas: string[];
  ayniContributions: number; // score de contribuciones recíprocas
  philosophyAlignment: number;
  availability: number; // 0-100
}

export interface MissionAssignmentContext {
  gaps: ProjectGap[];
  opportunities: Opportunity[];
  teamMembers: TeamMember[];
  harmony: HarmonyMetrics;
  predictions: PatternPrediction[];
  projectPriorities: string[];
  timeConstraints: {
    sprint: number; // semanas
    release: number; // semanas
    milestone: number; // semanas
  };
}

export interface AssignmentStrategy {
  prioritizePhilosophy: boolean;
  balanceWorkload: boolean;
  focusOnGrowth: boolean;
  considerAyni: boolean;
  respectPreferences: boolean;
}

export class MissionAssigner {
  private config: CosmicConfig;
  private assignmentHistory: Mission[] = [];
  private completedMissions: Mission[] = [];

  constructor(config: CosmicConfig) {
    this.config = config;
  }

  /**
   * 🎯 Asigna misiones automáticamente basado en análisis completo del contexto
   */
  async assignMissions(context: MissionAssignmentContext, strategy?: AssignmentStrategy): Promise<Mission[]> {
    this.log('🎯 Iniciando asignación automática de misiones...');

    const defaultStrategy: AssignmentStrategy = {
      prioritizePhilosophy: true,
      balanceWorkload: true,
      focusOnGrowth: true,
      considerAyni: true,
      respectPreferences: true
    };

    const assignmentStrategy = { ...defaultStrategy, ...strategy };

    try {
      // Generar misiones candidatas
      const candidateMissions = await this.generateCandidateMissions(context);

      // Priorizar misiones según estrategia
      const prioritizedMissions = this.prioritizeMissions(candidateMissions, context, assignmentStrategy);

      // Asignar recursos y responsables
      const assignedMissions = await this.assignResources(prioritizedMissions, context, assignmentStrategy);

      // Optimizar para balance de equipo
      const optimizedMissions = this.optimizeForTeamBalance(assignedMissions, context, assignmentStrategy);

      // Establecer dependencias y cronograma
      const scheduledMissions = this.establishSchedule(optimizedMissions, context);

      // Validar asignaciones
      const validatedMissions = this.validateAssignments(scheduledMissions, context);

      // Guardar en historial
      this.assignmentHistory.push(...validatedMissions);

      this.log(`✅ Asignadas ${validatedMissions.length} misiones`);
      return validatedMissions;

    } catch (error) {
      this.log(`❌ Error asignando misiones: ${error.message}`);
      throw error;
    }
  }

  /**
   * 🔍 Identifica gaps críticos en el proyecto
   */
  async identifyProjectGaps(context: MissionAssignmentContext): Promise<ProjectGap[]> {
    this.log('🔍 Identificando gaps del proyecto...');

    const gaps: ProjectGap[] = [];

    // Analizar gaps técnicos
    const technicalGaps = await this.identifyTechnicalGaps(context);
    gaps.push(...technicalGaps);

    // Analizar gaps de proceso
    const processGaps = await this.identifyProcessGaps(context);
    gaps.push(...processGaps);

    // Analizar gaps filosóficos
    const philosophyGaps = await this.identifyPhilosophyGaps(context);
    gaps.push(...philosophyGaps);

    // Analizar gaps de colaboración
    const collaborationGaps = await this.identifyCollaborationGaps(context);
    gaps.push(...collaborationGaps);

    // Analizar gaps de documentación
    const documentationGaps = await this.identifyDocumentationGaps(context);
    gaps.push(...documentationGaps);

    this.log(`✅ Identificados ${gaps.length} gaps del proyecto`);
    return gaps;
  }

  /**
   * 🌟 Identifica oportunidades de mejora y crecimiento
   */
  async identifyOpportunities(context: MissionAssignmentContext): Promise<Opportunity[]> {
    this.log('🌟 Identificando oportunidades...');

    const opportunities: Opportunity[] = [];

    // Oportunidades de innovación técnica
    const technicalOpportunities = await this.identifyTechnicalOpportunities(context);
    opportunities.push(...technicalOpportunities);

    // Oportunidades de crecimiento del equipo
    const growthOpportunities = await this.identifyGrowthOpportunities(context);
    opportunities.push(...growthOpportunities);

    // Oportunidades de mejora filosófica
    const philosophyOpportunities = await this.identifyPhilosophyOpportunities(context);
    opportunities.push(...philosophyOpportunities);

    // Oportunidades basadas en predicciones
    const predictionOpportunities = await this.identifyPredictionOpportunities(context);
    opportunities.push(...predictionOpportunities);

    this.log(`✅ Identificadas ${opportunities.length} oportunidades`);
    return opportunities;
  }

  /**
   * 📊 Actualiza el progreso de misiones activas
   */
  async updateMissionProgress(missionId: string, progress: number, notes?: string): Promise<Mission | null> {
    const mission = this.assignmentHistory.find(m => m.id === missionId);

    if (!mission) {
      this.log(`⚠️ Misión no encontrada: ${missionId}`);
      return null;
    }

    mission.progress = Math.max(0, Math.min(100, progress));

    if (progress >= 100) {
      mission.status = MissionStatus.COMPLETED;
      mission.actualEffort = mission.estimatedEffort; // Placeholder
      this.completedMissions.push(mission);
      this.log(`✅ Misión completada: ${mission.title}`);
    }

    this.log(`📊 Progreso actualizado: ${mission.title} - ${progress}%`);
    return mission;
  }

  /**
   * 📈 Obtiene estadísticas de misiones
   */
  getMissionStats(): {
    total: number;
    assigned: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    averageCompletion: number;
    philosophyAlignment: number;
  } {
    const total = this.assignmentHistory.length;
    const assigned = this.assignmentHistory.filter(m => m.status === MissionStatus.ASSIGNED).length;
    const inProgress = this.assignmentHistory.filter(m => m.status === MissionStatus.IN_PROGRESS).length;
    const completed = this.assignmentHistory.filter(m => m.status === MissionStatus.COMPLETED).length;
    const cancelled = this.assignmentHistory.filter(m => m.status === MissionStatus.CANCELLED).length;

    const averageCompletion = total > 0
      ? this.assignmentHistory.reduce((sum, m) => sum + m.progress, 0) / total
      : 0;

    const philosophyAlignment = total > 0
      ? this.assignmentHistory.reduce((sum, m) => {
          const benefit = m.philosophyBenefit || '';
          return sum + (benefit.length > 50 ? 90 : 70); // Heurística simple
        }, 0) / total
      : 100;

    return {
      total,
      assigned,
      inProgress,
      completed,
      cancelled,
      averageCompletion,
      philosophyAlignment
    };
  }

  // 🔧 Métodos privados de implementación

  private async generateCandidateMissions(context: MissionAssignmentContext): Promise<Mission[]> {
    const missions: Mission[] = [];

    // Generar misiones desde gaps
    for (const gap of context.gaps) {
      const gapMissions = this.createMissionsFromGap(gap);
      missions.push(...gapMissions);
    }

    // Generar misiones desde oportunidades
    for (const opportunity of context.opportunities) {
      const opportunityMission = this.createMissionFromOpportunity(opportunity);
      missions.push(opportunityMission);
    }

    // Generar misiones desde predicciones
    for (const prediction of context.predictions) {
      const predictionMissions = this.createMissionsFromPrediction(prediction);
      missions.push(...predictionMissions);
    }

    return missions;
  }

  private createMissionsFromGap(gap: ProjectGap): Mission[] {
    const missions: Mission[] = [];

    for (const solution of gap.suggestedSolutions) {
      missions.push({
        id: this.generateId('gap'),
        title: `Resolver: ${gap.area}`,
        description: `${gap.description} - Implementar: ${solution}`,
        priority: this.severityToPriority(gap.severity),
        category: this.areaToCategory(gap.area),
        assignedDate: new Date(),
        progress: 0,
        status: MissionStatus.ASSIGNED,
        philosophyBenefit: `Contribuye al Bien Común resolviendo ${gap.area}`,
        technicalBenefit: solution,
        requirements: [`Analizar ${gap.area}`, `Implementar ${solution}`],
        deliverables: [`${gap.area} mejorado`, `Documentación de solución`],
        dependencies: [],
        estimatedEffort: this.estimateEffortFromSeverity(gap.severity),
        tags: ['gap-resolution', gap.area.toLowerCase()]
      });
    }

    return missions;
  }

  private createMissionFromOpportunity(opportunity: Opportunity): Mission {
    return {
      id: this.generateId('opportunity'),
      title: opportunity.name,
      description: opportunity.description,
      priority: this.valueToPriority(opportunity.potentialValue),
      category: opportunity.category,
      assignedDate: new Date(),
      progress: 0,
      status: MissionStatus.ASSIGNED,
      philosophyBenefit: `Valor filosófico: ${opportunity.philosophyBenefit}/100`,
      technicalBenefit: `Valor técnico: ${opportunity.technicalBenefit}/100`,
      requirements: [`Evaluar viabilidad`, `Diseñar implementación`],
      deliverables: [`${opportunity.name} implementado`],
      dependencies: opportunity.dependencies,
      estimatedEffort: opportunity.estimatedEffort,
      tags: ['opportunity', opportunity.category.toLowerCase()]
    };
  }

  private createMissionsFromPrediction(prediction: PatternPrediction): Mission[] {
    return prediction.suggestedActions.map(action => ({
      id: this.generateId('prediction'),
      title: `Predicción: ${prediction.name}`,
      description: `Implementar acción preventiva: ${action}`,
      priority: this.impactToPriority(prediction.impact),
      category: this.patternCategoryToMissionCategory(prediction.category),
      assignedDate: new Date(),
      progress: 0,
      status: MissionStatus.ASSIGNED,
      philosophyBenefit: `Alineación: ${prediction.philosophyAlignment}% - Preparación proactiva`,
      technicalBenefit: action,
      requirements: [`Validar predicción`, `Planificar implementación`],
      deliverables: [`Acción preventiva implementada`],
      dependencies: [],
      estimatedEffort: this.estimateEffortFromConfidence(prediction.confidence),
      tags: ['prediction', 'proactive', prediction.category.toLowerCase()]
    }));
  }

  private prioritizeMissions(
    missions: Mission[],
    context: MissionAssignmentContext,
    strategy: AssignmentStrategy
  ): Mission[] {
    return missions.sort((a, b) => {
      const scoreA = this.calculateMissionScore(a, context, strategy);
      const scoreB = this.calculateMissionScore(b, context, strategy);
      return scoreB - scoreA;
    });
  }

  private calculateMissionScore(
    mission: Mission,
    context: MissionAssignmentContext,
    strategy: AssignmentStrategy
  ): number {
    let score = 0;

    // Peso por prioridad técnica (30%)
    score += this.getPriorityWeight(mission.priority) * 0.3;

    // Peso por filosofía (configurable, por defecto 40%)
    if (strategy.prioritizePhilosophy) {
      const philosophyScore = this.extractPhilosophyScore(mission.philosophyBenefit);
      score += philosophyScore * (this.config.philosophyWeight || 0.4);
    }

    // Peso por impacto en armonía del equipo (20%)
    const harmonyImpact = this.calculateHarmonyImpact(mission, context.harmony);
    score += harmonyImpact * 0.2;

    // Peso por urgencia (10%)
    const urgency = this.calculateUrgency(mission, context);
    score += urgency * 0.1;

    return score;
  }

  private async assignResources(
    missions: Mission[],
    context: MissionAssignmentContext,
    strategy: AssignmentStrategy
  ): Promise<Mission[]> {
    const assignedMissions: Mission[] = [];

    for (const mission of missions) {
      // Encontrar el mejor candidato para la misión
      const bestCandidate = this.findBestCandidate(mission, context.teamMembers, strategy);

      if (bestCandidate) {
        // Asignar misión
        mission.tags = mission.tags || [];
        mission.tags.push(`assigned-to:${bestCandidate.id}`);

        // Actualizar carga de trabajo del miembro
        bestCandidate.currentWorkload += this.estimateWorkloadImpact(mission);

        // Actualizar score de Ayni si corresponde
        if (strategy.considerAyni) {
          this.updateAyniScore(bestCandidate, mission);
        }

        assignedMissions.push(mission);

        this.log(`👤 Misión "${mission.title}" asignada a ${bestCandidate.name}`);
      } else {
        this.log(`⚠️ No se encontró candidato para misión: ${mission.title}`);
        mission.status = MissionStatus.BLOCKED;
        assignedMissions.push(mission);
      }
    }

    return assignedMissions;
  }

  private findBestCandidate(
    mission: Mission,
    teamMembers: TeamMember[],
    strategy: AssignmentStrategy
  ): TeamMember | null {
    let bestCandidate: TeamMember | null = null;
    let bestScore = 0;

    for (const member of teamMembers) {
      // Verificar disponibilidad básica
      if (member.currentWorkload > 80) continue;

      const score = this.calculateCandidateScore(mission, member, strategy);

      if (score > bestScore) {
        bestScore = score;
        bestCandidate = member;
      }
    }

    return bestCandidate;
  }

  private calculateCandidateScore(
    mission: Mission,
    member: TeamMember,
    strategy: AssignmentStrategy
  ): number {
    let score = 0;

    // Skills match (30%)
    const skillsMatch = this.calculateSkillsMatch(mission, member);
    score += skillsMatch * 0.3;

    // Disponibilidad (20%)
    const availability = (100 - member.currentWorkload) / 100;
    score += availability * 0.2;

    // Alineación filosófica (25%)
    if (strategy.prioritizePhilosophy) {
      score += (member.philosophyAlignment / 100) * 0.25;
    }

    // Potencial de crecimiento (15%)
    if (strategy.focusOnGrowth) {
      const growthPotential = this.calculateGrowthPotential(mission, member);
      score += growthPotential * 0.15;
    }

    // Balance de Ayni (10%)
    if (strategy.considerAyni) {
      const ayniBalance = this.calculateAyniBalance(member);
      score += ayniBalance * 0.1;
    }

    return score;
  }

  private optimizeForTeamBalance(
    missions: Mission[],
    context: MissionAssignmentContext,
    strategy: AssignmentStrategy
  ): Mission[] {
    if (!strategy.balanceWorkload) return missions;

    // Implementar algoritmo de balanceo de carga
    // Por ahora, una implementación básica

    const workloadByMember = new Map<string, number>();

    for (const mission of missions) {
      const assignedTo = this.extractAssignedMember(mission);
      if (assignedTo) {
        const currentLoad = workloadByMember.get(assignedTo) || 0;
        workloadByMember.set(assignedTo, currentLoad + this.estimateWorkloadImpact(mission));
      }
    }

    // Redistribuir si hay desequilibrios significativos
    const averageLoad = Array.from(workloadByMember.values()).reduce((a, b) => a + b, 0) / workloadByMember.size;

    for (const [memberId, load] of workloadByMember) {
      if (load > averageLoad * 1.3) { // 30% sobre el promedio
        this.log(`⚖️ Rebalanceando carga para miembro: ${memberId}`);
        // Implementar lógica de rebalanceo
      }
    }

    return missions;
  }

  private establishSchedule(missions: Mission[], context: MissionAssignmentContext): Mission[] {
    // Ordenar por dependencias y prioridades
    const scheduledMissions = [...missions];

    for (const mission of scheduledMissions) {
      // Calcular fecha de vencimiento basada en prioridad y esfuerzo
      const dueDate = this.calculateDueDate(mission, context.timeConstraints);
      mission.dueDate = dueDate;
    }

    return scheduledMissions;
  }

  private validateAssignments(missions: Mission[], context: MissionAssignmentContext): Mission[] {
    const validMissions: Mission[] = [];

    for (const mission of missions) {
      // Validar que la asignación es viable
      if (this.isAssignmentValid(mission, context)) {
        validMissions.push(mission);
      } else {
        this.log(`⚠️ Asignación inválida: ${mission.title}`);
        mission.status = MissionStatus.BLOCKED;
        validMissions.push(mission);
      }
    }

    return validMissions;
  }

  // 🔍 Métodos de identificación de gaps

  private async identifyTechnicalGaps(context: MissionAssignmentContext): Promise<ProjectGap[]> {
    const gaps: ProjectGap[] = [];

    // Gap de testing
    if (context.harmony.technical.testCoverage < 80) {
      gaps.push({
        id: this.generateId('gap'),
        area: 'Testing',
        description: 'Cobertura de tests insuficiente para garantizar calidad',
        severity: context.harmony.technical.testCoverage < 60 ? 'high' : 'medium',
        impact: ImpactLevel.HIGH,
        evidence: [`Cobertura actual: ${context.harmony.technical.testCoverage}%`],
        suggestedSolutions: ['Implementar TDD', 'Aumentar tests unitarios', 'Configurar CI/CD'],
        philosophyAlignment: 90,
        technicalDebt: 70,
        urgency: 80
      });
    }

    // Gap de performance
    if (context.harmony.technical.performanceScore < 75) {
      gaps.push({
        id: this.generateId('gap'),
        area: 'Performance',
        description: 'Performance del sistema requiere optimización',
        severity: 'medium',
        impact: ImpactLevel.MEDIUM,
        evidence: [`Score de performance: ${context.harmony.technical.performanceScore}%`],
        suggestedSolutions: ['Optimizar queries', 'Implementar caching', 'Profiling de código'],
        philosophyAlignment: 75,
        technicalDebt: 60,
        urgency: 60
      });
    }

    return gaps;
  }

  private async identifyProcessGaps(context: MissionAssignmentContext): Promise<ProjectGap[]> {
    const gaps: ProjectGap[] = [];

    // Gap de documentación
    if (context.harmony.communication.clarityScore < 75) {
      gaps.push({
        id: this.generateId('gap'),
        area: 'Documentation',
        description: 'Documentación insuficiente afecta la claridad de comunicación',
        severity: 'medium',
        impact: ImpactLevel.MEDIUM,
        evidence: [`Score de claridad: ${context.harmony.communication.clarityScore}%`],
        suggestedSolutions: ['Crear templates de documentación', 'Documentar APIs', 'Guías de usuario'],
        philosophyAlignment: 85,
        technicalDebt: 40,
        urgency: 50
      });
    }

    return gaps;
  }

  private async identifyPhilosophyGaps(context: MissionAssignmentContext): Promise<ProjectGap[]> {
    const gaps: ProjectGap[] = [];

    // Gap de alineación con Bien Común
    if (context.harmony.philosophy.bienComunAlignment < 85) {
      gaps.push({
        id: this.generateId('gap'),
        area: 'Philosophy',
        description: 'Alineación con principios del Bien Común puede fortalecerse',
        severity: 'medium',
        impact: ImpactLevel.HIGH,
        evidence: [`Alineación actual: ${context.harmony.philosophy.bienComunAlignment}%`],
        suggestedSolutions: ['Workshops de filosofía CoomÜnity', 'Integrar principios en código', 'Métricas de impacto'],
        philosophyAlignment: 100,
        technicalDebt: 0,
        urgency: 70
      });
    }

    return gaps;
  }

  private async identifyCollaborationGaps(context: MissionAssignmentContext): Promise<ProjectGap[]> {
    const gaps: ProjectGap[] = [];

    // Gap de Ayni (reciprocidad)
    if (context.harmony.collaboration.ayniScore < 80) {
      gaps.push({
        id: this.generateId('gap'),
        area: 'Collaboration',
        description: 'Score de Ayni indica oportunidades de mejorar reciprocidad',
        severity: 'medium',
        impact: ImpactLevel.MEDIUM,
        evidence: [`Score Ayni: ${context.harmony.collaboration.ayniScore}%`],
        suggestedSolutions: ['Pair programming', 'Rotación de roles', 'Mentoring cruzado'],
        philosophyAlignment: 95,
        technicalDebt: 0,
        urgency: 60
      });
    }

    return gaps;
  }

  private async identifyDocumentationGaps(context: MissionAssignmentContext): Promise<ProjectGap[]> {
    // Implementación básica - expandir según necesidades
    return [];
  }

  // 🌟 Métodos de identificación de oportunidades

  private async identifyTechnicalOpportunities(context: MissionAssignmentContext): Promise<Opportunity[]> {
    const opportunities: Opportunity[] = [];

    // Oportunidad de automatización
    opportunities.push({
      id: this.generateId('opp'),
      name: 'Automatización de Testing',
      description: 'Implementar pipeline de testing completamente automatizado',
      category: MissionCategory.TESTING,
      potentialValue: 85,
      implementationComplexity: 60,
      philosophyBenefit: 80,
      technicalBenefit: 90,
      teamGrowthPotential: 70,
      estimatedEffort: 16,
      dependencies: []
    });

    return opportunities;
  }

  private async identifyGrowthOpportunities(context: MissionAssignmentContext): Promise<Opportunity[]> {
    const opportunities: Opportunity[] = [];

    // Analizar áreas de crecimiento del equipo
    for (const member of context.teamMembers) {
      for (const growthArea of member.growthAreas) {
        opportunities.push({
          id: this.generateId('growth'),
          name: `Desarrollo en ${growthArea}`,
          description: `Oportunidad de crecimiento para ${member.name} en ${growthArea}`,
          category: MissionCategory.FEATURE,
          potentialValue: 70,
          implementationComplexity: 40,
          philosophyBenefit: 90,
          technicalBenefit: 60,
          teamGrowthPotential: 95,
          estimatedEffort: 8,
          dependencies: []
        });
      }
    }

    return opportunities;
  }

  private async identifyPhilosophyOpportunities(context: MissionAssignmentContext): Promise<Opportunity[]> {
    const opportunities: Opportunity[] = [];

    // Oportunidad de integrar más filosofía CoomÜnity
    if (context.harmony.philosophy.bienComunAlignment < 90) {
      opportunities.push({
        id: this.generateId('philosophy'),
        name: 'Integración Filosófica Profunda',
        description: 'Integrar principios CoomÜnity más profundamente en el código y procesos',
        category: MissionCategory.PHILOSOPHY,
        potentialValue: 95,
        implementationComplexity: 30,
        philosophyBenefit: 100,
        technicalBenefit: 70,
        teamGrowthPotential: 85,
        estimatedEffort: 12,
        dependencies: []
      });
    }

    return opportunities;
  }

  private async identifyPredictionOpportunities(context: MissionAssignmentContext): Promise<Opportunity[]> {
    const opportunities: Opportunity[] = [];

    // Convertir predicciones en oportunidades
    for (const prediction of context.predictions) {
      if (prediction.confidence > 75) {
        opportunities.push({
          id: this.generateId('pred-opp'),
          name: `Preparación: ${prediction.name}`,
          description: `Prepararse proactivamente para ${prediction.description}`,
          category: this.patternCategoryToMissionCategory(prediction.category),
          potentialValue: prediction.confidence,
          implementationComplexity: 50,
          philosophyBenefit: prediction.philosophyAlignment,
          technicalBenefit: 80,
          teamGrowthPotential: 60,
          estimatedEffort: 6,
          dependencies: []
        });
      }
    }

    return opportunities;
  }

  // 🔧 Métodos de utilidad

  private severityToPriority(severity: string): MissionPriority {
    switch (severity) {
      case 'critical': return MissionPriority.CRITICAL;
      case 'high': return MissionPriority.HIGH;
      case 'medium': return MissionPriority.MEDIUM;
      default: return MissionPriority.LOW;
    }
  }

  private valueToPriority(value: number): MissionPriority {
    if (value >= 90) return MissionPriority.CRITICAL;
    if (value >= 75) return MissionPriority.HIGH;
    if (value >= 50) return MissionPriority.MEDIUM;
    return MissionPriority.LOW;
  }

  private impactToPriority(impact: ImpactLevel): MissionPriority {
    switch (impact) {
      case ImpactLevel.CRITICAL: return MissionPriority.CRITICAL;
      case ImpactLevel.HIGH: return MissionPriority.HIGH;
      case ImpactLevel.MEDIUM: return MissionPriority.MEDIUM;
      default: return MissionPriority.LOW;
    }
  }

  private areaToCategory(area: string): MissionCategory {
    const areaLower = area.toLowerCase();
    if (areaLower.includes('test')) return MissionCategory.TESTING;
    if (areaLower.includes('doc')) return MissionCategory.DOCUMENTATION;
    if (areaLower.includes('arch')) return MissionCategory.ARCHITECTURE;
    if (areaLower.includes('phil')) return MissionCategory.PHILOSOPHY;
    return MissionCategory.FEATURE;
  }

  private patternCategoryToMissionCategory(category: any): MissionCategory {
    // Mapeo básico - expandir según necesidades
    return MissionCategory.FEATURE;
  }

  private estimateEffortFromSeverity(severity: string): number {
    switch (severity) {
      case 'critical': return 24;
      case 'high': return 16;
      case 'medium': return 8;
      default: return 4;
    }
  }

  private estimateEffortFromConfidence(confidence: number): number {
    return Math.max(2, Math.round(confidence / 10));
  }

  private getPriorityWeight(priority: MissionPriority): number {
    switch (priority) {
      case MissionPriority.CRITICAL: return 100;
      case MissionPriority.URGENT: return 80;
      case MissionPriority.HIGH: return 60;
      case MissionPriority.MEDIUM: return 40;
      default: return 20;
    }
  }

  private extractPhilosophyScore(benefit: string): number {
    // Heurística simple para extraer score filosófico
    if (benefit.includes('100')) return 100;
    if (benefit.includes('95')) return 95;
    if (benefit.includes('90')) return 90;
    if (benefit.includes('85')) return 85;
    return 75; // Valor por defecto
  }

  private calculateHarmonyImpact(mission: Mission, harmony: HarmonyMetrics): number {
    // Calcular cómo la misión impactaría la armonía del equipo
    let impact = 50; // Base neutra

    if (mission.category === MissionCategory.PHILOSOPHY) impact += 30;
    if (mission.tags?.includes('collaboration')) impact += 20;
    if (mission.tags?.includes('growth')) impact += 15;

    return Math.min(100, impact);
  }

  private calculateUrgency(mission: Mission, context: MissionAssignmentContext): number {
    let urgency = 50; // Base

    // Aumentar urgencia basada en prioridad
    urgency += this.getPriorityWeight(mission.priority) * 0.3;

    // Ajustar por deadlines del proyecto
    if (mission.dueDate) {
      const daysToDeadline = (mission.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (daysToDeadline < 7) urgency += 30;
      else if (daysToDeadline < 14) urgency += 15;
    }

    return Math.min(100, urgency);
  }

  private calculateSkillsMatch(mission: Mission, member: TeamMember): number {
    // Calcular match entre skills requeridos y skills del miembro
    const requiredSkills = this.extractRequiredSkills(mission);
    const matchingSkills = member.skills.filter(skill =>
      requiredSkills.some(required =>
        required.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(required.toLowerCase())
      )
    );

    return requiredSkills.length > 0
      ? (matchingSkills.length / requiredSkills.length) * 100
      : 50; // Valor neutral si no hay skills específicos
  }

  private extractRequiredSkills(mission: Mission): string[] {
    // Extraer skills requeridos del título, descripción y categoría
    const skills: string[] = [];

    const text = `${mission.title} ${mission.description} ${mission.category}`.toLowerCase();

    // Skills técnicos comunes
    const technicalSkills = ['typescript', 'react', 'node', 'testing', 'api', 'database', 'ui', 'ux'];
    skills.push(...technicalSkills.filter(skill => text.includes(skill)));

    // Skills de proceso
    const processSkills = ['documentation', 'testing', 'architecture', 'refactoring'];
    skills.push(...processSkills.filter(skill => text.includes(skill)));

    return [...new Set(skills)]; // Eliminar duplicados
  }

  private calculateGrowthPotential(mission: Mission, member: TeamMember): number {
    // Calcular potencial de crecimiento de la misión para el miembro
    const missionSkills = this.extractRequiredSkills(mission);
    const growthOpportunities = missionSkills.filter(skill =>
      !member.skills.includes(skill) && member.growthAreas.includes(skill)
    );

    return missionSkills.length > 0
      ? (growthOpportunities.length / missionSkills.length) * 100
      : 0;
  }

  private calculateAyniBalance(member: TeamMember): number {
    // Calcular balance de Ayni del miembro
    // Por ahora, usar el score de contribuciones directamente
    return member.ayniContributions;
  }

  private estimateWorkloadImpact(mission: Mission): number {
    // Estimar impacto en carga de trabajo (0-100)
    return Math.min(30, mission.estimatedEffort * 2);
  }

  private updateAyniScore(member: TeamMember, mission: Mission): void {
    // Actualizar score de Ayni basado en la misión asignada
    if (mission.tags?.includes('collaboration') || mission.category === MissionCategory.PHILOSOPHY) {
      member.ayniContributions += 5;
    }
  }

  private extractAssignedMember(mission: Mission): string | null {
    const assignedTag = mission.tags?.find(tag => tag.startsWith('assigned-to:'));
    return assignedTag ? assignedTag.split(':')[1] : null;
  }

  private calculateDueDate(mission: Mission, timeConstraints: any): Date {
    const dueDate = new Date();

    // Calcular días basado en prioridad y esfuerzo
    let days = mission.estimatedEffort / 8; // Asumiendo 8 horas por día

    // Ajustar por prioridad
    switch (mission.priority) {
      case MissionPriority.CRITICAL:
        days *= 0.5;
        break;
      case MissionPriority.HIGH:
        days *= 0.7;
        break;
      case MissionPriority.MEDIUM:
        days *= 1.0;
        break;
      default:
        days *= 1.5;
    }

    dueDate.setDate(dueDate.getDate() + Math.max(1, Math.ceil(days)));
    return dueDate;
  }

  private isAssignmentValid(mission: Mission, context: MissionAssignmentContext): boolean {
    // Validar que la asignación es viable
    const assignedMember = this.extractAssignedMember(mission);

    if (!assignedMember) return false;

    const member = context.teamMembers.find(m => m.id === assignedMember);
    if (!member) return false;

    // Verificar que no exceda capacidad
    return member.currentWorkload <= 90;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private log(message: string): void {
    if (this.config.debugMode) {
      console.log(`[MissionAssigner] ${message}`);
    }
  }
}
