import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {
  constructor() {
    // //     console.log('>>> NotificationModule CONSTRUCTOR: Initializing notification system...');
  }
}
