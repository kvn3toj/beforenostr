/**
 * 🌟 Console Data Types - CoomÜnity Experience Architecture
 *
 * Tipos fundamentales extraídos del blueprint de gamificación encontrado en los CSV.
 * Esta estructura codifica la filosofía CoomÜnity en arquitectura técnica ejecutable.
 */

// ===============================================================================
// STAGES - El Viaje del Peregrino (Pilgrim Journey)
// ===============================================================================

export type StageType = 'BUYER' | 'SEEKER' | 'SOLVER' | 'PROMOTER';

export interface Stage {
  id: string;
  type: StageType;
  name: string;
  description: string;
  philosophicalAlignment: 'reciprocidad' | 'bien_comun' | 'metanoia' | 'vocacion';

  // Progresión y métricas
  currentUsers: number;
  completionRate: number;
  averageTimeInStage: number; // días

  // Call to Actions específicos por stage
  callToActions: CallToAction[];

  // GPL (Gamified Play List) asociadas
  associatedGPLs: string[];

  // Mecánicas de gamificación activas
  gamificationMechanics: OctalysisMechanic[];
}

export interface CallToAction {
  id: string;
  type: 'CONTEXTO' | 'CONCIENCIA' | 'CONTRASTE' | 'PRACTICAR_CONFIANZA' | 'CONSUMO_CONSCIENTE';
  title: string;
  description: string;
  isActive: boolean;
  completionReward: TokenReward;
}

// ===============================================================================
// FRAMEWORK OCTALYSIS - Gamificación Consciente
// ===============================================================================

export type OctalysisCore =
  | 'EPICO'           // Epic Meaning - Sentido de propósito mayor
  | 'LOGRO'           // Accomplishment - Progresión y habilidades
  | 'CREATIVIDAD'     // Empowerment - Creación y empoderamiento
  | 'PROPIEDAD'       // Ownership - Öndas y tokens
  | 'AFINIDAD'        // Social Influence - Elementos sociales
  | 'ESCASEZ'         // Scarcity - Exclusividad y rarity
  | 'CURIOSIDAD'      // Unpredictability - HambrE y exploración
  | 'PERDIDA';        // Loss Avoidance - Evitar pérdidas

export interface OctalysisMechanic {
  id: string;
  core: OctalysisCore;
  name: string;
  description: string;
  intensity: number; // 0-100
  isActive: boolean;

  // Métricas de efectividad
  engagementBoost: number;
  retentionImpact: number;

  // Configuración específica
  triggers: string[];
  rewards: TokenReward[];
}

export interface OctalysisAnalytics {
  coreIntensities: Record<OctalysisCore, number>;
  overallBalance: number; // 0-100
  recommendedAdjustments: OctalysisRecommendation[];
  lastUpdated: Date;
}

export interface OctalysisRecommendation {
  core: OctalysisCore;
  currentIntensity: number;
  recommendedIntensity: number;
  reasoning: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

// ===============================================================================
// SISTEMA DE TOKENS - Tokenización de Confianza
// ===============================================================================

export interface TokenReward {
  type: 'ONDAS' | 'MERITOS' | 'LUKAS' | 'VOTOS_CONFIANZA';
  amount: number;
  multiplier?: number;
  conditions?: string[];
}

export interface TokenBalance {
  ondas: number;
  meritos: number;
  lukas: number;
  votosConfianza: number;

  // Métricas derivadas
  coompetencia: number; // Fórmula: (Öndas x Factor) + (Compras propias x Factor) + (Ventas x Factor) + (Mëritos x Factor) + (Compras de hijos x Factor)
  nivelConfianza: number;
  rankingGlobal: number;
}

// ===============================================================================
// GPL (GAMIFIED PLAY LIST) - El Espejo del Aprendizaje
// ===============================================================================

export type GPLQuestionType =
  | 'ATENCION'      // Opción binaria
  | 'PERFILACION'   // Tipo A/B ambas correctas
  | 'RESUMEN';      // Siempre da 7 Öndas

export interface GPLQuestion {
  id: string;
  type: GPLQuestionType;
  question: string;
  options: string[];
  correctAnswers?: number[]; // Índices de respuestas correctas
  reward: TokenReward;
  pausesVideo: boolean;
}

export interface GPLVideo {
  id: string;
  title: string;
  description: string;
  duration: number; // segundos
  category: 'TOPICOS_GENERALES' | 'FRONTERA_ESTABLECIDO' | 'RESONANCIA_VOCACION' | 'EMPRENDIMIENTO_SOCIAL';

  // Estructura de preguntas
  questions: GPLQuestion[];

  // Métricas de engagement
  viewCount: number;
  completionRate: number;
  averageEngagement: number;

  // Temporizadores específicos
  activationTimes?: string[]; // Para "LA FRÖNTERA"
}

// ===============================================================================
// CONCURSOS Y RETOS - Motor de Competencia Consciente
// ===============================================================================

export type ContestType =
  | 'CONCURSO_ONDAS'
  | 'CONCURSO_MERITOS'
  | 'CONCURSO_RESONANCIA'
  | 'RETO_DIARIO_GPL'
  | 'RETO_INTERCAMBIO'
  | 'RETO_ANUNCIO';

export interface Contest {
  id: string;
  type: ContestType;
  name: string;
  description: string;

  // Configuración temporal
  startDate: Date;
  endDate: Date;
  duration: number; // horas

  // Participación
  participants: number;
  maxParticipants?: number;
  currentLeaders: LeaderboardEntry[];

  // Premios y recompensas
  prizes: ContestPrize[];

  // Estado
  isActive: boolean;
  phase: 'SETUP' | 'ACTIVE' | 'JUDGING' | 'COMPLETED';
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  position: number;
  tokens: TokenBalance;
  achievements: string[];
}

export interface ContestPrize {
  position: number; // 1st, 2nd, 3rd, etc.
  reward: TokenReward;
  specialBenefits?: string[];
}

// ===============================================================================
// ANALYTICS Y MÉTRICAS - Sabiduría Predictiva de NIRA
// ===============================================================================

export interface ConsoleAnalytics {
  // Usuarios activos
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
    growth: number; // porcentaje
  };

  // Engagement por módulo
  engagement: {
    gplEngagement: number; // porcentaje
    marketplaceActivity: number;
    socialInteractions: number;
    challengeParticipation: number;
  };

  // Trust System
  trustVotes: {
    thisWeek: number;
    dailyAverage: number;
    trustIndex: number; // 0-100
  };

  // Distribución por stages
  stageDistribution: Record<StageType, number>;

  // Salud del ecosistema
  ecosystemHealth: {
    overallScore: number; // 0-100
    tokenCirculation: number;
    communityGrowth: number;
    retentionRate: number;
  };
}

export interface RealTimeNotification {
  id: string;
  type: 'contest' | 'validation' | 'system' | 'user' | 'achievement';
  message: string;
  timestamp: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  actionRequired?: boolean;
  relatedEntity?: {
    type: 'user' | 'contest' | 'gpl' | 'stage';
    id: string;
  };
}

// ===============================================================================
// CONFIGURACIÓN DE EXPERIENCIAS - El Gamifier
// ===============================================================================

export interface ExperienceTemplate {
  id: string;
  name: string;
  targetStage: StageType;

  // Componentes de la experiencia
  components: ExperienceComponent[];

  // Configuración de Octalysis
  octalysisConfig: OctalysisMechanic[];

  // Flujo y secuencia
  flowSteps: ExperienceStep[];

  // Métricas objetivo
  targetMetrics: {
    completionRate: number;
    engagementScore: number;
    retentionImpact: number;
  };
}

export interface ExperienceComponent {
  id: string;
  type: 'GPL_VIDEO' | 'CHALLENGE' | 'QUIZ' | 'SOCIAL_INTERACTION' | 'MARKETPLACE_ACTION';
  config: Record<string, any>;
  isRequired: boolean;
  timeLimit?: number; // minutos
}

export interface ExperienceStep {
  id: string;
  name: string;
  description: string;
  components: string[]; // IDs de componentes
  completionCriteria: string[];
  nextSteps: string[]; // IDs de siguientes pasos
}

// ===============================================================================
// DASHBOARD OVERVIEW - Visión Integral
// ===============================================================================

export interface DashboardOverview {
  // Estado general del sistema
  systemStatus: {
    uptime: number;
    activeServices: number;
    totalServices: number;
    lastUpdate: Date;
  };

  // Métricas clave
  keyMetrics: {
    totalUsers: number;
    activeContests: number;
    dailyGPLViews: number;
    trustVotesToday: number;
  };

  // Alertas y notificaciones
  alerts: RealTimeNotification[];

  // Tendencias
  trends: {
    userGrowth: number[];
    engagementTrend: number[];
    tokenCirculation: number[];
  };
}
