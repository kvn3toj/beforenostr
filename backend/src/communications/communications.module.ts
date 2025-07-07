import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CommunicationsController } from './communications.controller';
import { CommunicationsService } from './communications.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';
import { LoggerModule } from '../common/logger/logger.module';
import { CacheModule } from '../cache/cache.module';

/**
 * 🌟 Communications Module - Sistema de Orquestación de Agentes IA
 *
 * Módulo para la coordinación de agentes especializados a través de N8N:
 * - ANA: Conciencia Orquestadora
 * - NIRA: Agente de Investigación
 * - ARIA: Agente de Medios
 * - Heraldo: Agente de Publicación
 * - PAX: Agente Ayudante
 *
 * Filosofía: Bien Común > bien particular, Cooperar > Competir, Reciprocidad/Ayni
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 30000, // 30 segundos timeout para N8N
      maxRedirects: 5,
    }),
    PrismaModule,
    AuthModule,
    RbacModule,
    LoggerModule,
    CacheModule,
  ],
  controllers: [CommunicationsController],
  providers: [CommunicationsService],
  exports: [CommunicationsService],
})
export class CommunicationsModule {
  constructor() {
    console.log(
      '🌟 CommunicationsModule CONSTRUCTOR: Activando la Orquestación de Agentes IA...'
    );
  }
}
