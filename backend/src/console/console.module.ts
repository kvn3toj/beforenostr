/**
 * 🎮 Console Module - Experience Management Backend
 *
 * Módulo principal para la gestión de experiencias gamificadas
 * Basado en el Customer Journey Map del tablero de Miro
 *
 * Funcionalidades:
 * - Gestión de STAGES del customer journey
 * - Administración de concursos de Mëritos y Öndas
 * - Sistema de Trust Voting y Coompetencia
 * - Gestión de contenido GPL (ÜPlay)
 * - Framework Octalysis
 * - Analytics en tiempo real
 */

import { Module } from '@nestjs/common';
import { ConsoleController } from './console.controller';
import { ConsoleService } from './console.service';
import { StagesController } from './stages/stages.controller';
import { StagesService } from './stages/stages.service';
import { ContestsController } from './contests/contests.controller';
import { ContestsService } from './contests/contests.service';
import { TrustVotingController } from './trust-voting/trust-voting.controller';
import { TrustVotingService } from './trust-voting/trust-voting.service';
import { GplContentController } from './gpl-content/gpl-content.controller';
import { GplContentService } from './gpl-content/gpl-content.service';
import { OctalysisController } from './octalysis/octalysis.controller';
import { OctalysisService } from './octalysis/octalysis.service';
import { CosmicKanbanController } from './cosmic-kanban/cosmic-kanban.controller';
import { CosmicKanbanService } from './cosmic-kanban/cosmic-kanban.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheModule } from '../cache/cache.module';
import { CosmicKanbanModule } from './cosmic-kanban/cosmic-kanban.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule,
    CosmicKanbanModule,
  ],
  controllers: [
    ConsoleController,
    StagesController,
    ContestsController,
    TrustVotingController,
    GplContentController,
    OctalysisController,
    CosmicKanbanController,
  ],
  providers: [
    ConsoleService,
    StagesService,
    ContestsService,
    TrustVotingService,
    GplContentService,
    OctalysisService,
    CosmicKanbanService,
  ],
  exports: [
    ConsoleService,
    StagesService,
    ContestsService,
    TrustVotingService,
    GplContentService,
    OctalysisService,
    CosmicKanbanService,
  ],
})
export class ConsoleModule {}
