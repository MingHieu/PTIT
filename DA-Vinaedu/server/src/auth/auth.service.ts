import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { Response } from 'express';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserEntity } from 'src/model/user/entity';
import { UserService } from 'src/model/user/user.service';
import { AuthDto, JwtPayloadDto, ThirdPartyPayloadDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  signToken(user: UserEntity) {
    const payload: JwtPayloadDto = {
      sub: user.id,
      userId: user.id,
      isVerify: user.isVerify,
    };

    return this.jwtService.sign(payload, {
      // expiresIn: '1d',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async createAuthResponse(user: UserEntity) {
    return {
      user,
      token: this.signToken(user),
    };
  }

  async signup(body: AuthDto) {
    try {
      const user = await this.userService.create(body);
      return this.createAuthResponse(user);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code == 'P2002') {
        throw new ForbiddenException(
          'Email đã được liên kết với tài khoản khác',
        );
      }
      throw e;
    }
  }

  async login(props: AuthDto) {
    const { email, password } = props;
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        avatar: true,
        accounts: { select: { provider: true, providerAccountId: true } },
      },
    });
    if (!user) throw new ForbiddenException('Tài khoản không tồn tại');
    if (!user.password)
      throw new ForbiddenException(
        'Tài khoản chưa cài đặt mật khẩu. Hãy đăng nhập bằng tài khoản liên kết',
      );

    const pwMatches = await argon.verify(user.password, password);
    if (!pwMatches)
      throw new ForbiddenException(
        'Mật khẩu không đúng. Hãy kiểm tra và thử lại',
      );

    return this.createAuthResponse(new UserEntity(user));
  }

  async googleLogin(req: Express.Request, res: Response) {
    const {
      provider,
      providerAccountId,
      email,
      name,
      photo,
      accessToken,
      refreshToken,
    } = req.user as ThirdPartyPayloadDto;

    return this.prisma.$transaction(async (transaction) => {
      let user = await transaction.user.findUnique({
        where: { email },
        include: { avatar: true },
      });
      if (!user) {
        user = await this.userService.createWithAccount(
          { email, name, avatar: photo },
          transaction,
        );
      }
      const account = await transaction.account.findUnique({
        where: {
          provider_providerAccountId: { provider, providerAccountId },
        },
      });
      if (!account) {
        await transaction.account.create({
          data: {
            provider,
            providerAccountId,
            accessToken,
            refreshToken,
            userId: user.id,
          },
        });
      }
      res.redirect(
        this.config.get('GOOGLE_REDIRECT_CLIENT_URL') +
          '?token=' +
          this.signToken(new UserEntity(user)),
      );
    });
  }

  async getNewToken(id: number) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return this.signToken(new UserEntity(user));
  }
}
