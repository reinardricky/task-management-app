import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway'; // WebSocket gateway for notifications

@Module({
  providers: [NotificationGateway],  // Register the gateway
  exports: [NotificationGateway], 
})
export class NotificationModule {}
