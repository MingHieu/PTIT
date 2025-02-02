import { IsNumber, IsOptional, MaxLength } from 'class-validator';

export class ScoreSubmissionDto {
  @IsNumber()
  grade: number;

  @IsOptional()
  @MaxLength(255)
  feedback?: string;
}
