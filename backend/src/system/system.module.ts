import { Module } from '@nestjs/common';
import { SystemController } from './system.controller.js.js';

@Module({
  controllers: [SystemController],
})
export class SystemModule {}
