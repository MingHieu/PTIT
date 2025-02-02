import { File, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  name?: string;
  email: string;
  avatar?: string;
  isVerify: boolean;

  @Exclude()
  password: string;

  @Exclude()
  avatarFileId: number;

  @Exclude()
  avatarUrl: string;

  constructor(user: User & { avatar?: File }) {
    Object.assign(this, user);
    this.avatar = user.avatar?.url || user.avatarUrl;
  }
}
