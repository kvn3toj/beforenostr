/**
 * 🏆 Challenges Module - Enhanced Components
 *
 * Módulo de desafíos mejorado con componentes más ricos en funcionalidad
 * y alineados con la filosofía CoomÜnity (Reciprocidad, Bien Común, etc.)
 *
 * COMPONENTES DISPONIBLES:
 * - ChallengeCard: Tarjeta mejorada con variantes y funcionalidades sociales
 * - ChallengeStats: Dashboard completo de estadísticas y métricas
 * - ChallengeFilters: Sistema avanzado de filtros y búsqueda
 * - ChallengeDetail: Vista detallada completa con pestañas
 * - ChallengeProgressTracker: Seguimiento visual de progreso
 * - ChallengeCreator: Formulario completo para crear nuevos desafíos
 *
 * HOOKS DISPONIBLES:
 * - useChallengeProgress: Gestión de progreso y estado de desafíos
 */

export { ChallengeCard } from './ChallengeCard';
export { ChallengeStats } from './ChallengeStats';
export { ChallengeFilters } from './ChallengeFilters';
export { ChallengeDetail } from './ChallengeDetail';
export { ChallengeProgressTracker } from './ChallengeProgressTracker';
export { ChallengeCreator } from './ChallengeCreator';

// Hooks export
export { useChallengeProgress } from '../../../hooks/useChallengeProgress';

// Types re-export for convenience
export type { ChallengeCardProps } from '../../../types/challenges';
