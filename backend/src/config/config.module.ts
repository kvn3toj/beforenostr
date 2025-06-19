import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';

@Module({
  controllers: [ConfigController],
  exports: [],
})
export class ConfigModule {} 