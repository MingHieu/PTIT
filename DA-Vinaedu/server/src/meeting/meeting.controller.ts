import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GetUser, Public } from 'src/auth/decorator';
import { CreateInteractDto, CreateMeetingDto } from './dto';
import { MeetingService } from './meeting.service';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  createZoomMeeting(
    @Body() body: CreateMeetingDto,
    @GetUser('userId') userId: number,
  ) {
    return this.meetingService.createZoomMeeting(body, userId);
  }

  @Public()
  @Get('auth')
  handleMeetingAuth(@Query('code') code: string, @Res() res: Response) {
    return this.meetingService.handleMeetingAuth(code, res);
  }

  @Get('interact')
  findAllInteractByLessonId(
    @Query('lessonId') lessonId: number,
    @GetUser('userId') userId: number,
  ) {
    return this.meetingService.findAllInteractByLessonId(lessonId, userId);
  }

  @Post('interact/create')
  createInteract(
    @Body() body: CreateInteractDto,
    @GetUser('userId') userId: number,
  ) {
    return this.meetingService.createInteract(body, userId);
  }

  @Post('interact/:id/submit')
  submitInteract(
    @Param('id') interactId: string,
    @Body() body: any,
    @GetUser('userId') userId: number,
  ) {
    return this.meetingService.submitInteract(interactId, body, userId);
  }

  @Get('interact/:id/submission')
  findAllInteractSubmission(
    @Param('id') interactId: string,
    @Query('lessonId') lessonId: number,
    @GetUser('userId') userId: number,
  ) {
    return this.meetingService.findAllInteractSubmission(
      interactId,
      lessonId,
      userId,
    );
  }
}
