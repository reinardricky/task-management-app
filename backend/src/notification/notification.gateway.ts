import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  // When a user connects, you can store their socket information
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // When a user disconnects
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Emit a notification for task assignments
  sendTaskAssignmentNotification(userId: number, task: any) {
    this.server.to(`user_${userId}`).emit('task-assigned', task);
  }

  // Emit a notification for new comments
  sendCommentNotification(userId: number, comment: any) {
    this.server.to(`user_${userId}`).emit('comment-added', comment);
  }

  // This will subscribe the user to their own notifications
  @SubscribeMessage('subscribe-to-notifications')
  handleSubscription(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`user_${userId}`);
    console.log(`User ${userId} subscribed to notifications`);
  }
}
