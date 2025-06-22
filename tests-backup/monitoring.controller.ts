import { Controller, Get, Post, Inject } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(
    @Inject(MonitoringService) private readonly monitoringService: MonitoringService,
  ) {
// //     console.log('>>> MonitoringController CONSTRUCTOR: this.monitoringService IS', this.monitoringService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get('health-report')
  async getHealthReport() {
//     console.log('>>> MonitoringController.getHealthReport called');
    return this.monitoringService.getHealthReport();
  }

  @Get('last-check')
  async getLastConsistencyCheck() {
//     console.log('>>> MonitoringController.getLastConsistencyCheck called');
    return this.monitoringService.getLastConsistencyCheckResult();
  }

  @Post('run-check')
  async runConsistencyCheck() {
//     console.log('>>> MonitoringController.runConsistencyCheck called');
    return this.monitoringService.runConsistencyCheck();
  }

  @Get('alert-config')
  async getAlertConfig() {
//     console.log('>>> MonitoringController.getAlertConfig called');
    return this.monitoringService.getAlertConfiguration();
  }

  @Get('test')
  async testEndpoint() {
//     console.log('>>> MonitoringController.testEndpoint called');
    return {
      message: 'Monitoring module is working!',
      timestamp: new Date().toISOString(),
      status: 'ok'
    };
  }
} 