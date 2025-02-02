import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLessonDto {
  @IsNumber()
  start: number;

  @IsNumber()
  end: number;

  @IsNotEmpty()
  classroomId: string;
}
