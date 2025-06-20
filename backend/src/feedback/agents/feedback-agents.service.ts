import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * 🔮 CoP ORÁCULO - Sistema Multi-Agente
 * Inspirado en CrewAI para transformar feedback en sabiduría colectiva
 * Implementa agentes especializados que colaboran según principios de Ayni
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
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  results: any;
  lukasGenerated: number;
}

@Injectable()
export class FeedbackAgentsService {
  private readonly logger = new Logger(FeedbackAgentsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * 🧠 AGENTE ORÁCULO PRINCIPAL
   * Analiza feedback usando IA contextual y filosofía CoomÜnity
   */
  async analyzeWithOraculo(feedbackData: any): Promise<FeedbackAnalysis> {
    this.logger.log(`🔮 [ORÁCULO] Analizando feedback: ${feedbackData.id}`);

    // Simulación de análisis IA avanzado
    const analysis: FeedbackAnalysis = {
      sentiment: this.calculateSentiment(feedbackData.feedbackText),
      urgency: this.calculateUrgency(feedbackData),
      complexity: this.calculateComplexity(feedbackData),
      category: this.categorizeByElement(feedbackData),
      recommendedPath: this.recommendPath(feedbackData),
      lukasReward: this.calculateLukasReward(feedbackData)
    };

    this.logger.log(`🎯 [ORÁCULO] Análisis completado - Categoría: ${analysis.category}, Lükas: ${analysis.lukasReward}`);
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
        ayniImpact: 'HIGH' // Impacto en el Bien Común
      },
      lukasGenerated: 50
    };

    // Simulación de procesamiento rápido del agente Fuego
    await this.simulateAgentWork(2000);
    task.status = 'COMPLETED';

    this.logger.log(`🔥 [FUEGO] Tarea completada - Lükas generados: ${task.lukasGenerated}`);
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
        ayniFlow: 'BALANCED' // Flujo equilibrado de Ayni
      },
      lukasGenerated: 30
    };

    await this.simulateAgentWork(3000);
    task.status = 'COMPLETED';

    this.logger.log(`💧 [AGUA] Colaboración facilitada - Consenso: ${task.results.consensusLevel}`);
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
        foundationStrength: 'SOLID' // Solidez para el Bien Común
      },
      lukasGenerated: 40
    };

    await this.simulateAgentWork(4000);
    task.status = 'COMPLETED';

    this.logger.log(`🌱 [TIERRA] Sabiduría documentada - Artículos: ${task.results.knowledgeArticlesCreated}`);
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
        visionClarity: 'CRYSTAL_CLEAR' // Claridad visionaria
      },
      lukasGenerated: 60
    };

    await this.simulateAgentWork(5000);
    task.status = 'COMPLETED';

    this.logger.log(`💨 [AIRE] Visión completada - Oportunidades: ${task.results.innovationOpportunities}`);
    return task;
  }

  /**
   * 🤝 COORDINADOR DE COLABORACIÓN AYNI
   * Orchestor principal que gestiona la colaboración entre todos los agentes
   */
  async orchestrateCollaboration(feedbackId: string, analysis: FeedbackAnalysis): Promise<{
    tasks: CollaborationTask[];
    totalLukasGenerated: number;
    ayniBalance: number;
    collaborationScore: number;
  }> {
    this.logger.log(`🤝 [COORDINADOR] Orquestando colaboración para feedback: ${feedbackId}`);

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
    if (analysis.category === 'IMPROVEMENT' || analysis.category === 'MISSING_FEATURE') {
      tasks.push(await this.processAireAgent(feedbackId));
    }

    const totalLukasGenerated = tasks.reduce((sum, task) => sum + task.lukasGenerated, 0);
    const ayniBalance = this.calculateAyniBalance(tasks);
    const collaborationScore = this.calculateCollaborationScore(tasks);

    this.logger.log(`🏆 [COORDINADOR] Colaboración completada - Lükas total: ${totalLukasGenerated}, Ayni: ${ayniBalance}`);

    return {
      tasks,
      totalLukasGenerated,
      ayniBalance,
      collaborationScore
    };
  }

  /**
   * 📊 SISTEMA DE MÉTRICAS GAMIFICADAS
   */
  async calculateCommunityMetrics(): Promise<{
    wisdomQuotient: number;
    ayniIndex: number;
    collaborationVelocity: number;
    innovationScore: number;
  }> {
    // Simulación de métricas comunitarias
    return {
      wisdomQuotient: 8.7, // Calidad de la sabiduría generada
      ayniIndex: 0.92, // Balance de reciprocidad
      collaborationVelocity: 15.3, // Velocidad de colaboración
      innovationScore: 7.8 // Nivel de innovación
    };
  }

  // Métodos auxiliares privados
  private calculateSentiment(text: string): number {
    // Simulación de análisis de sentimiento
    const positiveWords = ['bueno', 'excelente', 'genial', 'útil'];
    const negativeWords = ['malo', 'terrible', 'roto', 'problema'];

    let score = 0;
    positiveWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score += 0.2;
    });
    negativeWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score -= 0.2;
    });

    return Math.max(-1, Math.min(1, score));
  }

  private calculateUrgency(feedbackData: any): number {
    // Lógica de urgencia basada en tipo y contexto
    const urgencyMap = {
      'BUG': 4,
      'PERFORMANCE': 3,
      'UI_UX': 2,
      'IMPROVEMENT': 2,
      'MISSING_FEATURE': 1
    };
    return urgencyMap[feedbackData.feedbackType] || 2;
  }

  private calculateComplexity(feedbackData: any): number {
    // Análisis de complejidad
    const textLength = feedbackData.feedbackText.length;
    const technicalTerms = ['api', 'database', 'server', 'authentication'].some(
      term => feedbackData.feedbackText.toLowerCase().includes(term)
    );

    let complexity = Math.min(5, Math.floor(textLength / 100) + 1);
    if (technicalTerms) complexity += 1;

    return Math.min(5, complexity);
  }

  private categorizeByElement(feedbackData: any): string {
    const typeElementMap = {
      'BUG': 'FUEGO',
      'PERFORMANCE': 'FUEGO',
      'UI_UX': 'AGUA',
      'IMPROVEMENT': 'AIRE',
      'MISSING_FEATURE': 'AIRE',
      'OTHER': 'TIERRA'
    };
    return typeElementMap[feedbackData.feedbackType] || 'TIERRA';
  }

  private recommendPath(feedbackData: any): string {
    // Recomendaciones basadas en análisis
    const pathMap = {
      'FUEGO': 'rapid-resolution',
      'AGUA': 'collaborative-improvement',
      'TIERRA': 'knowledge-documentation',
      'AIRE': 'innovation-incubation'
    };
    return pathMap[this.categorizeByElement(feedbackData)] || 'standard-review';
  }

  private calculateLukasReward(feedbackData: any): number {
    // Sistema de recompensas Lükas
    const baseReward = 10;
    const complexityMultiplier = this.calculateComplexity(feedbackData) * 2;
    const urgencyMultiplier = this.calculateUrgency(feedbackData) * 1.5;

    return Math.floor(baseReward + complexityMultiplier + urgencyMultiplier);
  }

  private calculateAyniBalance(tasks: CollaborationTask[]): number {
    // Cálculo del balance de Ayni (reciprocidad)
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
    const lukasDistribution = tasks.map(task => task.lukasGenerated);
    const variance = this.calculateVariance(lukasDistribution);

    // Balance perfecto cuando hay alta completitud y baja varianza en distribución
    const completionRatio = completedTasks / totalTasks;
    const distributionBalance = 1 / (1 + variance / 100); // Normalizado

    return (completionRatio + distributionBalance) / 2;
  }

  private calculateCollaborationScore(tasks: CollaborationTask[]): number {
    // Puntuación de colaboración basada en diversidad de agentes y sincronización
    const uniqueAgentTypes = new Set(tasks.map(task => task.type)).size;
    const avgLukasPerTask = tasks.reduce((sum, task) => sum + task.lukasGenerated, 0) / tasks.length;

    return Math.min(10, uniqueAgentTypes * 2 + avgLukasPerTask / 10);
  }

  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }

  private async simulateAgentWork(duration: number): Promise<void> {
    // Simulación de trabajo asíncrono del agente
    return new Promise(resolve => setTimeout(resolve, duration));
  }
}
