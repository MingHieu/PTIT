import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException('Login with google failed');
    }

    return user;
  }
}
