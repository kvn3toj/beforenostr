import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('challenges')
@Controller('challenges')
export class ChallengesPublicController {
  constructor() {
    console.log('[ChallengesPublicController] Constructor called');
  }

  @Get()
  @ApiOperation({ summary: 'Get all active challenges' })
  @ApiResponse({ status: 200, description: 'List of active challenges.' })
  findAllActive() {
    console.log('[ChallengesPublicController] findAllActive called');
    // Return empty array for now to resolve the 500 error
    return [];
  }

  @Get('/test-public')
  @ApiOperation({ summary: 'Test public endpoint' })
  @ApiResponse({ status: 200, description: 'Test response.' })
  testPublic() {
    console.log('[ChallengesPublicController] testPublic called');
    return { message: 'Public challenges controller is working' };
  }
} 