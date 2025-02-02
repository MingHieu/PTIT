import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class EssaySubmissionDto {
  @IsNotEmpty()
  classroomId: string;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  assignmentId?: number;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  examId?: number;
}
