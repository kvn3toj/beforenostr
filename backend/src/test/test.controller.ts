import { Controller, Get } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {
    // // //     console.log('>>> TestController CONSTRUCTOR: Initializing...');
    // //     console.log('>>> TestController CONSTRUCTOR: service:', !!this.testService);
  }

  @Get('ping')
  ping() {
    //     console.log('>>> TestController.ping called');
    return {
      message: 'Test controller is working!',
      timestamp: new Date().toISOString(),
      serviceAvailable: !!this.testService,
    };
  }

  @Get('db')
  async testDatabase() {
    try {
      //       console.log('>>> TestController.testDatabase called');
      //       console.log('>>> TestController.testDatabase - service check:', !!this.testService);

      if (!this.testService) {
        return {
          message: 'Test DB endpoint working!',
          timestamp: new Date().toISOString(),
          service: 'Service not available',
          error: 'TestService is not injected',
        };
      }

      const result = await this.testService.testDatabase();
      //       console.log('>>> TestController.testDatabase - success:', result);

      return {
        message: 'Test DB endpoint working!',
        timestamp: new Date().toISOString(),
        service: 'Service available',
        result,
      };
    } catch (error) {
      //       console.log('>>> TestController.testDatabase - Error:', error);
      return {
        message: 'Test DB endpoint working!',
        timestamp: new Date().toISOString(),
        service: 'Service available but failed',
        error: error.message,
      };
    }
  }
}
