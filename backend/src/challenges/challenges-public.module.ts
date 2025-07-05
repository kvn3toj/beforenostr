import { Module } from '@nestjs/common';
import { ChallengesPublicController } from './challenges-public.controller.js.js';
import { ChallengesPublicService } from './challenges-public.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';

@Module({
  imports: [PrismaModule],
  controllers: [ChallengesPublicController],
  providers: [ChallengesPublicService],
  exports: [ChallengesPublicService],
})
export class ChallengesPublicModule {
  constructor() {
    //     console.log('[ChallengesPublicModule] Module initialized with PrismaModule - full version');
  }
}
