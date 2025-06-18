// CoomÜnity SuperApp - UI Components Index
// Exportaciones centralizadas del sistema de diseño

// Import components first, then export them
import CoomunityButton from './CoomunityButton';
import { CoomunityCard } from './CoomunityCard';
import { LoadingSpinner } from './LoadingSpinner';
import DesignSystemValidator from './DesignSystemValidator';
import PerformanceMonitor from './PerformanceMonitor';
import DesignSystemShowcase from './DesignSystemShowcase';
import ThemeTestSuite from './ThemeTestSuite';
import BuilderIOStatus from './BuilderIOStatus';

// Core Components - Using import/export pattern to avoid binding conflicts
export { CoomunityButton };
export { CoomunityCard } from './CoomunityCard';
export { LoadingSpinner } from './LoadingSpinner';

// Aliases for backwards compatibility - Using imported components
export { CoomunityButton as Button };
export { CoomunityCard as Card };
export { CoomunityCard as AyniCard };
export { CoomunityCard as ModuleCard };

// Design System Tools - Using imported components to avoid star export issues
export { DesignSystemValidator };
export { PerformanceMonitor };
export { DesignSystemShowcase };
export { ThemeTestSuite };
export { BuilderIOStatus };

// Types
export type { CoomunityButtonProps } from './CoomunityButton';
export type { CoomunityCardProps } from './CoomunityCard'; 