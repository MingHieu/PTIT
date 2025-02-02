import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @MaxLength(500)
  title: string;

  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}

class CreateAnswerDto {
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsBoolean()
  correct: boolean;
}
