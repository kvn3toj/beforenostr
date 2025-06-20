import { useCallback } from 'react';
import type { QueryPerformance, ApiMetrics, ErrorMetrics, PerformanceMetrics } from './useMetricsCollection';

interface AggregatedMetrics {
  avgQueryTime: number;
  avgApiTime: number;
  cacheHitRate: number;
  prefetchRate: number;
  successRate: number;
  errorRate: number;
  totalQueries: number;
  totalApis: number;
  totalErrors: number;
}

interface PerformancePattern {
  type: string;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  recommendation: string;
}

interface PerformanceTrend {
  pageLoadTime: {
    trend: 'increasing' | 'decreasing';
    change: number;
    percentage: number;
  };
  cacheHitRate: {
    trend: 'increasing' | 'decreasing';
    change: number;
    percentage: number;
  };
  errorRate: {
    trend: 'increasing' | 'decreasing';
    change: number;
    percentage: number;
  };
}

/**
 * 📊 Hook para Análisis de Métricas
 * Maneja el análisis y agregación de métricas sin dependencias circulares
 */
export const useMetricsAnalysis = () => {
  /**
   * 📊 Calcular métricas agregadas
   */
  const getAggregatedMetrics = useCallback(
    (
      queryMetrics: QueryPerformance[],
      apiMetrics: ApiMetrics[],
      errorMetrics: ErrorMetrics[]
    ): AggregatedMetrics => {
      const recentQueries = queryMetrics.slice(-20); // Últimas 20 queries
      const recentApis = apiMetrics.slice(-20); // Últimas 20 APIs
      const recentErrors = errorMetrics.slice(-10); // Últimos 10 errores

      const totalQueries = recentQueries.length;
      const totalApis = recentApis.length;
      const totalErrors = recentErrors.length;

      if (totalQueries === 0 && totalApis === 0) {
        return {
          avgQueryTime: 0,
          avgApiTime: 0,
          cacheHitRate: 0,
          prefetchRate: 0,
          successRate: 0,
          errorRate: 0,
          totalQueries: 0,
          totalApis: 0,
          totalErrors: 0,
        };
      }

      // Métricas de queries
      const avgQueryTime =
        totalQueries > 0
          ? recentQueries.reduce((sum, q) => sum + q.duration, 0) / totalQueries
          : 0;
      const cacheHits = recentQueries.filter((q) => q.cacheHit).length;
      const prefetched = recentQueries.filter((q) => q.prefetched).length;
      const cacheHitRate =
        totalQueries > 0 ? (cacheHits / totalQueries) * 100 : 0;
      const prefetchRate =
        totalQueries > 0 ? (prefetched / totalQueries) * 100 : 0;

      // Métricas de APIs
      const avgApiTime =
        totalApis > 0
          ? recentApis.reduce((sum, a) => sum + a.duration, 0) / totalApis
          : 0;
      const successfulApis = recentApis.filter((a) => a.success).length;
      const successRate = totalApis > 0 ? (successfulApis / totalApis) * 100 : 0;

      // Métricas de errores
      const errorRate =
        totalErrors > 0 ? (totalErrors / (totalQueries + totalApis)) * 100 : 0;

      return {
        avgQueryTime: Math.round(avgQueryTime),
        avgApiTime: Math.round(avgApiTime),
        cacheHitRate: Math.round(cacheHitRate),
        prefetchRate: Math.round(prefetchRate),
        successRate: Math.round(successRate),
        errorRate: Math.round(errorRate),
        totalQueries,
        totalApis,
        totalErrors,
      };
    },
    []
  );

  /**
   * 🎯 Detectar patrones de rendimiento
   */
  const analyzePerformancePatterns = useCallback(
    (metrics: AggregatedMetrics): PerformancePattern[] => {
      const patterns: PerformancePattern[] = [];

      // Detectar problemas de rendimiento
      if (metrics.avgQueryTime > 1000) {
        patterns.push({
          type: 'slow-queries',
          message: `Queries promedio de ${metrics.avgQueryTime}ms (>1s)`,
          severity: 'warning',
          recommendation: 'Considerar optimizar queries o implementar más cache',
        });
      }

      if (metrics.avgApiTime > 2000) {
        patterns.push({
          type: 'slow-apis',
          message: `APIs promedio de ${metrics.avgApiTime}ms (>2s)`,
          severity: 'warning',
          recommendation: 'Verificar latencia de red o optimizar endpoints',
        });
      }

      if (metrics.cacheHitRate < 50) {
        patterns.push({
          type: 'low-cache-hit',
          message: `Cache hit rate bajo: ${metrics.cacheHitRate}% (<50%)`,
          severity: 'warning',
          recommendation: 'Revisar estrategias de cache y staleTime',
        });
      }

      if (metrics.prefetchRate < 20) {
        patterns.push({
          type: 'low-prefetch',
          message: `Prefetch rate bajo: ${metrics.prefetchRate}% (<20%)`,
          severity: 'info',
          recommendation: 'Implementar más prefetching inteligente',
        });
      }

      if (metrics.errorRate > 10) {
        patterns.push({
          type: 'high-error-rate',
          message: `Tasa de errores alta: ${metrics.errorRate}% (>10%)`,
          severity: 'error',
          recommendation: 'Investigar y resolver errores frecuentes',
        });
      }

      if (metrics.successRate < 90) {
        patterns.push({
          type: 'low-success-rate',
          message: `Tasa de éxito baja: ${metrics.successRate}% (<90%)`,
          severity: 'warning',
          recommendation: 'Mejorar manejo de errores y retry logic',
        });
      }

      // Detectar optimizaciones exitosas
      if (metrics.cacheHitRate > 80) {
        patterns.push({
          type: 'excellent-caching',
          message: `Excelente cache hit rate: ${metrics.cacheHitRate}%`,
          severity: 'success',
          recommendation: 'Mantener estrategia actual de cache',
        });
      }

      if (metrics.avgQueryTime < 200) {
        patterns.push({
          type: 'fast-queries',
          message: `Queries rápidas: ${metrics.avgQueryTime}ms promedio`,
          severity: 'success',
          recommendation: 'Excelente performance de queries',
        });
      }

      if (metrics.prefetchRate > 60) {
        patterns.push({
          type: 'excellent-prefetch',
          message: `Excelente prefetch rate: ${metrics.prefetchRate}%`,
          severity: 'success',
          recommendation: 'Estrategia de prefetching muy efectiva',
        });
      }

      return patterns;
    },
    []
  );

  /**
   * 📈 Obtener tendencias de performance
   */
  const getPerformanceTrends = useCallback(
    (performanceMetrics: PerformanceMetrics[]): PerformanceTrend | null => {
      const recentMetrics = performanceMetrics.slice(-10);
      if (recentMetrics.length < 2) return null;

      const first = recentMetrics[0];
      const last = recentMetrics[recentMetrics.length - 1];

      return {
        pageLoadTime: {
          trend:
            last.pageLoadTime > first.pageLoadTime ? 'increasing' : 'decreasing',
          change: Math.abs(last.pageLoadTime - first.pageLoadTime),
          percentage:
            ((last.pageLoadTime - first.pageLoadTime) / first.pageLoadTime) * 100,
        },
        cacheHitRate: {
          trend:
            last.cacheHitRate > first.cacheHitRate ? 'increasing' : 'decreasing',
          change: Math.abs(last.cacheHitRate - first.cacheHitRate),
          percentage:
            first.cacheHitRate > 0
              ? ((last.cacheHitRate - first.cacheHitRate) / first.cacheHitRate) *
                100
              : 0,
        },
        errorRate: {
          trend: last.errorRate > first.errorRate ? 'increasing' : 'decreasing',
          change: Math.abs(last.errorRate - first.errorRate),
          percentage:
            first.errorRate > 0
              ? ((last.errorRate - first.errorRate) / first.errorRate) * 100
              : 0,
        },
      };
    },
    []
  );

  return {
    getAggregatedMetrics,
    analyzePerformancePatterns,
    getPerformanceTrends,
  };
}; 