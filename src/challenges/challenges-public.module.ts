import { Module } from '@nestjs/common';
import { ChallengesPublicController } from './challenges-public.controller';

@Module({
  controllers: [ChallengesPublicController],
  providers: [],
  exports: [],
})
export class ChallengesPublicModule {
  constructor() {
    console.log('[ChallengesPublicModule] Module initialized');
  }
} 