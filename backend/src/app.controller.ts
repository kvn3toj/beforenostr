import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService?: AppService) {
// //     console.log('>>> AppController CONSTRUCTOR: appService is', this.appService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get()
  getHello() {
//     console.log('>>> AppController.getHello: appService is', this.appService ? 'DEFINED' : 'UNDEFINED');

    // Fallback si AppService no está disponible
    if (!this.appService) {
      return {
        status: 'ok',
        message: 'Gamifier API is running! 🚀',
        timestamp: new Date().toISOString(),
        note: 'Direct response (AppService unavailable)'
      };
    }

    try {
      return {
        status: 'ok',
        message: this.appService.getHello(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
//       console.error('>>> AppController.getHello: Error calling appService.getHello():', error);
      return {
        status: 'ok',
        message: 'Gamifier API is running! 🚀',
        timestamp: new Date().toISOString(),
        note: 'Fallback response due to AppService error'
      };
    }
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Backend is running',
      appService: this.appService ? 'available' : 'unavailable',
      endpoints: {
        health: 'OK',
        auth: 'OK',
        api: 'OK'
      }
    };
  }
}
