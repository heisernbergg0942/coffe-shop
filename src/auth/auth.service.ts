import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthProvider, UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.authProvider === AuthProvider.LOCAL) {
      const isValid = await this.usersService.validatePassword(password, user.password);
      if (isValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const user = await this.usersService.create(registerDto);
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async validateSocialToken(provider: string, token: string) {
    let user = await this.usersService.findBySocialId(provider as AuthProvider, token);
    if (!user) {
      user = await this.usersService.create({
        email: `${token}@${provider}.com`,
        password: Math.random().toString(36),
        name: `${provider} user`,
        role: UserRole.USER,
      });
      user.authProvider = provider as AuthProvider;
      user.socialId = token;
      await this.usersService.update(user.id, { authProvider: provider as AuthProvider, socialId: token });
    }
    return this.login(user);
  }
}
