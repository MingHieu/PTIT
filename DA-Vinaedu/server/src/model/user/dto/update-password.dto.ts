import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class UpdatePasswordDto {
  currentPassword: string;

  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}":;,.<>?]).{6,}$/, {
    message:
      'Mật khẩu phải có ít nhất 6 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt.',
  })
  newPassword: string;
}
