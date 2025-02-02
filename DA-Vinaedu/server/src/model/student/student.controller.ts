import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { UpdateStudentDto } from './dto';
import { StudentService } from './student.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  findAllByClassroomId(
    @Query('classroomId') classroomId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.studentService.findAllByClassroomId(classroomId, userId);
  }

  @Get('me')
  getMyStudentInfo(
    @Query('classroomId') classroomId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.studentService.getMyStudentInfo(classroomId, userId);
  }

  @Post(':id/update')
  update(
    @Param('id') id: number,
    @Body() body: UpdateStudentDto,
    @GetUser('userId') userId: number,
  ) {
    return this.studentService.update(id, body, userId);
  }

  @Post(':id/update-image')
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @GetUser('userId') userId: number,
  ) {
    return this.studentService.updateImage(id, file, userId);
  }

  @Post('delete')
  remove(
    @Query('classroomId') classroomId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.studentService.remove(classroomId, userId);
  }
}
