import { IsNotEmpty } from 'class-validator';

export class CreateInteractDto {
  @IsNotEmpty()
  lessonId: number;

  @IsNotEmpty()
  type: string;

  data: any;
}
