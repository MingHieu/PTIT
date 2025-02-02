export class ThirdPartyPayloadDto {
  provider: string;
  providerAccountId: string;
  name?: string;
  email?: string;
  photo?: string;
  accessToken?: string;
  refreshToken?: string;
}
