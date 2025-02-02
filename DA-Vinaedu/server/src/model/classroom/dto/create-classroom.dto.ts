import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateClassroomDto {
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsBoolean()
  isPrivate: boolean;
}
