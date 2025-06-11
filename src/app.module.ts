import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger';
import { MetricsModule } from './common/metrics/metrics.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';
import { NotificationModule } from './common/notifications/notification.module';
import { ValidationModule } from './common/validation/validation.module';
import { AuthModule } from './auth/auth.module';  // RE-ENABLED
import { UsersModule } from './users/users.module';  // RE-ENABLED
import { SubtitleModule } from './subtitle/subtitle.module';
import { QuestionModule } from './questions/question.module';
import { VideoItemsModule } from './video-items/video-items.module';
// ======= GRUPO 1: MÓDULOS DE CONTENIDO AVANZADO Y GAMIFICACIÓN BASE =======
import { ContentItemsModule } from './content/items/content-items.module'; // RE-ENABLED
import { WorldsModule } from './content/worlds/worlds.module'; // RE-ENABLED
// import { ExperiencesModule } from './content/experiences/experiences.module'; // TEMPORAL - PROBLEMA
import { PlaylistModule } from './playlist/playlist.module'; // RE-ENABLED - FIXED
import { PlaylistsModule } from './content/playlists/playlists.module'; // RE-ENABLED
import { AiModule } from './ai/ai.module'; // RE-ENABLED
// ======= GRUPO 2: MÓDULOS DE ECONOMÍA Y SOCIAL =======
import { MeritsAndWalletModule } from './merits-and-wallet/merits-and-wallet.module'; // RE-ENABLED
import { TokensModule } from './tokens/tokens.module'; // RE-ENABLED
import { LetsModule } from './lets/lets.module'; // RE-ENABLED
import { GroupsModule } from './social/groups/groups.module'; // RE-ENABLED
import { MarketplaceModule } from './marketplace/marketplace.module'; // RE-ENABLED
import { SocialModule } from './social/social.module'; // NEW - Social stats and activity
// import { ChallengesModule } from './challenges/challenges.module'; // RE-ENABLED - DEPENDENCIAS RESUELTAS
import { ChallengesPublicModule } from './challenges/challenges-public.module'; // TEMPORARY PUBLIC MODULE
// import { NotificationsModule } from './notifications/notifications.module'; // TEMPORAL - CONFLICTO
import { InvitationsModule } from './invitations/invitations.module'; // RE-ENABLED
// ======= GRUPO 3: MÓDULOS ADMINISTRATIVOS Y MONITOREO =======
import { AdminModule } from './admin/admin.module'; // RE-ENABLED
import { AnalyticsModule } from './analytics/analytics.module'; // RE-ENABLED
import { MonitoringModule } from './monitoring/monitoring.module'; // RE-ENABLED
// ======= MÓDULOS ADICIONALES =======
import { MundosModule } from './content/mundos/mundos.module'; // RE-ENABLED
import { RbacModule } from './rbac/rbac.module'; // RE-ENABLED
import { VideoPermissionsModule } from './video-permissions/video-permissions.module'; // RE-ENABLED
import { MeritsModule } from './merits/merits.module'; // RE-ENABLED
import { PersonalityModule } from './personality/personality.module'; // RE-ENABLED

console.log('>>> AppModule: MÓDULOS CRÍTICOS RE-HABILITADOS (SIN PROBLEMAS)...');

@Module({
  imports: [
    LoggerModule,      // Logging estructurado - BÁSICO
    MetricsModule,     // Métricas de Prometheus - BÁSICO
    PrismaModule,      // Conexión a base de datos - BÁSICO
    CacheModule,       // Cache Redis - BÁSICO
    // ======= MÓDULOS BÁSICOS FUNCIONANDO =======
    SubtitleModule,    // Módulo de subtítulos (sin dependencias RBAC)
    QuestionModule,    // Módulo de preguntas (sin dependencias RBAC)
    VideoItemsModule,  // Módulo de video items (ya sabemos que funciona)
    // ======= GRUPO 1: CONTENIDO AVANZADO Y GAMIFICACIÓN BASE =======
    ContentItemsModule, // RE-ENABLED - CRÍTICO PARA /content/items
    PlaylistsModule,   // RE-ENABLED - Para /content/playlists
    PlaylistModule,    // RE-ENABLED - FIXED - Para /playlists
    WorldsModule,      // RE-ENABLED
    // ExperiencesModule, // TEMPORAL - PROBLEMA
    AiModule,          // RE-ENABLED
    // ======= GRUPO 2: ECONOMÍA Y SOCIAL =======
    MeritsAndWalletModule, // RE-ENABLED
    TokensModule,      // RE-ENABLED
    LetsModule,        // RE-ENABLED
    GroupsModule,      // RE-ENABLED
    MarketplaceModule, // RE-ENABLED
    SocialModule,      // NEW - Social stats and activity
    // ChallengesModule,  // RE-ENABLED - DEPENDENCIAS RESUELTAS
    ChallengesPublicModule,  // TEMPORARY PUBLIC MODULE
    // NotificationsModule, // TEMPORAL - CONFLICTO
    InvitationsModule, // RE-ENABLED
    // ======= GRUPO 3: MÓDULOS ADMINISTRATIVOS Y MONITOREO =======
    AdminModule,       // RE-ENABLED
    AnalyticsModule,   // RE-ENABLED - Para endpoints de analytics y series de tiempo
    MonitoringModule,  // RE-ENABLED
    // ======= MÓDULOS CRÍTICOS =======
    AuthModule,        // RE-ENABLED - PROBLEMA RESUELTO
    UsersModule,       // RE-ENABLED - FUNCIONANDO CORRECTAMENTE
    RbacModule,        // RE-ENABLED - CRÍTICO PARA ROLES Y PERMISOS
    MundosModule,      // RE-ENABLED - Para /content/mundos
    VideoPermissionsModule, // RE-ENABLED
    MeritsModule,      // RE-ENABLED - Gestión de tokens intrínsecos (Mëritos, Öndas, Vibras)
    PersonalityModule, // RE-ENABLED - PARA ASIGNACIÓN DE PERSONALIDADES
    NotificationModule,
    ValidationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('>>> AppModule CONSTRUCTOR: MÓDULOS CRÍTICOS RE-HABILITADOS (SIN PROBLEMAS)...');
  }
} 