// ===== COOMUNITY SUPERAPP - UI COMPONENTS INDEX =====

// 🎨 Core Design System Components (Fixed: Import/Export separation for mixed exports)
import Card, { 
  ModuleCard,
  AyniCard,
  MeritosCard,
  OndasCard,
  MarketplaceCard,
  SocialCard,
  StatsCard,
  CardHeader,
  CardFooter,
  type CardHeaderProps,
  type CardFooterProps,
  type CardProps
} from './Card/Card';

// Export Card components
export { Card };
export { Card as CoomunityCard };
export {
  ModuleCard,
  AyniCard,
  MeritosCard,
  OndasCard,
  MarketplaceCard,
  SocialCard,
  StatsCard,
  CardHeader,
  CardFooter,
  type CardHeaderProps,
  type CardFooterProps,
  type CardProps
};

// ✅ Button Components (Fixed: Import/Export separation)
import Button, {
  PrimaryButton, 
  GoldButton, 
  AyniButton, 
  MeritosButton, 
  OndasButton,
  type ButtonProps 
} from './Button/Button';

// Export Button components
export { Button };
export { 
  PrimaryButton, 
  GoldButton, 
  AyniButton, 
  MeritosButton, 
  OndasButton,
  type ButtonProps 
};

// 🎨 Theme Management Components (Fixed: Import/Export separation)
import ThemeToggle, { ThemeControlPanel } from './ThemeToggle';
export { ThemeToggle };
export { ThemeControlPanel };

// Direct exports for single default exports (these are safe)
export { default as DesignSystemShowcase } from './DesignSystemShowcase';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as SkeletonLoaders } from './SkeletonLoaders';
export { default as OptimizedImage } from './OptimizedImage';
export { default as PerformanceMonitor } from './PerformanceMonitor';
export { default as DesignSystemValidator } from './DesignSystemValidator';
export { default as VideoPlayerErrorBoundary } from './VideoPlayerErrorBoundary';
export { default as MonitoringTestComponent } from './MonitoringTestComponent';

// 🌈 Design System Utilities
export { cn } from '../../utils/styles';

// 📝 TODO: Future showcase components to implement (currently commented out because they don't exist)
// 🎨 Theme Management Showcases
// export { default as AnimationShowcase } from './AnimationShowcase';
// export { default as InteractiveDemo } from './InteractiveDemo';
// export { default as ColorPaletteDemo } from './ColorPaletteDemo';
// export { default as TypographyDemo } from './TypographyDemo';
// export { default as SpacingDemo } from './SpacingDemo';
// export { default as ComponentsDemo } from './ComponentsDemo';
// export { default as AccessibilityDemo } from './AccessibilityDemo';
// export { default as ResponsiveDemo } from './ResponsiveDemo';
// export { default as PerformanceDemo } from './PerformanceDemo';
// export { default as DarkModeDemo } from './DarkModeDemo';

// 🎮 Component Testing & Validation Showcases
// export { default as ComponentTester } from './ComponentTester';
// export { default as TokensShowcase } from './TokensShowcase';
// export { default as LayoutShowcase } from './LayoutShowcase';
// export { default as NavigationShowcase } from './NavigationShowcase';
// export { default as FormsShowcase } from './FormsShowcase';
// export { default as DataDisplayShowcase } from './DataDisplayShowcase';
// export { default as FeedbackShowcase } from './FeedbackShowcase';
// export { default as MediaShowcase } from './MediaShowcase';
// export { default as UtilsShowcase } from './UtilsShowcase';
// export { default as HooksShowcase } from './HooksShowcase';
// export { default as ServicesShowcase } from './ServicesShowcase';
// export { default as ContextsShowcase } from './ContextsShowcase';
// export { default as PatternsShowcase } from './PatternsShowcase';
// export { default as AdvancedShowcase } from './AdvancedShowcase';
// export { default as ExamplesShowcase } from './ExamplesShowcase';
// export { default as BestPracticesShowcase } from './BestPracticesShowcase';
// export { default as TroubleshootingShowcase } from './TroubleshootingShowcase';

// 🛠️ Development & Debugging Tools (to be implemented)
// export { default as DevToolsPanel } from './DevToolsPanel';
// export { default as DebugInfo } from './DebugInfo';
// export { default as ComponentInspector } from './ComponentInspector';

// 🌟 Enhanced Components (future implementation)
// export { default as Typography } from './Typography';
// export { default as EnhancedSocialFeed } from '../modules/social/components/EnhancedSocialFeed';
// export { default as EnhancedVideoPlayer } from '../modules/uplay/components/EnhancedVideoPlayer';
// export { default as EnhancedMarketplaceCard } from '../modules/marketplace/components/EnhancedMarketplaceCard'; 