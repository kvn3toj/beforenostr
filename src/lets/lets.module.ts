import { Module } from '@nestjs/common';
import { LetsController } from './lets.controller';
import { LetsService } from './lets.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [PrismaModule, AuthModule, RbacModule],
  controllers: [LetsController],
  providers: [LetsService],
  exports: [LetsService],
})
export class LetsModule {
  constructor() {
    console.log('>>> LetsModule CONSTRUCTOR: Initializing LETS (Local Exchange Trading System)...');
  }
} 