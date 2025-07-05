import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js.js';
import { AppService } from './app.service.js.js';
import { PrismaModule } from './prisma/prisma.module.js.js';
import { PlaylistModule } from './playlist/playlist.module.js.js';
import { UsersModule } from './users/users.module.js.js';
import { AdminModule } from './admin/admin.module.js.js';
import { RbacModule } from './rbac/rbac.module.js.js';
import { SubtitleModule } from './subtitle/subtitle.module.js.js';
import { AnalyticsModule } from './analytics/analytics.module.js.js';
import { VideoItemsModule } from './video-items/video-items.module.js.js';
import { SocialModule } from './social/social.module.js.js';
import { MeritsAndWalletModule } from './merits-and-wallet/merits-and-wallet.module.js.js';
import { NotificationsModule } from './notifications/notifications.module.js.js';
import { MarketplaceModule } from './marketplace/marketplace.module.js.js';
import { StudyRoomsModule } from './study-rooms/study-rooms.module.js.js';
import { ConsoleModule } from './console/console.module.js.js';
import { LoggerModule } from './common/logger/logger.module.js.js';
import { AuthModule } from './auth/auth.module.js.js';
import { ConfigModule } from './config/config.module.js.js';
import { ChallengesModule } from './challenges/challenges.module.js.js';
import { FeedbackModule } from './feedback/feedback.module.js.js';
import { PhilosophyModule } from './philosophy/philosophy.module.js.js'; // 🌌 Módulo de Métricas Filosóficas
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache/cache.service.js.js';
import { MetricsModule } from './common/metrics/metrics.module.js.js';

@Module({
  imports: [
    LoggerModule, // 📝 Global Logger Module - must be imported first
    AuthModule, // 🔐 Authentication Module - core authentication
    ConfigModule, // 🔧 Configuration Module - elemental system config
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
    ChallengesModule, // 🏆 Challenges Module - gamified challenges and tasks
    FeedbackModule, // 🤖 Feedback Agent Module - sistema de recolección de reportes
    ConsoleModule, // 🎮 Módulo de la Consola de Experiencias
    PhilosophyModule, // 🌌 Philosophy Module - métricas filosóficas (HambrE, IEA)
    CacheModule.register({ isGlobal: true }),
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService, CacheService],
  exports: [CacheService],
})
export class AppModule {
  constructor() {
    // // //     console.log('>>> AppModule CONSTRUCTOR: Initializing...');
  }
}
