import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SuccessResponse } from 'src/common/response';
import { generateUniqueString } from 'src/common/utils';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { generateVerificationEmailContent } from 'src/email/email.helpers';
import { EmailService } from 'src/email/email.service';
import { FileService } from 'src/file/file.service';
import {
  CreateUserDto,
  CreateUserWithAccountDto,
  SaveUserSettingsDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto';
import { UserEntity } from './entity';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private emailService: EmailService,
    private config: ConfigService,
  ) {}

  async create({ email, password }: CreateUserDto) {
    const hashPassword = await argon.hash(password);
    const user = await this.prisma.user.create({
      data: { email, password: hashPassword },
      include: {
        avatar: true,
        accounts: { select: { provider: true, providerAccountId: true } },
      },
    });
    this.getVerifyEmail(user.id);
    return new UserEntity(user);
  }

  async createWithAccount(
    { email, name, avatar: avatarUrl }: CreateUserWithAccountDto,
    transaction: Partial<PrismaService>,
  ) {
    const user = await transaction.user.create({
      data: { email, name, avatarUrl },
      include: {
        avatar: true,
        accounts: { select: { provider: true, providerAccountId: true } },
      },
    });
    this.getVerifyEmail(user.id);
    return user;
  }

  async findOne(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        avatar: true,
        accounts: { select: { provider: true, providerAccountId: true } },
      },
    });
    return new UserEntity(user);
  }

  async update(userId: number, { name }: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
      include: {
        avatar: true,
        accounts: { select: { provider: true, providerAccountId: true } },
      },
    });
    return new UserEntity(user);
  }

  async updatePassword(
    userId: number,
    { currentPassword, newPassword }: UpdatePasswordDto,
  ) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    if (user.password) {
      const pwMatches = await argon.verify(user.password, currentPassword);
      if (!pwMatches) throw new ForbiddenException('Mật khẩu cũ không khớp');
    }
    const hashPassword = await argon.hash(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashPassword },
    });
    return SuccessResponse;
  }

  async updateAvatar(userId: number, file: Express.Multer.File) {
    let user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { avatar: true },
    });
    if (user.avatar) {
      this.fileService.delete([user.avatar.id]);
    }
    if (!file) {
      return { avatar: null };
    }
    const files = await this.fileService.upload([file]);
    try {
      user = await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: { connect: { id: files[0].id } }, avatarUrl: null },
        include: { avatar: true },
      });
      return { avatar: user.avatar.url };
    } catch (error) {
      this.fileService.delete(files.map((f) => f.id));
      throw error;
    }
  }

  async getVerifyEmail(id: number) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id, isVerify: false },
    });
    const token = generateUniqueString();
    const ttl = 5;
    await this.cacheManager.set(token, user.email, ttl * 60 * 1000);
    const { subject, html, text } = generateVerificationEmailContent({
      userName: user.name,
      token,
      ttl,
      appName: this.config.get('APP_NAME'),
      appUrl: this.config.get('APP_URL'),
    });
    await this.emailService.sendMail({
      to: user.email,
      subject,
      html,
      text,
    });
    return SuccessResponse;
  }

  async verifyUser(token: string) {
    const email: string = await this.cacheManager.get(token);
    if (!email) {
      throw new BadRequestException('Mã xác nhận đã hết hạn');
    }
    await this.cacheManager.del(token);
    await this.prisma.user.update({
      where: { email },
      data: { isVerify: true },
    });
    return SuccessResponse;
  }

  getUserSettings(userId: number) {
    return this.prisma.userSettings.findMany({
      where: { userId },
      select: { key: true, value: true },
    });
  }

  saveUserSettings({ key, value }: SaveUserSettingsDto, userId: number) {
    return this.prisma.userSettings.upsert({
      where: { userId_key: { key, userId } },
      create: { key, value, userId },
      update: { value },
    });
  }
}
