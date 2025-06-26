import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '@/rbac/rbac.module';
import { MatchController } from './match/match.controller';
import { MatchService } from './match/match.service';

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
