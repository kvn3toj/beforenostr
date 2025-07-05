/**
 * 🌌 Cosmic Kanban Module
 * Módulo para la gestión del Portal Kanban Cósmico
 */

import { Module, OnModuleInit } from '@nestjs/common';
import { CosmicKanbanController } from './cosmic-kanban.controller.js.js';
import { CosmicKanbanService } from './cosmic-kanban.service.js.js';
import { PrismaModule } from '../../prisma/prisma.module.js.js';
import { CacheModule } from '../../cache/cache.module.js.js';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [CosmicKanbanController],
  providers: [CosmicKanbanService],
  exports: [CosmicKanbanService],
})
export class CosmicKanbanModule implements OnModuleInit {
  constructor(private readonly cosmicKanbanService: CosmicKanbanService) {}

  /**
   * Al iniciar el módulo, configuramos la sincronización automática
   */
  async onModuleInit() {
    // Configurar sincronización automática cada 30 minutos
    await this.cosmicKanbanService.scheduleAutoSync(30);
    console.log('[CosmicKanbanModule] Sincronización automática iniciada');
  }
}
