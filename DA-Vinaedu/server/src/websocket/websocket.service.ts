import { Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { Socket } from 'net';

@Injectable()
export class WebsocketService {
  handleNotificationCreatedEvent(client: Socket, payload: Notification) {
    client.emit('notifications', payload);
  }

  handleMeetingInteractEvent(client: Socket, payload: any) {
    client.emit('meeting.interact', payload);
  }
}
