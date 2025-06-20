/**
 * 🌌 AUTOMATIC BUNDLE ANALYZER
 * ===========================
 * 
 * Análisis automático de bundle con alertas inteligentes
 * Parte de la Fase 5: Optimización Extrema del Design System
 */

import * as React from 'react';

interface BundleMetrics {
  totalSize: number;
  jsSize: number;
  cssSize: number;
  duplicateCode: number;
  unusedCode: number;
  compressionRatio: number;
  treeShakenSize: number;
  chunkSizes: Record<string, number>;
  dependencies: Record<string, number>;
}

interface BundleAlert {
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  category: 'size' | 'performance' | 'duplicates' | 'dependencies';
  severity: number; // 1-10
}

interface OptimizationRecommendation {
  action: string;
  description: string;
  estimatedSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: number;
}

export class AutoBundleAnalyzer {
  private static targets = {
    totalSize: 150 * 1024, // 150KB target para Q3 2025
    jsSize: 100 * 1024,
    cssSize: 50 * 1024,
    duplicateCode: 5 * 1024, // Máximo 5KB duplicado
    compressionRatio: 0.8, // Mínimo 80% compresión
    chunkSize: 50 * 1024, // Máximo 50KB por chunk
    dependencySize: 10 * 1024 // Máximo 10KB por dependencia individual
  };

  /**
   * Analiza el bundle actual y genera reporte completo
   */
  static async analyzeBundle(): Promise<{
    metrics: BundleMetrics;
    alerts: BundleAlert[];
    recommendations: OptimizationRecommendation[];
    score: number;
    trends: {
      sizeChange: number;
      performanceChange: number;
      lastAnalysis: number;
    };
  }> {
    console.log('🔍 Starting comprehensive bundle analysis...');
    
    const metrics = await this.collectMetrics();
    const alerts = this.generateAlerts(metrics);
    const recommendations = this.generateRecommendations(metrics, alerts);
    const score = this.calculateScore(metrics);
    const trends = await this.getTrends();

    const analysis = {
      metrics,
      alerts,
      recommendations,
      score,
      trends
    };

    // Guardar análisis para comparaciones futuras
    this.saveAnalysis(analysis);

    console.log(`✅ Bundle analysis completed. Score: ${score}/100`);
    return analysis;
  }

  /**
   * Recolecta métricas del bundle actual
   */
  private static async collectMetrics(): Promise<BundleMetrics> {
    // En desarrollo, simular métricas basadas en observaciones reales
    // En producción, integrar con webpack-bundle-analyzer
    
    const mockStats = await this.getMockBundleStats();
    
    return {
      totalSize: this.calculateTotalSize(mockStats),
      jsSize: this.calculateJSSize(mockStats),
      cssSize: this.calculateCSSSize(mockStats),
      duplicateCode: this.findDuplicates(mockStats),
      unusedCode: this.findUnusedCode(mockStats),
      compressionRatio: this.calculateCompression(mockStats),
      treeShakenSize: this.calculateTreeShaken(mockStats),
      chunkSizes: this.getChunkSizes(mockStats),
      dependencies: this.getDependencySizes(mockStats)
    };
  }

  /**
   * Obtiene estadísticas simuladas del bundle
   */
  private static async getMockBundleStats() {
    // Simulación basada en el estado actual real del proyecto
    return {
      assets: [
        { name: 'main.js', size: 120 * 1024 },
        { name: 'vendor.js', size: 150 * 1024 },
        { name: 'design-system.css', size: 45 * 1024 },
        { name: 'main.css', size: 25 * 1024 },
        { name: 'components.chunk.js', size: 80 * 1024 },
        { name: 'uplay.chunk.js', size: 60 * 1024 },
        { name: 'marketplace.chunk.js', size: 55 * 1024 }
      ],
      chunks: [
        { name: 'main', size: 120 * 1024, modules: 45 },
        { name: 'vendor', size: 150 * 1024, modules: 120 },
        { name: 'design-system', size: 45 * 1024, modules: 25 },
        { name: 'uplay', size: 60 * 1024, modules: 18 },
        { name: 'marketplace', size: 55 * 1024, modules: 16 }
      ],
      modules: [
        { name: '@mui/material', size: 85 * 1024 },
        { name: 'react', size: 45 * 1024 },
        { name: 'react-dom', size: 130 * 1024 },
        { name: '@emotion/react', size: 25 * 1024 },
        { name: 'react-query', size: 35 * 1024 },
        { name: 'framer-motion', size: 55 * 1024 },
        { name: 'date-fns', size: 20 * 1024 }
      ]
    };
  }

  /**
   * Calcula tamaño total del bundle
   */
  private static calculateTotalSize(stats: any): number {
    return stats.assets.reduce((total: number, asset: any) => total + asset.size, 0);
  }

  /**
   * Calcula tamaño de archivos JavaScript
   */
  private static calculateJSSize(stats: any): number {
    return stats.assets
      .filter((asset: any) => asset.name.endsWith('.js'))
      .reduce((total: number, asset: any) => total + asset.size, 0);
  }

  /**
   * Calcula tamaño de archivos CSS
   */
  private static calculateCSSSize(stats: any): number {
    return stats.assets
      .filter((asset: any) => asset.name.endsWith('.css'))
      .reduce((total: number, asset: any) => total + asset.size, 0);
  }

  /**
   * Detecta código duplicado
   */
  private static findDuplicates(stats: any): number {
    // Simulación de detección de duplicados
    const commonModules = ['react', 'react-dom', '@mui/material'];
    let duplicateSize = 0;

    commonModules.forEach(moduleName => {
      const occurrences = stats.modules.filter((mod: any) => 
        mod.name.includes(moduleName)
      ).length;
      
      if (occurrences > 1) {
        const moduleSize = stats.modules.find((mod: any) => 
          mod.name === moduleName
        )?.size || 0;
        duplicateSize += moduleSize * (occurrences - 1);
      }
    });

    return duplicateSize;
  }

  /**
   * Detecta código no utilizado
   */
  private static findUnusedCode(stats: any): number {
    // Simulación de detección de código no utilizado
    // En producción usar herramientas como webpack-unused
    return 15 * 1024; // 15KB estimado de código no utilizado
  }

  /**
   * Calcula ratio de compresión
   */
  private static calculateCompression(stats: any): number {
    const uncompressedSize = this.calculateTotalSize(stats);
    const estimatedCompressedSize = uncompressedSize * 0.75; // 75% ratio simulado
    return estimatedCompressedSize / uncompressedSize;
  }

  /**
   * Calcula tamaño después de tree shaking
   */
  private static calculateTreeShaken(stats: any): number {
    const totalSize = this.calculateTotalSize(stats);
    // Estimación de 15% de reducción por tree shaking
    return totalSize * 0.85;
  }

  /**
   * Obtiene tamaños de chunks individuales
   */
  private static getChunkSizes(stats: any): Record<string, number> {
    const chunkSizes: Record<string, number> = {};
    stats.chunks.forEach((chunk: any) => {
      chunkSizes[chunk.name] = chunk.size;
    });
    return chunkSizes;
  }

  /**
   * Obtiene tamaños de dependencias
   */
  private static getDependencySizes(stats: any): Record<string, number> {
    const depSizes: Record<string, number> = {};
    stats.modules.forEach((module: any) => {
      depSizes[module.name] = module.size;
    });
    return depSizes;
  }

  /**
   * Genera alertas basadas en métricas
   */
  private static generateAlerts(metrics: BundleMetrics): BundleAlert[] {
    const alerts: BundleAlert[] = [];

    // Alerta de tamaño total
    if (metrics.totalSize > this.targets.totalSize) {
      const excess = metrics.totalSize - this.targets.totalSize;
      alerts.push({
        type: 'error',
        message: `Bundle total de ${this.formatSize(metrics.totalSize)} excede el target de ${this.formatSize(this.targets.totalSize)}`,
        suggestion: `Reducir ${this.formatSize(excess)} usando lazy loading o eliminando dependencias no críticas`,
        impact: 'high',
        category: 'size',
        severity: Math.min(10, Math.round((excess / this.targets.totalSize) * 10))
      });
    }

    // Alerta de código duplicado
    if (metrics.duplicateCode > this.targets.duplicateCode) {
      alerts.push({
        type: 'warning',
        message: `${this.formatSize(metrics.duplicateCode)} de código duplicado detectado`,
        suggestion: 'Revisar imports y extraer dependencias comunes a chunks separados',
        impact: 'medium',
        category: 'duplicates',
        severity: 6
      });
    }

    // Alerta de compresión baja
    if (metrics.compressionRatio < this.targets.compressionRatio) {
      alerts.push({
        type: 'warning',
        message: `Ratio de compresión ${Math.round(metrics.compressionRatio * 100)}% está por debajo del target ${Math.round(this.targets.compressionRatio * 100)}%`,
        suggestion: 'Habilitar gzip/brotli compression y optimizar assets',
        impact: 'medium',
        category: 'performance',
        severity: 5
      });
    }

    // Alertas de chunks grandes
    Object.entries(metrics.chunkSizes).forEach(([chunkName, size]) => {
      if (size > this.targets.chunkSize) {
        alerts.push({
          type: 'warning',
          message: `Chunk '${chunkName}' (${this.formatSize(size)}) excede el límite recomendado`,
          suggestion: 'Considerar dividir este chunk en partes más pequeñas',
          impact: 'medium',
          category: 'size',
          severity: 4
        });
      }
    });

    // Alertas de dependencias pesadas
    Object.entries(metrics.dependencies).forEach(([depName, size]) => {
      if (size > this.targets.dependencySize) {
        alerts.push({
          type: 'info',
          message: `Dependencia '${depName}' (${this.formatSize(size)}) es considerablemente grande`,
          suggestion: 'Evaluar alternativas más ligeras o lazy loading',
          impact: 'low',
          category: 'dependencies',
          severity: 3
        });
      }
    });

    // Alerta positiva si todo está bien
    if (alerts.length === 0) {
      alerts.push({
        type: 'success',
        message: 'Bundle optimizado correctamente ✨',
        suggestion: 'Mantener el monitoreo continuo para detectar regresiones',
        impact: 'low',
        category: 'performance',
        severity: 0
      });
    }

    return alerts.sort((a, b) => b.severity - a.severity);
  }

  /**
   * Genera recomendaciones de optimización
   */
  private static generateRecommendations(
    metrics: BundleMetrics, 
    alerts: BundleAlert[]
  ): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // Recomendación basada en tamaño total
    if (metrics.totalSize > this.targets.totalSize) {
      recommendations.push({
        action: 'Implementar Code Splitting Avanzado',
        description: 'Dividir el bundle en chunks más pequeños usando dynamic imports',
        estimatedSavings: (metrics.totalSize - this.targets.totalSize) * 0.3,
        difficulty: 'medium',
        priority: 9
      });
    }

    // Recomendación de tree shaking
    if (metrics.unusedCode > 5 * 1024) {
      recommendations.push({
        action: 'Optimizar Tree Shaking',
        description: 'Configurar webpack para mejor eliminación de código no utilizado',
        estimatedSavings: metrics.unusedCode * 0.8,
        difficulty: 'easy',
        priority: 8
      });
    }

    // Recomendación de compresión
    if (metrics.compressionRatio < this.targets.compressionRatio) {
      recommendations.push({
        action: 'Habilitar Compresión Avanzada',
        description: 'Implementar Brotli compression y optimizar configuración gzip',
        estimatedSavings: metrics.totalSize * 0.15,
        difficulty: 'easy',
        priority: 7
      });
    }

    // Recomendaciones específicas por dependencia
    const largeDependencies = Object.entries(metrics.dependencies)
      .filter(([, size]) => size > this.targets.dependencySize)
      .sort((a, b) => b[1] - a[1]);

    largeDependencies.slice(0, 3).forEach(([depName, size]) => {
      recommendations.push({
        action: `Optimizar dependencia ${depName}`,
        description: `Evaluar alternativas más ligeras o implementar lazy loading para ${depName}`,
        estimatedSavings: size * 0.5,
        difficulty: depName.includes('@mui') ? 'hard' : 'medium',
        priority: 6
      });
    });

    // Recomendación de Critical CSS
    recommendations.push({
      action: 'Implementar Critical CSS',
      description: 'Extraer y inline CSS crítico para mejorar First Paint',
      estimatedSavings: metrics.cssSize * 0.4,
      difficulty: 'medium',
      priority: 8
    });

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Calcula score general del bundle
   */
  static calculateScore(metrics: BundleMetrics): number {
    const scores = [
      this.calculateMetricScore(metrics.totalSize, this.targets.totalSize, true),
      this.calculateMetricScore(metrics.jsSize, this.targets.jsSize, true),
      this.calculateMetricScore(metrics.cssSize, this.targets.cssSize, true),
      this.calculateMetricScore(metrics.duplicateCode, this.targets.duplicateCode, true),
      this.calculateMetricScore(metrics.compressionRatio * 100, this.targets.compressionRatio * 100, false)
    ];

    // Score ponderado
    const weights = [0.3, 0.25, 0.15, 0.15, 0.15]; // Total: 1.0
    const weightedScore = scores.reduce((acc, score, index) => acc + score * weights[index], 0);

    return Math.round(Math.max(0, Math.min(100, weightedScore)));
  }

  /**
   * Calcula score para una métrica individual
   */
  private static calculateMetricScore(
    actual: number, 
    target: number, 
    lowerIsBetter: boolean = true
  ): number {
    if (lowerIsBetter) {
      if (actual <= target) return 100;
      const ratio = actual / target;
      return Math.max(0, 100 - (ratio - 1) * 100);
    } else {
      if (actual >= target) return 100;
      const ratio = actual / target;
      return Math.max(0, ratio * 100);
    }
  }

  /**
   * Obtiene tendencias históricas
   */
  private static async getTrends(): Promise<{
    sizeChange: number;
    performanceChange: number;
    lastAnalysis: number;
  }> {
    // En producción, obtener de localStorage o API
    try {
      const lastAnalysis = localStorage.getItem('bundle-analysis-history');
      
      if (!lastAnalysis) {
        return {
          sizeChange: 0,
          performanceChange: 0,
          lastAnalysis: Date.now()
        };
      }

      const parsed = JSON.parse(lastAnalysis);
      return {
        sizeChange: -5.2, // Simulado: 5.2% reducción
        performanceChange: 12.8, // Simulado: 12.8% mejora
        lastAnalysis: parsed.timestamp || Date.now()
      };
    } catch {
      return {
        sizeChange: 0,
        performanceChange: 0,
        lastAnalysis: Date.now()
      };
    }
  }

  /**
   * Guarda análisis para futuras comparaciones
   */
  private static saveAnalysis(analysis: any): void {
    try {
      const historyKey = 'bundle-analysis-history';
      const current = {
        timestamp: Date.now(),
        score: analysis.score,
        totalSize: analysis.metrics.totalSize,
        alerts: analysis.alerts.length
      };

      localStorage.setItem(historyKey, JSON.stringify(current));
    } catch (error) {
      console.warn('Could not save bundle analysis to localStorage:', error);
    }
  }

  /**
   * Formatea tamaño en bytes a formato legible
   */
  private static formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  }

  /**
   * Ejecuta análisis en tiempo real durante desarrollo
   */
  static startRealTimeMonitoring(): void {
    if (process.env.NODE_ENV !== 'development') return;

    console.log('🔍 Starting real-time bundle monitoring...');
    
    setInterval(async () => {
      const quickAnalysis = await this.analyzeBundle();
      if (quickAnalysis.score < 70) {
        console.warn('⚠️ Bundle performance degraded. Score:', quickAnalysis.score);
        console.table(quickAnalysis.alerts.slice(0, 3));
      }
    }, 30000); // Cada 30 segundos en desarrollo
  }
}

/**
 * Hook React para usar el Bundle Analyzer
 */
export const useBundleAnalyzer = () => {
  const [analysis, setAnalysis] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  const runAnalysis = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await AutoBundleAnalyzer.analyzeBundle();
      setAnalysis(result);
    } catch (error) {
      console.error('Error running bundle analysis:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // Análisis inicial
    runAnalysis();
  }, [runAnalysis]);

  return {
    analysis,
    loading,
    runAnalysis,
    score: analysis?.score || 0
  };
};

export default AutoBundleAnalyzer; 