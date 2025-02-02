import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { LessonService } from './lesson.service';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  create(@Body() body: CreateLessonDto, @GetUser('userId') userId: number) {
    return this.lessonService.create(body, userId);
  }

  @Get()
  findAllByClassroomId(
    @Query('classroomId') classroomId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.lessonService.findAllByClassroomId(classroomId, userId);
  }

  @Get('timetable')
  getTimetable(
    @Query('timestamp') timestamp: number,
    @GetUser('userId') userId: number,
  ) {
    return this.lessonService.getTimetable(timestamp, userId);
  }

  @Post(':id/update')
  update(
    @Param('id') id: number,
    @Body() body: UpdateLessonDto,
    @GetUser('userId') userId: number,
  ) {
    return this.lessonService.update(id, body, userId);
  }

  @Post(':id/delete')
  remove(@Param('id') id: number, @GetUser('userId') userId: number) {
    return this.lessonService.remove(id, userId);
  }
}
