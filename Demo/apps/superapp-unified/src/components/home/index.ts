// 🏠 Componentes modulares del Home de CoomÜnity SuperApp
// Exportaciones centralizadas para una mejor organización y mantenimiento

// Widget components with fixed exports
export { AyniMetricsCard } from './AyniMetricsCard'; // ✅ AGREGADO: Export faltante
// ❌ REMOVIDO: SystemSolarIndicator (archivo no existe)
// ❌ REMOVIDO: SystemSolarIndicatorWrapper (archivo no existe)
// ❌ REMOVIDO: SystemSolarMiniDashboard (archivo no existe)
export { WalletOverview } from './WalletOverview'; // ✅ AGREGADO: Export faltante
export { QuickActionsGrid } from './QuickActionsGrid'; // ✅ AGREGADO: Export faltante
export { NotificationCenter } from './NotificationCenter'; // ✅ AGREGADO: Export faltante
export { SmartQuickActions } from './SmartQuickActions';
// ❌ REMOVIDO: SmartWalletOverview (archivo no existe)
export { LiveActivityFeed } from './LiveActivityFeed';
// ❌ REMOVIDO: NotificationCenterWidget (archivo no existe)
export { ModuleCards } from './ModuleCards';
export { PersonalProgressWidget } from './PersonalProgressWidget';
export { ActiveChallengesWidget } from './ActiveChallengesWidget';
// ❌ REMOVIDO: SidebarProgressSection (archivo no existe)
// ❌ REMOVIDO: SidebarActivitySection (archivo no existe)
// ❌ REMOVIDO: SidebarRecommendationsSection (archivo no existe)
export { AyniBalanceVisualization } from './AyniBalanceVisualization';
// ❌ REMOVIDO: RecentActivity (archivo no existe)
// ❌ REMOVIDO: QuickStats (archivo no existe)

// 🚀 Phase 3: Advanced Visual Components
export { AdvancedInsightsPanel } from './AdvancedInsightsPanel';
export { PerformanceMonitor } from './PerformanceMonitor';
export { IntelligentNotificationCenter } from './IntelligentNotificationCenter';

// 🌟 Fase Avanzada: Nuevos componentes 3D y efectos
export { EnergyWeatherWidget } from './EnergyWeatherWidget';
export { EnhancedParticles } from './EnhancedParticles';

// Tipos compartidos entre componentes
export interface HomeComponentProps {
  isLoading?: boolean;
  isConnected?: boolean;
}

export interface ModuleData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  gradient: string;
  path: string;
  stats: {
    label: string;
    value: string;
  };
  isActive: boolean;
  isNew?: boolean;
  lastActivity?: string;
  userLevel?: string;
}

export interface AyniAction {
  icon: React.ReactElement;
  label: string;
  path: string;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  description: string;
  category: 'ayni' | 'modules' | 'create';
}

export interface NotificationData {
  id: string;
  type: 'ayni' | 'meritos' | 'social' | 'marketplace' | 'system';
  title: string;
  message: string;
  time: string;
  icon: React.ReactElement;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  isRead?: boolean;
  priority?: 'high' | 'medium' | 'low';
  actionLabel?: string;
  onAction?: () => void;
}
