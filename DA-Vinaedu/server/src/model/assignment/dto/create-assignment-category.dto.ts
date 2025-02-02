import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateAssignmentCategoryDto {
  @IsNotEmpty()
  classroomId: string;

  @IsNotEmpty()
  @MaxLength(255)
  title: string;
}
