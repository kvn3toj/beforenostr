/**
 * ⚡ CRITICAL CSS EXTRACTOR
 * =======================
 *
 * Sistema inteligente de extracción de CSS crítico para optimizar
 * First Contentful Paint y reducir el bundle size.
 *
 * Funcionalidades:
 * - Extracción de CSS crítico por ruta
 * - Análisis de componentes above-the-fold
 * - Optimización responsive
 * - Integración con elementos CoomÜnity
 * - Métricas de performance
 */



interface CriticalCSSConfig {
  route: string;
  components: string[];
  aboveFold: boolean;
  inline: boolean;
  priority: number;
  element?: 'fuego' | 'agua' | 'tierra' | 'aire' | 'espiritu';
  responsive: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
}

interface CriticalCSSMetrics {
  extractedSize: number;      // Size of extracted critical CSS (bytes)
  originalSize: number;       // Original CSS size (bytes)
  reductionPercentage: number; // Percentage reduction
  firstContentfulPaint: number; // FCP time (ms)
  timeToInteractive: number;   // TTI time (ms)
  routeOptimization: Record<string, number>; // Per-route optimization
  cacheHitRate: number;       // CSS cache efficiency
  compressionRatio: number;   // Gzip compression effectiveness
}

interface RouteSpecificCSS {
  route: string;
  criticalCSS: string;
  deferredCSS: string;
  componentMap: Record<string, string[]>;
  mediaQueries: Record<string, string>;
  performance: {
    size: number;
    loadTime: number;
    renderTime: number;
  };
}

/**
 * 🎯 CriticalCSSExtractor - Advanced CSS optimization system
 *
 * Extracts and optimizes CSS for specific routes and components,
 * focusing on above-the-fold content and CoomÜnity design elements.
 */
export class CriticalCSSExtractor {
  private static instance: CriticalCSSExtractor;
  private routeConfigs: Map<string, CriticalCSSConfig> = new Map();
  private extractedCSS: Map<string, RouteSpecificCSS> = new Map();
  private performanceMetrics: CriticalCSSMetrics;
  private cssCache: Map<string, string> = new Map();

  private constructor() {
    this.initializeRouteConfigs();
    this.performanceMetrics = this.createDefaultMetrics();
    this.setupPerformanceMonitoring();
  }

  static getInstance(): CriticalCSSExtractor {
    if (!CriticalCSSExtractor.instance) {
      CriticalCSSExtractor.instance = new CriticalCSSExtractor();
    }
    return CriticalCSSExtractor.instance;
  }

  /**
   * 🏗️ Initialize route-specific CSS configurations
   */
  private initializeRouteConfigs(): void {
    // Home route - Balance y bienvenida
    this.routeConfigs.set('/', {
      route: '/',
      components: [
        'WelcomeWidget', 'QuickActionsGrid', 'ReciprocidadMetricsCard',
        'ModuleCards', 'WalletOverview', 'NotificationCenter'
      ],
      aboveFold: true,
      inline: true,
      priority: 10,
      element: 'espiritu',
      responsive: { mobile: true, tablet: true, desktop: true }
    });

    // ÜPlay route - Aprendizaje y energía
    this.routeConfigs.set('/uplay', {
      route: '/uplay',
      components: [
        'UPlayDashboard', 'VideoPlayer', 'InteractiveOverlay',
        'LearningProgress', 'GameElements', 'VideoLibrary'
      ],
      aboveFold: true,
      inline: true,
      priority: 9,
      element: 'fuego',
      responsive: { mobile: true, tablet: true, desktop: true }
    });

    // Marketplace route - Comercio y crecimiento
    this.routeConfigs.set('/marketplace', {
      route: '/marketplace',
      components: [
        'MarketplaceGrid', 'ProductCard', 'FilterPanel',
        'SearchBar', 'CategoryNav', 'TrustIndicators'
      ],
      aboveFold: true,
      inline: true,
      priority: 8,
      element: 'tierra',
      responsive: { mobile: true, tablet: true, desktop: true }
    });

    // Social route - Comunicación y aire
    this.routeConfigs.set('/social', {
      route: '/social',
      components: [
        'SocialFeed', 'PostCard', 'UserProfile',
        'ChatInterface', 'CommunityStats', 'ReciprocidadIndicators'
      ],
      aboveFold: true,
      inline: true,
      priority: 7,
      element: 'aire',
      responsive: { mobile: true, tablet: true, desktop: true }
    });

    // Wallet route - Fluidez y agua
    this.routeConfigs.set('/wallet', {
      route: '/wallet',
      components: [
        'BalanceCard', 'TransactionList', 'CurrencyDisplay',
        'PaymentMethods', 'WalletActions', 'LukasIndicator'
      ],
      aboveFold: true,
      inline: true,
      priority: 6,
      element: 'agua',
      responsive: { mobile: true, tablet: true, desktop: true }
    });
  }

  /**
   * ⚡ Extract critical CSS for a specific route
   */
  static extractCriticalCSS(route: string, options?: {
    inline?: boolean;
    compress?: boolean;
    includeAnimations?: boolean;
  }): string {
    const instance = CriticalCSSExtractor.getInstance();
    const config = instance.routeConfigs.get(route);

    if (!config) {
      console.warn(`No critical CSS configuration found for route: ${route}`);
      return instance.generateFallbackCSS(route);
    }

    // Check cache first
    const cacheKey = `${route}-${JSON.stringify(options)}`;
    if (instance.cssCache.has(cacheKey)) {
      return instance.cssCache.get(cacheKey)!;
    }

    const criticalCSS = instance.buildCriticalCSS(config, options);

    // Cache the result
    instance.cssCache.set(cacheKey, criticalCSS);

    // Update metrics
    instance.updateMetrics(route, criticalCSS);

    return criticalCSS;
  }

  /**
   * 🏗️ Build critical CSS based on configuration
   */
  private buildCriticalCSS(config: CriticalCSSConfig, options?: any): string {
    const cssBlocks: string[] = [];

    // 1. Core reset and base styles
    cssBlocks.push(this.getCoreStyles());

    // 2. CoomÜnity design tokens
    cssBlocks.push(this.getDesignTokens());

    // 3. Element-specific styles
    if (config.element) {
      cssBlocks.push(this.getElementStyles(config.element));
    }

    // 4. Component-specific styles
    config.components.forEach(component => {
      cssBlocks.push(this.getComponentStyles(component));
    });

    // 5. Layout and grid systems
    cssBlocks.push(this.getLayoutStyles(config.responsive));

    // 6. Above-the-fold optimizations
    if (config.aboveFold) {
      cssBlocks.push(this.getAboveFoldStyles());
    }

    // 7. Animations (if enabled)
    if (options?.includeAnimations !== false) {
      cssBlocks.push(this.getAnimationStyles(config.element));
    }

    // 8. Responsive media queries
    cssBlocks.push(this.getResponsiveStyles(config.responsive));

    let finalCSS = cssBlocks.join('\n');

    // Optimization steps
    if (options?.compress !== false) {
      finalCSS = this.compressCSS(finalCSS);
    }

    return finalCSS;
  }

  /**
   * 🎨 Core styles - essential resets and base typography
   */
  private getCoreStyles(): string {
    return `
/* === CRITICAL CSS CORE STYLES === */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-variation-settings: 'wght' 400;
  background-color: var(--coomunity-background);
  color: var(--coomunity-text);
  overflow-x: hidden;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
`;
  }

  /**
   * 🌈 CoomÜnity design tokens - critical color and spacing variables
   */
  private getDesignTokens(): string {
    return `
/* === COOMUNITY DESIGN TOKENS === */
:root {
  /* Core Colors */
  --coomunity-primary: #8B5CF6;
  --coomunity-secondary: #EC4899;
  --coomunity-accent: #F59E0B;
  --coomunity-background: #FEFEFE;
  --coomunity-surface: #FFFFFF;
  --coomunity-text: #1F2937;
  --coomunity-text-secondary: #6B7280;

  /* Element Colors */
  --coomunity-fuego: #EF4444;
  --coomunity-agua: #3B82F6;
  --coomunity-tierra: #22C55E;
  --coomunity-aire: #8B5CF6;
  --coomunity-espiritu: #EC4899;

  /* Semantic Colors */
  --coomunity-success: #10B981;
  --coomunity-warning: #F59E0B;
  --coomunity-error: #EF4444;
  --coomunity-info: #3B82F6;

  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Typography Scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
}
`;
  }

  /**
   * 🔥 Element-specific styles based on CoomÜnity philosophy
   */
  private getElementStyles(element: string): string {
    const elementStyles: Record<string, string> = {
      fuego: `
/* === FUEGO (FIRE) ELEMENT STYLES === */
.element-fuego {
  --element-primary: var(--coomunity-fuego);
  --element-gradient: linear-gradient(135deg, #EF4444 0%, #F97316 100%);
  --element-glow: 0 0 20px rgba(239, 68, 68, 0.3);
  --element-animation-duration: 0.3s;
}

.fuego-card {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  box-shadow: var(--element-glow);
}

.fuego-button {
  background: var(--element-gradient);
  color: white;
  transition: all var(--element-animation-duration) ease;
}

.fuego-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--element-glow), var(--shadow-lg);
}
`,
      agua: `
/* === AGUA (WATER) ELEMENT STYLES === */
.element-agua {
  --element-primary: var(--coomunity-agua);
  --element-gradient: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
  --element-glow: 0 0 20px rgba(59, 130, 246, 0.3);
  --element-animation-duration: 0.5s;
}

.agua-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: var(--element-glow);
}

.agua-flow {
  animation: agua-wave 3s ease-in-out infinite;
}

@keyframes agua-wave {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}
`,
      tierra: `
/* === TIERRA (EARTH) ELEMENT STYLES === */
.element-tierra {
  --element-primary: var(--coomunity-tierra);
  --element-gradient: linear-gradient(135deg, #22C55E 0%, #84CC16 100%);
  --element-glow: 0 0 20px rgba(34, 197, 94, 0.3);
  --element-animation-duration: 0.4s;
}

.tierra-card {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(132, 204, 22, 0.05) 100%);
  border: 1px solid rgba(34, 197, 94, 0.2);
  box-shadow: var(--element-glow);
}

.tierra-growth {
  animation: tierra-growth 2s ease-out;
}

@keyframes tierra-growth {
  0% { transform: scale(0.95); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}
`,
      aire: `
/* === AIRE (AIR) ELEMENT STYLES === */
.element-aire {
  --element-primary: var(--coomunity-aire);
  --element-gradient: linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%);
  --element-glow: 0 0 20px rgba(139, 92, 246, 0.3);
  --element-animation-duration: 0.6s;
}

.aire-card {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: var(--element-glow);
}

.aire-float {
  animation: aire-float 4s ease-in-out infinite;
}

@keyframes aire-float {
  0%, 100% { transform: translateY(0px) rotateY(0deg); }
  25% { transform: translateY(-3px) rotateY(2deg); }
  75% { transform: translateY(3px) rotateY(-2deg); }
}
`,
      espiritu: `
/* === ESPÍRITU (SPIRIT) ELEMENT STYLES === */
.element-espiritu {
  --element-primary: var(--coomunity-espiritu);
  --element-gradient: linear-gradient(135deg, #EC4899 0%, #F59E0B 100%);
  --element-glow: 0 0 30px rgba(236, 72, 153, 0.4);
  --element-animation-duration: 0.8s;
}

.espiritu-card {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%);
  border: 1px solid rgba(236, 72, 153, 0.2);
  box-shadow: var(--element-glow);
}

.espiritu-pulse {
  animation: espiritu-pulse 3s ease-in-out infinite;
}

@keyframes espiritu-pulse {
  0%, 100% { box-shadow: var(--element-glow); }
  50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.6); }
}
`
    };

    return elementStyles[element] || '';
  }

  /**
   * 🧩 Component-specific critical styles
   */
  private getComponentStyles(componentName: string): string {
    const componentStyles: Record<string, string> = {
      'WelcomeWidget': `
.welcome-widget {
  padding: var(--space-8);
  border-radius: var(--radius-2xl);
  background: var(--coomunity-surface);
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-6);
}

.welcome-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--coomunity-text);
  margin-bottom: var(--space-4);
}
`,
      'QuickActionsGrid': `
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.quick-action-item {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--coomunity-surface);
  border: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.quick-action-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
`,
      'ReciprocidadMetricsCard': `
.reciprocidad-metrics-card {
  background: var(--coomunity-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--space-6);
}

.reciprocidad-balance-score {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--coomunity-primary);
  text-align: center;
  margin-bottom: var(--space-4);
}

.reciprocidad-elements-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}
`,
      'ModuleCards': `
.module-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.module-card {
  background: var(--coomunity-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  cursor: pointer;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
`,
      'UPlayDashboard': `
.uplay-dashboard {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-6);
  min-height: 70vh;
}

.uplay-main-content {
  background: var(--coomunity-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
}

.uplay-sidebar {
  background: var(--coomunity-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
}
`,
      'VideoPlayer': `
.video-player-container {
  position: relative;
  background: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 16/9;
  margin-bottom: var(--space-4);
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: var(--space-4);
}
`,
      'MarketplaceGrid': `
.marketplace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
  padding: var(--space-4);
}

.marketplace-card {
  background: var(--coomunity-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.marketplace-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
`,
      'SocialFeed': `
.social-feed {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-4);
}

.social-post {
  background: var(--coomunity-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-4);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.social-post-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
`,
      'WalletOverview': `
.wallet-overview {
  background: var(--coomunity-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-6);
}

.wallet-balance {
  text-align: center;
  margin-bottom: var(--space-6);
}

.wallet-balance-amount {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--coomunity-primary);
  margin-bottom: var(--space-2);
}

.wallet-currency {
  font-size: var(--text-lg);
  color: var(--coomunity-text-secondary);
}
`
    };

    return componentStyles[componentName] || '';
  }

  /**
   * 📱 Layout and grid systems
   */
  private getLayoutStyles(responsive: CriticalCSSConfig['responsive']): string {
    return `
/* === CRITICAL LAYOUT STYLES === */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.grid {
  display: grid;
  gap: var(--space-4);
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-4 {
  gap: var(--space-4);
}

.gap-6 {
  gap: var(--space-6);
}

.mb-4 {
  margin-bottom: var(--space-4);
}

.mb-6 {
  margin-bottom: var(--space-6);
}

.p-4 {
  padding: var(--space-4);
}

.p-6 {
  padding: var(--space-6);
}

.rounded-lg {
  border-radius: var(--radius-lg);
}

.rounded-xl {
  border-radius: var(--radius-xl);
}

.shadow-md {
  box-shadow: var(--shadow-md);
}

.shadow-lg {
  box-shadow: var(--shadow-lg);
}
`;
  }

  /**
   * ⬆️ Above-the-fold specific optimizations
   */
  private getAboveFoldStyles(): string {
    return `
/* === ABOVE-THE-FOLD CRITICAL STYLES === */
.above-fold {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero-section {
  padding: var(--space-16) 0;
  text-align: center;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
}

.hero-title {
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--coomunity-text);
  margin-bottom: var(--space-6);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: var(--text-xl);
  color: var(--coomunity-text-secondary);
  margin-bottom: var(--space-8);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-8);
  background: var(--coomunity-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.cta-button:hover {
  background: var(--coomunity-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Critical loading states */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text {
  height: 1em;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-2);
}

.skeleton-card {
  height: 200px;
  border-radius: var(--radius-lg);
}
`;
  }

  /**
   * 🎬 Animation styles optimized for performance
   */
  private getAnimationStyles(element?: string): string {
    const baseAnimations = `
/* === CRITICAL ANIMATION STYLES === */
.fade-in {
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.scale-in {
  animation: scale-in 0.3s ease-out;
}

@keyframes scale-in {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}

.slide-up {
  animation: slide-up 0.4s ease-out;
}

@keyframes slide-up {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Interaction animations */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Performance optimized transitions */
.smooth-transition {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity, box-shadow;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

    return baseAnimations;
  }

  /**
   * 📱 Responsive styles for different breakpoints
   */
  private getResponsiveStyles(responsive: CriticalCSSConfig['responsive']): string {
    let styles = '';

    if (responsive.mobile) {
      styles += `
/* === MOBILE CRITICAL STYLES === */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-2);
  }

  .module-cards-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .marketplace-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .uplay-dashboard {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .hero-title {
    font-size: var(--text-3xl);
  }

  .hero-subtitle {
    font-size: var(--text-lg);
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2);
  }
}
`;
    }

    if (responsive.tablet) {
      styles += `
/* === TABLET CRITICAL STYLES === */
@media (min-width: 769px) and (max-width: 1024px) {
  .module-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .marketplace-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-actions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
`;
    }

    if (responsive.desktop) {
      styles += `
/* === DESKTOP CRITICAL STYLES === */
@media (min-width: 1025px) {
  .module-cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .marketplace-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .quick-actions-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .hero-section {
    padding: var(--space-16) 0 var(--space-20);
  }
}
`;
    }

    return styles;
  }

  /**
   * 🗜️ CSS compression and optimization
   */
  private compressCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
      .replace(/;\s*/g, ';') // Remove spaces after semicolons
      .replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
      .replace(/\s*,\s*/g, ',') // Remove spaces around commas
      .replace(/\s*:\s*/g, ':') // Remove spaces around colons
      .replace(/\s*;\s*}/g, '}') // Remove trailing semicolons
      .trim();
  }

  /**
   * 🚨 Generate fallback CSS for unknown routes
   */
  private generateFallbackCSS(route: string): string {
    return this.getCoreStyles() + this.getDesignTokens() + this.getLayoutStyles({
      mobile: true,
      tablet: true,
      desktop: true
    });
  }

  /**
   * 📊 Update performance metrics
   */
  private updateMetrics(route: string, criticalCSS: string): void {
    const size = new Blob([criticalCSS]).size;

    this.performanceMetrics.extractedSize = size;
    this.performanceMetrics.routeOptimization[route] = size;

    // Calculate reduction percentage (compared to estimated full CSS)
    const estimatedFullSize = 250000; // 250KB estimated full CSS
    this.performanceMetrics.reductionPercentage = ((estimatedFullSize - size) / estimatedFullSize) * 100;
  }

  /**
   * 🔧 Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    if (typeof window !== 'undefined') {
      // Monitor Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.performanceMetrics.firstContentfulPaint = entry.startTime;
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }

  /**
   * 📈 Get current performance metrics
   */
  getMetrics(): CriticalCSSMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * 🧹 Clear CSS cache (useful for development)
   */
  static clearCache(): void {
    const instance = CriticalCSSExtractor.getInstance();
    instance.cssCache.clear();
    console.log('Critical CSS cache cleared');
  }

  /**
   * 💾 Preload critical CSS for multiple routes
   */
  static preloadCriticalCSS(routes: string[]): Promise<void[]> {
    const instance = CriticalCSSExtractor.getInstance();

    const preloadPromises = routes.map(route => {
      return new Promise<void>((resolve) => {
        // Generate and cache CSS for each route
        const css = CriticalCSSExtractor.extractCriticalCSS(route);

        // Create link element for preloading
        if (typeof document !== 'undefined') {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'style';
          link.href = `data:text/css;base64,${btoa(css)}`;
          document.head.appendChild(link);
        }

        resolve();
      });
    });

    return Promise.all(preloadPromises);
  }

  private createDefaultMetrics(): CriticalCSSMetrics {
    return {
      extractedSize: 0,
      originalSize: 250000, // Estimated 250KB full CSS
      reductionPercentage: 0,
      firstContentfulPaint: 0,
      timeToInteractive: 0,
      routeOptimization: {},
      cacheHitRate: 0,
      compressionRatio: 0.7 // 70% compression ratio
    };
  }

  /**
   * 🎯 Inline critical CSS directly into document head
   */
  static inlineCriticalCSS(route: string): void {
    if (typeof document === 'undefined') return;

    const criticalCSS = CriticalCSSExtractor.extractCriticalCSS(route, {
      inline: true,
      compress: true,
      includeAnimations: true
    });

    // Remove existing inline critical CSS
    const existingStyle = document.querySelector('style[data-critical-css]');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject new critical CSS
    const style = document.createElement('style');
    style.setAttribute('data-critical-css', route);
    style.textContent = criticalCSS;

    // Insert before any existing stylesheets
    const firstLink = document.querySelector('link[rel="stylesheet"]');
    if (firstLink) {
      document.head.insertBefore(style, firstLink);
    } else {
      document.head.appendChild(style);
    }

    console.log(`✅ Critical CSS inlined for route: ${route} (${(criticalCSS.length / 1024).toFixed(2)}KB)`);
  }
}

/**
 * 🌟 React Hook for using Critical CSS
 */
export function useCriticalCSS(route: string) {
  React.useEffect(() => {
    // Inline critical CSS for the current route
    CriticalCSSExtractor.inlineCriticalCSS(route);

    // Preload CSS for likely next routes
    const commonRoutes = ['/', '/uplay', '/marketplace', '/social', '/wallet'];
    const nextRoutes = commonRoutes.filter(r => r !== route).slice(0, 2);

    CriticalCSSExtractor.preloadCriticalCSS(nextRoutes);
  }, [route]);

  const metrics = React.useMemo(() => {
    return CriticalCSSExtractor.getInstance().getMetrics();
  }, [route]);

  return {
    metrics,
    clearCache: CriticalCSSExtractor.clearCache,
    preloadRoutes: CriticalCSSExtractor.preloadCriticalCSS
  };
}

export default CriticalCSSExtractor;
