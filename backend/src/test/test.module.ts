import { Module } from '@nestjs/common';
import { TestController } from './test.controller.js.js';
import { TestService } from './test.service.js.js';
import { PrismaService } from '../prisma/prisma.service.js.js';

@Module({
  controllers: [TestController],
  providers: [TestService, PrismaService],
})
export class TestModule {
  constructor() {
    // // //     console.log('>>> TestModule CONSTRUCTOR: Initializing...');
  }
}
