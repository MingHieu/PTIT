import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class QuizSubmissionDto {
  @IsNotEmpty()
  classroomId: string;

  @IsOptional()
  assignmentId?: number;

  @IsOptional()
  examId?: number;

  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

export class AnswerDto {
  @IsNumber()
  questionId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  answerIds: number[];
}
