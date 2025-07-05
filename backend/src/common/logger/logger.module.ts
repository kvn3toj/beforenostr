import { Module, Global } from '@nestjs/common';
import { CoomUnityLoggerService } from './logger.service';

@Global()
@Module({
  providers: [CoomUnityLoggerService],
  exports: [CoomUnityLoggerService],
})
export class LoggerModule {}
