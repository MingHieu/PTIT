import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean } from 'class-validator';
import { CreateAssignmentDto } from './create-assignment.dto';

export class UpdateAssignmentDto extends OmitType(CreateAssignmentDto, [
  'classroomId',
] as const) {
  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  fileIds: number[];

  @IsBoolean()
  @Transform(({ value }) => JSON.parse(value))
  isQuestionChanged: boolean;
}
