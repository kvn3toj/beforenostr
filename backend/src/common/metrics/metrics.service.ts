import { Injectable, Logger } from '@nestjs/common';
import {
  register,
  collectDefaultMetrics,
  Counter,
  Histogram,
  Gauge,
} from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  // Contadores
  public readonly httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  public readonly apiErrorsTotal = new Counter({
    name: 'api_errors_total',
    help: 'Total number of API errors',
    labelNames: ['error_type', 'endpoint'],
  });

  public readonly cacheOperationsTotal = new Counter({
    name: 'cache_operations_total',
    help: 'Total number of cache operations',
    labelNames: ['operation', 'result'],
  });

  public readonly videoDurationMethodsTotal = new Counter({
    name: 'video_duration_methods_total',
    help: 'Total number of video duration calculations by method',
    labelNames: ['method', 'success'],
  });

  public readonly cronJobExecutionsTotal = new Counter({
    name: 'cron_job_executions_total',
    help: 'Total number of cron job executions',
    labelNames: ['job_name', 'status'],
  });

  // Histogramas para tiempos de respuesta
  public readonly httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  });

  public readonly videoDurationCalculationTime = new Histogram({
    name: 'video_duration_calculation_seconds',
    help: 'Time taken to calculate video duration in seconds',
    labelNames: ['method'],
    buckets: [0.5, 1, 2, 5, 10, 30, 60],
  });

  public readonly databaseQueryDuration = new Histogram({
    name: 'database_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'table'],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  });

  // Gauges para estado actual
  public readonly cacheHitRatio = new Gauge({
    name: 'cache_hit_ratio',
    help: 'Cache hit ratio (0-1)',
  });

  public readonly activeConnections = new Gauge({
    name: 'active_connections',
    help: 'Number of active database connections',
  });

  public readonly lastCronJobExecution = new Gauge({
    name: 'last_cron_job_execution_timestamp',
    help: 'Timestamp of last cron job execution',
    labelNames: ['job_name'],
  });

  public readonly systemMemoryUsage = new Gauge({
    name: 'system_memory_usage_bytes',
    help: 'System memory usage in bytes',
    labelNames: ['type'],
  });

  constructor() {
    this.logger.log(
      '>>> MetricsService CONSTRUCTOR: Initializing Prometheus metrics'
    );

    try {
      // Limpiar registry existente para evitar duplicados
      register.clear();

      // Crear nuevos contadores después de limpiar
      this.httpRequestsTotal = new Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'status_code'],
      });

      // Registrar métricas por defecto del sistema
      collectDefaultMetrics({ register });

      this.logger.log('✅ Prometheus metrics initialized successfully');
    } catch (error) {
      this.logger.error('❌ Error initializing metrics:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las métricas en formato Prometheus
   */
  async getMetrics(): Promise<string> {
    try {
      return await register.metrics();
    } catch (error) {
      this.logger.error('Error getting metrics:', error);
      throw error;
    }
  }

  /**
   * Incrementar contador de requests HTTP
   */
  incrementHttpRequests(
    method: string,
    route: string,
    statusCode: number
  ): void {
    this.httpRequestsTotal.inc({
      method,
      route,
      status_code: statusCode.toString(),
    });
  }

  /**
   * Observar duración de request HTTP
   */
  observeHttpDuration(
    method: string,
    route: string,
    durationSeconds: number
  ): void {
    this.httpRequestDuration.observe({ method, route }, durationSeconds);
  }

  /**
   * Incrementar contador de errores de API
   */
  incrementApiErrors(errorType: string, endpoint: string): void {
    this.apiErrorsTotal.inc({ error_type: errorType, endpoint });
  }

  /**
   * Incrementar operaciones de caché
   */
  incrementCacheOperations(
    operation: 'get' | 'set' | 'del',
    result: 'hit' | 'miss' | 'success' | 'error'
  ): void {
    this.cacheOperationsTotal.inc({ operation, result });
  }

  /**
   * Actualizar ratio de hit del caché
   */
  setCacheHitRatio(ratio: number): void {
    this.cacheHitRatio.set(ratio);
  }

  /**
   * Incrementar métodos de cálculo de duración de video
   */
  incrementVideoDurationMethods(
    method: 'api' | 'scraping' | 'oembed' | 'estimation',
    success: boolean
  ): void {
    this.videoDurationMethodsTotal.inc({
      method,
      success: success.toString(),
    });
  }

  /**
   * Observar tiempo de cálculo de duración de video
   */
  observeVideoDurationCalculation(
    method: string,
    durationSeconds: number
  ): void {
    this.videoDurationCalculationTime.observe({ method }, durationSeconds);
  }

  /**
   * Incrementar ejecuciones de cron jobs
   */
  incrementCronJobExecutions(
    jobName: string,
    status: 'success' | 'error'
  ): void {
    this.cronJobExecutionsTotal.inc({ job_name: jobName, status });
  }

  /**
   * Actualizar timestamp de última ejecución de cron job
   */
  setLastCronJobExecution(jobName: string): void {
    this.lastCronJobExecution.set({ job_name: jobName }, Date.now() / 1000);
  }

  /**
   * Observar duración de query de base de datos
   */
  observeDatabaseQuery(
    operation: string,
    table: string,
    durationSeconds: number
  ): void {
    this.databaseQueryDuration.observe({ operation, table }, durationSeconds);
  }

  /**
   * Actualizar conexiones activas
   */
  setActiveConnections(count: number): void {
    this.activeConnections.set(count);
  }

  /**
   * Actualizar uso de memoria del sistema
   */
  setSystemMemoryUsage(type: 'used' | 'free' | 'total', bytes: number): void {
    this.systemMemoryUsage.set({ type }, bytes);
  }

  /**
   * Limpiar todas las métricas (útil para tests)
   */
  clearMetrics(): void {
    register.clear();
    this.logger.log('All metrics cleared');
  }
}
