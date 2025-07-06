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
import { ConfigModule } from './config/config.module';
import { ChallengesModule } from './challenges/challenges.module';
import { FeedbackModule } from './feedback/feedback.module';
import { PhilosophyModule } from './philosophy/philosophy.module'; // 🌌 Módulo de Métricas Filosóficas
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache/cache.service';
import { MetricsModule } from './common/metrics/metrics.module';
import { DebugController } from './debug/debug.controller';

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
  controllers: [AppController, DebugController],
  providers: [AppService, CacheService],
  exports: [CacheService],
})
export class AppModule {
  constructor() {
    // // //     console.log('>>> AppModule CONSTRUCTOR: Initializing...');
  }
}
