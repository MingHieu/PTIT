import { Body, Controller, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { AttendanceService } from './attendance.service';
import { CommentAttendanceDto, CreateAttendanceDto } from './dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  checkInOut(
    @Body() body: CreateAttendanceDto,
    @GetUser('userId') userId: number,
  ) {
    return this.attendanceService.checkInOut(body, userId);
  }

  @Post('comment')
  comment(
    @Body() body: CommentAttendanceDto,
    @GetUser('userId') userId: number,
  ) {
    return this.attendanceService.comment(body, userId);
  }
}
