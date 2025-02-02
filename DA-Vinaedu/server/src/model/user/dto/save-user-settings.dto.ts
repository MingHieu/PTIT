import { IsNotEmpty, MaxLength, Validate } from 'class-validator';
import { MaxJsonLengthConstraint } from 'src/common/validator';

export class SaveUserSettingsDto {
  @IsNotEmpty()
  @MaxLength(255)
  key: string;

  @IsNotEmpty()
  @Validate(MaxJsonLengthConstraint)
  value: any;
}
