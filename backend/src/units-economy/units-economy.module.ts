import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '@/rbac/rbac.module';

// Controllers
import { UnitsController } from './controllers/units.controller';
import { RevenueSharingController } from './controllers/revenue-sharing.controller';
import { ReciprocityController } from './controllers/reciprocity.controller';

// Services
import { UnitsService } from './services/units.service';
import { RevenueSharingService } from './services/revenue-sharing.service';
import { ReciprocityService } from './services/reciprocity.service';
import { UnitsEconomyOrchestrator } from './services/units-economy-orchestrator.service';

/**
 * 🌌 Units Economy Module - Sistema de Economía Sagrada CoomÜnity
 * 
 * 🎯 INTENT: Implementar sistema completo de economía Ünits con revenue sharing, reciprocidad y Ayni
 * 🌟 VALUES: Bien Común (distribución equitativa), Reciprocidad (intercambios balanceados), Transparencia (transacciones visibles)
 * ⚡ CONSTRAINTS: NestJS patterns, Prisma ORM, JWT auth, RBAC permissions
 */
@Module({
  imports: [
    PrismaModule,
    AuthModule, 
    RbacModule
  ],
  controllers: [
    UnitsController,
    RevenueSharingController,
    ReciprocityController
  ],
  providers: [
    UnitsService,
    RevenueSharingService,
    ReciprocityService,
    UnitsEconomyOrchestrator
  ],
  exports: [
    UnitsService,
    RevenueSharingService,
    ReciprocityService,
    UnitsEconomyOrchestrator
  ],
})
export class UnitsEconomyModule {}