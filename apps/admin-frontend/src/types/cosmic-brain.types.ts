/**
 * 🌌 Cosmic Brain Types
 * 
 * Tipos TypeScript para el sistema AI Cosmic Brain.
 * Define las interfaces y tipos para datos del dashboard,
 * métricas, misiones, guardianes y funcionalidades de evolución.
 * 
 * Filosofía CoomÜnity:
 * - Bien Común: Tipos compartidos y reutilizables
 * - Ayni: Balance entre flexibilidad y estructura
 * - Neguentropía: Organización clara de tipos
 * - Metanöia: Evolución continua de la tipología
 */

// ============================================================================
// ��️ Dashboard Types
// ============================================================================

export interface CosmicDashboardData {
  overview: {
    totalUsers: number;
    activeGuardians: number;
    completedMissions: number;
    systemHealth: number;
    philosophyAlignment: number;
    harmonyLevel: number;
  };
  guardians?: GuardianStatus[];
  philosophyMetrics?: PhilosophyMetrics;
  activeMissions?: Mission[];
  harmonyMetrics?: HarmonyMetrics;
  lastUpdated: string;
}

// ============================================================================
// 📊 Metrics Types
// ============================================================================

export interface PhilosophyMetrics {
  overallScore: number;
  principles: {
    bienComun: {
      score: number;
      description: string;
      indicators: string[];
    };
    ayni: {
      score: number;
      description: string;
      indicators: string[];
    };
    negentropia: {
      score: number;
      description: string;
      indicators: string[];
    };
    metanoia: {
      score: number;
      description: string;
      indicators: string[];
    };
    vocacion: {
      score: number;
      description: string;
      indicators: string[];
    };
  };
  trends: {
    period: string;
    values: number[];
  };
  recommendations: string[];
}

export interface SystemHealth {
  overallHealth: number;
  components: {
    database: {
      status: 'healthy' | 'warning' | 'critical';
      responseTime: number;
      connections: number;
    };
    api: {
      status: 'healthy' | 'warning' | 'critical';
      responseTime: number;
      requests: number;
    };
    cache: {
      status: 'healthy' | 'warning' | 'critical';
      hitRate: number;
      memory: number;
    };
    guardians: {
      status: 'healthy' | 'warning' | 'critical';
      active: number;
      total: number;
    };
  };
  alerts: {
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }[];
}

export interface HarmonyMetrics {
  overallHarmony: number;
  teamMetrics: {
    collaboration: number;
    communication: number;
    creativity: number;
    wellbeing: number;
  };
  indicators: {
    name: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
    description: string;
  }[];
  recommendations: string[];
}

// ============================================================================
// 🎯 Mission Types
// ============================================================================

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'philosophy' | 'technical' | 'creative' | 'social';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string[];
  progress: number;
  startDate: string;
  endDate?: string;
  estimatedDuration: number;
  actualDuration?: number;
  tags: string[];
  rewards: {
    merits: number;
    badges: string[];
    experience: number;
  };
  dependencies: string[];
  blockers: string[];
  notes: string[];
}

// ============================================================================
// 🛡️ Guardian Types
// ============================================================================

export enum GuardianType {
  COSMOS = 'cosmos',
  ARIA = 'aria',
  ATLAS = 'atlas',
  CRONOS = 'cronos',
  EUNOIA = 'eunoia',
  HARMONIA = 'harmonia',
  SOPHIA = 'sophia',
  METIS = 'metis',
}

export interface GuardianStatus {
  type: GuardianType;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  healthScore: number;
  lastActivity: string;
  capabilities: string[];
  currentTasks: {
    id: string;
    name: string;
    progress: number;
    estimatedCompletion: string;
  }[];
  metrics: {
    tasksCompleted: number;
    averageResponseTime: number;
    successRate: number;
    uptime: number;
  };
  alerts: {
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }[];
  configuration: {
    [key: string]: any;
  };
}

// ============================================================================
// 🔄 Evolution Types
// ============================================================================

export interface EvolutionResult {
  message: string;
  evolutionId: string;
  startedAt: Date;
  estimatedDuration: number;
  phases: {
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    estimatedTime: number;
  }[];
  expectedImprovements: string[];
  risks: string[];
}

// ============================================================================
// 🎨 UI Component Types
// ============================================================================

export interface CosmicBrainTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
  };
  gradients: {
    cosmic: string;
    harmony: string;
    philosophy: string;
  };
  animations: {
    pulse: string;
    glow: string;
    float: string;
  };
}

export interface WidgetProps {
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  compact?: boolean;
  theme?: Partial<CosmicBrainTheme>;
}

// ============================================================================
// 🔧 Utility Types
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FilterOptions {
  search?: string;
  status?: string;
  type?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
