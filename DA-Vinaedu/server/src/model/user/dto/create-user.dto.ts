import { PartialType } from '@nestjs/mapped-types';
import { AuthDto } from 'src/auth/dto';

export class CreateUserDto extends PartialType(AuthDto) {}
