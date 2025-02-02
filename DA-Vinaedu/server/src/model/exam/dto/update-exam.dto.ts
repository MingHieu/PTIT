import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean } from 'class-validator';
import { CreateExamDto } from './create-exam.dto';

export class UpdateExamDto extends OmitType(CreateExamDto, [
  'classroomId',
] as const) {
  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  fileIds: number[];

  @IsBoolean()
  @Transform(({ value }) => JSON.parse(value))
  isQuestionChanged: boolean;
}
