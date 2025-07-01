import { Module } from '@nestjs/common';
import { MundosService } from './mundos.service';
import { MundosController } from './mundos.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MundosController],
  providers: [MundosService],
  exports: [MundosService]
})
export class MundosModule {} 