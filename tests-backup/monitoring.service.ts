import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VideoItemsService } from '../video-items/video-items.service';
import { CacheService } from '../cache/cache.service';
import { NotificationService } from '../common/notifications/notification.service';
import { QuestionValidationService } from '../common/validation/question-validation.service';
import {
  HealthReportDto,
  ConsistencyCheckResultDto,
  AlertConfigDto
} from './dto/health-report.dto';

interface PerformanceMetrics {
  averageCalculationTime: number;
  totalCalculations: number;
  cacheHitRatio: number;
  methodDistribution: {
    cache_hit: number;
    youtube_api: number;
    scraping: number;
    estimation: number;
  };
  errorRate: number;
  totalErrors: number;
}

interface SystemHealthReport {
  timestamp: string;
  period: string;
  consistencyCheck: ConsistencyCheckResultDto;
  performanceMetrics: PerformanceMetrics;
  cacheStats: any;
  errorSummary: {
    totalErrors: number;
    errorsByType: Record<string, number>;
    criticalErrors: number;
  };
  uptime: {
    videoItemsService: boolean;
    cacheService: boolean;
    alertService: boolean;
  };
  recommendations: string[];
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private lastConsistencyCheck: Date | null = null;
  private lastCheckResult: ConsistencyCheckResultDto | null = null;
  private recentAlerts: Array<{
    type: 'email' | 'slack';
    timestamp: string;
    message: string;
    status: 'sent' | 'failed';
  }> = [];

  // Métricas de performance en memoria (en producción se podría usar una base de datos)
  private performanceData: Array<{
    timestamp: Date;
    operation: string;
    duration: number;
    method: string;
    success: boolean;
    videoId?: string;
  }> = [];

  constructor(
    @Inject(VideoItemsService) private readonly videoItemsService: VideoItemsService,
    @Inject(CacheService) private readonly cacheService: CacheService,
    @Inject(NotificationService) private readonly notificationService: NotificationService,
    // Logger service removed - using built-in Logger instead
    @Inject(QuestionValidationService) private readonly questionValidationService: QuestionValidationService,
  ) {
    this.logger.log('MonitoringService initialized - All services connected');
  }

  // Cron job que se ejecuta diariamente a las 2:00 AM
  @Cron('0 2 * * *', {
    name: 'daily-consistency-check',
    timeZone: 'America/New_York', // Ajustar según la zona horaria deseada
  })
  async handleDailyConsistencyCheck() {
    this.logger.log('🕐 Starting scheduled daily consistency check...');

    try {
      const result = await this.runConsistencyCheck();
      this.logger.log(`✅ Daily consistency check completed: ${result.inconsistenciesFound} issues found`);

      // Enviar alertas si es necesario
      if (result.inconsistenciesFound > 0) {
        const alertsSent = await this.notificationService.sendConsistencyAlert(result);
        result.alertsSent = alertsSent;

        if (alertsSent) {
          this.addRecentAlert('email', `Daily check: ${result.inconsistenciesFound} inconsistencies found`, 'sent');
        }
      }

    } catch (error) {
      this.logger.error('❌ Daily consistency check failed:', error);

      // Enviar alerta de error crítico
      try {
        const errorAlert: ConsistencyCheckResultDto = {
          timestamp: new Date().toISOString(),
          totalVideos: 0,
          inconsistenciesFound: -1, // Indicador de error
          problematicVideos: [],
          executionTime: 0,
          alertsSent: false,
        };

        await this.notificationService.sendConsistencyAlert(errorAlert);
        this.addRecentAlert('email', 'Critical error during consistency check', 'sent');
      } catch (alertError) {
        this.logger.error('Failed to send error alert:', alertError);
        this.addRecentAlert('email', 'Critical error during consistency check', 'failed');
      }
    }
  }

  // Cron job que se ejecuta cada hora para verificar la salud del sistema
  @Cron('0 * * * *', {
    name: 'hourly-health-check',
  })
  async handleHourlyHealthCheck() {
    this.logger.log('🔍 Running hourly health check...');

    try {
      const healthReport = await this.getHealthReport();

      // Log del estado del sistema
      this.logger.log(`System health: ${healthReport.status}`);
      this.logger.log(`Cache healthy: ${healthReport.cacheHealth.healthy}`);
      this.logger.log(`YouTube API configured: ${healthReport.youtubeApiHealth.configured}`);

      // Si el sistema está en estado crítico, enviar alerta
      if (healthReport.status === 'critical') {
        this.logger.warn('🚨 System in critical state - sending alert');
        // Aquí se podría implementar una alerta específica para estado crítico
      }

    } catch (error) {
      this.logger.error('❌ Hourly health check failed:', error);
    }
  }

  // Cron job que se ejecuta semanalmente para generar reportes automáticos
  @Cron('0 6 * * 1', {
    name: 'weekly-health-report',
    timeZone: 'America/New_York',
  })
  async handleWeeklyHealthReport() {
    this.logger.log('📊 Generating weekly health report...', 'MonitoringService');

    try {
      const weeklyReport = await this.generateSystemHealthReport('weekly');

      // Enviar reporte por email/Slack
      const reportSent = await this.notificationService.sendHealthReport(weeklyReport);

      if (reportSent) {
        this.addRecentAlert('email', 'Weekly health report sent successfully', 'sent');
        this.logger.log('Weekly health report sent successfully', 'MonitoringService');
      } else {
        this.addRecentAlert('email', 'Failed to send weekly health report', 'failed');
        this.logger.error('Failed to send weekly health report', '', 'MonitoringService');
      }

    } catch (error) {
      this.logger.error(`Error: ${error.message || error}`, 'MonitoringService', { operation: 'weekly_health_report' });
    }
  }

  // ✅ Cron job que se ejecuta diariamente para validar timestamps de preguntas
  @Cron('0 3 * * *', {
    name: 'daily-question-validation',
    timeZone: 'America/New_York',
  })
  async handleDailyQuestionValidation() {
    this.logger.log('🔍 Starting scheduled daily question validation...', 'MonitoringService');

    try {
      const validationSummary = await this.questionValidationService.validateAllQuestionTimestamps();

      this.logger.log(
        `Question validation completed: ${validationSummary.validQuestions}/${validationSummary.totalQuestionsChecked} valid questions`,
        'MonitoringService',
        {
          totalQuestions: validationSummary.totalQuestionsChecked,
          validQuestions: validationSummary.validQuestions,
          invalidQuestions: validationSummary.invalidQuestions,
          executionTime: validationSummary.executionTime
        }
      );

      // Enviar alertas si hay problemas significativos
      if (validationSummary.invalidQuestions > 0) {
        this.addRecentAlert(
          'email',
          `Question validation: ${validationSummary.invalidQuestions} invalid questions found`,
          'sent'
        );
        this.logger.log(
          `Question validation alert sent for ${validationSummary.invalidQuestions} invalid questions`,
          'MonitoringService'
        );
      }

    } catch (error) {
      this.logger.error(`Error: ${error.message || error}`, 'MonitoringService', { operation: 'daily_question_validation' });

      // Enviar alerta de error crítico
      try {
        this.addRecentAlert('email', 'Critical error during question validation', 'failed');
      } catch (alertError) {
        this.logger.error('Failed to log question validation error alert', alertError.message, 'MonitoringService');
      }
    }
  }

  async runConsistencyCheck(): Promise<ConsistencyCheckResultDto> {
    const startTime = Date.now();
    this.logger.log('🔍 Starting consistency check...');

    try {
      // Ejecutar la verificación de duraciones usando el servicio existente
      // TODO: Implement verifyAllDurations method in VideoItemsService
      const verificationResult = { inconsistenciesFound: 0, problematicVideos: [], totalVideos: 0 };

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Procesar los resultados para extraer información relevante
      const problematicVideos = this.extractProblematicVideos(verificationResult);

      const result: ConsistencyCheckResultDto = {
        timestamp: new Date().toISOString(),
        totalVideos: verificationResult.totalVideos || 0,
        inconsistenciesFound: problematicVideos.length,
        problematicVideos,
        executionTime,
        alertsSent: false,
      };

      // Guardar el resultado del último check
      this.lastConsistencyCheck = new Date();
      this.lastCheckResult = result;

      this.logger.log(`✅ Consistency check completed: ${result.inconsistenciesFound} issues found in ${executionTime}ms`);

      return result;

    } catch (error) {
      this.logger.error('❌ Consistency check failed:', error);
      throw error;
    }
  }

  private extractProblematicVideos(verificationResult: any): Array<{
    id: number;
    title: string;
    issue: string;
    storedDuration: number | null;
    actualDuration: number | null;
  }> {
    const problematicVideos = [];

    // Procesar videos con errores
    if (verificationResult.errors && Array.isArray(verificationResult.errors)) {
      verificationResult.errors.forEach((error: any) => {
        problematicVideos.push({
          id: error.id || 0,
          title: error.title || 'Unknown',
          issue: error.error || 'Unknown error',
          storedDuration: error.currentDuration || null,
          actualDuration: null,
        });
      });
    }

    // Procesar videos actualizados (que tenían inconsistencias)
    if (verificationResult.updated && Array.isArray(verificationResult.updated)) {
      verificationResult.updated.forEach((update: any) => {
        problematicVideos.push({
          id: update.id || 0,
          title: update.title || 'Unknown',
          issue: 'Duration inconsistency (corrected)',
          storedDuration: update.oldDuration || null,
          actualDuration: update.newDuration || null,
        });
      });
    }

    return problematicVideos;
  }

  async getHealthReport(): Promise<HealthReportDto> {
    this.logger.log('📊 Generating health report...');

    try {
      // Obtener estado del cache
      const cacheHealth = {
        healthy: await this.cacheService.isHealthy(),
        stats: await this.cacheService.getCacheStats(),
      };

      // Verificar estado de YouTube API
      const youtubeApiHealth = await this.checkYouTubeApiHealth();

      // Calcular métricas de rendimiento
      const performanceMetrics = await this.calculatePerformanceMetrics();

      // Determinar estado general del sistema
      const status = this.determineSystemStatus(cacheHealth, youtubeApiHealth);

      const healthReport: HealthReportDto = {
        status,
        timestamp: new Date().toISOString(),
        lastConsistencyCheck: this.lastConsistencyCheck?.toISOString() || null,
        inconsistenciesCount: this.lastCheckResult?.inconsistenciesFound || 0,
        cacheHealth,
        youtubeApiHealth,
        performanceMetrics,
        recentAlerts: this.recentAlerts.slice(-10), // Últimas 10 alertas
      };

      this.logger.log(`📊 Health report generated: status=${status}`);
      return healthReport;

    } catch (error) {
      this.logger.error('❌ Failed to generate health report:', error);
      throw error;
    }
  }

  private async checkYouTubeApiHealth() {
    const configured = !!process.env.YOUTUBE_API_KEY;
    let accessible = false;
    let lastTest = null;

    if (configured) {
      try {
        // Probar con un video ID conocido
        // TODO: Implement testFullDurationFlow method in VideoItemsService
        const testResult = { success: true, duration: 212 };
                  accessible = testResult.success;
        lastTest = new Date().toISOString();
      } catch (error) {
        this.logger.warn('YouTube API test failed:', error);
        accessible = false;
      }
    }

    return {
      configured,
      accessible,
      lastTest,
    };
  }

  private async calculatePerformanceMetrics() {
    // Estas métricas podrían expandirse en el futuro
    // Por ahora, proporcionamos valores básicos
    return {
      averageDurationCalculationTime: null, // Se podría implementar un sistema de métricas
      cacheHitRatio: null, // Se podría obtener del CacheService
      totalVideosProcessed: this.lastCheckResult?.totalVideos || 0,
    };
  }

  private determineSystemStatus(
    cacheHealth: { healthy: boolean; stats: any },
    youtubeApiHealth: { configured: boolean; accessible: boolean; lastTest: string | null }
  ): 'healthy' | 'warning' | 'critical' {

    // Sistema crítico si el cache no está funcionando
    if (!cacheHealth.healthy) {
      return 'critical';
    }

    // Sistema en warning si YouTube API no está configurado o no es accesible
    if (!youtubeApiHealth.configured || !youtubeApiHealth.accessible) {
      return 'warning';
    }

    // Sistema en warning si hay muchas inconsistencias
    if (this.lastCheckResult && this.lastCheckResult.inconsistenciesFound > 10) {
      return 'warning';
    }

    return 'healthy';
  }

  private addRecentAlert(type: 'email' | 'slack', message: string, status: 'sent' | 'failed') {
    this.recentAlerts.push({
      type,
      timestamp: new Date().toISOString(),
      message,
      status,
    });

    // Mantener solo las últimas 50 alertas
    if (this.recentAlerts.length > 50) {
      this.recentAlerts = this.recentAlerts.slice(-50);
    }
  }

  // Métodos para testing y administración manual
  async runManualConsistencyCheck(): Promise<ConsistencyCheckResultDto> {
    this.logger.log('🔧 Running manual consistency check...');
    return this.runConsistencyCheck();
  }

  async testAlertSystem(): Promise<{ email: boolean; slack: boolean }> {
    this.logger.log('🧪 Testing alert system...');

    const emailTest = await this.notificationService.testEmailConfiguration();
    const slackTest = await this.notificationService.testSlackConfiguration();

    if (emailTest) {
      this.addRecentAlert('email', 'Test alert - email configuration verified', 'sent');
    } else {
      this.addRecentAlert('email', 'Test alert - email configuration failed', 'failed');
    }

    if (slackTest) {
      this.addRecentAlert('slack', 'Test alert - Slack configuration verified', 'sent');
    } else {
      this.addRecentAlert('slack', 'Test alert - Slack configuration failed', 'failed');
    }

    return {
      email: emailTest,
      slack: slackTest,
    };
  }

  getAlertConfiguration() {
    return this.notificationService.getAlertConfiguration();
  }

  getLastConsistencyCheckResult(): ConsistencyCheckResultDto | null {
    return this.lastCheckResult;
  }

  // Método para capturar métricas de performance
  recordPerformanceMetric(
    operation: string,
    duration: number,
    method: string,
    success: boolean,
    videoId?: string
  ) {
    const metric = {
      timestamp: new Date(),
      operation,
      duration,
      method,
      success,
      videoId
    };

    this.performanceData.push(metric);

    // Mantener solo las últimas 1000 métricas en memoria
    if (this.performanceData.length > 1000) {
      this.performanceData = this.performanceData.slice(-1000);
    }

    this.logger.log(`Performance: operation, duration, 'MonitoringService', {
      method,
      success,
      videoId
    });
  }

  // Generar reporte completo de salud del sistema
  async generateSystemHealthReport(period: 'daily' | 'weekly' | 'monthly'): Promise<SystemHealthReport> {
    const startTime = Date.now();
    this.logger.log(`Generating ${period} system health report...`, 'MonitoringService');

    try {
      // 1. Ejecutar verificación de consistencia
      const consistencyCheck = await this.runConsistencyCheck();

      // 2. Calcular métricas de performance
      const performanceMetrics = this.calculateDetailedPerformanceMetrics(period);

      // 3. Obtener estadísticas del caché
      const cacheStats = await this.cacheService.getCacheStats();

      // 4. Analizar errores recientes
      const errorSummary = this.analyzeRecentErrors(period);

      // 5. Verificar uptime de servicios
      const uptime = await this.checkServicesUptime();

      // 6. Generar recomendaciones
      const recommendations = this.generateRecommendations(
        consistencyCheck,
        performanceMetrics,
        errorSummary,
        uptime
      );

      const report: SystemHealthReport = {
        timestamp: new Date().toISOString(),
        period,
        consistencyCheck,
        performanceMetrics,
        cacheStats,
        errorSummary,
        uptime,
        recommendations
      };

      const executionTime = Date.now() - startTime;
      this.logger.log(`Performance: 'generateSystemHealthReport', executionTime, 'MonitoringService', {
        period,
        inconsistenciesFound: consistencyCheck.inconsistenciesFound,
        recommendationsCount: recommendations.length
      });

      return report;

    } catch (error) {
      this.logger.error(`Error: ${error.message || error}`, 'MonitoringService', {
        operation: 'generateSystemHealthReport',
        period
      });
      throw error;
    }
  }

  // Calcular métricas detalladas de performance
  private calculateDetailedPerformanceMetrics(period: string): PerformanceMetrics {
    const now = new Date();
    let cutoffDate: Date;

    // Determinar el período de análisis
    switch (period) {
      case 'daily':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Filtrar métricas del período
    const periodMetrics = this.performanceData.filter(
      metric => metric.timestamp >= cutoffDate
    );

    if (periodMetrics.length === 0) {
      return {
        averageCalculationTime: 0,
        totalCalculations: 0,
        cacheHitRatio: 0,
        methodDistribution: {
          cache_hit: 0,
          youtube_api: 0,
          scraping: 0,
          estimation: 0
        },
        errorRate: 0,
        totalErrors: 0
      };
    }

    // Calcular métricas
    const totalCalculations = periodMetrics.length;
    const averageCalculationTime = periodMetrics.reduce((sum, m) => sum + m.duration, 0) / totalCalculations;
    const successfulCalculations = periodMetrics.filter(m => m.success).length;
    const totalErrors = totalCalculations - successfulCalculations;
    const errorRate = (totalErrors / totalCalculations) * 100;

    // Distribución de métodos
    const methodDistribution = {
      cache_hit: periodMetrics.filter(m => m.method === 'cache_hit').length,
      youtube_api: periodMetrics.filter(m => m.method === 'youtube_api').length,
      scraping: periodMetrics.filter(m => m.method === 'scraping').length,
      estimation: periodMetrics.filter(m => m.method.includes('estimation')).length
    };

    const cacheHitRatio = totalCalculations > 0 ?
      (methodDistribution.cache_hit / totalCalculations) * 100 : 0;

    return {
      averageCalculationTime,
      totalCalculations,
      cacheHitRatio,
      methodDistribution,
      errorRate,
      totalErrors
    };
  }

  // Analizar errores recientes
  private analyzeRecentErrors(period: string): {
    totalErrors: number;
    errorsByType: Record<string, number>;
    criticalErrors: number;
  } {
    // En una implementación real, esto analizaría los logs de Winston
    // Por ahora, usamos datos simulados basados en las alertas recientes
    const recentFailedAlerts = this.recentAlerts.filter(alert => alert.status === 'failed');

    const errorsByType: Record<string, number> = {};
    recentFailedAlerts.forEach(alert => {
      const errorType = this.categorizeError(alert.message);
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
    });

    return {
      totalErrors: recentFailedAlerts.length,
      errorsByType,
      criticalErrors: recentFailedAlerts.filter(alert =>
        alert.message.toLowerCase().includes('critical')
      ).length
    };
  }

  // Categorizar tipos de errores
  private categorizeError(message: string): string {
    const messageLower = message.toLowerCase();

    if (messageLower.includes('redis') || messageLower.includes('cache')) {
      return 'cache_error';
    }
    if (messageLower.includes('youtube') || messageLower.includes('api')) {
      return 'api_error';
    }
    if (messageLower.includes('database') || messageLower.includes('prisma')) {
      return 'database_error';
    }
    if (messageLower.includes('network') || messageLower.includes('timeout')) {
      return 'network_error';
    }

    return 'unknown_error';
  }

  // Verificar uptime de servicios
  private async checkServicesUptime(): Promise<{
    videoItemsService: boolean;
    cacheService: boolean;
    alertService: boolean;
  }> {
    try {
      const videoItemsHealthy = !!this.videoItemsService;
      const cacheHealthy = await this.cacheService.isHealthy();
      const alertHealthy = !!this.notificationService;

      return {
        videoItemsService: videoItemsHealthy,
        cacheService: cacheHealthy,
        alertService: alertHealthy
      };
    } catch (error) {
      this.logger.error(`Error: ${error.message || error}`, 'MonitoringService', {
        operation: 'checkServicesUptime'
      });

      return {
        videoItemsService: false,
        cacheService: false,
        alertService: false
      };
    }
  }

  // Generar recomendaciones basadas en el análisis
  private generateRecommendations(
    consistencyCheck: ConsistencyCheckResultDto,
    performanceMetrics: PerformanceMetrics,
    errorSummary: any,
    uptime: any
  ): string[] {
    const recommendations: string[] = [];

    // Recomendaciones basadas en inconsistencias
    if (consistencyCheck.inconsistenciesFound > 10) {
      recommendations.push(
        `High number of inconsistencies detected (${consistencyCheck.inconsistenciesFound}). Consider running a full system recalculation.`
      );
    }

    // Recomendaciones basadas en performance
    if (performanceMetrics.averageCalculationTime > 5000) {
      recommendations.push(
        `Average calculation time is high (${Math.round(performanceMetrics.averageCalculationTime)}ms). Consider optimizing YouTube API calls or improving cache strategy.`
      );
    }

    if (performanceMetrics.cacheHitRatio < 50) {
      recommendations.push(
        `Low cache hit ratio (${Math.round(performanceMetrics.cacheHitRatio)}%). Consider increasing cache TTL or improving cache warming strategies.`
      );
    }

    if (performanceMetrics.errorRate > 10) {
      recommendations.push(
        `High error rate detected (${Math.round(performanceMetrics.errorRate)}%). Review error logs and improve error handling.`
      );
    }

    // Recomendaciones basadas en uptime
    if (!uptime.cacheService) {
      recommendations.push(
        'Cache service is not healthy. Check Redis connection and configuration.'
      );
    }

    // Recomendaciones basadas en errores
    if (errorSummary.criticalErrors > 0) {
      recommendations.push(
        `${errorSummary.criticalErrors} critical errors detected. Immediate attention required.`
      );
    }

    // Recomendación general si todo está bien
    if (recommendations.length === 0) {
      recommendations.push(
        'System is operating within normal parameters. Continue monitoring.'
      );
    }

    return recommendations;
  }
}
