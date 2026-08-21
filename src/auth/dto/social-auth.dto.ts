import { IsString, IsOptional } from 'class-validator';

export class SocialAuthDto {
  @IsString()
  @IsOptional()
  idToken?: string;

  @IsString()
  @IsOptional()
  accessToken?: string;
}
