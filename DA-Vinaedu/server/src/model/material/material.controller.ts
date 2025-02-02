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
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorator';
import { CreateMaterialDto, UpdateMaterialDto } from './dto';
import { MaterialService } from './material.service';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMaterialDto,
    @GetUser('userId') userId: number,
  ) {
    return this.materialService.create(file, body, userId);
  }

  @Get()
  findAllByClassroomId(
    @Query('classroomId') classroomId: string,
    @GetUser('userId') userId: number,
  ) {
    return this.materialService.findAllByClassroomId(classroomId, userId);
  }

  @Post(':id/update')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateMaterialDto,
    @GetUser('userId') userId: number,
  ) {
    return this.materialService.update(id, file, body, userId);
  }

  @Post(':id/delete')
  remove(@Param('id') id: number, @GetUser('userId') userId: number) {
    return this.materialService.remove(id, userId);
  }
}
