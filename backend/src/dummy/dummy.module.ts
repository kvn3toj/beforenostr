import { Module } from '@nestjs/common';
import { DummyService } from './dummy.service.js.js';

@Module({
  providers: [DummyService],
  exports: [DummyService],
})
export class DummyModule {}
