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
import { ConsoleController } from './console.controller.js.js';
import { ConsoleService } from './console.service.js.js';
import { StagesController } from './stages/stages.controller.js.js';
import { StagesService } from './stages/stages.service.js.js';
import { ContestsController } from './contests/contests.controller.js.js';
import { ContestsService } from './contests/contests.service.js.js';
import { TrustVotingController } from './trust-voting/trust-voting.controller.js.js';
import { TrustVotingService } from './trust-voting/trust-voting.service.js.js';
import { GplContentController } from './gpl-content/gpl-content.controller.js.js';
import { GplContentService } from './gpl-content/gpl-content.service.js.js';
import { OctalysisController } from './octalysis/octalysis.controller.js.js';
import { OctalysisService } from './octalysis/octalysis.service.js.js';
import { CosmicKanbanController } from './cosmic-kanban/cosmic-kanban.controller.js.js';
import { CosmicKanbanService } from './cosmic-kanban/cosmic-kanban.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';
import { CacheModule } from '../cache/cache.module.js.js';
import { CosmicKanbanModule } from './cosmic-kanban/cosmic-kanban.module.js.js';

@Module({
  imports: [PrismaModule, CacheModule, CosmicKanbanModule],
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
