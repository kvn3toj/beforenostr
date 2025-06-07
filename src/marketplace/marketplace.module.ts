import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { PrismaModule } from '../prisma/prisma.module';
// import { AuthModule } from '../auth/auth.module'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard
// import { RbacModule } from '../rbac/rbac.module'; // COMENTADO TEMPORALMENTE: PROBLEMA CON RolesGuard

@Module({
  imports: [PrismaModule], // Solo PrismaModule por ahora, sin Auth/RBAC
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {
  constructor() {
    console.log('>>> MarketplaceModule CONSTRUCTOR: Initializing marketplace system (without Auth/RBAC)...');
  }
} 