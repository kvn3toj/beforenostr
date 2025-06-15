import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PlaylistModule } from './playlist/playlist.module';
import { MundosModule } from './content/mundos/mundos.module';
import { PlaylistsModule } from './content/playlists/playlists.module';
import { ContentItemsModule } from './content/items/content-items.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { RbacModule } from './rbac/rbac.module';
import { SubtitleModule } from './subtitle/subtitle.module';
import { QuestionModule } from './questions/question.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { VideoItemsModule } from './video-items/video-items.module';
import { SocialModule } from './social/social.module';
import { MeritsAndWalletModule } from './merits-and-wallet/merits-and-wallet.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [
    PrismaModule,
    SubtitleModule,    // Mover SubtitleModule al principio para verificar si hay problemas de orden
    QuestionModule,    // Mover QuestionModule también
    VideoItemsModule,  // Agregar VideoItemsModule
    ContentItemsModule, // Agregar ContentItemsModule para endpoint /content/items
    MundosModule, 
    PlaylistModule,    // Agregar para endpoint /playlists
    PlaylistsModule,   // Mantener para endpoint /content/playlists
    UsersModule,       // Agregar para endpoint /users
    AdminModule,       // Agregar para endpoints /admin/*
    RbacModule,        // Import full RBAC module instead of just RolesModule to get guards
    AnalyticsModule,   // Agregar para endpoints /analytics
    SocialModule,      // Agregar para endpoints /social
    MeritsAndWalletModule, // Agregar para endpoints /wallets, /merits, /transactions
    NotificationsModule, // Agregar para endpoints /notifications
    MarketplaceModule, // Agregar para endpoints /marketplace
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('>>> AppModule CONSTRUCTOR: Initializing...');
  }
} 