import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StudyRoomsController } from './study-rooms.controller.js.js';
import { StudyRoomsService } from './study-rooms.service.js.js';
import { StudyRoomsGateway } from './study-rooms.gateway.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';
import { AuthModule } from '../auth/auth.module.js.js';

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
