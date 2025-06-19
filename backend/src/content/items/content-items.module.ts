import { Module } from '@nestjs/common';
import { ContentItemsController } from './content-items.controller';
import { ContentItemsService } from './content-items.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContentItemsController],
  providers: [ContentItemsService],
  exports: [ContentItemsService],
})
export class ContentItemsModule {} 