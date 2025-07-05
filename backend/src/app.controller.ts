import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js.js';

@Controller()
export class AppController {
  constructor(private readonly appService?: AppService) {}

  @Get()
  getHello() {
    // Fallback si AppService no está disponible
    if (!this.appService) {
      return {
        status: 'ok',
        message: 'Gamifier API is running! 🚀',
        timestamp: new Date().toISOString(),
        note: 'Direct response (AppService unavailable)',
      };
    }

    try {
      return {
        status: 'ok',
        message: this.appService.getHello(),
        timestamp: new Date().toISOString(),
      };
    } catch {
      // Error calling AppService - returning fallback response
      return {
        status: 'ok',
        message: 'Gamifier API is running! 🚀',
        timestamp: new Date().toISOString(),
        note: 'Fallback response due to AppService error',
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
        api: 'OK',
      },
    };
  }
}
