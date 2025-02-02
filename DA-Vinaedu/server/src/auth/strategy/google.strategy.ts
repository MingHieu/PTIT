import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ThirdPartyPayloadDto } from '../dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_SECRET'),
      callbackURL: config.get('GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): ThirdPartyPayloadDto {
    const {
      provider,
      id: providerAccountId,
      displayName: name,
      emails,
      photos,
    } = profile;

    return {
      provider,
      providerAccountId,
      name,
      email: emails[0].value,
      photo: photos[0].value,
      accessToken,
      refreshToken,
    };
  }
}
