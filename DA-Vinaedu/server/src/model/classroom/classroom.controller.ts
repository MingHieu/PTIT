import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator';
import { CheckVerify } from '../user/decorator';
import { ClassroomService } from './classroom.service';
import {
  AcceptJoinClassroomDto,
  CreateClassroomDto,
  UpdateClassroomDto,
} from './dto';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @CheckVerify()
  @Post()
  create(@Body() body: CreateClassroomDto, @GetUser('userId') userId: number) {
    return this.classroomService.create(body, userId);
  }

  @Get()
  findAllByUserId(@GetUser('userId') userId: number) {
    return this.classroomService.findAllByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.classroomService.findOne(id, userId);
  }

  @Post(':id/update')
  update(
    @Param('id') id: string,
    @Body() body: UpdateClassroomDto,
    @GetUser('userId') userId: number,
  ) {
    return this.classroomService.update(id, body, userId);
  }

  @Post(':id/update-banner')
  @UseInterceptors(FileInterceptor('file'))
  async updateBanner(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @GetUser('userId') userId: number,
  ) {
    return this.classroomService.updateBanner(id, file, userId);
  }

  @Post(':id/delete')
  remove(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.classroomService.remove(id, userId);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.classroomService.join(id, userId);
  }

  @Post(':id/accept-join')
  acceptJoin(
    @Param('id') id: string,
    @Body() body: AcceptJoinClassroomDto,
    @GetUser('userId') userId: number,
  ) {
    return this.classroomService.acceptJoin(id, userId, body);
  }

  @Get(':id/requests')
  getJoinRequests(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.classroomService.getJoinRequests(id, userId);
  }
}
