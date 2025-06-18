import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StudyRoomsController } from './study-rooms.controller';
import { StudyRoomsService } from './study-rooms.service';
import { StudyRoomsGateway } from './study-rooms.gateway';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [StudyRoomsController],
  providers: [StudyRoomsService, StudyRoomsGateway],
  exports: [StudyRoomsService],
})
export class StudyRoomsModule {} 