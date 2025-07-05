import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js.js';

/**
 * 🔮 CoP ORÁCULO - Sistema Multi-Agente
 * Inspirado en CrewAI para transformar feedback en sabiduría colectiva
 * Implementa agentes especializados que colaboran según principios de Reciprocidad
 */

// Interfaces para el sistema de agentes
interface AgentProfile {
  id: string;
  name: string;
  role: string;
  element: 'FUEGO' | 'AGUA' | 'TIERRA' | 'AIRE';
  specialization: string;
  lukasBalance: number;
  level: number;
  activeQuests: string[];
}

interface FeedbackAnalysis {
  sentiment: number; // -1 a 1
  urgency: number; // 1 a 5
  complexity: number; // 1 a 5
  category: string;
  recommendedPath: string;
  lukasReward: number;
}

interface CollaborationTask {
  id: string;
  type: 'ANALYZE' | 'PRIORITIZE' | 'RESOLVE' | 'DISTRIBUTE';
  feedbackId: string;
  assignedAgents: string[];
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  results: any;
  lukasGenerated: number;
}

interface FeedbackData {
  id: string;
  feedbackText: string;
  category:
    | 'BUG'
    | 'IMPROVEMENT'
    | 'MISSING_FEATURE'
    | 'UI_UX'
    | 'PERFORMANCE'
    | 'OTHER';
  urgency?: number; // Optional, might be calculated
  complexity?: number; // Optional, might be calculated
  // Add other potential fields based on usage if necessary
}

@Injectable()
export class FeedbackAgentsService {
  private readonly logger = new Logger(FeedbackAgentsService.name);

  constructor(@Inject(PrismaService) private readonly _prisma: PrismaService) {
    // console.log('>>> FeedbackAgentsService CONSTRUCTOR: this._prisma IS', this._prisma ? 'DEFINED' : 'UNDEFINED');
  }

  /**
   * 🧠 AGENTE ORÁCULO PRINCIPAL
   * Analiza feedback usando IA contextual y filosofía CoomÜnity
   */
  async analyzeWithOraculo(
    feedbackData: FeedbackData
  ): Promise<FeedbackAnalysis> {
    this.logger.log(`🔮 [ORÁCULO] Analizando feedback: ${feedbackData.id}`);

    // Simulación de análisis IA avanzado
    const analysis: FeedbackAnalysis = {
      sentiment: this.calculateSentiment(feedbackData.feedbackText),
      urgency: this.calculateUrgency(feedbackData),
      complexity: this.calculateComplexity(feedbackData),
      category: this.categorizeByElement(feedbackData),
      recommendedPath: this.recommendPath(feedbackData),
      lukasReward: this.calculateLukasReward(feedbackData),
    };

    this.logger.log(
      `🎯 [ORÁCULO] Análisis completado - Categoría: ${analysis.category}, Lükas: ${analysis.lukasReward}`
    );
    return analysis;
  }

  /**
   * 🔥 AGENTE FUEGO - ACCIÓN RÁPIDA
   * Especializado en bugs críticos y resolución inmediata
   */
  async processFuegoAgent(feedbackId: string): Promise<CollaborationTask> {
    this.logger.log(`🔥 [FUEGO] Procesando feedback crítico: ${feedbackId}`);

    const task: CollaborationTask = {
      id: `fuego_${Date.now()}`,
      type: 'RESOLVE',
      feedbackId,
      assignedAgents: ['fuego-primary', 'fuego-support'],
      status: 'IN_PROGRESS',
      results: {
        priority: 'CRITICAL',
        estimatedResolution: '2 hours',
        resourcesNeeded: ['backend-dev', 'qa-tester'],
        reciprocidadImpact: 'HIGH', // Impacto en el Bien Común
      },
      lukasGenerated: 50,
    };

    // Simulación de procesamiento rápido del agente Fuego
    await this.simulateAgentWork(2000);

    this.logger.log(
      `🔥 [FUEGO] Tarea completada - Lükas generados: ${task.lukasGenerated}`
    );
    return task;
  }

  /**
   * 💧 AGENTE AGUA - COLABORACIÓN FLUIDA
   * Especializado en coordinación entre administradores y comunicación
   */
  async processAguaAgent(feedbackId: string): Promise<CollaborationTask> {
    this.logger.log(`💧 [AGUA] Facilitando colaboración para: ${feedbackId}`);

    const task: CollaborationTask = {
      id: `agua_${Date.now()}`,
      type: 'DISTRIBUTE',
      feedbackId,
      assignedAgents: ['agua-coordinator', 'agua-communicator'],
      status: 'IN_PROGRESS',
      results: {
        stakeholdersNotified: ['admin-team', 'ux-team'],
        collaborationChannels: ['slack-cop-oraculo', 'feedback-board'],
        consensusLevel: 0.85,
        reciprocidadFlow: 'BALANCED', // Flujo equilibrado de Reciprocidad
      },
      lukasGenerated: 30,
    };

    await this.simulateAgentWork(3000);

    this.logger.log(
      `💧 [AGUA] Colaboración facilitada - Consenso: ${task.results.consensusLevel}`
    );
    return task;
  }

  /**
   * 🌱 AGENTE TIERRA - DOCUMENTACIÓN SÓLIDA
   * Especializado en crear conocimiento duradero y bases de datos de sabiduría
   */
  async processTierraAgent(feedbackId: string): Promise<CollaborationTask> {
    this.logger.log(`🌱 [TIERRA] Documentando sabiduría para: ${feedbackId}`);

    const task: CollaborationTask = {
      id: `tierra_${Date.now()}`,
      type: 'ANALYZE',
      feedbackId,
      assignedAgents: ['tierra-documentalist', 'tierra-knowledge-keeper'],
      status: 'IN_PROGRESS',
      results: {
        knowledgeArticlesCreated: 2,
        bestPracticesUpdated: ['feedback-handling', 'user-communication'],
        wisdomScore: 8.5,
        foundationStrength: 'SOLID', // Solidez para el Bien Común
      },
      lukasGenerated: 40,
    };

    await this.simulateAgentWork(4000);

    this.logger.log(
      `🌱 [TIERRA] Sabiduría documentada - Artículos: ${task.results.knowledgeArticlesCreated}`
    );
    return task;
  }

  /**
   * 💨 AGENTE AIRE - VISIÓN E INNOVACIÓN
   * Especializado en detectar patrones, tendencias y oportunidades de mejora
   */
  async processAireAgent(feedbackId: string): Promise<CollaborationTask> {
    this.logger.log(`💨 [AIRE] Visionando innovaciones para: ${feedbackId}`);

    const task: CollaborationTask = {
      id: `aire_${Date.now()}`,
      type: 'ANALYZE',
      feedbackId,
      assignedAgents: ['aire-visionary', 'aire-innovator'],
      status: 'IN_PROGRESS',
      results: {
        trendsIdentified: ['ui-accessibility', 'mobile-first'],
        innovationOpportunities: 3,
        futureImpactScore: 9.2,
        visionClarity: 'CRYSTAL_CLEAR', // Claridad visionaria
      },
      lukasGenerated: 60,
    };

    await this.simulateAgentWork(5000);

    this.logger.log(
      `💨 [AIRE] Visión completada - Oportunidades: ${task.results.innovationOpportunities}`
    );
    return task;
  }

  /**
   * 🤝 COORDINADOR DE COLABORACIÓN RECIPROCIDAD
   * Orchestor principal que gestiona la colaboración entre todos los agentes
   */
  async orchestrateCollaboration(
    feedbackId: string,
    analysis: FeedbackAnalysis
  ): Promise<{
    tasks: CollaborationTask[];
    totalLukasGenerated: number;
    reciprocidadBalance: number;
    collaborationScore: number;
  }> {
    this.logger.log(
      `🤝 [COORDINADOR] Orquestando colaboración para feedback: ${feedbackId}`
    );

    const tasks: CollaborationTask[] = [];

    // Asignar agentes según la categoría y complejidad
    if (analysis.urgency >= 4) {
      tasks.push(await this.processFuegoAgent(feedbackId));
    }

    if (analysis.complexity >= 3) {
      tasks.push(await this.processAguaAgent(feedbackId));
    }

    // Siempre documentamos para generar sabiduría
    tasks.push(await this.processTierraAgent(feedbackId));

    // Para insights avanzados
    if (
      analysis.category === 'IMPROVEMENT' ||
      analysis.category === 'MISSING_FEATURE'
    ) {
      tasks.push(await this.processAireAgent(feedbackId));
    }

    const totalLukasGenerated = tasks.reduce(
      (sum, task) => sum + task.lukasGenerated,
      0
    );
    const reciprocidadBalance = this.calculateReciprocidadBalance(tasks);
    const collaborationScore = this.calculateCollaborationScore(tasks);

    this.logger.log(
      `🏆 [COORDINADOR] Colaboración completada - Lükas total: ${totalLukasGenerated}, Reciprocidad: ${reciprocidadBalance}`
    );

    return {
      tasks,
      totalLukasGenerated,
      reciprocidadBalance,
      collaborationScore,
    };
  }

  /**
   * 📊 SISTEMA DE MÉTRICAS GAMIFICADAS
   */
  async calculateCommunityMetrics(): Promise<{
    wisdomQuotient: number;
    reciprocidadIndex: number;
    collaborationVelocity: number;
    innovationScore: number;
  }> {
    // Simulación de métricas comunitarias
    return {
      wisdomQuotient: 8.7, // Calidad de la sabiduría generada
      reciprocidadIndex: 0.92, // Balance de reciprocidad
      collaborationVelocity: 15.3, // Velocidad de colaboración
      innovationScore: 7.8, // Nivel de innovación
    };
  }

  // Métodos auxiliares privados
  private calculateSentiment(text: string): number {
    // Simulación de análisis de sentimiento
    const positiveWords = ['good', 'great', 'love', 'excellent', 'amazing'];
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'problem'];
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    words.forEach((word) => {
      if (positiveWords.includes(word)) score++;
      if (negativeWords.includes(word)) score--;
    });
    return score / words.length || 0;
  }

  private calculateUrgency(feedbackData: FeedbackData): number {
    if (feedbackData.category === 'BUG') return 5;
    if (feedbackData.category === 'PERFORMANCE') return 4;
    return feedbackData.urgency || 2;
  }

  private calculateComplexity(feedbackData: FeedbackData): number {
    const textLength = feedbackData.feedbackText.length;
    if (textLength > 500) return 5;
    if (textLength > 200) return 3;
    return feedbackData.complexity || 1;
  }

  private categorizeByElement(feedbackData: FeedbackData): string {
    // Lógica de mapeo a los 4 elementos
    switch (feedbackData.category) {
      case 'BUG':
      case 'PERFORMANCE':
        return 'FUEGO';
      case 'UI_UX':
        return 'AGUA';
      case 'MISSING_FEATURE':
      case 'IMPROVEMENT':
        return 'AIRE';
      case 'OTHER':
      default:
        return 'TIERRA';
    }
  }

  private recommendPath(feedbackData: FeedbackData): string {
    if (feedbackData.category === 'BUG') return 'Fuego -> Agua -> Tierra';
    return 'Oraculo -> Aire -> Tierra -> Agua';
  }

  private calculateLukasReward(feedbackData: FeedbackData): number {
    let reward = 10; // Base reward
    reward += this.calculateUrgency(feedbackData) * 5;
    reward += this.calculateComplexity(feedbackData) * 3;
    return Math.round(reward);
  }

  private calculateReciprocidadBalance(tasks: CollaborationTask[]): number {
    // Cálculo del balance de Reciprocidad (reciprocidad)
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const lukasDistribution = tasks.map((task) => task.lukasGenerated);
    const variance = this.calculateVariance(lukasDistribution);

    // Balance perfecto cuando hay alta completitud y baja varianza en distribución
    const completionRatio = completedTasks / totalTasks;
    const distributionBalance = 1 / (1 + variance / 100); // Normalizado

    return (completionRatio + distributionBalance) / 2;
  }

  private calculateCollaborationScore(tasks: CollaborationTask[]): number {
    // Puntuación de colaboración basada en diversidad de agentes y sincronización
    const uniqueAgentTypes = new Set(tasks.map((task) => task.type)).size;
    const avgLukasPerTask =
      tasks.reduce((sum, task) => sum + task.lukasGenerated, 0) / tasks.length;

    return Math.min(10, uniqueAgentTypes * 2 + avgLukasPerTask / 10);
  }

  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map((num) => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }

  private async simulateAgentWork(duration: number): Promise<void> {
    // Simulación de trabajo asíncrono del agente
    return new Promise((resolve) => setTimeout(resolve, duration));
  }
}
