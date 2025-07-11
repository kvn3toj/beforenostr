/**
 * 🎮 Challenge Builder - Exportaciones Principales
 *
 * Punto de entrada para el sistema completo de Constructor Visual de Desafíos
 * Diseñado para integración perfecta con Experience Console y ecosistema CoomÜnity
 */

// Componentes principales
export { ChallengeBuilder } from './ChallengeBuilder';
export { 
  ChallengeBuilderProvider, 
  useChallengeBuilder, 
  useValidation, 
  useOctalysisMetrics 
} from './ChallengeBuilderProvider';
export { 
  ChallengeBuilderIntegration, 
  QuickChallengeBuilder, 
  useExperienceConsoleIntegration 
} from './ChallengeBuilderIntegration';
export { default as TemplateMarketplaceIntegration } from './TemplateMarketplaceIntegration';

// Tipos TypeScript
export type {
  ChallengeElement,
  ChallengeFlow,
  ChallengeTemplate,
  ChallengeMetrics,
  ChallengeSettings,
  OctalysisElement,
  ValidationRule,
  FlowConnection,
  BuilderState,
  BuilderAction,
  UseChallengeBuilderReturn,
  MarketplaceFilters,
  MarketplaceSearchResult,
  ChallengeAnalytics,
  ChallengeAPI,
  TriggerConfig,
  ActionConfig,
  RewardConfig,
  ConditionConfig,
  TimerConfig,
  SocialConfig,
  ContentConfig,
  ElementConfig,
} from '../../../types/challenge-builder.types';

// Constantes y utilidades
export {
  OCTALYSIS_CORES,
  ELEMENT_TYPES,
  VALIDATION_SEVERITY_ORDER,
  DEFAULT_CANVAS_SIZE,
  DEFAULT_GRID_SIZE,
  DEFAULT_ZOOM,
} from '../../../types/challenge-builder.types';

// Re-exportar todo desde types para conveniencia
export * from '../../../types/challenge-builder.types';