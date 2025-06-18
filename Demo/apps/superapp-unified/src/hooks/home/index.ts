// Home-specific hooks for CoomÜnity SuperApp
export { useTimeOfDay } from './useTimeOfDay';
export { useElementalBalance, elementConfig, calculateAyniEfficiency, calculateCommunityImpact, getElementAnimation } from './useElementalBalance';

export type { TimeOfDay, TimeOfDayData } from './useTimeOfDay';
export type { ElementType, ElementConfig as ElementalBalanceConfig, ElementalBalance } from './useElementalBalance';

// 🌟 HOOKS DEL MÓDULO HOME - EXPORTS CENTRALIZADOS

export { useElementalConfig } from './useElementalConfig';
export { useAyniMetrics, useAyniMetricsRealTime } from './useAyniMetrics';

// 🎯 Tipos con nombres únicos para evitar conflictos
export type { ElementConfig as ElementalSystemConfig } from './useElementalConfig';
export type { AyniMetricsData } from './useAyniMetrics'; 