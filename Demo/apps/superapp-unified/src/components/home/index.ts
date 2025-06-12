// 🏠 Componentes modulares del Home de CoomÜnity SuperApp
// Exportaciones centralizadas para una mejor organización y mantenimiento

export { WelcomeHeader } from './WelcomeHeader';
export { AyniMetricsCard } from './AyniMetricsCard';
export { WalletOverview } from './WalletOverview';
export { QuickActionsGrid } from './QuickActionsGrid';
export { ModuleCards } from './ModuleCards';
export { NotificationCenter } from './NotificationCenter';

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
