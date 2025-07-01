/**
 * 🌟 TIPOS CENTRALIZADOS DE RECIPROCIDAD - CoomÜnity
 * ===============================================
 *
 * Fuente única de verdad para todos los tipos relacionados con Reciprocidad.
 * Diseñados para mantener coherencia entre frontend y backend, y eliminar duplicaciones.
 *
 * Categorías:
 * - DTOs: Contratos con el backend
 * - Modelos de dominio: Tipos enriquecidos para el frontend
 * - Componentes: Props específicas para componentes UI
 * - Utilidades: Tipos helper y derivados
 */

// ===================================================================
// 🔗 DTO BACKEND - Contrato con API
// ===================================================================

/**
 * DTO principal que define la forma de los datos de métricas de Reciprocidad
 * tal como los devuelve el backend desde el endpoint `/users/{userId}/reciprocidad-metrics`.
 * Este tipo asegura que el contrato con el backend se mantiene intacto.
 */
export interface ReciprocidadMetricsDTO {
  ondas: number;
  meritos: number;
  balanceReciprocidad: number;
  nivelReciprocidad: string;
  nextLevel: string;
  progresoReciprocidad: number;
  bienComunContributions: number;
  reciprocityScore: number;
  elementos: ElementosBasicos;
  totalTransactions: number;
  positiveImpact: number;
  communityRank: number;
  weeklyGrowth: number;
  lastUpdated: string;
  joinedDate: string;
}

// ===================================================================
// 🌊 ELEMENTOS Y DOMINIO
// ===================================================================

/**
 * Elementos básicos del universo CoomÜnity
 */
export interface ElementosBasicos {
  fuego: number;    // Pasión, inspiración, energía transformadora
  agua: number;     // Fluidez, adaptabilidad, empatía
  tierra: number;   // Estabilidad, confianza, manifestación
  aire: number;     // Comunicación, claridad, intercambio
}

/**
 * Elementos específicos para el contexto social (alias semánticos)
 */
export interface ElementosSociales {
  comunicacion: number;   // Aire - Comunicación efectiva
  empatia: number;       // Agua - Empatía y fluidez emocional
  confianza: number;     // Tierra - Estabilidad y confianza
  inspiracion: number;   // Fuego - Pasión e inspiración
}

/**
 * Elementos específicos para grupos y colaboraciones
 */
export interface ElementosGrupales {
  colaboracion: number;   // Aire - Trabajo en equipo
  sostenibilidad: number; // Tierra - Proyectos duraderos
  innovacion: number;     // Fuego - Creatividad e innovación
  armonia: number;        // Agua - Equilibrio grupal
}

// ===================================================================
// 📊 MÉTRICAS Y ESTADÍSTICAS
// ===================================================================

/**
 * Estadísticas de usuario para contexto social
 */
export interface UserStatsReciprocidad {
  reciprocidadBalance: number;
  socialLevel: string;
  nextLevel: string;
  socialProgress: number;
  connectionsCount: number;
  collaborationsCount: number;
  bienComunContributions: number;
  socialMeritos: number;
  trustScore: number;
  elementos: ElementosSociales;
  dailyInteractions?: number;
  activeCircles?: number;
}

/**
 * Métricas de la comunidad
 */
export interface CommunityMetrics {
  activeConnections: number;
  onlineMembers: number;
  dailyInteractions: number;
  reciprocidadExchanges: number;
  activeCircles: number;
  weeklyGrowth: number;
  totalMembers?: number;
  monthlyGrowth?: number;
}

/**
 * Datos específicos para grupos y colaboraciones
 */
export interface GroupReciprocidadData {
  id: string;
  name: string;
  reciprocidadBalance: number;
  reciprocidadGiving: number;
  reciprocidadReceiving: number;
  meritos: number;
  ondas: number;
  impactoBienComun: number;
  nivelColaboracion: string;
  elementos: ElementosGrupales;
  proyectosActivos: number;
  intercambiosReciprocidad: number;
  miembrosActivos: number;
  crecimientoSemanal: number;
  fechaCreacion: string;
  proximoEvento?: string;
  categoriaImpacto: 'alto' | 'medio' | 'bajo';
  especialidades: string[];
}

// ===================================================================
// 🔔 NOTIFICACIONES Y COMUNICACIÓN
// ===================================================================

/**
 * Estructura de notificaciones relacionadas con reciprocidad
 */
export interface NotificationData {
  id: string;
  type: 'reciprocidad' | 'nivel' | 'colaboracion' | 'merito' | 'general';
  title: string;
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  relatedUserId?: string;
  actionUrl?: string;
}

// ===================================================================
// 🎨 TIPOS PARA COMPONENTES UI
// ===================================================================

/**
 * Props para el componente principal de métricas sociales de reciprocidad
 */
export interface ReciprocidadSocialMetricsProps {
  userStats: UserStatsReciprocidad;
  communityMetrics: CommunityMetrics;
  notifications?: NotificationData[];
  isLoading?: boolean;
  isConnected?: boolean;
  showDetailedView?: boolean;
  detailed?: boolean;
}

/**
 * Props para widgets de balance de reciprocidad
 */
export interface ReciprocidadBalanceWidgetProps {
  balance: number;
  nivel: string;
  progreso: number;
  meritos: number;
  ondas: number;
  isLoading?: boolean;
  showAnimation?: boolean;
  compactView?: boolean;
}

/**
 * Props para métricas de grupos
 */
export interface GroupReciprocidadMetricsProps {
  groupData: GroupReciprocidadData;
  isLoading?: boolean;
  showMembers?: boolean;
  showProjects?: boolean;
}

// ===================================================================
// 🔄 TRANSFORMADORES Y UTILIDADES
// ===================================================================

/**
 * Función para transformar DTO a modelo de dominio social
 */
export type ReciprocidadDTOToSocial = (dto: ReciprocidadMetricsDTO) => UserStatsReciprocidad;

/**
 * Función para mapear elementos básicos a sociales
 */
export type ElementosMapper = (basicos: ElementosBasicos) => ElementosSociales;

/**
 * Estados posibles de carga de datos de reciprocidad
 */
export type ReciprocidadLoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Configuración de visualización para métricas
 */
export interface ReciprocidadDisplayConfig {
  showElements: boolean;
  showProgress: boolean;
  showCommunityMetrics: boolean;
  showNotifications: boolean;
  animationLevel: 'none' | 'subtle' | 'full';
  theme: 'light' | 'dark' | 'cosmic';
}

// ===================================================================
// 🌟 TIPOS DERIVADOS Y CALCULADOS
// ===================================================================

/**
 * Nivel de reciprocidad calculado
 */
export interface CalculatedReciprocidadLevel {
  current: string;
  next: string;
  progress: number;
  pointsToNext: number;
  totalPointsNeeded: number;
  description: string;
  benefits: string[];
  color: string;
}

/**
 * Resumen de impacto en el bien común
 */
export interface BienComunImpactSummary {
  totalContributions: number;
  impactLevel: 'emergente' | 'creciente' | 'notable' | 'excepcional' | 'legendary';
  description: string;
  recentActions: Array<{
    type: string;
    description: string;
    points: number;
    date: string;
  }>;
}

// ===================================================================
// 🔧 VALIDADORES Y GUARDS
// ===================================================================

/**
 * Type guard para verificar si un objeto es un DTO válido
 */
export const isReciprocidadMetricsDTO = (obj: any): obj is ReciprocidadMetricsDTO => {
  return (
    typeof obj === 'object' &&
    typeof obj.ondas === 'number' &&
    typeof obj.meritos === 'number' &&
    typeof obj.balanceReciprocidad === 'number' &&
    typeof obj.elementos === 'object' &&
    typeof obj.elementos.fuego === 'number' &&
    typeof obj.elementos.agua === 'number' &&
    typeof obj.elementos.tierra === 'number' &&
    typeof obj.elementos.aire === 'number'
  );
};

/**
 * Type guard para UserStats
 */
export const isUserStatsReciprocidad = (obj: any): obj is UserStatsReciprocidad => {
  return (
    typeof obj === 'object' &&
    typeof obj.reciprocidadBalance === 'number' &&
    typeof obj.socialLevel === 'string' &&
    typeof obj.elementos === 'object' &&
    typeof obj.elementos.comunicacion === 'number'
  );
};

// ===================================================================
// 📈 FUNCIONES UTILITARIAS EXPORTADAS
// ===================================================================

/**
 * Mapea elementos básicos a elementos sociales con nombres semánticos
 */
export const mapElementosBasicosToSociales = (basicos: ElementosBasicos): ElementosSociales => ({
  comunicacion: basicos.aire,
  empatia: basicos.agua,
  confianza: basicos.tierra,
  inspiracion: basicos.fuego,
});

/**
 * Calcula el nivel de reciprocidad basado en el balance y méritos
 */
export const calculateReciprocidadLevel = (
  balance: number,
  meritos: number
): CalculatedReciprocidadLevel => {
  // Lógica de cálculo de niveles (simplificada)
  if (balance >= 0.9 && meritos >= 2000) {
    return {
      current: 'Guía Estelar',
      next: 'Maestro Cósmico',
      progress: 95,
      pointsToNext: 500,
      totalPointsNeeded: 3000,
      description: 'Mentor de la comunidad con impacto excepcional',
      benefits: ['Acceso a círculos privados', 'Mentorías exclusivas'],
      color: '#FFD700'
    };
  }

  if (balance >= 0.7 && meritos >= 1000) {
    return {
      current: 'Colaborador Equilibrado',
      next: 'Guía Estelar',
      progress: Math.round(((meritos - 1000) / 1000) * 100),
      pointsToNext: 2000 - meritos,
      totalPointsNeeded: 2000,
      description: 'Miembro activo que contribuye al equilibrio',
      benefits: ['Participación en decisiones', 'Acceso a herramientas avanzadas'],
      color: '#4A90E2'
    };
  }

  return {
    current: 'Nuevo Miembro',
    next: 'Colaborador Equilibrado',
    progress: Math.round((meritos / 1000) * 100),
    pointsToNext: 1000 - meritos,
    totalPointsNeeded: 1000,
    description: 'Comenzando el viaje en la comunidad',
    benefits: ['Acceso al chat global', 'Participación en eventos'],
    color: '#A8E6CF'
  };
};

/**
 * Genera valores por defecto seguros para UserStats
 */
export const createSafeUserStats = (partial?: Partial<UserStatsReciprocidad>): UserStatsReciprocidad => ({
  reciprocidadBalance: 0.5,
  socialLevel: 'Nuevo Miembro',
  nextLevel: 'Colaborador Equilibrado',
  socialProgress: 0,
  connectionsCount: 0,
  collaborationsCount: 0,
  bienComunContributions: 0,
  socialMeritos: 0,
  trustScore: 4.0,
  elementos: {
    comunicacion: 50,
    empatia: 50,
    confianza: 50,
    inspiracion: 50,
  },
  dailyInteractions: 0,
  activeCircles: 0,
  ...partial,
});

/**
 * Genera valores por defecto seguros para CommunityMetrics
 */
export const createSafeCommunityMetrics = (partial?: Partial<CommunityMetrics>): CommunityMetrics => ({
  activeConnections: 0,
  onlineMembers: 0,
  dailyInteractions: 0,
  reciprocidadExchanges: 0,
  activeCircles: 0,
  weeklyGrowth: 0,
  totalMembers: 0,
  monthlyGrowth: 0,
  ...partial,
});
