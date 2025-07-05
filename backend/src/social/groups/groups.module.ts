import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller.js.js';
import { GroupsService } from './groups.service.js.js';
import { PrismaModule } from '../../prisma/prisma.module.js.js';

@Module({
  imports: [PrismaModule],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {
  constructor() {
    // // //     console.log('>>> GroupsModule CONSTRUCTOR: Initializing...');
  }
}
