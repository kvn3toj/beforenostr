import { Controller, Get, Inject, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './common/logger';
import { MetricsService } from './common/metrics/metrics.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LoggerService) private readonly logger: LoggerService,
    @Inject(MetricsService) private readonly metricsService: MetricsService
  ) {}

  @Get()
  @ApiOperation({ summary: 'API status endpoint' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Backend is running' })
  getHealth() {
    this.logger.log('Health check requested', 'AppController');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Backend is running'
    };
  }

  @Get('test-logging')
  testLogging() {
    this.logger.log('Testing structured logging', 'AppController', {
      testData: 'sample data',
      timestamp: new Date().toISOString()
    });
    
    this.logger.logPerformance('test_operation', 150, 'AppController', {
      success: true,
      method: 'test'
    });

    return {
      message: 'Logging test completed',
      timestamp: new Date().toISOString()
    };
  }

  @Get('metrics-test')
  async testMetrics() {
    this.logger.log('Testing metrics service', 'AppController');
    try {
      // Generar algunas métricas de prueba
      this.metricsService.incrementHttpRequests('GET', '/metrics-test', 200);
      this.metricsService.incrementCacheOperations('get', 'hit');
      this.metricsService.setCacheHitRatio(0.85);
      
      const metrics = await this.metricsService.getMetrics();
      
      return {
        message: 'Metrics test completed',
        metricsLength: metrics.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error testing metrics:', error);
      return {
        message: 'Metrics test failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('prometheus-metrics')
  async getPrometheusMetrics(): Promise<string> {
    this.logger.log('Serving Prometheus metrics from AppController', 'AppController');
    try {
      // Generar algunas métricas de ejemplo
      this.metricsService.incrementHttpRequests('GET', '/prometheus-metrics', 200);
      this.metricsService.observeHttpDuration('GET', '/prometheus-metrics', 0.1);
      
      const metrics = await this.metricsService.getMetrics();
      this.logger.log(`✅ Prometheus metrics served successfully (${metrics.length} characters)`, 'AppController');
      
      return metrics;
    } catch (error) {
      this.logger.error('❌ Error serving Prometheus metrics:', error);
      throw error;
    }
  }

  // Redirecciones para compatibilidad entre singular y plural
  @Get('wallet')
  @Redirect('/wallets')
  redirectWalletToWallets() {
    // Esta función maneja la redirección automática
  }

  @Get('wallet/*')
  @Redirect('/wallets/*')
  redirectWalletPathToWallets() {
    // Esta función maneja la redirección automática para rutas anidadas
  }

  @Get('merit')
  @Redirect('/merits')
  redirectMeritToMerits() {
    // Esta función maneja la redirección automática
  }

  @Get('merit/*')
  @Redirect('/merits/*')
  redirectMeritPathToMerits() {
    // Esta función maneja la redirección automática para rutas anidadas
  }

  @Get('swagger')
  @ApiOperation({ summary: 'Swagger API documentation endpoint' })
  @ApiResponse({ status: 200, description: 'Redirects to /api/docs' })
  @Redirect('/api/docs')
  redirectToSwagger() {
    return 'Redirecting to Swagger docs...';
  }

  @Get('docs')
  @ApiOperation({ summary: 'API documentation endpoint' })
  @ApiResponse({ status: 200, description: 'Redirects to /api/docs' })
  @Redirect('/api/docs')
  redirectToDocs() {
    return 'Redirecting to API documentation...';
  }

  // ======== INFORMACIÓN GENERAL DEL SISTEMA ========

  @Get('info')
  @ApiOperation({ summary: 'System information endpoint' })
  @ApiResponse({ status: 200, description: 'System information' })
  getSystemInfo() {
    return {
      app: 'Gamifier Backend API',
      version: '1.0.0',
      description: 'Backend API for the Gamifier educational platform',
      documentation: '/api/docs',
      health: '/health',
      status: 'running',
      timestamp: new Date().toISOString(),
      features: [
        'User Authentication & Authorization (JWT)',
        'Role-Based Access Control (RBAC)',
        'Content Management',
        'Video Analysis & Questions',
        'Subtitle Management',
        'Analytics & Monitoring',
        'Gamification System',
        'Multi-platform Support'
      ]
    };
  }

  @Get('status')
  @ApiOperation({ summary: 'Detailed status endpoint' })
  @ApiResponse({ status: 200, description: 'Detailed system status' })
  async getStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development'
    };
  }
} 