import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { PagingQuery } from 'src/common/query';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll(@GetUser('userId') userId: number, @Query() query: PagingQuery) {
    return this.notificationService.findAll(userId, query);
  }

  @Get('un-read-number')
  getUnReadNumber(@GetUser('userId') userId: number) {
    return this.notificationService.getUnReadNumber(userId);
  }

  @Post(':id/mark-read')
  markRead(@Param('id') id: number, @GetUser('userId') userId: number) {
    return this.notificationService.markRead(id, userId);
  }

  @Post('mark-read-all')
  markReadAll(@GetUser('userId') userId: number) {
    return this.notificationService.markReadAll(userId);
  }
}
