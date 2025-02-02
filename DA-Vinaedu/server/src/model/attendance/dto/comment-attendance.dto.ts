import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CommentAttendanceDto {
  @IsNumber()
  lessonId: number;

  @IsNotEmpty()
  @MaxLength(255)
  comment: string;
}
