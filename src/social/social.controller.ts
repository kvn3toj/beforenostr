import { Controller, Get, Inject } from '@nestjs/common';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
  constructor(@Inject(SocialService) private readonly socialService: SocialService) {
    console.log('>>> SocialController CONSTRUCTOR: this.socialService IS', this.socialService ? 'DEFINED' : 'UNDEFINED');
  }

  @Get('stats')
  async getSocialStats() {
    console.log('>>> SocialController.getSocialStats: Starting...');
    return this.socialService.getSocialStats();
  }

  @Get('activity/recent')
  async getRecentActivity() {
    console.log('>>> SocialController.getRecentActivity: Starting...');
    return this.socialService.getRecentActivity();
  }
} 