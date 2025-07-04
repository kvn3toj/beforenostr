/**
 * 🌌 CRITICAL CSS EXTRACTOR - Fase 5
 * ===================================
 *
 * Sistema inteligente para extraer y optimizar CSS crítico
 * Mejora el First Contentful Paint de 800ms → 400ms target
 */

interface CriticalCSSConfig {
  route: string;
  components: string[];
  aboveFold: boolean;
  inline: boolean;
  priority: number;
  element?: 'fuego' | 'agua' | 'tierra' | 'aire' | 'espiritu';
}

interface CSSOptimizationMetrics {
  originalSize: number;
  criticalSize: number;
  reduction: number;
  inlineSize: number;
  firstPaintImprovement: number;
  lastUpdated: number;
}

interface CriticalCSSRule {
  selector: string;
  declaration: string;
  priority: number;
  aboveFold: boolean;
  source: 'component' | 'global' | 'element' | 'animation';
}

export class CriticalCSSExtractor {
  private static instance: CriticalCSSExtractor;
  private criticalRoutes: CriticalCSSConfig[] = [];
  private extractedCSS: Map<string, string> = new Map();
  private metrics: CSSOptimizationMetrics;
  private isOptimizationEnabled: boolean = true;

  private constructor() {
    this.initializeCriticalRoutes();
    this.metrics = this.initializeMetrics();
    this.setupPerformanceObserver();
  }

  static getInstance(): CriticalCSSExtractor {
    if (!CriticalCSSExtractor.instance) {
      CriticalCSSExtractor.instance = new CriticalCSSExtractor();
    }
    return CriticalCSSExtractor.instance;
  }

  /**
   * Configurar rutas críticas con componentes específicos
   */
  private initializeCriticalRoutes(): void {
    this.criticalRoutes = [
      {
        route: '/',
        components: ['WelcomeWidget', 'QuickActionsGrid', 'ReciprocidadMetricsCard', 'NotificationCenter'],
        aboveFold: true,
        inline: true,
        priority: 10,
        element: 'espiritu' // Balance espiritual del home
      },
      {
        route: '/uplay',
        components: ['UPlayDashboard', 'VideoPlayer', 'InteractiveOverlay', 'ProgressTracker'],
        aboveFold: true,
        inline: true,
        priority: 9,
        element: 'fuego' // Energía y acción del aprendizaje
      },
      {
        route: '/marketplace',
        components: ['CoomunityDataTable', 'FilterPanel', 'ProductGrid', 'SearchBar'],
        aboveFold: true,
        inline: true,
        priority: 8,
        element: 'tierra' // Abundancia y manifestación
      },
      {
        route: '/social',
        components: ['ChatInterface', 'UserProfile', 'CommunityFeed', 'ConnectionStatus'],
        aboveFold: true,
        inline: true,
        priority: 7,
        element: 'aire' // Comunicación y conexión
      },
      {
        route: '/wallet',
        components: ['BalanceWidget', 'TransactionHistory', 'LukasConverter', 'ToinsDisplay'],
        aboveFold: true,
        inline: true,
        priority: 6,
        element: 'agua' // Fluidez y intercambio
      }
    ];

    console.log('🌌 Critical routes initialized:', this.criticalRoutes.length);
  }

  /**
   * Extraer CSS crítico para una ruta específica
   */
  async extractCriticalCSS(route: string): Promise<string> {
    const config = this.criticalRoutes.find(r => r.route === route);
    if (!config) {
      console.warn(`⚠️ No critical CSS config found for route: ${route}`);
      return this.getDefaultCriticalCSS();
    }

    // Verificar si ya tenemos CSS crítico cacheado
    const cacheKey = `${route}-${config.components.join('-')}`;
    if (this.extractedCSS.has(cacheKey)) {
      return this.extractedCSS.get(cacheKey)!;
    }

    const startTime = performance.now();

    // Generar CSS crítico basado en componentes y elemento
    const criticalCSS = await this.generateCriticalCSS(config);

    // Optimizar y minimizar
    const optimizedCSS = this.optimizeCriticalCSS(criticalCSS);

    // Cachear resultado
    this.extractedCSS.set(cacheKey, optimizedCSS);

    // Actualizar métricas
    this.updateMetrics(criticalCSS.length, optimizedCSS.length, performance.now() - startTime);

    console.log(`✅ Critical CSS extracted for ${route} (${optimizedCSS.length} bytes)`);
    return optimizedCSS;
  }

  /**
   * Generar CSS crítico basado en configuración
   */
  private async generateCriticalCSS(config: CriticalCSSConfig): Promise<string> {
    const rules: CriticalCSSRule[] = [];

    // 1. CSS básico de layout y fonts
    rules.push(...this.getLayoutCriticalCSS());

    // 2. CSS específico de componentes above-the-fold
    for (const component of config.components) {
      rules.push(...this.getComponentCriticalCSS(component));
    }

    // 3. CSS del elemento filosófico
    if (config.element) {
      rules.push(...this.getElementCriticalCSS(config.element));
    }

    // 4. CSS de animaciones críticas
    rules.push(...this.getAnimationCriticalCSS());

    // Ordenar por prioridad y generar CSS final
    const sortedRules = rules.sort((a, b) => b.priority - a.priority);
    return this.assembleCriticalCSS(sortedRules);
  }

  /**
   * CSS crítico de layout y estructura
   */
  private getLayoutCriticalCSS(): CriticalCSSRule[] {
    return [
      {
        selector: 'body',
        declaration: `
          margin: 0;
          padding: 0;
          font-family: 'Roboto', 'Arial', sans-serif;
          background-color: #fffefb;
          color: #2c2c2c;
          line-height: 1.6;
        `,
        priority: 100,
        aboveFold: true,
        source: 'global'
      },
      {
        selector: '*',
        declaration: `
          box-sizing: border-box;
        `,
        priority: 99,
        aboveFold: true,
        source: 'global'
      },
      {
        selector: '.MuiContainer-root',
        declaration: `
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
        `,
        priority: 90,
        aboveFold: true,
        source: 'component'
      },
      {
        selector: '.MuiCard-root',
        declaration: `
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(255, 183, 77, 0.15);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        `,
        priority: 85,
        aboveFold: true,
        source: 'component'
      }
    ];
  }

  /**
   * CSS crítico específico de componente
   */
  private getComponentCriticalCSS(component: string): CriticalCSSRule[] {
    const componentStyles: Record<string, CriticalCSSRule[]> = {
      'WelcomeWidget': [
        {
          selector: '.welcome-widget',
          declaration: `
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 32px;
            text-align: center;
          `,
          priority: 80,
          aboveFold: true,
          source: 'component'
        }
      ],
      'QuickActionsGrid': [
        {
          selector: '.quick-actions-grid',
          declaration: `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin: 24px 0;
          `,
          priority: 75,
          aboveFold: true,
          source: 'component'
        }
      ],
      'UPlayDashboard': [
        {
          selector: '.uplay-dashboard',
          declaration: `
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 24px;
            padding: 16px;
          `,
          priority: 75,
          aboveFold: true,
          source: 'component'
        }
      ],
      'VideoPlayer': [
        {
          selector: '.video-player-container',
          declaration: `
            position: relative;
            width: 100%;
            aspect-ratio: 16/9;
            border-radius: 12px;
            overflow: hidden;
          `,
          priority: 78,
          aboveFold: true,
          source: 'component'
        }
      ],
      'CoomunityDataTable': [
        {
          selector: '.coomunity-data-table',
          declaration: `
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          `,
          priority: 70,
          aboveFold: true,
          source: 'component'
        }
      ]
    };

    return componentStyles[component] || [];
  }

  /**
   * CSS crítico del elemento filosófico
   */
  private getElementCriticalCSS(element: string): CriticalCSSRule[] {
    const elementStyles: Record<string, CriticalCSSRule[]> = {
      'fuego': [
        {
          selector: '.element-fuego',
          declaration: `
            --primary-color: #ff6b35;
            --secondary-color: #ffb347;
            --accent-color: #ff8c42;
            --glow-color: rgba(255, 107, 53, 0.3);
          `,
          priority: 60,
          aboveFold: true,
          source: 'element'
        }
      ],
      'agua': [
        {
          selector: '.element-agua',
          declaration: `
            --primary-color: #4fb3d1;
            --secondary-color: #a8e6cf;
            --accent-color: #66c2e0;
            --glow-color: rgba(79, 179, 209, 0.3);
          `,
          priority: 60,
          aboveFold: true,
          source: 'element'
        }
      ],
      'tierra': [
        {
          selector: '.element-tierra',
          declaration: `
            --primary-color: #8fbc8f;
            --secondary-color: #daa520;
            --accent-color: #9acd32;
            --glow-color: rgba(143, 188, 143, 0.3);
          `,
          priority: 60,
          aboveFold: true,
          source: 'element'
        }
      ],
      'aire': [
        {
          selector: '.element-aire',
          declaration: `
            --primary-color: #87ceeb;
            --secondary-color: #e0e0e0;
            --accent-color: #b0e0e6;
            --glow-color: rgba(135, 206, 235, 0.3);
          `,
          priority: 60,
          aboveFold: true,
          source: 'element'
        }
      ],
      'espiritu': [
        {
          selector: '.element-espiritu',
          declaration: `
            --primary-color: #dda0dd;
            --secondary-color: #ffd700;
            --accent-color: #e6e6fa;
            --glow-color: rgba(221, 160, 221, 0.3);
          `,
          priority: 60,
          aboveFold: true,
          source: 'element'
        }
      ]
    };

    return elementStyles[element] || [];
  }

  /**
   * CSS crítico de animaciones esenciales
   */
  private getAnimationCriticalCSS(): CriticalCSSRule[] {
    return [
      {
        selector: '.cosmic-glow',
        declaration: `
          box-shadow: 0 0 20px var(--glow-color, rgba(255, 183, 77, 0.3));
          transition: all 0.3s ease-in-out;
        `,
        priority: 50,
        aboveFold: true,
        source: 'animation'
      },
      {
        selector: '.fade-in',
        declaration: `
          animation: fadeIn 0.6s ease-in-out;
        `,
        priority: 45,
        aboveFold: true,
        source: 'animation'
      },
      {
        selector: '@keyframes fadeIn',
        declaration: `
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        `,
        priority: 45,
        aboveFold: true,
        source: 'animation'
      }
    ];
  }

  /**
   * Ensamblar CSS crítico final
   */
  private assembleCriticalCSS(rules: CriticalCSSRule[]): string {
    let css = '/* 🌌 CoomÜnity Critical CSS - Fase 5 Optimization */\n\n';

    for (const rule of rules) {
      if (rule.selector.startsWith('@keyframes')) {
        css += `${rule.selector} {\n${rule.declaration.trim()}\n}\n\n`;
      } else {
        css += `${rule.selector} {\n${rule.declaration.trim()}\n}\n\n`;
      }
    }

    return css;
  }

  /**
   * Optimizar y minimizar CSS crítico
   */
  private optimizeCriticalCSS(css: string): string {
    return css
      .replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '') // Remover comentarios
      .replace(/\s+/g, ' ') // Colapsar espacios
      .replace(/;\s*}/g, '}') // Remover ; antes de }
      .replace(/,\s+/g, ',') // Minimizar espacios en selectores
      .trim();
  }

  /**
   * CSS por defecto para rutas sin configuración
   */
  private getDefaultCriticalCSS(): string {
    return `
      body{margin:0;padding:0;font-family:'Roboto',Arial,sans-serif;background-color:#fffefb;color:#2c2c2c}
      *{box-sizing:border-box}
      .MuiCard-root{border-radius:16px;box-shadow:0 2px 12px rgba(255,183,77,0.15)}
      .cosmic-glow{box-shadow:0 0 20px rgba(255,183,77,0.3);transition:all 0.3s ease-in-out}
    `;
  }

  /**
   * Actualizar métricas de performance
   */
  private updateMetrics(originalSize: number, optimizedSize: number, extractionTime: number): void {
    this.metrics = {
      originalSize,
      criticalSize: optimizedSize,
      reduction: ((originalSize - optimizedSize) / originalSize) * 100,
      inlineSize: optimizedSize,
      firstPaintImprovement: Math.min((originalSize - optimizedSize) / 100, 50), // Estimación
      lastUpdated: Date.now()
    };

    // Guardar métricas en localStorage
    localStorage.setItem('coomunity-critical-css-metrics', JSON.stringify(this.metrics));
  }

  /**
   * Inicializar métricas
   */
  private initializeMetrics(): CSSOptimizationMetrics {
    const stored = localStorage.getItem('coomunity-critical-css-metrics');
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      originalSize: 0,
      criticalSize: 0,
      reduction: 0,
      inlineSize: 0,
      firstPaintImprovement: 0,
      lastUpdated: Date.now()
    };
  }

  /**
   * Configurar Performance Observer para Web Vitals
   */
  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const fcp = entry.startTime;
            console.log(`📊 First Contentful Paint: ${Math.round(fcp)}ms`);

            // Actualizar estimación de mejora
            this.metrics.firstPaintImprovement = Math.max(0, 800 - fcp); // 800ms era el baseline
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    }
  }

  /**
   * Inyectar CSS crítico en el DOM
   */
  async injectCriticalCSS(route: string): Promise<void> {
    const criticalCSS = await this.extractCriticalCSS(route);

    // Verificar si ya existe
    const existingStyle = document.getElementById('coomunity-critical-css');
    if (existingStyle) {
      existingStyle.textContent = criticalCSS;
      return;
    }

    // Crear nuevo style element
    const style = document.createElement('style');
    style.id = 'coomunity-critical-css';
    style.textContent = criticalCSS;

    // Insertar al inicio del head para máxima prioridad
    document.head.insertBefore(style, document.head.firstChild);

    console.log('✅ Critical CSS injected for route:', route);
  }

  /**
   * Obtener reporte de optimización
   */
  getOptimizationReport(): {
    metrics: CSSOptimizationMetrics;
    score: number;
    recommendations: string[];
  } {
    const score = Math.min(100, Math.round(
      (this.metrics.reduction * 0.4) + // 40% weight for size reduction
      (this.metrics.firstPaintImprovement * 0.6) // 60% weight for FCP improvement
    ));

    const recommendations: string[] = [];

    if (this.metrics.reduction < 40) {
      recommendations.push('Consider removing more non-critical CSS rules');
    }

    if (this.metrics.firstPaintImprovement < 200) {
      recommendations.push('Implement more aggressive CSS inlining');
    }

    if (this.metrics.criticalSize > 14000) {
      recommendations.push('Critical CSS size exceeds 14KB recommendation');
    }

    return {
      metrics: this.metrics,
      score,
      recommendations
    };
  }

  /**
   * Habilitar/deshabilitar optimización
   */
  setOptimizationEnabled(enabled: boolean): void {
    this.isOptimizationEnabled = enabled;
    console.log(`🔧 Critical CSS optimization ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Limpiar cache de CSS crítico
   */
  clearCache(): void {
    this.extractedCSS.clear();
    localStorage.removeItem('coomunity-critical-css-metrics');
    console.log('🧹 Critical CSS cache cleared');
  }
}

// Exportar instancia singleton
export const criticalCSSExtractor = CriticalCSSExtractor.getInstance();
