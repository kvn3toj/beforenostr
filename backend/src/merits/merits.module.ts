import { Module } from '@nestjs/common';
import { MeritsController } from './merits.controller.js.js';
import { MeritsService } from './merits.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';

@Module({
  imports: [PrismaModule],
  controllers: [MeritsController],
  providers: [MeritsService],
  exports: [MeritsService],
})
export class MeritsModule {
  constructor() {
    // // //     console.log('>>> MeritsModule CONSTRUCTOR: Initializing...');
  }
}
