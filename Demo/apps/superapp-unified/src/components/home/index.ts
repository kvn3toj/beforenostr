// 🏠 Componentes modulares del Home de CoomÜnity SuperApp
// Exportaciones centralizadas para una mejor organización y mantenimiento

// Import default exports first
import AyniMetricsCardRevolutionary from './AyniMetricsCardRevolutionary';
import WelcomeHeaderRevolutionary from './WelcomeHeaderRevolutionary';
import WalletOverviewRevolutionary from './WalletOverviewRevolutionary';
import QuickActionsGridRevolutionary from './QuickActionsGridRevolutionary';
import ModuleCardsRevolutionary from './ModuleCardsRevolutionary';
import NotificationCenterRevolutionary from './NotificationCenterRevolutionary';
import PersonalProgressWidgetRevolutionary from './PersonalProgressWidgetRevolutionary';
import ActiveChallengesWidgetRevolutionary from './ActiveChallengesWidgetRevolutionary';

// Widget components with fixed exports
export { AyniMetricsCards } from './AyniMetricsCards';
export { SystemSolarIndicator } from './SystemSolarIndicator';
export { SystemSolarIndicatorWrapper } from './SystemSolarIndicatorWrapper';
export { SystemSolarMiniDashboard } from './SystemSolarMiniDashboard';
export { WelcomeHeader } from './WelcomeHeader';
export { SmartQuickActions } from './SmartQuickActions';
export { SmartWalletOverview } from './SmartWalletOverview';
export { LiveActivityFeed } from './LiveActivityFeed';
export { NotificationCenterWidget } from './NotificationCenterWidget';
export { ModuleCards } from './ModuleCards';
export { PersonalProgressWidget } from './PersonalProgressWidget';
export { ActiveChallengesWidget } from './ActiveChallengesWidget';
export { SidebarProgressSection } from './SidebarProgressSection';
export { SidebarActivitySection } from './SidebarActivitySection';
export { SidebarRecommendationsSection } from './SidebarRecommendationsSection';
export { AyniBalanceVisualization } from './AyniBalanceVisualization';
export { RecentActivity } from './RecentActivity';
export { QuickStats } from './QuickStats';

// Revolutionary components - using imported components to avoid binding conflicts
export { AyniMetricsCardRevolutionary };
export { WelcomeHeaderRevolutionary };
export { WalletOverviewRevolutionary };
export { QuickActionsGridRevolutionary };
export { ModuleCardsRevolutionary };
export { NotificationCenterRevolutionary };
export { PersonalProgressWidgetRevolutionary };
export { ActiveChallengesWidgetRevolutionary };

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
