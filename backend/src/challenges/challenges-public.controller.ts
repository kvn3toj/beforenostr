import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChallengesPublicService } from './challenges-public.service';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesPublicController {
  constructor(
    @Inject(ChallengesPublicService)
    private readonly challengesPublicService: ChallengesPublicService
  ) {
    console.log(
      '[ChallengesPublicController] Constructor called with explicit @Inject'
    );
    console.log(
      '[ChallengesPublicController] Service injected:',
      !!this.challengesPublicService
    );
  }

  @Get('test-connection')
  @ApiOperation({ summary: 'Test database connection' })
  @ApiResponse({ status: 200, description: 'Connection test result.' })
  async testConnection() {
    console.log('[ChallengesPublicController] testConnection called');
    return await this.challengesPublicService.testConnection();
  }

  @Get()
  @ApiOperation({ summary: 'Get all active challenges' })
  @ApiResponse({ status: 200, description: 'List of active challenges.' })
  findAllActive() {
    console.log('[ChallengesPublicController] findAllActive called');
    console.log(
      '[ChallengesPublicController] Service status:',
      !!this.challengesPublicService
    );

    if (!this.challengesPublicService) {
      console.error(
        '[ChallengesPublicController] ERROR: challengesPublicService is undefined!'
      );
      throw new Error('ChallengesPublicService is not injected properly');
    }

    return this.challengesPublicService.findAllActive();
  }

  @Get('/test-public')
  @ApiOperation({ summary: 'Test public endpoint' })
  @ApiResponse({ status: 200, description: 'Test response.' })
  testPublic() {
    console.log('[ChallengesPublicController] testPublic called');
    return { message: 'Public challenges controller is working' };
  }
}
