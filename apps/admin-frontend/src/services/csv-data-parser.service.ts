/**
 * 🔮 CSV Data Parser Service - Activador del Flujo Vital
 *
 * Servicio que transforma los blueprints de gamificación encontrados en los CSV
 * en estructuras de datos ejecutables para la Consola de Experiencias CoomÜnity
 */

import {
  Stage,
  StageType,
  OctalysisMechanic,
  OctalysisCore,
  Contest,
  ContestType,
  TokenReward,
  ConsoleAnalytics,
  RealTimeNotification,
  DashboardOverview,
  GPLVideo,
  GPLQuestionType
} from '../types/console-data.types';

// ===============================================================================
// MOCK DATA PARSERS - Simulando el parsing de CSV hasta integración real
// ===============================================================================

/**
 * Parser principal que transforma los datos CSV en estructuras TypeScript
 */
export class CSVDataParserService {

  /**
   * 🏗️ Parse Stage Data - BUYER, SEEKER, SOLVER, PROMOTER
   * Transforma la información de stages del CSV en estructuras tipadas
   */
  static parseStageData(): Stage[] {
    // Datos basados en el analysis de los CSV encontrados
    const stageBlueprints = [
      {
        id: 'stage-buyer',
        type: 'BUYER' as StageType,
        name: 'Buyer - Consumo Consciente',
        description: 'Etapa inicial de activación y primera compra consciente',
        philosophicalAlignment: 'reciprocidad' as const,
        currentUsers: 342,
        completionRate: 78,
        averageTimeInStage: 14, // días
        callToActions: [
          {
            id: 'cta-gift-card',
            type: 'CONSUMO_CONSCIENTE' as const,
            title: 'Activar Gift Card',
            description: 'Recibe tu gift card de bienvenida y comienza tu journey',
            isActive: true,
            completionReward: {
              type: 'ONDAS' as const,
              amount: 50
            }
          },
          {
            id: 'cta-first-purchase',
            type: 'PRACTICAR_CONFIANZA' as const,
            title: 'Primera Compra',
            description: 'Realiza tu primera compra consciente en el marketplace',
            isActive: true,
            completionReward: {
              type: 'MERITOS' as const,
              amount: 10
            }
          }
        ],
        associatedGPLs: ['gpl-intro-coomunity', 'gpl-conscious-consumption'],
        gamificationMechanics: [
          {
            id: 'mech-buyer-accomplishment',
            core: 'LOGRO' as OctalysisCore,
            name: 'Primera Compra Achievement',
            description: 'Sistema de logros para primeras compras',
            intensity: 85,
            isActive: true,
            engagementBoost: 15,
            retentionImpact: 12,
            triggers: ['first_purchase_completed'],
            rewards: [{ type: 'ONDAS', amount: 25 }]
          }
        ]
      },
      {
        id: 'stage-seeker',
        type: 'SEEKER' as StageType,
        name: 'Seeker - Exploración y Búsqueda',
        description: 'Etapa de exploración activa del marketplace y solicitud de confianza',
        philosophicalAlignment: 'bien_comun' as const,
        currentUsers: 156,
        completionRate: 65,
        averageTimeInStage: 21,
        callToActions: [
          {
            id: 'cta-explore-marketplace',
            type: 'CONCIENCIA' as const,
            title: 'Explorar Marketplace',
            description: 'Descubre servicios y productos conscientes',
            isActive: true,
            completionReward: {
              type: 'ONDAS' as const,
              amount: 30
            }
          },
          {
            id: 'cta-request-trust-votes',
            type: 'PRACTICAR_CONFIANZA' as const,
            title: 'Solicitar Votos de Confianza',
            description: 'Construye tu red de confianza solicitando validaciones',
            isActive: true,
            completionReward: {
              type: 'VOTOS_CONFIANZA' as const,
              amount: 3
            }
          }
        ],
        associatedGPLs: ['gpl-marketplace-navigation', 'gpl-trust-building'],
        gamificationMechanics: [
          {
            id: 'mech-seeker-social',
            core: 'AFINIDAD' as OctalysisCore,
            name: 'Red de Confianza',
            description: 'Mecánicas para construir relaciones de confianza',
            intensity: 72,
            isActive: true,
            engagementBoost: 18,
            retentionImpact: 15,
            triggers: ['trust_vote_received', 'network_expansion'],
            rewards: [{ type: 'VOTOS_CONFIANZA', amount: 1 }]
          }
        ]
      },
      {
        id: 'stage-solver',
        type: 'SOLVER' as StageType,
        name: 'Solver - Creación y Solución',
        description: 'Etapa de creación de servicios y recepción de validación comunitaria',
        philosophicalAlignment: 'metanoia' as const,
        currentUsers: 89,
        completionRate: 58,
        averageTimeInStage: 35,
        callToActions: [
          {
            id: 'cta-create-services',
            type: 'CONTEXTO' as const,
            title: 'Crear Servicios',
            description: 'Publica tus servicios en el marketplace',
            isActive: true,
            completionReward: {
              type: 'MERITOS' as const,
              amount: 25
            }
          },
          {
            id: 'cta-receive-validation',
            type: 'PRACTICAR_CONFIANZA' as const,
            title: 'Recibir Validación',
            description: 'Obtén validación de la comunidad por tus servicios',
            isActive: true,
            completionReward: {
              type: 'ONDAS' as const,
              amount: 75
            }
          }
        ],
        associatedGPLs: ['gpl-service-creation', 'gpl-community-validation'],
        gamificationMechanics: [
          {
            id: 'mech-solver-creativity',
            core: 'CREATIVIDAD' as OctalysisCore,
            name: 'Herramientas de Creación',
            description: 'Empodera la creación de servicios únicos',
            intensity: 68,
            isActive: true,
            engagementBoost: 22,
            retentionImpact: 20,
            triggers: ['service_published', 'positive_feedback_received'],
            rewards: [{ type: 'MERITOS', amount: 15 }]
          }
        ]
      },
      {
        id: 'stage-promoter',
        type: 'PROMOTER' as StageType,
        name: 'Promoter - Liderazgo y Expansión',
        description: 'Etapa de liderazgo comunitario e invitación de nuevos miembros',
        philosophicalAlignment: 'vocacion' as const,
        currentUsers: 45,
        completionRate: 42,
        averageTimeInStage: 60,
        callToActions: [
          {
            id: 'cta-invite-users',
            type: 'CONTRASTE' as const,
            title: 'Invitar Usuarios',
            description: 'Invita nuevos miembros a la comunidad CoomÜnity',
            isActive: true,
            completionReward: {
              type: 'LUKAS' as const,
              amount: 100
            }
          },
          {
            id: 'cta-validate-seekers',
            type: 'PRACTICAR_CONFIANZA' as const,
            title: 'Validar Seekers',
            description: 'Ayuda a validar y mentorizar nuevos seekers',
            isActive: true,
            completionReward: {
              type: 'MERITOS' as const,
              amount: 30
            }
          }
        ],
        associatedGPLs: ['gpl-leadership-skills', 'gpl-community-building'],
        gamificationMechanics: [
          {
            id: 'mech-promoter-epic',
            core: 'EPICO' as OctalysisCore,
            name: 'Misión de Expansión',
            description: 'Sentido de propósito en la expansión de la comunidad',
            intensity: 90,
            isActive: true,
            engagementBoost: 25,
            retentionImpact: 28,
            triggers: ['successful_invitation', 'mentorship_completed'],
            rewards: [{ type: 'LUKAS', amount: 50 }]
          }
        ]
      }
    ];

    return stageBlueprints;
  }

  /**
   * 🏆 Parse Contest Data - Concursos activos basados en los CSV
   */
  static parseContestData(): Contest[] {
    const contestBlueprints = [
      {
        id: 'contest-ondas-weekly',
        type: 'CONCURSO_ONDAS' as ContestType,
        name: 'Concurso Semanal de Öndas',
        description: 'Compete por acumular la mayor cantidad de Öndas esta semana',
        startDate: new Date('2025-01-13'),
        endDate: new Date('2025-01-20'),
        duration: 168, // 7 días * 24 horas
        participants: 127,
        maxParticipants: 500,
        currentLeaders: [
          {
            userId: 'user-leader-1',
            username: 'EcoWarrior23',
            score: 450,
            position: 1,
            tokens: {
              ondas: 450,
              meritos: 25,
              lukas: 120,
              votosConfianza: 8,
              coompetencia: 1250,
              nivelConfianza: 78,
              rankingGlobal: 15
            },
            achievements: ['First Place', 'Consistency Master']
          }
        ],
        prizes: [
          {
            position: 1,
            reward: { type: 'LUKAS', amount: 500 },
            specialBenefits: ['Spotlight en comunidad', 'Acceso temprano a nuevas GPLs']
          }
        ],
        isActive: true,
        phase: 'ACTIVE'
      },
      {
        id: 'contest-meritos-monthly',
        type: 'CONCURSO_MERITOS' as ContestType,
        name: 'Reto Mensual de Mëritos',
        description: 'Construcción de confianza a través de acciones meritorias',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        duration: 744, // 31 días * 24 horas
        participants: 89,
        currentLeaders: [],
        prizes: [
          {
            position: 1,
            reward: { type: 'MERITOS', amount: 100 },
            specialBenefits: ['Título de Trusted Entrepreneur', 'Boost en algoritmo de marketplace']
          }
        ],
        isActive: true,
        phase: 'ACTIVE'
      }
    ];

    return contestBlueprints;
  }

  /**
   * 📊 Parse Analytics Data - Métricas del ecosistema
   */
  static parseAnalyticsData(): ConsoleAnalytics {
    return {
      activeUsers: {
        daily: 342,
        weekly: 1567,
        monthly: 4892,
        growth: 23.5
      },
      engagement: {
        gplEngagement: 78.3,
        marketplaceActivity: 65.7,
        socialInteractions: 82.1,
        challengeParticipation: 45.2
      },
      trustVotes: {
        thisWeek: 89,
        dailyAverage: 12.7,
        trustIndex: 76.4
      },
      stageDistribution: {
        BUYER: 342,
        SEEKER: 156,
        SOLVER: 89,
        PROMOTER: 45
      },
      ecosystemHealth: {
        overallScore: 82.3,
        tokenCirculation: 15420,
        communityGrowth: 18.7,
        retentionRate: 89.2
      }
    };
  }

  /**
   * 🔔 Parse Real-time Notifications
   */
  static parseNotifications(): RealTimeNotification[] {
    return [
      {
        id: 'notif-1',
        type: 'contest',
        message: 'Nueva líder en Concurso de Öndas: EcoWarrior23 con 450 Öndas',
        timestamp: new Date(),
        priority: 'MEDIUM',
        relatedEntity: {
          type: 'contest',
          id: 'contest-ondas-weekly'
        }
      },
      {
        id: 'notif-2',
        type: 'user',
        message: 'SustainableTech acaba de recibir su 10° voto de confianza',
        timestamp: new Date(Date.now() - 300000), // 5 min ago
        priority: 'LOW',
        relatedEntity: {
          type: 'user',
          id: 'user-sustainabletech'
        }
      },
      {
        id: 'notif-3',
        type: 'system',
        message: 'Nuevo milestone alcanzado: 5000 usuarios registrados',
        timestamp: new Date(Date.now() - 900000), // 15 min ago
        priority: 'HIGH',
        actionRequired: false
      }
    ];
  }

  /**
   * 🎮 Parse GPL Video Data - Datos de videos gamificados
   */
  static parseGPLVideoData(): GPLVideo[] {
    return [
      {
        id: 'gpl-intro-coomunity',
        title: 'Introducción a CoomÜnity',
        description: 'Descubre los fundamentos de la economía colaborativa',
        duration: 480, // 8 minutos
        category: 'TOPICOS_GENERALES',
        questions: [
          {
            id: 'q1-intro',
            type: 'ATENCION' as GPLQuestionType,
            question: '¿Cuál es el principio fundamental de CoomÜnity?',
            options: ['Bien Común', 'Ganancia individual'],
            correctAnswers: [0],
            reward: { type: 'ONDAS', amount: 5 },
            pausesVideo: true
          },
          {
            id: 'q2-intro',
            type: 'RESUMEN' as GPLQuestionType,
            question: 'Resume los 3 conceptos clave que aprendiste',
            options: [], // Respuesta libre
            reward: { type: 'ONDAS', amount: 7 },
            pausesVideo: false
          }
        ],
        viewCount: 1247,
        completionRate: 84.2,
        averageEngagement: 78.5
      }
    ];
  }

  /**
   * 📈 Parse Dashboard Overview - Vista integral del sistema
   */
  static parseDashboardOverview(): DashboardOverview {
    return {
      systemStatus: {
        uptime: 99.8,
        activeServices: 12,
        totalServices: 12,
        lastUpdate: new Date()
      },
      keyMetrics: {
        totalUsers: 632,
        activeContests: 2,
        dailyGPLViews: 89,
        trustVotesToday: 12
      },
      alerts: this.parseNotifications(),
      trends: {
        userGrowth: [100, 120, 140, 165, 190, 220, 260],
        engagementTrend: [65, 68, 72, 75, 78, 81, 78],
        tokenCirculation: [5000, 6200, 7800, 9500, 11200, 13400, 15420]
      }
    };
  }

  /**
   * 🔮 Master Parser - Función principal que retorna todos los datos parseados
   */
  static parseAllCSVData() {
    return {
      stages: this.parseStageData(),
      contests: this.parseContestData(),
      analytics: this.parseAnalyticsData(),
      notifications: this.parseNotifications(),
      gplVideos: this.parseGPLVideoData(),
      dashboard: this.parseDashboardOverview()
    };
  }
}

/**
 * 🚀 Función de utilidad para simulación en tiempo real
 * Simula updates en tiempo real para el dashboard
 */
export const simulateRealTimeUpdates = () => {
  const baseData = CSVDataParserService.parseAllCSVData();

  // Simular cambios en métricas
  const randomVariation = () => Math.random() * 0.1 - 0.05; // ±5%

  return {
    ...baseData,
    analytics: {
      ...baseData.analytics,
      activeUsers: {
        ...baseData.analytics.activeUsers,
        daily: Math.floor(baseData.analytics.activeUsers.daily * (1 + randomVariation())),
        weekly: Math.floor(baseData.analytics.activeUsers.weekly * (1 + randomVariation()))
      }
    }
  };
};

export default CSVDataParserService;
