/**
 * 🎮 Challenge Builder Types - Sistema de Tipos para Constructor Visual
 *
 * Definiciones TypeScript para el ecosistema completo de creación de desafíos
 * Alineado con la arquitectura CoomÜnity y valores de Neguentropía
 */

// Tipos base del Framework Octalysis
export interface OctalysisElement {
  core: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  name: string;
  description: string;
  weight: number; // 0-10, influencia del core drive en el elemento
}

export const OCTALYSIS_CORES: Record<number, { name: string; description: string; type: 'white' | 'black' }> = {
  1: { 
    name: 'Epic Meaning & Calling', 
    description: 'Contribuir a algo más grande que uno mismo',
    type: 'white'
  },
  2: { 
    name: 'Development & Accomplishment', 
    description: 'Progreso, logros y superación de desafíos',
    type: 'white'
  },
  3: { 
    name: 'Empowerment of Creativity & Feedback', 
    description: 'Expresión creativa y retroalimentación',
    type: 'white'
  },
  4: { 
    name: 'Ownership & Possession', 
    description: 'Sentimiento de pertenencia y control',
    type: 'black'
  },
  5: { 
    name: 'Social Influence & Relatedness', 
    description: 'Factores sociales y sentido de pertenencia',
    type: 'white'
  },
  6: { 
    name: 'Scarcity & Impatience', 
    description: 'Deseo por cosas escasas o inalcanzables',
    type: 'black'
  },
  7: { 
    name: 'Unpredictability & Curiosity', 
    description: 'Elementos de sorpresa y curiosidad',
    type: 'black'
  },
  8: { 
    name: 'Loss & Avoidance', 
    description: 'Motivación por evitar pérdidas',
    type: 'black'
  },
};

// Tipos de validación
export interface ValidationRule {
  id: string;
  type: 'required' | 'conditional' | 'logic' | 'ux' | 'philosophy' | 'octalysis';
  message: string;
  severity: 'error' | 'warning' | 'info';
  autoFix?: boolean;
  fixAction?: () => void;
}

// Configuraciones específicas por tipo de elemento
export interface TriggerConfig {
  triggerType: 'manual' | 'automatic' | 'time_based' | 'event_based';
  autoStart: boolean;
  conditions?: string[];
  delay?: number; // en segundos
}

export interface ActionConfig {
  actionType: 'task' | 'upload' | 'quiz' | 'survey' | 'creative' | 'social';
  verification: 'manual' | 'automatic' | 'peer' | 'ai';
  points: number;
  timeLimit?: number;
  resources?: string[];
  instructions: string;
  successCriteria: string[];
}

export interface RewardConfig {
  rewardType: 'ünits' | 'mëritos' | 'badge' | 'content' | 'access' | 'social';
  amount: number;
  visibility: 'private' | 'community' | 'public';
  conditions?: string[];
  expiry?: number; // en días
  transferable: boolean;
}

export interface ConditionConfig {
  conditionType: 'if_then' | 'switch' | 'probability' | 'time_gate';
  logic: 'simple' | 'complex';
  rules: Array<{
    field: string;
    operator: 'equals' | 'greater' | 'less' | 'contains' | 'exists';
    value: any;
    action: 'continue' | 'branch' | 'stop' | 'repeat';
  }>;
}

export interface TimerConfig {
  duration: number; // en segundos
  showCountdown: boolean;
  timeoutAction: 'fail' | 'continue' | 'branch';
  warningThresholds: number[]; // porcentajes para alertas
  pausable: boolean;
}

export interface SocialConfig {
  socialType: 'collaboration' | 'competition' | 'peer_review' | 'mentorship';
  groupSize: number;
  matchingCriteria: string[];
  visibility: 'private' | 'community' | 'public';
  roles?: Array<{
    name: string;
    description: string;
    permissions: string[];
  }>;
}

export interface ContentConfig {
  contentType: 'text' | 'video' | 'audio' | 'interactive' | 'ar' | 'vr';
  duration: number; // en segundos
  interactive: boolean;
  tracking: boolean;
  prerequisites?: string[];
  adaptiveContent: boolean;
}

// Tipo unión para todas las configuraciones
export type ElementConfig = 
  | TriggerConfig 
  | ActionConfig 
  | RewardConfig 
  | ConditionConfig 
  | TimerConfig 
  | SocialConfig 
  | ContentConfig;

// Elemento del desafío
export interface ChallengeElement {
  id: string;
  type: 'trigger' | 'action' | 'reward' | 'condition' | 'timer' | 'social' | 'content';
  title: string;
  description: string;
  config: ElementConfig;
  position: { x: number; y: number };
  connections: FlowConnection[];
  octalysisElements: OctalysisElement[];
  validationRules: ValidationRule[];
  metadata: {
    createdAt: string;
    modifiedAt: string;
    version: string;
    author: string;
    tags: string[];
  };
}

// Conexiones entre elementos
export interface FlowConnection {
  id: string;
  source: string;
  target: string;
  condition?: string;
  type: 'success' | 'failure' | 'timeout' | 'choice' | 'branch';
  style?: {
    stroke: string;
    strokeWidth: number;
    animated: boolean;
  };
}

// Métricas de análisis del desafío
export interface ChallengeMetrics {
  octalysisProfile: Record<number, number>; // Peso de cada core drive
  difficultyScore: number; // 1-10
  engagementScore: number; // 1-10
  bienComunScore: number; // Alineación con valores CoomÜnity
  reciprocidadIndex: number; // Fomenta reciprocidad vs individualismo
  metanoiaFactor: number; // Potencial de transformación consciente
  estimatedCompletionTime: number; // en minutos
  dropOffRisk: number; // 0-1, riesgo de abandono
}

// Flujo completo del desafío
export interface ChallengeFlow {
  id: string;
  name: string;
  description: string;
  elements: ChallengeElement[];
  connections: FlowConnection[];
  metadata: {
    stage: 'buyer' | 'seeker' | 'solver' | 'promoter';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string[];
    estimatedTime: number; // en segundos
    language: string;
    version: string;
    status: 'draft' | 'review' | 'published' | 'archived';
    createdAt: string;
    modifiedAt: string;
    author: string;
    collaborators: string[];
    tags: string[];
  };
  metrics: ChallengeMetrics;
  settings: ChallengeSettings;
}

// Configuraciones globales del desafío
export interface ChallengeSettings {
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    multiLanguage: string[];
  };
  privacy: {
    dataCollection: 'minimal' | 'standard' | 'comprehensive';
    analytics: boolean;
    personalization: boolean;
    sharing: 'private' | 'community' | 'public';
  };
  philosophical: {
    emphasizeBienComun: boolean;
    fosterReciprocity: boolean;
    encourageMetanoia: boolean;
    preventManipulation: boolean;
  };
}

// Template para reutilización
export interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  category: string[];
  flow: Omit<ChallengeFlow, 'id' | 'metadata'>;
  usage: {
    downloads: number;
    ratings: Array<{ userId: string; rating: number; comment?: string }>;
    forks: number;
    lastUsed: string;
  };
  author: {
    id: string;
    name: string;
    reputation: number;
  };
  license: 'open' | 'attribution' | 'commercial' | 'restricted';
  pricing: {
    type: 'free' | 'ünits' | 'mëritos';
    amount: number;
  };
}

// Estados del constructor
export interface BuilderState {
  currentFlow: ChallengeFlow | null;
  selectedElement: ChallengeElement | null;
  activeTab: number;
  previewMode: boolean;
  validationResults: ValidationRule[];
  isDragging: string | null;
  canvasSize: { width: number; height: number };
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

// Acciones del constructor
export type BuilderAction =
  | { type: 'SET_FLOW'; payload: ChallengeFlow }
  | { type: 'ADD_ELEMENT'; payload: ChallengeElement }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<ChallengeElement> } }
  | { type: 'DELETE_ELEMENT'; payload: string }
  | { type: 'SELECT_ELEMENT'; payload: ChallengeElement | null }
  | { type: 'SET_ACTIVE_TAB'; payload: number }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'SET_VALIDATION_RESULTS'; payload: ValidationRule[] }
  | { type: 'SET_DRAGGING'; payload: string | null }
  | { type: 'UPDATE_CANVAS_SIZE'; payload: { width: number; height: number } }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'TOGGLE_GRID'; payload?: boolean }
  | { type: 'TOGGLE_SNAP_TO_GRID'; payload?: boolean };

// Marketplace types
export interface MarketplaceFilters {
  category: string[];
  difficulty: ('beginner' | 'intermediate' | 'advanced')[];
  stage: ('buyer' | 'seeker' | 'solver' | 'promoter')[];
  octalysisCores: number[];
  priceRange: { min: number; max: number };
  license: ('open' | 'attribution' | 'commercial')[];
  rating: number; // mínimo rating
  language: string[];
  recent: boolean; // últimos 30 días
}

export interface MarketplaceSearchResult {
  templates: ChallengeTemplate[];
  totalCount: number;
  facets: {
    categories: Array<{ name: string; count: number }>;
    difficulties: Array<{ name: string; count: number }>;
    stages: Array<{ name: string; count: number }>;
    authors: Array<{ name: string; count: number }>;
  };
}

// Analytics y métricas
export interface ChallengeAnalytics {
  usage: {
    totalAttempts: number;
    completions: number;
    averageTime: number;
    dropOffPoints: Array<{ elementId: string; percentage: number }>;
  };
  engagement: {
    returnRate: number;
    shareRate: number;
    ratingAverage: number;
    feedbackSentiment: 'positive' | 'neutral' | 'negative';
  };
  impact: {
    bienComunContribution: number;
    reciprocityGenerated: number;
    metanoiaInstances: number;
    communityGrowth: number;
  };
}

// Integración con backend
export interface ChallengeAPI {
  save: (flow: ChallengeFlow) => Promise<{ id: string; version: string }>;
  load: (id: string, version?: string) => Promise<ChallengeFlow>;
  validate: (flow: ChallengeFlow) => Promise<ValidationRule[]>;
  generateCode: (flow: ChallengeFlow) => Promise<{ code: string; preview: string }>;
  publish: (id: string) => Promise<{ published: boolean; url: string }>;
  analytics: (id: string) => Promise<ChallengeAnalytics>;
  templates: {
    search: (filters: MarketplaceFilters) => Promise<MarketplaceSearchResult>;
    get: (id: string) => Promise<ChallengeTemplate>;
    fork: (templateId: string) => Promise<ChallengeFlow>;
    rate: (templateId: string, rating: number, comment?: string) => Promise<void>;
  };
}

// Hooks y utilidades
export interface UseChallengeBuilderReturn {
  state: BuilderState;
  actions: {
    setFlow: (flow: ChallengeFlow) => void;
    addElement: (element: ChallengeElement) => void;
    updateElement: (id: string, updates: Partial<ChallengeElement>) => void;
    deleteElement: (id: string) => void;
    selectElement: (element: ChallengeElement | null) => void;
    setActiveTab: (tab: number) => void;
    setPreviewMode: (preview: boolean) => void;
    validateFlow: () => void;
    generateCode: () => Promise<void>;
    saveFlow: () => Promise<void>;
  };
  computed: {
    hasErrors: boolean;
    hasWarnings: boolean;
    canGenerateCode: boolean;
    canPublish: boolean;
    octalysisBalance: Record<number, number>;
    bienComunScore: number;
  };
}

// Exportaciones de utilidades
export const ELEMENT_TYPES = [
  'trigger',
  'action', 
  'reward',
  'condition',
  'timer',
  'social',
  'content',
] as const;

export const VALIDATION_SEVERITY_ORDER = {
  error: 3,
  warning: 2,
  info: 1,
} as const;

export const DEFAULT_CANVAS_SIZE = {
  width: 1200,
  height: 800,
} as const;

export const DEFAULT_GRID_SIZE = 20;
export const DEFAULT_ZOOM = 1;