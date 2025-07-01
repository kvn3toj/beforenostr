import { Module } from '@nestjs/common';
import { MeritsController } from './merits.controller';
import { MeritsService } from './merits.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MeritsController],
  providers: [MeritsService],
  exports: [MeritsService],
})
export class MeritsModule {
  constructor() {
    console.log('>>> MeritsModule CONSTRUCTOR: Initializing...');
  }
} 