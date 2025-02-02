import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Notification, Student } from '@prisma/client';
import { Socket } from 'net';
import { CreateInteractDto } from 'src/meeting/dto';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private websocketService: WebsocketService) {}

  private wsClients = new Map<number, Set<Socket>>();

  handleConnection(client: any) {
    const { userId } = client.handshake.auth;
    if (!userId) {
      client.disconnect(true);
      return;
    }

    console.log('User:', userId, 'connected ws');

    const userSockets = this.wsClients.get(userId) || new Set<Socket>();
    userSockets.add(client);
    this.wsClients.set(userId, userSockets);
  }

  handleDisconnect(client: any) {
    const { userId } = client.handshake.auth;
    if (!userId) return;

    console.log('User:', userId, 'disconnected ws');

    const userSockets = this.wsClients.get(userId);
    if (userSockets) {
      userSockets.delete(client);

      if (userSockets.size === 0) {
        this.wsClients.delete(userId);
      }
    }
  }

  @OnEvent('notification.created')
  handleNotificationCreatedEvent(payload: Notification) {
    const userSockets = this.wsClients.get(payload.userId);

    if (!userSockets || userSockets.size === 0) {
      return;
    }

    userSockets.forEach((socket) => {
      this.websocketService.handleNotificationCreatedEvent(socket, payload);
    });
  }

  @OnEvent('meeting.interact')
  handleMeetingInteractEvent(payload: {
    students: Student[];
    data: CreateInteractDto & { id: string };
  }) {
    const { students, data } = payload;
    students.forEach((student) => {
      const userSockets = this.wsClients.get(student.userId);

      if (!userSockets || userSockets.size === 0) {
        return;
      }

      userSockets.forEach((socket) => {
        this.websocketService.handleMeetingInteractEvent(socket, data);
      });
    });
  }
}
