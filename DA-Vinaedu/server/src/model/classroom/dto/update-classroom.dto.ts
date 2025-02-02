import { PartialType } from '@nestjs/mapped-types';
import { CreateClassroomDto } from './create-classroom.dto';
import { ClassroomStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateClassroomDto extends PartialType(CreateClassroomDto) {
  @IsEnum(ClassroomStatus)
  status: ClassroomStatus;
}
