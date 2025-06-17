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

// Core Components - Fixed exports
export { default as CoomunityButton } from './CoomunityButton';
export { CoomunityCard } from './CoomunityCard';
export { LoadingSpinner } from './LoadingSpinner';

// Aliases for backwards compatibility - Using imported components
export { CoomunityButton as Button };
export { CoomunityCard as Card };
export { CoomunityCard as AyniCard };
export { CoomunityCard as ModuleCard };

// Design System Tools - Fixed pattern for default exports
export { DesignSystemValidator };
export { PerformanceMonitor };
export { DesignSystemShowcase };
export { ThemeTestSuite };

// Types
export type { CoomunityButtonProps } from './CoomunityButton';
export type { CoomunityCardProps } from './CoomunityCard';
export { default as BuilderIOStatus } from './BuilderIOStatus'; 