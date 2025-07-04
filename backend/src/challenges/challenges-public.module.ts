import { Module } from '@nestjs/common';
import { ChallengesPublicController } from './challenges-public.controller';
import { ChallengesPublicService } from './challenges-public.service';
import { PrismaModule } from '../prisma/prisma.module';

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
