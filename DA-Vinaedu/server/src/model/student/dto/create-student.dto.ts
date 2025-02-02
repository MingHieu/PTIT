import { IsOptional, MaxLength } from 'class-validator';

export class CreateStudentDto {
  classroomId: string;

  userId: number;

  @IsOptional()
  @MaxLength(255)
  name?: string;
}
