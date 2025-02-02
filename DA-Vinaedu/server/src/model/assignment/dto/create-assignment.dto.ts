import { AssignmentType } from '@prisma/client';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateQuestionDto } from 'src/model/question/dto';

export class CreateAssignmentDto {
  @IsNotEmpty()
  classroomId: string;

  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  dueDate?: number;

  @IsEnum(AssignmentType)
  type: AssignmentType;

  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @Transform(
    ({ value }) => plainToInstance(CreateQuestionDto, JSON.parse(value)),
    { toClassOnly: true },
  )
  questions: CreateQuestionDto[];

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  categoryId: number;
}
