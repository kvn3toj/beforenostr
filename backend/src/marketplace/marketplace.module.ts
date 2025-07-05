import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller.js.js';
import { MarketplaceService } from './marketplace.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';
import { AuthModule } from '../auth/auth.module.js.js';
import { RbacModule } from '@/rbac/rbac.module';
import { MatchController } from './match/match.controller.js.js';
import { MatchService } from './match/match.service.js.js';

@Module({
  imports: [PrismaModule, AuthModule, RbacModule],
  controllers: [MarketplaceController, MatchController],
  providers: [MarketplaceService, MatchService],
  exports: [MarketplaceService, MatchService],
})
export class MarketplaceModule {
  constructor() {
    // //     console.log('>>> MarketplaceModule CONSTRUCTOR: Initializing marketplace system with Auth/RBAC enabled...');
  }
}
