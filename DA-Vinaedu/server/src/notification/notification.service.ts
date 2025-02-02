import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PagingQuery } from 'src/common/query';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(body: CreateNotificationDto) {
    const { title, message, data, userId } = body;
    const notification = await this.prisma.notification.create({
      data: { title, message, data, userId },
    });
    this.eventEmitter.emit('notification.created', notification);
    return notification;
  }

  async createMany(body: CreateNotificationDto[]) {
    const notifications = await this.prisma.notification.createManyAndReturn({
      data: body.map(({ title, message, data, userId }) => ({
        title,
        message,
        data,
        userId,
      })),
    });
    notifications.forEach((notification) =>
      this.eventEmitter.emit('notification.created', notification),
    );
    return notifications;
  }

  findAll(userId: number, query: PagingQuery) {
    return this.prisma.notification.findMany({
      where: { userId },
      skip: query.page * query.records,
      take: query.records,
      orderBy: { createdAt: 'desc' },
    });
  }

  getUnReadNumber(userId: number) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  markRead(id: number, userId: number) {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  markReadAll(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });
  }
}
