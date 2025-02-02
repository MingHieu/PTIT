import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadDto } from '../dto';

export const GetUser = createParamDecorator(
  (key: keyof JwtPayloadDto, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (key) {
      return request.user[key];
    }
    return request.user;
  },
);
