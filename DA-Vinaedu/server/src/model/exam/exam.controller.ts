import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator';
import { CreateExamDto, UpdateExamDto } from './dto';
import { ExamService } from './exam.service';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateExamDto,
    @GetUser('userId') userId: number,
  ) {
    return this.examService.create(files, body, userId);
  }

  @Get()
  findAllByClassroomId(
    @Query('classroomId') classroomId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.examService.findAllByClassroomId(classroomId, userId);
  }

  @Post(':id/update')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UpdateExamDto,
    @GetUser('userId') userId: number,
  ) {
    return this.examService.update(id, files, body, userId);
  }

  @Post(':id/delete')
  remove(@Param('id') id: number, @GetUser('userId') userId: number) {
    return this.examService.remove(id, userId);
  }
}
