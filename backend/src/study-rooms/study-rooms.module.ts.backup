import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StudyRoomsController } from './study-rooms.controller';
import { StudyRoomsService } from './study-rooms.service';
import { StudyRoomsGateway } from './study-rooms.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_jwt_secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [StudyRoomsController],
  providers: [StudyRoomsService, StudyRoomsGateway],
  exports: [StudyRoomsService],
})
export class StudyRoomsModule {}
