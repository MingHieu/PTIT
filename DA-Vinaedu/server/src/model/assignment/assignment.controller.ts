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
import { AssignmentService } from './assignment.service';
import {
  CreateAssignmentCategoryDto,
  CreateAssignmentDto,
  UpdateAssignmentCategoryDto,
  UpdateAssignmentDto,
} from './dto';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateAssignmentDto,
    @GetUser('userId') userId: number,
  ) {
    return this.assignmentService.create(files, body, userId);
  }

  @Get()
  findAllByClassroomId(
    @Query('classroomId') classroomId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.assignmentService.findAllByClassroomId(classroomId, userId);
  }

  @Get('category')
  findAllCategoryByClassroomId(
    @Query('classroomId') classroomId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.assignmentService.findAllCategoryByClassroomId(
      classroomId,
      userId,
    );
  }

  @Post('category')
  createCategory(
    @Body() body: CreateAssignmentCategoryDto,
    @GetUser('userId') userId: number,
  ) {
    return this.assignmentService.createCategory(body, userId);
  }

  @Post('category/:id/update')
  updateCategory(
    @Param('id') id: number,
    @Body() body: UpdateAssignmentCategoryDto,
    @GetUser('userId') userId: number,
  ) {
    return this.assignmentService.updateCategory(id, body, userId);
  }

  @Post('category/:id/delete')
  removeCategory(@Param('id') id: number, @GetUser('userId') userId: number) {
    return this.assignmentService.removeCategory(id, userId);
  }

  @Post(':id/update')
  @UseInterceptors(FilesInterceptor('files'))
  update(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UpdateAssignmentDto,
    @GetUser('userId') userId: number,
  ) {
    return this.assignmentService.update(id, files, body, userId);
  }

  @Post(':id/delete')
  remove(@Param('id') id: number, @GetUser('userId') userId: number) {
    return this.assignmentService.remove(id, userId);
  }
}
