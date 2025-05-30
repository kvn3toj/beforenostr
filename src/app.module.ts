import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PlaylistModule } from './playlist/playlist.module';
import { MundosModule } from './content/mundos/mundos.module';
import { PlaylistsModule } from './content/playlists/playlists.module';
// import { ContentItemsModule } from './content/items/content-items.module';
// import { UsersModule } from './users/users.module';
// import { AdminModule } from './admin/admin.module';
// import { RbacModule } from './rbac/rbac.module';
import { SubtitleModule } from './subtitle/subtitle.module';
import { QuestionModule } from './questions/question.module';
// import { AnalyticsModule } from './analytics/analytics.module';
import { VideoItemsModule } from './video-items/video-items.module';
import { AiModule } from './ai/ai.module';
import { CacheModule } from './cache/cache.module';
import { VideoPermissionsModule } from './video-permissions/video-permissions.module';
import { TokensModule } from './tokens/tokens.module';
// import { MeritsModule } from './merits/merits.module';
import { WorldsModule } from './content/worlds/worlds.module';
import { ExperiencesModule } from './content/experiences/experiences.module';
import { GroupsModule } from './social/groups/groups.module';
// import { MeritsAndWalletModule } from './merits-and-wallet/merits-and-wallet.module';
// import { LetsModule } from './lets/lets.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
// import { InvitationsModule } from './invitations/invitations.module';
// import { PersonalityModule } from './personality/personality.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule,       // Añadir CacheModule al principio para inicialización temprana
    SubtitleModule,    // Mover SubtitleModule al principio para verificar si hay problemas de orden
    QuestionModule,    // Mover QuestionModule también
    VideoItemsModule,  // Agregar VideoItemsModule
    VideoPermissionsModule, // Agregar VideoPermissionsModule
    // ContentItemsModule, // Agregar ContentItemsModule para endpoint /content/items
    MundosModule, 
    PlaylistModule,    // Agregar para endpoint /playlists
    PlaylistsModule,   // Mantener para endpoint /content/playlists
    // UsersModule,       // Agregar para endpoint /users
    // AdminModule,       // Agregar para endpoints /admin/*
    // RbacModule,        // Import full RBAC module instead of just RolesModule to get guards
    // AnalyticsModule,   // Agregar para endpoints /analytics (deshabilitado temporalmente)
    AiModule,          // Agregar para endpoints /ai/*
    TokensModule,      // Gestión de tokens extrínsecos (Ünits, Töins)
    // MeritsModule,      // Gestión de tokens intrínsecos (Mëritos, Öndas, Vibras)
    // MeritsAndWalletModule, // Gestión completa de economía (Wallet, Transacciones, LETS)
    // LetsModule,        // Sistema de intercambio local (Local Exchange Trading System)
    NotificationsModule, // Sistema de notificaciones y alertas
    MarketplaceModule, // Marketplace para productos, servicios y experiencias
    // InvitationsModule, // Sistema de invitaciones y gift cards
    WorldsModule,      // Gestión de mundos gamificados de CoomÜnity
    ExperiencesModule, // Gestión de experiencias gamificadas de CoomÜnity
    GroupsModule,      // Gestión de grupos y comunidades de CoomÜnity
    // PersonalityModule, // Gestión de personalidades y asignación a usuarios (comentado temporalmente hasta resolver problemas)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('>>> AppModule CONSTRUCTOR: Initializing...');
  }
} 