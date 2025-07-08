/**
 * 🌌 CosmicBrainModule - Módulo del AI Cosmic Brain
 *
 * Módulo NestJS que encapsula toda la funcionalidad del AI Cosmic Brain
 * para el Gamifier Admin Dashboard. Integra los principios de CoomÜnity
 * con la arquitectura NestJS.
 *
 * Filosofía: Metanöia aplicada al desarrollo - transformación consciente
 * del caos en orden fractal a través de la observación y análisis.
 *
 * Componentes:
 * - CosmicBrainController: Endpoints RESTful
 * - CosmicBrainService: Lógica de negocio
 * - Integración con PrismaModule, CacheModule, AuthModule, RbacModule
 */

import { Module } from '@nestjs/common';
import { CosmicBrainController } from './cosmic-brain.controller';
import { CosmicBrainService } from './cosmic-brain.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [PrismaModule, CacheModule, AuthModule, RbacModule],
  controllers: [CosmicBrainController],
  providers: [CosmicBrainService],
  exports: [CosmicBrainService],
})
export class CosmicBrainModule {}
