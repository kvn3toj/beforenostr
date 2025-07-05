import { Module } from '@nestjs/common';
import { SocialController } from './social.controller.js.js';
import { SocialService } from './social.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';

@Module({
  imports: [PrismaModule],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
