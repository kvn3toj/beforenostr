import { Controller, Get, Logger, Inject } from '@nestjs/common';
import { MetricsService } from './metrics.service.js.js';

@Controller('metrics')
export class MetricsController {
  private readonly logger = new Logger(MetricsController.name);

  constructor(
    @Inject(MetricsService) private readonly metricsService: MetricsService
  ) {
    this.logger.log(
      '>>> MetricsController CONSTRUCTOR: MetricsService IS',
      this.metricsService ? 'DEFINED' : 'UNDEFINED'
    );
  }

  @Get()
  async getMetrics(): Promise<string> {
    this.logger.log('📊 Serving Prometheus metrics');
    try {
      const metrics = await this.metricsService.getMetrics();
      this.logger.log(
        `✅ Metrics served successfully (${metrics.length} characters)`
      );
      return metrics;
    } catch (error) {
      this.logger.error('❌ Error serving metrics:', error);
      throw error;
    }
  }

  @Get('test')
  async testMetrics(): Promise<{ message: string; metricsService: boolean }> {
    this.logger.log('🧪 Testing metrics service');
    return {
      message: 'Metrics service test',
      metricsService: !!this.metricsService,
    };
  }
}
