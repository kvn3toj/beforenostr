import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, PrismaService],
  exports: [ItemsService]
})
export class ItemsModule {} 