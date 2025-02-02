import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_CHECK_VERIFY_KEY } from '../decorator';

@Injectable()
export class CheckVerifyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isCheckVerify = this.reflector.getAllAndOverride<boolean>(
      IS_CHECK_VERIFY_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isCheckVerify) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return user.isVerify;
    }
    return true;
  }
}
