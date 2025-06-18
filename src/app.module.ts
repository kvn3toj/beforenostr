import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PlaylistModule } from './playlist/playlist.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { RbacModule } from './rbac/rbac.module';
import { SubtitleModule } from './subtitle/subtitle.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { VideoItemsModule } from './video-items/video-items.module';
import { SocialModule } from './social/social.module';
import { MeritsAndWalletModule } from './merits-and-wallet/merits-and-wallet.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { StudyRoomsModule } from './study-rooms/study-rooms.module';
import { ConsoleModule } from './console/console.module';
import { LoggerModule } from './common/logger/logger.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    LoggerModule, // 📝 Global Logger Module - must be imported first
    AuthModule, // 🔐 Authentication Module - core authentication
    PrismaModule,
    SubtitleModule,
    VideoItemsModule,
    PlaylistModule,
    UsersModule,
    AdminModule,
    RbacModule,
    AnalyticsModule,
    SocialModule,
    MeritsAndWalletModule,
    NotificationsModule,
    MarketplaceModule,
    StudyRoomsModule,
    ConsoleModule, // 🎮 Módulo de la Consola de Experiencias
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('>>> AppModule CONSTRUCTOR: Initializing...');
  }
} 