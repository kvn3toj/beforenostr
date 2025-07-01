import { Module } from '@nestjs/common';
import { ItemTypesService } from './item-types.service';
import { ItemTypesController } from './item-types.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ItemTypesController],
  providers: [ItemTypesService, PrismaService],
  exports: [ItemTypesService]
})
export class ItemTypesModule {} 