import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';
import { AuthProvider } from '../entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  authProvider?: AuthProvider;

  @IsString()
  @IsOptional()
  socialId?: string;
}
