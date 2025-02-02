import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateMaterialDto {
  @IsNotEmpty()
  classroomId: string;

  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @MaxLength(255)
  url?: string;
}
