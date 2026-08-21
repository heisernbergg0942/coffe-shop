import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SocialAuthDto } from './dto/social-auth.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() loginDto: LoginDto, @Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('social/google')
  @ApiOperation({ summary: 'Login/Register with Google' })
  async googleAuth(@Body() socialAuthDto: SocialAuthDto) {
    if (!socialAuthDto.idToken) {
      throw new BadRequestException('Google ID token is required');
    }
    return this.authService.validateSocialToken('google', socialAuthDto.idToken);
  }

  @Post('social/facebook')
  @ApiOperation({ summary: 'Login/Register with Facebook' })
  async facebookAuth(@Body() socialAuthDto: SocialAuthDto) {
    if (!socialAuthDto.accessToken) {
      throw new BadRequestException('Facebook access token is required');
    }
    return this.authService.validateSocialToken('facebook', socialAuthDto.accessToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req: any) {
    return req.user;
  }
}
