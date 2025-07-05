import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller.js.js';

@Module({
  controllers: [ConfigController],
  exports: [],
})
export class ConfigModule {}
