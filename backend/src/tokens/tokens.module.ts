import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller.js.js';
import { TokensService } from './tokens.service.js.js';
import { PrismaModule } from '../prisma/prisma.module.js.js';

@Module({
  imports: [PrismaModule],
  controllers: [TokensController],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {
  constructor() {
    // // //     console.log('>>> TokensModule CONSTRUCTOR: Initializing...');
  }
}
