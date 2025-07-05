import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js.js';
import { PersonalityService } from './personality.service.js.js';
import { PersonalityController } from './personality.controller.js.js';

@Module({
  imports: [PrismaModule],
  providers: [PersonalityService],
  controllers: [PersonalityController],
  exports: [PersonalityService],
})
export class PersonalityModule {}
