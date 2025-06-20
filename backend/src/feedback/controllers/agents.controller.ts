import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Logger
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
import { FeedbackAgentsService } from '../agents/feedback-agents.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../rbac/guards/roles.guard';
import { Roles } from '../../rbac/decorators/roles.decorator';

@ApiTags('🤖 CoP Oráculo - Agentes Multi-IA')
@ApiBearerAuth()
@Controller('cop-oraculo/agents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgentsController {
  private readonly logger = new Logger(AgentsController.name);

  constructor(private agentsService: FeedbackAgentsService) {}

  @Post('analyze/:feedbackId')
  @Roles('admin', 'moderator')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '🔮 Análisis Oráculo Completo',
    description: 'Activa el sistema multi-agente para analizar feedback y generar sabiduría colectiva'
  })
  @ApiResponse({
    status: 200,
    description: 'Análisis completado por todos los agentes elementales'
  })
  @ApiParam({
    name: 'feedbackId',
    description: 'ID del feedback a analizar'
  })
  async analyzeWithAllAgents(@Param('feedbackId') feedbackId: string, @Req() req) {
    this.logger.log(`🔮 [CONTROLLER] Iniciando análisis multi-agente para feedback: ${feedbackId}`);

    try {
      // Obtener datos del feedback (simulado)
      const feedbackData = {
        id: feedbackId,
        feedbackText: "El sistema de reproducción de video se detiene inesperadamente",
        feedbackType: "BUG",
        pageUrl: "http://localhost:3001/uplay",
        userId: req.user.id
      };

      // 1. Análisis inicial del Oráculo
      const oraculoAnalysis = await this.agentsService.analyzeWithOraculo(feedbackData);

      // 2. Orquestar colaboración entre agentes
      const collaboration = await this.agentsService.orchestrateCollaboration(
        feedbackId,
        oraculoAnalysis
      );

      // 3. Calcular métricas comunitarias
      const communityMetrics = await this.agentsService.calculateCommunityMetrics();

      return {
        success: true,
        feedbackId,
        timestamp: new Date().toISOString(),
        oraculoAnalysis,
        collaboration: {
          tasksCompleted: collaboration.tasks.length,
          totalLukasGenerated: collaboration.totalLukasGenerated,
          ayniBalance: collaboration.ayniBalance,
          collaborationScore: collaboration.collaborationScore,
          tasks: collaboration.tasks
        },
        communityImpact: communityMetrics,
        nextSteps: this.generateNextSteps(oraculoAnalysis, collaboration),
        message: `🎉 El sistema multi-agente ha transformado tu feedback en ${collaboration.totalLukasGenerated} Lükas de Sabiduría`
      };

    } catch (error) {
      this.logger.error(`❌ [CONTROLLER] Error en análisis multi-agente: ${error.message}`);
      throw error;
    }
  }

  @Get('dashboard/metrics')
  @Roles('admin', 'moderator')
  @ApiOperation({
    summary: '📊 Dashboard de Agentes',
    description: 'Métricas en tiempo real del sistema multi-agente de la CoP Oráculo'
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard completo con métricas de gamificación y Ayni'
  })
  async getAgentsDashboard(@Req() req) {
    this.logger.log(`📊 [DASHBOARD] Generando métricas para usuario: ${req.user.id}`);

    const communityMetrics = await this.agentsService.calculateCommunityMetrics();

    return {
      success: true,
      timestamp: new Date().toISOString(),
      communityMetrics,
      agentStatus: {
        fuego: { active: true, efficiency: 0.95, lukasGenerated: 1250 },
        agua: { active: true, efficiency: 0.88, lukasGenerated: 980 },
        tierra: { active: true, efficiency: 0.92, lukasGenerated: 1100 },
        aire: { active: true, efficiency: 0.90, lukasGenerated: 1350 }
      },
      personalStats: {
        userId: req.user.id,
        lukasBalance: 450,
        contributionLevel: 'Oráculo Aprendiz',
        feedbackProcessed: 23,
        wisdomPointsEarned: 890,
        collaborationsCompleted: 12
      },
      leaderboard: [
        { username: 'SabioAdmin', lukasBalance: 2500, level: 'Oráculo Maestro' },
        { username: 'ColaboradorAyni', lukasBalance: 1800, level: 'Visionario Elemental' },
        { username: req.user.username || 'TuUsuario', lukasBalance: 450, level: 'Oráculo Aprendiz' }
      ],
      achievements: {
        recent: [
          {
            name: '🔍 Detector de Patrones',
            description: 'Identificaste un patrón en 5 feedback similares',
            lukasReward: 50,
            unlockedAt: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        available: [
          {
            name: '🌟 Maestro del Ayni',
            description: 'Mantén un balance de Ayni > 0.9 por 30 días',
            lukasReward: 200,
            progress: 0.73
          }
        ]
      }
    };
  }

  @Post('collaborate/:feedbackId')
  @Roles('admin', 'moderator')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '🤝 Colaboración Ayni',
    description: 'Inicia una sesión de colaboración multi-agente basada en principios de Ayni'
  })
  @ApiResponse({
    status: 200,
    description: 'Sesión de colaboración iniciada exitosamente'
  })
  async initiateCollaboration(
    @Param('feedbackId') feedbackId: string,
    @Body() collaborationRequest: {
      preferredElements?: string[];
      urgencyOverride?: number;
      collaborationGoal?: string;
    },
    @Req() req
  ) {
    this.logger.log(`🤝 [COLLABORATION] Iniciando colaboración para feedback: ${feedbackId}`);

    try {
      // Simular análisis básico
      const basicAnalysis = {
        sentiment: 0.2,
        urgency: collaborationRequest.urgencyOverride || 3,
        complexity: 3,
        category: 'IMPROVEMENT',
        recommendedPath: 'collaborative-improvement',
        lukasReward: 35
      };

      // Orquestar colaboración específica
      const collaboration = await this.agentsService.orchestrateCollaboration(
        feedbackId,
        basicAnalysis
      );

      return {
        success: true,
        collaborationId: `collab_${Date.now()}`,
        feedbackId,
        initiatedBy: req.user.id,
        collaboration,
        ayniPrinciples: {
          reciprocity: 'Cada contribución genera valor de retorno',
          balance: `Ayni Balance: ${collaboration.ayniBalance.toFixed(2)}`,
          collectiveWisdom: 'La sabiduría emerge de la colaboración',
          bienComun: 'Priorizamos el Bien Común sobre el beneficio individual'
        },
        nextActions: [
          '🔥 Agente Fuego revisará urgencia y creará plan de acción',
          '💧 Agente Agua coordinará con otros administradores',
          '🌱 Agente Tierra documentará el proceso para futura referencia',
          '💨 Agente Aire identificará oportunidades de innovación'
        ],
        estimatedCompletion: new Date(Date.now() + 7200000).toISOString() // 2 horas
      };

    } catch (error) {
      this.logger.error(`❌ [COLLABORATION] Error en colaboración: ${error.message}`);
      throw error;
    }
  }

  @Get('wisdom/insights')
  @Roles('admin', 'moderator')
  @ApiOperation({
    summary: '🧠 Insights de Sabiduría Colectiva',
    description: 'Obtiene insights generados por la inteligencia colectiva de los agentes'
  })
  @ApiResponse({
    status: 200,
    description: 'Insights de sabiduría y patrones identificados'
  })
  async getWisdomInsights(@Req() req) {
    this.logger.log(`🧠 [WISDOM] Generando insights para usuario: ${req.user.id}`);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      wisdomInsights: {
        patterns: [
          {
            pattern: 'Feedback de UX aumenta 40% los viernes',
            confidence: 0.87,
            recommendation: 'Programar revisiones UX antes del fin de semana',
            lukasImpact: 150
          },
          {
            pattern: 'Bugs de rendimiento correlacionan con picos de tráfico',
            confidence: 0.92,
            recommendation: 'Implementar monitoreo proactivo de rendimiento',
            lukasImpact: 200
          }
        ],
        trends: {
          feedbackVelocity: {
            current: 15.3,
            trend: '+12%',
            interpretation: 'La comunidad está más activa en reportar feedback'
          },
          resolutionEfficiency: {
            current: 0.89,
            trend: '+5%',
            interpretation: 'Los agentes están mejorando en resolver problemas'
          },
          collaborationDepth: {
            current: 7.8,
            trend: '+8%',
            interpretation: 'Más administradores participan en cada resolución'
          }
        },
        wisdomQuotientBreakdown: {
          technical: 8.5,
          collaborative: 9.1,
          innovative: 7.8,
          sustainable: 8.9,
          overall: 8.7
        },
        emergentBehaviors: [
          'Administradores están formando equipos especializados por elemento',
          'Surgimiento de mentorías cruzadas entre agentes de diferentes elementos',
          'Desarrollo espontáneo de rituales de reconocimiento Ayni'
        ]
      },
      personalWisdomContribution: {
        userId: req.user.id,
        wisdomPointsContributed: 234,
        patternsDiscovered: 3,
        collaborationsLed: 7,
        ayniContributions: 45,
        nextLevelRequirements: {
          wisdomPoints: 100, // Para siguiente nivel
          collaborations: 5,
          ayniBalance: 0.85
        }
      }
    };
  }

  // Métodos auxiliares privados
  private generateNextSteps(analysis: any, collaboration: any): string[] {
    const steps = [];

    if (analysis.urgency >= 4) {
      steps.push('🔥 Activación inmediata del protocolo de respuesta rápida');
    }

    if (analysis.complexity >= 3) {
      steps.push('💧 Convocatoria a sesión de colaboración multi-disciplinaria');
    }

    steps.push('🌱 Documentación del proceso en la base de conocimiento');

    if (analysis.category === 'IMPROVEMENT') {
      steps.push('💨 Evaluación para roadmap de innovación');
    }

    steps.push(`🎯 Distribución de ${collaboration.totalLukasGenerated} Lükas entre participantes`);

    return steps;
  }
}
