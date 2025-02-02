import { IsNumber } from 'class-validator';

export class CreateAttendanceDto {
  @IsNumber()
  lessonId: number;

  image: string;
}
