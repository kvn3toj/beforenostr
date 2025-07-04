// Home-specific hooks for CoomÜnity SuperApp
export { useTimeOfDay } from './useTimeOfDay';
export { useElementalBalance, elementConfig, calculateReciprocidadEfficiency, calculateCommunityImpact, getElementAnimation } from './useElementalBalance';
export { useElementalConfig } from './useElementalConfig';
export { useReciprocidadMetrics, useReciprocidadMetricsRealTime } from './useReciprocidadMetrics';

export type { TimeOfDay, TimeOfDayData } from './useTimeOfDay';
export type { ElementType, ElementConfig as ElementalBalanceConfig, ElementalBalance } from './useElementalBalance';
export type { ElementConfig as ElementalSystemConfig } from './useElementalConfig';
export type { ReciprocidadMetricsUI } from './useReciprocidadMetrics';
